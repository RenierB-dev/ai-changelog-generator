import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, userId } = body;

    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: 'referralCode and userId are required' },
        { status: 400 }
      );
    }

    // Track the referral using database function
    const { data, error } = await supabase.rpc('track_referral', {
      referral_code_param: referralCode,
      referred_user_id_param: userId,
    });

    if (error) {
      console.error('Error tracking referral:', error);
      return NextResponse.json(
        { error: 'Failed to track referral' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Invalid referral code or self-referral attempted' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      referralId: data,
    });
  } catch (error) {
    console.error('Track referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
