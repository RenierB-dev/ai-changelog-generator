import { NextRequest, NextResponse } from 'next/server'
import { exportChangelogToPDF } from '@/lib/pdf-export'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { changelog, version, branding, template } = body

    if (!changelog || !version) {
      return NextResponse.json(
        { error: 'Changelog and version are required' },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfBlob = await exportChangelogToPDF({
      changelog,
      version,
      branding,
      template,
    })

    // Convert Blob to Buffer for Next.js response
    const buffer = Buffer.from(await pdfBlob.arrayBuffer())

    // Return PDF file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="changelog-${version}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'PDF export failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
