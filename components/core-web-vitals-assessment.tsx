"use client"

import React from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

interface Distribution {
  min?: number
  max?: number
  proportion: number
}

interface Metric {
  percentile: number
  distributions: Distribution[]
  category: string
}

interface CoreWebVitalsAssessmentProps {
  metrics: {
    [key: string]: Metric
  }
  overallCategory?: string
}

const METRIC_INFO = {
  LARGEST_CONTENTFUL_PAINT_MS: {
    label: "Largest Contentful Paint (LCP)",
    abbr: "LCP",
    unit: "s",
    thresholds: { good: 2500, needsImprovement: 4000 },
    description: "LCP marks the time at which the largest text or image is painted."
  },
  INTERACTION_TO_NEXT_PAINT: {
    label: "Interaction to Next Paint (INP)",
    abbr: "INP",
    unit: "ms",
    thresholds: { good: 200, needsImprovement: 500 },
    description: "INP measures the latency of all interactions a user has made with the page."
  },
  CUMULATIVE_LAYOUT_SHIFT_SCORE: {
    label: "Cumulative Layout Shift (CLS)",
    abbr: "CLS",
    unit: "",
    thresholds: { good: 0.1, needsImprovement: 0.25 },
    description: "CLS measures the sum total of all individual layout shift scores."
  },
  FIRST_CONTENTFUL_PAINT_MS: {
    label: "First Contentful Paint (FCP)",
    abbr: "FCP",
    unit: "s",
    thresholds: { good: 1800, needsImprovement: 3000 },
    description: "FCP marks the time at which the first text or image is painted."
  },
  FIRST_INPUT_DELAY_MS: {
    label: "First Input Delay (FID)",
    abbr: "FID",
    unit: "ms",
    thresholds: { good: 100, needsImprovement: 300 },
    description: "FID measures the time from when a user first interacts with your site to when the browser responds."
  },
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
    label: "Time to First Byte (TTFB)",
    abbr: "TTFB",
    unit: "ms",
    thresholds: { good: 800, needsImprovement: 1800 },
    description: "TTFB measures the time it takes for a user's browser to receive the first byte of page content."
  }
}

export function CoreWebVitalsAssessment({ metrics, overallCategory }: CoreWebVitalsAssessmentProps) {
  // Filter to show only Core Web Vitals (LCP, INP, CLS)
  const coreVitals = ["LARGEST_CONTENTFUL_PAINT_MS", "INTERACTION_TO_NEXT_PAINT", "CUMULATIVE_LAYOUT_SHIFT_SCORE"]
  const coreMetrics = Object.entries(metrics).filter(([key]) => coreVitals.includes(key))
  
  // Other metrics
  const otherMetrics = Object.entries(metrics).filter(([key]) => !coreVitals.includes(key))
  
  // Combine all metrics for display
  const allMetrics = [...coreMetrics, ...otherMetrics]

  // Parse markdown-style links in descriptions
  const parseDescription = (text: string): React.ReactNode => {
    if (!text) return null
    
    const parts: React.ReactNode[] = []
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      
      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {match[1]}
        </a>
      )
      
      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? <>{parts}</> : text
  }

  const formatValue = (key: string, value: number) => {
    const info = METRIC_INFO[key as keyof typeof METRIC_INFO]
    if (!info) return value.toString()

    if (key === "CUMULATIVE_LAYOUT_SHIFT_SCORE") {
      return (value / 100).toFixed(2)
    }
    if (info.unit === "s") {
      return `${(value / 1000).toFixed(1)} s`
    }
    return `${value} ${info.unit}`
  }

  const getStatusIcon = (category: string) => {
    switch (category) {
      case "FAST":
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
      case "AVERAGE":
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case "SLOW":
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = (category: string) => {
    switch (category) {
      case "FAST":
        return "Passed"
      case "AVERAGE":
        return "Needs Improvement"
      case "SLOW":
        return "Failed"
      default:
        return category
    }
  }

  const getStatusColor = (category: string) => {
    switch (category) {
      case "FAST":
        return "text-green-600 dark:text-green-400"
      case "AVERAGE":
        return "text-amber-600 dark:text-amber-400"
      case "SLOW":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const renderMetric = (key: string, metric: Metric) => {
    const info = METRIC_INFO[key as keyof typeof METRIC_INFO]
    if (!info) return null

    const distributions = metric.distributions || []
    
    // Calculate percentile position (0-100%) based on distributions
    const percentilePosition = (() => {
      let cumulative = 0
      for (let i = 0; i < distributions.length; i++) {
        const dist = distributions[i]
        const rangeStart = dist.min || 0
        const rangeEnd = dist.max || Infinity
        
        if (metric.percentile >= rangeStart && (dist.max === undefined || metric.percentile <= rangeEnd)) {
          // Within this distribution
          const rangeSize = rangeEnd === Infinity ? 1 : (rangeEnd - rangeStart)
          const positionInRange = dist.max === undefined ? 1 : (metric.percentile - rangeStart) / rangeSize
          return (cumulative + (dist.proportion * positionInRange)) * 100
        }
        cumulative += dist.proportion
      }
      return cumulative * 100
    })()

    // Calculate threshold ranges for the metric
    const getThresholdRanges = () => {
      const goodPercent = (distributions[0]?.proportion || 0) * 100
      const averagePercent = (distributions[1]?.proportion || 0) * 100
      const poorPercent = (distributions[2]?.proportion || 0) * 100
      
      return { goodPercent, averagePercent, poorPercent }
    }

    const { goodPercent, averagePercent, poorPercent } = getThresholdRanges()

    return (
      <div key={key} className="space-y-3 p-4 sm:p-5 border rounded-lg bg-card hover:bg-accent/20 transition-colors">
        {/* Metric Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {getStatusIcon(metric.category)}
              <h5 className="text-sm font-semibold truncate">{info.label}</h5>
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {parseDescription(info.description)}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-xl sm:text-2xl font-bold ${getStatusColor(metric.category)}`}>
              {formatValue(key, metric.percentile)}
            </div>
            <div className={`text-xs font-medium mt-0.5 ${getStatusColor(metric.category)}`}>
              {getStatusText(metric.category)}
            </div>
          </div>
        </div>

        {/* Progress Bar with Distributions */}
        <div className="space-y-2.5">
          {/* Three-segment progress bar */}
          <div className="relative h-2 rounded-full overflow-hidden flex">
            {distributions.map((dist, idx) => {
              const widthPercent = dist.proportion * 100
              let color = "bg-gray-300 dark:bg-gray-700"
              
              if (idx === 0) color = "bg-green-500"
              else if (idx === 1) color = "bg-amber-500"
              else color = "bg-red-500"

              return (
                <div
                  key={idx}
                  className={`h-full ${color} transition-all duration-300`}
                  style={{ width: `${widthPercent}%` }}
                  title={`${Math.round(widthPercent)}%`}
                />
              )
            })}
          </div>

          {/* Percentile Marker with value indicator */}
          <div className="relative h-8">
            <motion.div
              className="absolute top-0 flex flex-col items-center -translate-x-1/2"
              style={{ left: `${Math.min(Math.max(percentilePosition, 2), 98)}%` }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-0.5 h-5 bg-foreground" />
              <div className="w-2.5 h-2.5 rounded-full bg-foreground border-2 border-background shadow-sm" />
            </motion.div>
          </div>

          {/* Distribution Labels - Detailed */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col gap-1 p-2 rounded bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                <span className="text-xs font-medium">Good</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {distributions[0]?.min || 0}{info.unit} - {distributions[0]?.max ? `${distributions[0].max}${info.unit}` : '∞'}
              </span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {Math.round(goodPercent)}%
              </span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded bg-amber-50 dark:bg-amber-900/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span className="text-xs font-medium">Needs Work</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {distributions[1]?.min || 0}{info.unit} - {distributions[1]?.max ? `${distributions[1].max}${info.unit}` : '∞'}
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {Math.round(averagePercent)}%
              </span>
            </div>

            <div className="flex flex-col gap-1 p-2 rounded bg-red-50 dark:bg-red-900/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                <span className="text-xs font-medium">Poor</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Over {distributions[2]?.min || 0}{info.unit}
              </span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {Math.round(poorPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics || Object.keys(metrics).length === 0) {
    return null
  }

  const hasFailedVitals = coreMetrics.some(([_, metric]) => metric.category === "SLOW")

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b bg-card">
        <div className="flex items-center gap-2">
          {hasFailedVitals ? (
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          )}
          <div>
            <h4 className="text-sm sm:text-base font-semibold">
              Core Web Vitals Assessment:{" "}
              <span className={hasFailedVitals ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                {hasFailedVitals ? "Failed" : "Passed"}
              </span>
            </h4>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Real-world Chrome usage data from the past 28 days
            </p>
          </div>
        </div>
      </div>

      {/* All Metrics - 2 per row */}
      <div className="p-4 sm:p-5">
        <div className="grid lg:grid-cols-2 gap-4">
          {allMetrics.map(([key, metric]) => renderMetric(key, metric))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 sm:p-4 bg-muted/30 border-t">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <div className="space-y-1">
            <p>
              <strong>Data Source:</strong> Chrome UX Report - Real user experiences from the past 28 days
            </p>
            <p className="hidden sm:block">
              <strong>Sample Info:</strong> Latest 28-day period • Full visit durations • Various mobile devices • Various network connections • All Chrome versions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
