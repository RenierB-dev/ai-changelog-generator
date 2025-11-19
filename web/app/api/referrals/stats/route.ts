import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get referral stats using database function
    const { data: stats, error } = await supabase.rpc('get_referral_stats', {
      user_id_param: user.id,
    });

    if (error) {
      console.error('Error getting referral stats:', error);
      return NextResponse.json(
        { error: 'Failed to get referral stats' },
        { status: 500 }
      );
    }

    // Get referral code
    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('code, uses, max_uses')
      .eq('user_id', user.id)
      .single();

    if (codeError) {
      console.error('Error getting referral code:', codeError);
    }

    // Get recent referrals
    const { data: recentReferrals, error: recentError } = await supabase
      .from('referrals')
      .select('*, profiles!referred_id(email, full_name)')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Error getting recent referrals:', recentError);
    }

    return NextResponse.json({
      success: true,
      stats: stats?.[0] || {
        total_referrals: 0,
        completed_referrals: 0,
        pending_referrals: 0,
        rewards_earned: 0,
      },
      code: codeData,
      recentReferrals: recentReferrals || [],
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
