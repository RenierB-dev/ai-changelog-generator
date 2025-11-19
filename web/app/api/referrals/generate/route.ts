import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header or session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a referral code
    const { data: existingCode, error: fetchError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single();

    if (existingCode) {
      return NextResponse.json({
        success: true,
        code: existingCode.code,
        message: 'Referral code already exists',
      });
    }

    // Generate new code using database function
    const { data, error } = await supabase.rpc('generate_referral_code', {
      user_id_param: user.id,
    });

    if (error) {
      console.error('Error generating referral code:', error);
      return NextResponse.json(
        { error: 'Failed to generate referral code' },
        { status: 500 }
      );
    }

    // Insert the code
    const { error: insertError } = await supabase
      .from('referral_codes')
      .insert({
        user_id: user.id,
        code: data,
      });

    if (insertError) {
      console.error('Error inserting referral code:', insertError);
      return NextResponse.json(
        { error: 'Failed to save referral code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: data,
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
