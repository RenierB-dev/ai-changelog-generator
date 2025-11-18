import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { webhookUrl, changelog, version } = body

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Slack webhook URL is required' },
        { status: 400 }
      )
    }

    // Format changelog for Slack
    const slackMessage = {
      text: `📝 New Changelog: ${version}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚀 Release ${version}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: formatChangelogForSlack(changelog),
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Generated with *Changelog Premium* • ${new Date().toLocaleDateString()}`,
            },
          ],
        },
      ],
    }

    // Send to Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Posted to Slack successfully',
    })
  } catch (error) {
    console.error('Slack integration error:', error)
    return NextResponse.json(
      { error: 'Failed to post to Slack', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function formatChangelogForSlack(changelog: any): string {
  // Convert changelog to Slack markdown format
  let text = ''

  if (changelog.commits) {
    const grouped = changelog.commits.reduce((acc: any, commit: any) => {
      if (!acc[commit.type]) {
        acc[commit.type] = []
      }
      acc[commit.type].push(commit)
      return acc
    }, {})

    Object.entries(grouped).forEach(([type, commits]: [string, any]) => {
      text += `*${type}*\n`
      commits.forEach((commit: any) => {
        text += `• ${commit.message}\n`
      })
      text += '\n'
    })
  }

  return text || 'See full changelog for details.'
}
