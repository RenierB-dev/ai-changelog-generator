import { NextRequest, NextResponse } from 'next/server';
import { sendChangelogReadyEmail, sendTeamNotification } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      userName,
      version,
      repository,
      changesCount,
      aiEnhanced,
      changelogUrl,
      tweetText,
      teamEmails,
    } = body;

    // Validation
    if (!email || !version || !repository || !changelogUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: email, version, repository, changelogUrl' },
        { status: 400 }
      );
    }

    // Send notification to primary user
    const result = await sendChangelogReadyEmail({
      to: email,
      userName: userName || 'Developer',
      version,
      repository,
      changesCount: changesCount || 0,
      aiEnhanced: aiEnhanced || false,
      changelogUrl,
      tweetText,
    });

    // If team emails are provided, send to them too
    let teamResult;
    if (teamEmails && Array.isArray(teamEmails) && teamEmails.length > 0) {
      teamResult = await sendTeamNotification({
        to: teamEmails,
        version,
        repository,
        changesCount: changesCount || 0,
        aiEnhanced: aiEnhanced || false,
        changelogUrl,
      });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        team: teamResult,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Changelog notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
