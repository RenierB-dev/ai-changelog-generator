import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, commits } = body

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI features require ANTHROPIC_API_KEY to be configured' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Generate prompt based on polish type
    const prompt = getPromptForType(type, content, commits)

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const result = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({
      success: true,
      result,
      type,
    })
  } catch (error) {
    console.error('AI polish error:', error)
    return NextResponse.json(
      { error: 'AI processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function getPromptForType(type: string, content: string, commits: any[]): string {
  const commitList = commits?.map(c => `- ${c.message} (${c.hash})`).join('\n') || content

  switch (type) {
    case 'rewrite':
      return `Rewrite these git commit messages in plain English, making them user-friendly and clear. Focus on what changed and why it matters to users:\n\n${commitList}\n\nProvide concise, user-friendly descriptions.`

    case 'group':
      return `Analyze these commits and group them into logical categories. Suggest intelligent groupings:\n\n${commitList}\n\nProvide a structured grouping with category names and commit counts.`

    case 'summary':
      return `Create a concise, professional release notes summary for these commits:\n\n${commitList}\n\nWrite 2-3 sentences highlighting the main themes and improvements.`

    case 'highlights':
      return `Extract the key highlights and improvements from these commits:\n\n${commitList}\n\nProvide 3-5 bullet points with emojis, focusing on user-facing improvements.`

    case 'tweet':
      return `Create a tweet-worthy announcement (under 280 characters) for this release:\n\n${commitList}\n\nMake it exciting and include relevant hashtags.`

    default:
      return `Analyze these commits:\n\n${commitList}`
  }
}
