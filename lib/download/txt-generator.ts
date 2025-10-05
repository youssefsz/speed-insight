/**
 * Text Generator Utility
 * Generates plain text reports from performance data
 */

import { PageSpeedData } from '@/types/page-speed'

export interface TxtGeneratorOptions {
  title?: string
  url?: string
  deviceType: 'desktop' | 'mobile'
  includeScreenshot?: boolean
}

export class TxtGenerator {
  private content: string[] = []

  /**
   * Generate plain text from performance data
   */
  generateText(data: PageSpeedData, options: TxtGeneratorOptions): string {
    this.content = []
    
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
    
    return this.content.join('\n')
  }

  private addHeader(options: TxtGeneratorOptions): void {
    this.content.push('='.repeat(60))
    this.content.push('PERFORMANCE REPORT')
    this.content.push('='.repeat(60))
    this.content.push('')
    this.content.push(`URL: ${options.url || 'N/A'}`)
    this.content.push(`Device: ${options.deviceType.toUpperCase()}`)
    this.content.push(`Generated: ${new Date().toLocaleString()}`)
    this.content.push('')
    this.content.push('-'.repeat(60))
    this.content.push('')
  }

  private addPerformanceOverview(data: PageSpeedData): void {
    if (!data.lighthouseResult?.categories) return

    this.content.push('PERFORMANCE OVERVIEW')
    this.content.push('-'.repeat(20))
    this.content.push('')

    const performanceScore = data.lighthouseResult.categories.performance.score
    const scorePercent = Math.round(performanceScore * 100)
    
    this.content.push(`Overall Performance Score: ${scorePercent}/100`)
    this.content.push('')

    // Add score visualization
    const scoreBar = this.generateScoreBar(performanceScore)
    this.content.push(scoreBar)
    this.content.push('')

    // Add score interpretation
    const interpretation = this.getScoreInterpretation(performanceScore)
    this.content.push(`Status: ${interpretation}`)
    this.content.push('')
    this.content.push('')
  }

  private generateScoreBar(score: number): string {
    const maxLength = 20
    const filledLength = Math.round(score * maxLength)
    const emptyLength = maxLength - filledLength
    
    const filled = '█'.repeat(filledLength)
    const empty = '░'.repeat(emptyLength)
    
    return `[${filled}${empty}] ${Math.round(score * 100)}/100`
  }

  private getScoreInterpretation(score: number): string {
    if (score >= 0.9) return 'Good'
    if (score >= 0.5) return 'Needs Improvement'
    return 'Poor'
  }

  private addMetricsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('CORE WEB VITALS')
    this.content.push('-'.repeat(15))
    this.content.push('')

    const keyMetrics = [
      { key: 'first-contentful-paint', label: 'First Contentful Paint', abbr: 'FCP' },
      { key: 'speed-index', label: 'Speed Index', abbr: 'SI' },
      { key: 'largest-contentful-paint', label: 'Largest Contentful Paint', abbr: 'LCP' },
      { key: 'interactive', label: 'Time to Interactive', abbr: 'TTI' },
      { key: 'total-blocking-time', label: 'Total Blocking Time', abbr: 'TBT' },
      { key: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', abbr: 'CLS' }
    ]

    // Calculate column widths for table formatting
    const labelWidth = 35
    const valueWidth = 12
    const scoreWidth = 8
    const statusWidth = 15

    // Header row
    this.content.push('┌' + '─'.repeat(labelWidth) + '┬' + '─'.repeat(valueWidth) + '┬' + '─'.repeat(scoreWidth) + '┬' + '─'.repeat(statusWidth) + '┐')
    this.content.push('│' + 'Metric'.padEnd(labelWidth) + '│' + 'Value'.padEnd(valueWidth) + '│' + 'Score'.padEnd(scoreWidth) + '│' + 'Status'.padEnd(statusWidth) + '│')
    this.content.push('├' + '─'.repeat(labelWidth) + '┼' + '─'.repeat(valueWidth) + '┼' + '─'.repeat(scoreWidth) + '┼' + '─'.repeat(statusWidth) + '┤')

    keyMetrics.forEach(({ key, label, abbr }) => {
      const audit = data.lighthouseResult!.audits[key]
      if (!audit) return

      const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
      const value = audit.numericValue ?? 0
      const formattedValue = this.formatMetricValue(key, value)
      const scorePercent = Math.round(score * 100)
      const status = this.getScoreStatus(score)

      const metricLabel = `${label} (${abbr})`
      this.content.push(
        '│' + metricLabel.padEnd(labelWidth) + 
        '│' + formattedValue.padEnd(valueWidth) + 
        '│' + `${scorePercent}/100`.padEnd(scoreWidth) + 
        '│' + status.padEnd(statusWidth) + '│'
      )
    })

    this.content.push('└' + '─'.repeat(labelWidth) + '┴' + '─'.repeat(valueWidth) + '┴' + '─'.repeat(scoreWidth) + '┴' + '─'.repeat(statusWidth) + '┘')
    this.content.push('')
  }

  private addOpportunitiesSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('OPTIMIZATION OPPORTUNITIES')
    this.content.push('-'.repeat(25))
    this.content.push('')

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
      .slice(0, 8)

    if (opportunities.length === 0) {
      this.content.push('✓ No optimization opportunities found.')
      this.content.push('')
      return
    }

    opportunities.forEach(([key, audit], index) => {
      const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
      const wastedBytes = audit.details?.items?.[0]?.wastedBytes

      this.content.push(`${index + 1}. ${audit.title}`)
      this.content.push('   ' + '─'.repeat(50))
      
      if (audit.description) {
        // Wrap description text
        const wrappedDescription = this.wrapText(audit.description, 70, '   ')
        this.content.push(wrappedDescription)
        this.content.push('')
      }

      this.content.push('   POTENTIAL SAVINGS:')
      
      if (wastedMs > 0) {
        this.content.push(`   • Time: ${this.formatMetricValue('time', wastedMs)}`)
      }
      
      if (wastedBytes) {
        this.content.push(`   • Data: ${(wastedBytes / 1024).toFixed(0)} KB`)
      }

      this.content.push('')
    })
  }

  private addDiagnosticsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('DIAGNOSTICS')
    this.content.push('-'.repeat(11))
    this.content.push('')

    const diagnostics = Object.entries(data.lighthouseResult.audits)
      .filter(([_, audit]) => 
        audit.score !== null &&
        audit.score === 1 &&
        audit.title &&
        !["performance", "accessibility", "best-practices", "seo"].some(cat => audit.title?.toLowerCase().includes(cat))
      )
      .slice(0, 8)

    if (diagnostics.length === 0) {
      this.content.push('No diagnostic information available.')
      this.content.push('')
      return
    }

    diagnostics.forEach(([key, audit]) => {
      const details = audit.displayValue || 'Passed'
      this.content.push(`✓ ${audit.title}`)
      if (details !== 'Passed') {
        this.content.push(`  Details: ${details}`)
      }
      this.content.push('')
    })
  }

  private addFooter(options: TxtGeneratorOptions): void {
    this.content.push('')
    this.content.push('='.repeat(60))
    this.content.push(`Generated by Speed Insight on ${new Date().toLocaleDateString()}`)
    this.content.push('')
    this.content.push('ABOUT THIS REPORT')
    this.content.push('-'.repeat(16))
    this.content.push('')
    this.content.push('This performance report was generated using Google\'s PageSpeed')
    this.content.push('Insights API. The metrics and recommendations are based on the')
    this.content.push('latest web performance standards.')
    this.content.push('')
    this.content.push('Core Web Vitals are key metrics that measure real-world user')
    this.content.push('experience. For more information, visit:')
    this.content.push('https://web.dev/vitals')
    this.content.push('')
    this.content.push('='.repeat(60))
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

  private getScoreStatus(score: number): string {
    if (score >= 0.9) return 'Good'
    if (score >= 0.5) return 'Needs Improvement'
    return 'Poor'
  }

  private wrapText(text: string, width: number, indent: string = ''): string {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = indent

    for (const word of words) {
      if ((currentLine + word).length <= width) {
        currentLine += (currentLine === indent ? '' : ' ') + word
      } else {
        if (currentLine !== indent) {
          lines.push(currentLine)
          currentLine = indent + word
        } else {
          // Word is longer than width, force it
          lines.push(currentLine + word)
          currentLine = indent
        }
      }
    }

    if (currentLine !== indent) {
      lines.push(currentLine)
    }

    return lines.join('\n')
  }
}
