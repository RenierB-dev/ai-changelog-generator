import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, changelog, version, template } = body

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { error: 'Email recipients are required' },
        { status: 400 }
      )
    }

    // In production, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Resend

    // For this example, we'll structure the email data
    const emailData = {
      to,
      subject: `📝 Changelog Update: ${version}`,
      html: generateEmailHTML(changelog, version, template),
      text: generateEmailText(changelog, version),
    }

    // Mock successful send
    // In production: await emailService.send(emailData)

    return NextResponse.json({
      success: true,
      message: `Email digest sent to ${to.length} recipient(s)`,
      preview: emailData,
    })
  } catch (error) {
    console.error('Email integration error:', error)
    return NextResponse.json(
      { error: 'Failed to send email digest', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateEmailHTML(changelog: any, version: string, template: string = 'default'): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Changelog Update - ${version}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      color: #667eea;
      border-bottom: 2px solid #667eea;
      padding-bottom: 8px;
    }
    .commit {
      background: white;
      padding: 12px;
      margin: 8px 0;
      border-left: 3px solid #667eea;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚀 ${version} Released</h1>
    <p>Here's what's new in this release</p>
  </div>
  <div class="content">
    ${formatChangelogHTML(changelog)}
  </div>
  <div class="footer">
    <p>Generated with Changelog Premium</p>
    <p>You're receiving this because you subscribed to changelog updates</p>
  </div>
</body>
</html>
  `
}

function formatChangelogHTML(changelog: any): string {
  if (!changelog.commits) return '<p>No changes to display</p>'

  const grouped = changelog.commits.reduce((acc: any, commit: any) => {
    if (!acc[commit.type]) {
      acc[commit.type] = []
    }
    acc[commit.type].push(commit)
    return acc
  }, {})

  let html = ''
  Object.entries(grouped).forEach(([type, commits]: [string, any]) => {
    html += `<div class="section"><h2>${type}</h2>`
    commits.forEach((commit: any) => {
      html += `<div class="commit">${commit.message}</div>`
    })
    html += '</div>'
  })

  return html
}

function generateEmailText(changelog: any, version: string): string {
  let text = `Changelog Update: ${version}\n\n`

  if (changelog.commits) {
    const grouped = changelog.commits.reduce((acc: any, commit: any) => {
      if (!acc[commit.type]) {
        acc[commit.type] = []
      }
      acc[commit.type].push(commit)
      return acc
    }, {})

    Object.entries(grouped).forEach(([type, commits]: [string, any]) => {
      text += `${type}:\n`
      commits.forEach((commit: any) => {
        text += `- ${commit.message}\n`
      })
      text += '\n'
    })
  }

  text += '\n---\nGenerated with Changelog Premium'
  return text
}
