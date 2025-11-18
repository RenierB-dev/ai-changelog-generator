import { NextRequest, NextResponse } from 'next/server'
import simpleGit from 'simple-git'
import { ChangelogGenerator } from '@/../src/changelog'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoPath, fromTag, toTag, useAI, format } = body

    // Validate inputs
    if (!repoPath) {
      return NextResponse.json(
        { error: 'Repository path is required' },
        { status: 400 }
      )
    }

    // Initialize changelog generator
    const generator = new ChangelogGenerator()

    // Generate changelog
    const changelog = await generator.generate({
      useAI: useAI || false,
      fromTag,
      toTag,
      format: format || 'markdown',
    })

    return NextResponse.json({
      success: true,
      changelog,
      format: format || 'markdown',
    })
  } catch (error) {
    console.error('Changelog generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate changelog', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
