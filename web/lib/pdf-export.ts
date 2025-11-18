import jsPDF from 'jspdf'

export interface PDFExportOptions {
  changelog: any
  version: string
  branding?: {
    logo?: string
    companyName?: string
    accentColor?: string
  }
  template?: 'minimal' | 'professional' | 'detailed'
}

export async function exportChangelogToPDF(options: PDFExportOptions): Promise<Blob> {
  const {
    changelog,
    version,
    branding = {},
    template = 'professional'
  } = options

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Set default color
  const accentColor = branding.accentColor || '#667eea'
  const rgb = hexToRgb(accentColor)

  // Header with branding
  if (branding.companyName || branding.logo) {
    doc.setFillColor(rgb.r, rgb.g, rgb.b)
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')

    if (branding.companyName) {
      doc.text(branding.companyName, margin, 25)
    }

    yPosition = 60
  }

  // Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(`Changelog ${version}`, margin, yPosition)
  yPosition += 15

  // Date
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Released on ${new Date().toLocaleDateString()}`, margin, yPosition)
  yPosition += 20

  // Separator line
  doc.setDrawColor(rgb.r, rgb.g, rgb.b)
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // Group commits by category
  if (changelog.commits) {
    const grouped = changelog.commits.reduce((acc: any, commit: any) => {
      if (!acc[commit.type]) {
        acc[commit.type] = []
      }
      acc[commit.type].push(commit)
      return acc
    }, {})

    // Render each category
    for (const [category, commits] of Object.entries(grouped) as [string, any][]) {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = margin
      }

      // Category header
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(rgb.r, rgb.g, rgb.b)
      doc.text(category, margin, yPosition)
      yPosition += 10

      // Commits in this category
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)

      for (const commit of commits) {
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = margin
        }

        // Bullet point
        doc.circle(margin + 2, yPosition - 2, 1, 'F')

        // Commit message (wrap text if needed)
        const lines = doc.splitTextToSize(commit.message, pageWidth - margin * 2 - 10)
        doc.text(lines, margin + 8, yPosition)
        yPosition += lines.length * 5 + 3

        // Commit hash
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`(${commit.hash})`, margin + 8, yPosition)
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        yPosition += 8
      }

      yPosition += 10
    }
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Generated with Changelog Premium - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Return as Blob
  return doc.output('blob')
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 102, g: 126, b: 234 }
}
