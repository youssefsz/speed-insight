/**
 * PDF Generator Utility
 * Generates PDF reports from performance data using jsPDF
 */

import { jsPDF } from 'jspdf'
import { PageSpeedData } from '@/types/page-speed'

export interface PDFGeneratorOptions {
  title?: string
  url?: string
  deviceType: 'desktop' | 'mobile'
  includeScreenshot?: boolean
}

export class PDFGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF()
  }

  /**
   * Generate PDF from performance data
   */
  async generatePDF(
    data: PageSpeedData,
    options: PDFGeneratorOptions
  ): Promise<Blob> {
    this.doc = new jsPDF()
    this.currentY = 20

    // Set up document
    this.setupDocument(options)

    // Add header
    this.addHeader(options)

    // Add performance overview
    this.addPerformanceOverview(data)

    // Add metrics section
    this.addMetricsSection(data)

    // Add opportunities section
    this.addOpportunitiesSection(data)

    // Add diagnostics section
    this.addDiagnosticsSection(data)

    // Add footer
    this.addFooter(options)

    return this.doc.output('blob')
  }

  private setupDocument(options: PDFGeneratorOptions): void {
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Performance Report', this.margin, this.currentY)
    this.currentY += 15

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`URL: ${options.url || 'N/A'}`, this.margin, this.currentY)
    this.currentY += 8
    this.doc.text(`Device: ${options.deviceType.toUpperCase()}`, this.margin, this.currentY)
    this.currentY += 8
    this.doc.text(`Generated: ${new Date().toLocaleString()}`, this.margin, this.currentY)
    this.currentY += 15

    // Add separator line
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, this.doc.internal.pageSize.getWidth() - this.margin, this.currentY)
    this.currentY += 10
  }

  private addHeader(options: PDFGeneratorOptions): void {
    // Header is already added in setupDocument
  }

  private addPerformanceOverview(data: PageSpeedData): void {
    if (!data.lighthouseResult?.categories) return

    this.checkPageBreak(30)
    
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Performance Overview', this.margin, this.currentY)
    this.currentY += 10

    const performanceScore = data.lighthouseResult.categories.performance.score
    const scorePercent = Math.round(performanceScore * 100)
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Overall Performance Score: ${scorePercent}/100`, this.margin, this.currentY)
    this.currentY += 8

    // Add score visualization
    this.addScoreBar(performanceScore)
    this.currentY += 15
  }

  private addScoreBar(score: number): void {
    const barWidth = 100
    const barHeight = 8
    const x = this.margin
    const y = this.currentY

    // Background bar
    this.doc.setFillColor(230, 230, 230)
    this.doc.rect(x, y, barWidth, barHeight, 'F')

    // Score bar
    const fillWidth = (score * barWidth)
    if (score >= 0.9) {
      this.doc.setFillColor(34, 197, 94) // Green
    } else if (score >= 0.5) {
      this.doc.setFillColor(251, 191, 36) // Yellow
    } else {
      this.doc.setFillColor(239, 68, 68) // Red
    }
    this.doc.rect(x, y, fillWidth, barHeight, 'F')

    // Score text
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(`${Math.round(score * 100)}/100`, x + barWidth + 5, y + 5)
  }

  private addMetricsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.checkPageBreak(60)
    
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Core Web Vitals', this.margin, this.currentY)
    this.currentY += 10

    const keyMetrics = [
      { key: 'first-contentful-paint', label: 'First Contentful Paint', abbr: 'FCP' },
      { key: 'speed-index', label: 'Speed Index', abbr: 'SI' },
      { key: 'largest-contentful-paint', label: 'Largest Contentful Paint', abbr: 'LCP' },
      { key: 'interactive', label: 'Time to Interactive', abbr: 'TTI' },
      { key: 'total-blocking-time', label: 'Total Blocking Time', abbr: 'TBT' },
      { key: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', abbr: 'CLS' }
    ]

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')

    keyMetrics.forEach(({ key, label, abbr }) => {
      this.checkPageBreak(20)
      
      const audit = data.lighthouseResult!.audits[key]
      if (!audit) return

      const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
      const value = audit.numericValue ?? 0
      const formattedValue = this.formatMetricValue(key, value)
      const scoreColor = score >= 0.9 ? [34, 197, 94] : score >= 0.5 ? [251, 191, 36] : [239, 68, 68]

      this.doc.text(`${label} (${abbr}):`, this.margin, this.currentY)
      this.doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
      this.doc.text(formattedValue, this.margin + 80, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(`Score: ${Math.round(score * 100)}/100`, this.margin + 140, this.currentY)
      
      this.currentY += 8
    })

    this.currentY += 5
  }

  private addOpportunitiesSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.checkPageBreak(40)
    
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Optimization Opportunities', this.margin, this.currentY)
    this.currentY += 10

    const opportunities = Object.entries(data.lighthouseResult.audits)
      .filter(([_, audit]) => 
        audit.details?.items && 
        Array.isArray(audit.details.items) && 
        audit.details.items.length > 0 &&
        audit.score !== null &&
        audit.score !== undefined &&
        audit.score < 0.9
      )
      .sort((a, b) => {
        const aValue = a[1].details?.items?.[0]?.wastedMs || 0
        const bValue = b[1].details?.items?.[0]?.wastedMs || 0
        return bValue - aValue
      })
      .slice(0, 5)

    if (opportunities.length === 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text('No optimization opportunities found.', this.margin, this.currentY)
      this.currentY += 15
      return
    }

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')

    opportunities.forEach(([key, audit]) => {
      this.checkPageBreak(25)
      
      const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
      const wastedBytes = audit.details?.items?.[0]?.wastedBytes

      this.doc.setFont('helvetica', 'bold')
      this.doc.text(`• ${audit.title}`, this.margin, this.currentY)
      this.currentY += 6

      if (wastedMs > 0) {
        this.doc.setFont('helvetica', 'normal')
        this.doc.text(`Time savings: ${this.formatMetricValue('time', wastedMs)}`, this.margin + 10, this.currentY)
        this.currentY += 6
      }

      if (wastedBytes) {
        this.doc.text(`Data savings: ${(wastedBytes / 1024).toFixed(0)} KB`, this.margin + 10, this.currentY)
        this.currentY += 6
      }

      this.currentY += 5
    })
  }

  private addDiagnosticsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.checkPageBreak(40)
    
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Diagnostics', this.margin, this.currentY)
    this.currentY += 10

    const diagnostics = Object.entries(data.lighthouseResult.audits)
      .filter(([_, audit]) => 
        audit.score !== null &&
        audit.score === 1 &&
        audit.title &&
        !["performance", "accessibility", "best-practices", "seo"].some(cat => audit.title?.toLowerCase().includes(cat))
      )
      .slice(0, 5)

    if (diagnostics.length === 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text('No diagnostic information available.', this.margin, this.currentY)
      this.currentY += 15
      return
    }

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')

    diagnostics.forEach(([key, audit]) => {
      this.checkPageBreak(15)
      
      this.doc.setFillColor(34, 197, 94) // Green circle
      this.doc.circle(this.margin + 5, this.currentY + 2, 2, 'F')
      this.doc.text(`✓ ${audit.title}`, this.margin + 15, this.currentY)
      
      if (audit.displayValue) {
        this.doc.text(audit.displayValue, this.margin + 120, this.currentY)
      }
      
      this.currentY += 8
    })
  }

  private addFooter(options: PDFGeneratorOptions): void {
    const pageCount = this.doc.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(128, 128, 128)
      
      const pageWidth = this.doc.internal.pageSize.getWidth()
      const footerText = `Generated by Speed Insight - Page ${i} of ${pageCount}`
      const textWidth = this.doc.getTextWidth(footerText)
      
      this.doc.text(footerText, (pageWidth - textWidth) / 2, pageWidth - 10)
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  private formatMetricValue(key: string, value: number): string {
    if (key.includes("CLS")) {
      return value.toFixed(3)
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}s`
    }
    return `${Math.round(value)}ms`
  }
}
