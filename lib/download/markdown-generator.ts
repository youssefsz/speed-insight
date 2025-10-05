/**
 * Markdown Generator Utility
 * Generates Markdown reports from performance data
 */

import { PageSpeedData } from '@/types/page-speed'

export interface MarkdownGeneratorOptions {
  title?: string
  url?: string
  deviceType: 'desktop' | 'mobile'
  includeScreenshot?: boolean
}

export class MarkdownGenerator {
  private content: string[] = []

  /**
   * Generate Markdown from performance data
   */
  generateMarkdown(data: PageSpeedData, options: MarkdownGeneratorOptions): string {
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

  private addHeader(options: MarkdownGeneratorOptions): void {
    this.content.push(`# Performance Report`)
    this.content.push('')
    this.content.push(`**URL:** ${options.url || 'N/A'}`)
    this.content.push(`**Device:** ${options.deviceType.toUpperCase()}`)
    this.content.push(`**Generated:** ${new Date().toLocaleString()}`)
    this.content.push('')
    this.content.push('---')
    this.content.push('')
  }

  private addPerformanceOverview(data: PageSpeedData): void {
    if (!data.lighthouseResult?.categories) return

    this.content.push('## Performance Overview')
    this.content.push('')

    const performanceScore = data.lighthouseResult.categories.performance.score
    const scorePercent = Math.round(performanceScore * 100)
    
    this.content.push(`### Overall Performance Score: ${scorePercent}/100`)
    this.content.push('')

    // Add score visualization
    const scoreBar = this.generateScoreBar(performanceScore)
    this.content.push(scoreBar)
    this.content.push('')

    // Add score interpretation
    const interpretation = this.getScoreInterpretation(performanceScore)
    this.content.push(`**Status:** ${interpretation}`)
    this.content.push('')
  }

  private generateScoreBar(score: number): string {
    const maxLength = 20
    const filledLength = Math.round(score * maxLength)
    const emptyLength = maxLength - filledLength
    
    const filled = '█'.repeat(filledLength)
    const empty = '░'.repeat(emptyLength)
    
    return `\`${filled}${empty}\` ${Math.round(score * 100)}/100`
  }

  private getScoreInterpretation(score: number): string {
    if (score >= 0.9) return '🟢 Good'
    if (score >= 0.5) return '🟡 Needs Improvement'
    return '🔴 Poor'
  }

  private addMetricsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('## Core Web Vitals')
    this.content.push('')

    const keyMetrics = [
      { key: 'first-contentful-paint', label: 'First Contentful Paint', abbr: 'FCP' },
      { key: 'speed-index', label: 'Speed Index', abbr: 'SI' },
      { key: 'largest-contentful-paint', label: 'Largest Contentful Paint', abbr: 'LCP' },
      { key: 'interactive', label: 'Time to Interactive', abbr: 'TTI' },
      { key: 'total-blocking-time', label: 'Total Blocking Time', abbr: 'TBT' },
      { key: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', abbr: 'CLS' }
    ]

    this.content.push('| Metric | Value | Score | Status |')
    this.content.push('|--------|-------|-------|--------|')

    keyMetrics.forEach(({ key, label, abbr }) => {
      const audit = data.lighthouseResult!.audits[key]
      if (!audit) return

      const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
      const value = audit.numericValue ?? 0
      const formattedValue = this.formatMetricValue(key, value)
      const scorePercent = Math.round(score * 100)
      const status = this.getScoreStatus(score)

      this.content.push(`| **${label}** (${abbr}) | ${formattedValue} | ${scorePercent}/100 | ${status} |`)
    })

    this.content.push('')
  }

  private addOpportunitiesSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('## Optimization Opportunities')
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
      this.content.push('✅ No optimization opportunities found.')
      this.content.push('')
      return
    }

    opportunities.forEach(([key, audit], index) => {
      const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
      const wastedBytes = audit.details?.items?.[0]?.wastedBytes

      this.content.push(`### ${index + 1}. ${audit.title}`)
      this.content.push('')

      if (audit.description) {
        this.content.push(audit.description)
        this.content.push('')
      }

      this.content.push('**Potential Savings:**')
      
      if (wastedMs > 0) {
        this.content.push(`- ⏱️ Time: ${this.formatMetricValue('time', wastedMs)}`)
      }
      
      if (wastedBytes) {
        this.content.push(`- 💾 Data: ${(wastedBytes / 1024).toFixed(0)} KB`)
      }

      this.content.push('')
    })
  }

  private addDiagnosticsSection(data: PageSpeedData): void {
    if (!data.lighthouseResult?.audits) return

    this.content.push('## Diagnostics')
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

    this.content.push('| Diagnostic | Status | Details |')
    this.content.push('|------------|--------|---------|')

    diagnostics.forEach(([key, audit]) => {
      const status = '✅ Passed'
      const details = audit.displayValue || '-'
      
      this.content.push(`| ${audit.title} | ${status} | ${details} |`)
    })

    this.content.push('')
  }

  private addFooter(options: MarkdownGeneratorOptions): void {
    this.content.push('---')
    this.content.push('')
    this.content.push(`*Generated by [Speed Insight](/) on ${new Date().toLocaleDateString()}`)
    this.content.push('')
    this.content.push('### About This Report')
    this.content.push('')
    this.content.push('This performance report was generated using Google\'s PageSpeed Insights API.')
    this.content.push('The metrics and recommendations are based on the latest web performance standards.')
    this.content.push('')
    this.content.push('**Core Web Vitals** are key metrics that measure real-world user experience.')
    this.content.push('For more information, visit [web.dev/vitals](https://web.dev/vitals).')
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
    if (score >= 0.9) return '🟢 Good'
    if (score >= 0.5) return '🟡 Needs Improvement'
    return '🔴 Poor'
  }
}
