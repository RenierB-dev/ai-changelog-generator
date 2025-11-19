import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(email, userName || 'Developer');

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
