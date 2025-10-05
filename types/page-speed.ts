/**
 * PageSpeed Insights API Types
 * Type definitions for Google PageSpeed Insights API responses
 */

export interface PageSpeedData {
  lighthouseResult?: {
    categories: {
      performance: {
        score: number
      }
    }
    audits: {
      [key: string]: {
        title: string
        description?: string
        displayValue?: string
        score?: number | null
        numericValue?: number
        details?: {
          data?: string // Base64 screenshot data
          items?: Array<{
            url?: string
            wastedBytes?: number
            wastedMs?: number
            totalBytes?: number
            [key: string]: unknown
          }>
          [key: string]: unknown
        }
      }
    }
    finalUrl?: string
  }
  loadingExperience?: {
    id?: string
    metrics: {
      [key: string]: {
        percentile: number
        distributions: Array<{
          min?: number
          max?: number
          proportion: number
        }>
        category: string
      }
    }
    overall_category?: string
    initial_url?: string
  }
}

export interface CoreWebVital {
  name: string
  value: number
  score: number
  category: 'FAST' | 'AVERAGE' | 'SLOW'
}

export interface PerformanceMetrics {
  fcp: CoreWebVital
  lcp: CoreWebVital
  cls: CoreWebVital
  si: CoreWebVital
  tti: CoreWebVital
  tbt: CoreWebVital
}

export interface OptimizationOpportunity {
  id: string
  title: string
  description?: string
  score: number
  wastedMs?: number
  wastedBytes?: number
  savings: {
    time?: number
    data?: number
  }
}
