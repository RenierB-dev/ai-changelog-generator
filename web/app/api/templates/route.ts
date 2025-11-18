import { NextRequest, NextResponse } from 'next/server'

// Template definitions for different styles
const templates = [
  {
    id: 'tech',
    name: 'Tech',
    description: 'Clean, technical format for developer tools',
    style: {
      theme: 'dark',
      accentColor: '#3b82f6',
      font: 'monospace',
      format: 'detailed',
    },
    template: `# Changelog

## [{{version}}] - {{date}}

### Added
{{features}}

### Fixed
{{fixes}}

### Changed
{{changes}}

### Deprecated
{{deprecated}}

### Removed
{{removed}}

### Security
{{security}}
`,
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'User-friendly format for product updates',
    style: {
      theme: 'light',
      accentColor: '#8b5cf6',
      font: 'sans-serif',
      format: 'simple',
    },
    template: `# What's New in {{version}}

Released on {{date}}

## ✨ New Features
{{features}}

## 🐛 Bug Fixes
{{fixes}}

## 💪 Improvements
{{improvements}}

---
Thank you for using our product!
`,
  },
  {
    id: 'opensource',
    name: 'Open Source',
    description: 'Keep a Changelog compliant format',
    style: {
      theme: 'auto',
      accentColor: '#10b981',
      font: 'system',
      format: 'standard',
    },
    template: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [{{version}}] - {{date}}

### Added
{{features}}

### Changed
{{changes}}

### Fixed
{{fixes}}

### Removed
{{removed}}

[{{version}}]: https://github.com/username/repo/compare/v{{previousVersion}}...v{{version}}
`,
  },
]

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    templates,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, data } = body

    const template = templates.find(t => t.id === templateId)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Apply data to template
    let rendered = template.template
    Object.entries(data).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })

    return NextResponse.json({
      success: true,
      rendered,
      style: template.style,
    })
  } catch (error) {
    console.error('Template rendering error:', error)
    return NextResponse.json(
      { error: 'Template rendering failed' },
      { status: 500 }
    )
  }
}
