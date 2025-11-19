import { NextRequest, NextResponse } from 'next/server';
import { handleWeeklyDigestCron } from '@/lib/email/schedule';

// This endpoint should be called by Vercel Cron or similar scheduler
// Secure it with a secret token
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting weekly digest cron job...');

    const result = await handleWeeklyDigestCron();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Weekly digest cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}

// Manual trigger (for testing)
// POST /api/emails/digest with userId
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const { sendUserWeeklyDigest } = await import('@/lib/email/schedule');
    const result = await sendUserWeeklyDigest(userId);

    if (result.success) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json(
        { error: 'Failed to send digest', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Manual digest send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
