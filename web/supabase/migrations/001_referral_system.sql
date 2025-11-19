-- Referral System Migration
-- This migration creates the referral system tables and functions

-- Referral codes table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reward_granted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate referrals
  CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- Enable RLS
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
CREATE POLICY "Users can view own referral codes"
  ON public.referral_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral codes"
  ON public.referral_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral codes"
  ON public.referral_codes FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
  ON public.referrals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update referrals"
  ON public.referrals FOR UPDATE
  USING (true);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Generate a random 8-character code
    code := upper(substring(md5(random()::text || user_id_param::text) from 1 for 8));

    -- Check if code already exists
    SELECT COUNT(*) INTO exists_count
    FROM public.referral_codes
    WHERE code = code;

    -- If code doesn't exist, return it
    IF exists_count = 0 THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create referral code for new user
CREATE OR REPLACE FUNCTION create_referral_code_for_user()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate unique code
  new_code := generate_referral_code(NEW.id);

  -- Insert referral code
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.id, new_code);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create referral code on user signup
CREATE TRIGGER create_referral_code_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_for_user();

-- Function to track referral
CREATE OR REPLACE FUNCTION track_referral(
  referral_code_param TEXT,
  referred_user_id_param UUID
)
RETURNS UUID AS $$
DECLARE
  referrer_user_id UUID;
  referral_id UUID;
BEGIN
  -- Get referrer user ID from code
  SELECT user_id INTO referrer_user_id
  FROM public.referral_codes
  WHERE code = referral_code_param;

  -- If code not found, return null
  IF referrer_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Don't allow self-referral
  IF referrer_user_id = referred_user_id_param THEN
    RETURN NULL;
  END IF;

  -- Create referral record
  INSERT INTO public.referrals (referrer_id, referred_id, code, status)
  VALUES (referrer_user_id, referred_user_id_param, referral_code_param, 'pending')
  ON CONFLICT (referrer_id, referred_id) DO NOTHING
  RETURNING id INTO referral_id;

  -- Increment use count
  UPDATE public.referral_codes
  SET uses = uses + 1, updated_at = NOW()
  WHERE code = referral_code_param;

  RETURN referral_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete referral (grant rewards)
CREATE OR REPLACE FUNCTION complete_referral(referral_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  -- Get referrer ID
  SELECT referrer_id INTO referrer_user_id
  FROM public.referrals
  WHERE id = referral_id_param;

  IF referrer_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Update referral status
  UPDATE public.referrals
  SET status = 'completed', reward_granted = true, updated_at = NOW()
  WHERE id = referral_id_param;

  -- Here you would grant rewards (e.g., free month, credits)
  -- This could update a subscription table or credits table

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get referral stats for user
CREATE OR REPLACE FUNCTION get_referral_stats(user_id_param UUID)
RETURNS TABLE (
  total_referrals BIGINT,
  completed_referrals BIGINT,
  pending_referrals BIGINT,
  rewards_earned BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_referrals,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_referrals,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_referrals,
    COUNT(*) FILTER (WHERE reward_granted = true)::BIGINT as rewards_earned
  FROM public.referrals
  WHERE referrer_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.referral_codes IS 'Stores unique referral codes for each user';
COMMENT ON TABLE public.referrals IS 'Tracks referrals and their status';
COMMENT ON FUNCTION generate_referral_code IS 'Generates a unique 8-character referral code';
COMMENT ON FUNCTION track_referral IS 'Creates a referral record when a new user signs up with a code';
COMMENT ON FUNCTION complete_referral IS 'Marks a referral as completed and grants rewards';
COMMENT ON FUNCTION get_referral_stats IS 'Returns referral statistics for a user';
