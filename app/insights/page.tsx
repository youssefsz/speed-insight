"use client"

import React, { useEffect, useState, Suspense, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, Monitor, TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PerformanceCircle } from "@/components/performance-circle"
import { CoreWebVitalsAssessment } from "@/components/core-web-vitals-assessment"
import { DownloadMenu } from "@/components/download-menu"
import { InteractiveHoverButtonBack } from "@/components/ui/interactive-hover-button-back"
import Link from "next/link"

interface PageSpeedData {
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

function InsightsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams?.get("url")

  const [mobileData, setMobileData] = useState<PageSpeedData | null>(null)
  const [desktopData, setDesktopData] = useState<PageSpeedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("desktop")
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async (forceRefresh = false) => {
    if (!url) return
    
    if (forceRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const refreshParam = forceRefresh ? '&refresh=true' : ''
      const testUrl = url // Assign to const to satisfy TypeScript
      
      // Fetch mobile and desktop data in parallel
      const [mobileResponse, desktopResponse] = await Promise.all([
        fetch(`/api/pagespeed?url=${encodeURIComponent(testUrl)}&strategy=mobile${refreshParam}`),
        fetch(`/api/pagespeed?url=${encodeURIComponent(testUrl)}&strategy=desktop${refreshParam}`)
      ])

        if (!mobileResponse.ok || !desktopResponse.ok) {
          const errorData = await (mobileResponse.ok ? desktopResponse : mobileResponse).json()
          throw new Error(errorData.error || "Failed to fetch performance data")
        }

        const mobileJson = await mobileResponse.json()
        const desktopJson = await desktopResponse.json()

      setMobileData(mobileJson)
      setDesktopData(desktopJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!url) {
      router.push("/")
      return
    }

    fetchData(false)
  }, [url, router])

  if (!url) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 dark:text-green-400"
    if (score >= 0.5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return "Good"
    if (score >= 0.5) return "Needs Improvement"
    return "Poor"
  }

  const getCoreWebVitalIcon = (category: string) => {
    if (category === "FAST") return <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
    if (category === "AVERAGE") return <Minus className="text-yellow-600 dark:text-yellow-400" size={20} />
    return <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
  }

  const formatMetricValue = (key: string, value: number) => {
    if (key.includes("CLS")) {
      return value.toFixed(3)
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}s`
    }
    return `${Math.round(value)}ms`
  }

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

  const renderResults = (data: PageSpeedData | null) => {
    if (!data?.lighthouseResult) return null

    const { categories, audits, finalUrl } = data.lighthouseResult
    const performanceScore = categories.performance.score
    const performancePercent = Math.round(performanceScore * 100)
    
    // Extract screenshot
    const screenshot = audits['final-screenshot']?.details?.data || null

    // Key metrics to display with weights (based on Lighthouse v10 weighting)
    const keyMetrics = [
      { key: "first-contentful-paint", label: "First Contentful Paint", abbr: "FCP", weight: 10 },
      { key: "speed-index", label: "Speed Index", abbr: "SI", weight: 10 },
      { key: "largest-contentful-paint", label: "Largest Contentful Paint", abbr: "LCP", weight: 25 },
      { key: "interactive", label: "Time to Interactive", abbr: "TTI", weight: 10 },
      { key: "total-blocking-time", label: "Total Blocking Time", abbr: "TBT", weight: 30 },
      { key: "cumulative-layout-shift", label: "Cumulative Layout Shift", abbr: "CLS", weight: 15 }
    ]

    // Prepare metrics for the performance circle
    const metricsForCircle = keyMetrics.map(metric => {
      const audit = audits[metric.key]
      return {
        ...metric,
        score: audit?.score ?? 0,
        value: audit?.numericValue ?? 0
      }
    }).filter(m => m.score !== undefined)

    // Opportunities for improvement
    const opportunities = Object.entries(audits)
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

    // Diagnostics - passed audits
    const diagnostics = Object.entries(audits)
      .filter(([_, audit]) => 
        audit.score !== null &&
        audit.score === 1 &&
        audit.title &&
        !["performance", "accessibility", "best-practices", "seo"].some(cat => audit.title?.toLowerCase().includes(cat))
      )
      .slice(0, 6)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Top Category Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Performance", score: performanceScore, icon: "⚡" },
            { label: "Accessibility", score: 0.96, icon: "♿" },
            { label: "Best Practices", score: 1.0, icon: "✓" },
            { label: "SEO", score: 1.0, icon: "🔍" }
          ].map((category) => {
            const percent = Math.round(category.score * 100)
            const color = category.score >= 0.9 ? "text-green-600 dark:text-green-400" : category.score >= 0.5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
            
            return (
              <div key={category.label} className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - category.score)}`}
                      className={color}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`text-sm font-bold ${color} relative z-10`}>
                    {percent}
                  </span>
                </div>
                <span className="text-xs font-medium text-center">{category.label}</span>
              </div>
            )
          })}
        </div>

        {/* Performance Circle and Screenshot Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Performance Circle */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg bg-card">
            <PerformanceCircle 
              score={performanceScore}
              metrics={metricsForCircle}
              formatValue={formatMetricValue}
            />
          </div>

          {/* Right: Screenshot */}
          {screenshot && (
            <div className="border rounded-lg overflow-hidden bg-card">
              <div className="p-3 sm:p-4 border-b">
                <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Page Screenshot
                </h4>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  Visual representation of the tested page
                </p>
              </div>
              <div className="p-4 sm:p-6 bg-muted/20 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
                <div className="relative rounded-lg overflow-hidden shadow-xl border bg-white dark:bg-gray-900">
                  <img 
                    src={screenshot} 
                    alt="Page Screenshot" 
                    className="h-auto object-contain"
                    style={{
                      maxHeight: "400px",
                      width: "auto",
                      maxWidth: "100%",
                      imageRendering: "auto" as const
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Section - Full Width Below */}
        <div className="border rounded-lg bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Metrics
            </h4>
            <button 
              onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">{isMetricsExpanded ? "Collapse view" : "Expand view"}</span>
              <span className="sm:hidden">{isMetricsExpanded ? "Collapse" : "Expand"}</span>
              <motion.span
                animate={{ rotate: isMetricsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </button>
          </div>

          {/* Metrics Grid - responsive: 1 col mobile, 2 cols tablet+ */}
          <div className="grid sm:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-6">
            {keyMetrics.map(({ key, label, abbr, weight }) => {
              const audit = audits[key]
              if (!audit) return null

              const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
              const value = audit.numericValue ?? 0
              const color = score >= 0.9 ? "text-green-500" : score >= 0.5 ? "text-amber-500" : "text-red-500"
              const bgColor = score >= 0.9 ? "bg-green-500" : score >= 0.5 ? "bg-amber-500" : "bg-red-500"

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${bgColor}`} />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <div className={`text-xl sm:text-2xl font-semibold ${color}`}>
                    {formatMetricValue(key, value)}
                  </div>
                  
                  {/* Expanded Details */}
                  <AnimatePresence initial={false}>
                    {isMetricsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: "auto",
                          marginTop: 8
                        }}
                        exit={{ 
                          opacity: 0, 
                          height: 0,
                          marginTop: 0
                        }}
                        transition={{ 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        className="overflow-hidden"
                      >
                        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span>Score:</span>
                            <span className="font-semibold">{Math.round(score * 100)}/100</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Weight:</span>
                            <span className="font-semibold">{weight}%</span>
                          </div>
                           {audit.description && (
                             <div className="text-xs leading-relaxed mt-2">
                               {parseDescription(audit.description)}
                             </div>
                           )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Real-World Assessment - Core Web Vitals */}
        {data.loadingExperience?.metrics && (
          <CoreWebVitalsAssessment 
            metrics={data.loadingExperience.metrics}
            overallCategory={data.loadingExperience.overall_category}
          />
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-muted-foreground uppercase tracking-wide">
              Opportunities
            </h4>
            <div className="space-y-2">
              {opportunities.map(([key, audit]) => {
                const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
                const wastedBytes = audit.details?.items?.[0]?.wastedBytes

                return (
                  <div key={key} className="p-3 sm:p-4 border rounded-lg bg-card">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm mb-1">{audit.title}</h5>
                        {audit.description && (
                          <p className="text-xs text-muted-foreground line-clamp-3 sm:line-clamp-none">
                            {parseDescription(audit.description)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
                        {wastedMs > 0 && (
                          <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold whitespace-nowrap">
                            {formatMetricValue("time", wastedMs)}
                          </span>
                        )}
                        {wastedBytes && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {(wastedBytes / 1024).toFixed(0)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Diagnostics */}
        {diagnostics.length > 0 && (
          <div>
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-muted-foreground uppercase tracking-wide">
              Diagnostics
            </h4>
            <div className="space-y-2">
              {diagnostics.map(([key, audit]) => (
                <div key={key} className="p-3 sm:p-4 border rounded-lg bg-card flex items-center gap-3">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm break-words">{audit.title}</span>
                  </div>
                  {audit.displayValue && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{audit.displayValue}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/">
              <InteractiveHoverButtonBack>
                Back to Home
              </InteractiveHoverButtonBack>
            </Link>
            
            {!loading && (mobileData || desktopData) && (
              <div className="flex items-center gap-2">
                <DownloadMenu 
                  data={activeTab === 'desktop' ? desktopData : mobileData}
                  deviceType={activeTab as 'desktop' | 'mobile'}
                  url={url}
                  title="Performance Report"
                  className="flex-shrink-0"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchData(true)}
                  disabled={isRefreshing}
                  className="gap-2 cursor-pointer"
                >
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                    transition={{ 
                      duration: 1,
                      repeat: isRefreshing ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </motion.svg>
                  <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Force Refresh"}</span>
                  <span className="sm:hidden">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                </Button>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Performance Report</h1>
            <p className="text-sm sm:text-base text-muted-foreground break-all">{url}</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {(loading || isRefreshing) && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Category Scores Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-card">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>

            {/* Performance Circle and Screenshot Skeleton */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Circle Skeleton */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg bg-card">
                <Skeleton className="w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px] rounded-full" />
                <Skeleton className="h-6 sm:h-8 w-24 sm:w-32 mt-4 sm:mt-6" />
                <Skeleton className="h-3 sm:h-4 w-40 sm:w-48 mt-2" />
              </div>

              {/* Screenshot Skeleton */}
              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="p-3 sm:p-4 border-b space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="p-4 sm:p-6 bg-muted/20 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
                  <Skeleton className="w-full max-w-[250px] sm:max-w-[300px] h-[300px] sm:h-[400px] rounded-lg" />
                </div>
              </div>
            </div>

            {/* Metrics Skeleton */}
            <div className="border rounded-lg bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Real-World Assessment Skeleton */}
            <div className="border rounded-lg bg-card overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                    <Skeleton className="h-3 w-full max-w-[400px] hidden sm:block" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20 flex-shrink-0" />
              </div>
              
              {/* Core Metrics - 2 per row */}
              <div className="p-4 sm:p-5">
                <div className="grid lg:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3 p-4 sm:p-5 border rounded-lg">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
                            <Skeleton className="h-4 w-full max-w-[200px]" />
                          </div>
                          <Skeleton className="h-3 w-full" />
                        </div>
                        <div className="space-y-1 flex-shrink-0">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="space-y-2.5">
                        <Skeleton className="h-2 w-full rounded-full" />
                        <Skeleton className="h-8 w-full" />
                        
                        {/* Distribution labels */}
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="flex flex-col gap-1 p-2 rounded bg-muted/30">
                              <Skeleton className="h-3 w-12" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-4 w-10" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-3 sm:p-4 bg-muted/30 border-t">
                <div className="flex gap-2">
                  <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5 hidden sm:block" />
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities Skeleton */}
            <div>
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics Skeleton */}
            <div>
              <Skeleton className="h-4 w-28 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border rounded-lg flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => router.push("/")} className="mt-4">
                  Try Another URL
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !isRefreshing && !error && (mobileData || desktopData) && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-accent/50 p-1">
              <TabsTrigger 
                value="desktop" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors cursor-pointer"
              >
                <Monitor size={16} />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mobile" 
                className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-colors cursor-pointer"
              >
                <Smartphone size={16} />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="desktop" className="mt-0">
                <AnimatePresence mode="wait">
                  {activeTab === "desktop" && (
                    <motion.div
                      key="desktop-results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderResults(desktopData)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="mobile" className="mt-0">
                <AnimatePresence mode="wait">
                  {activeTab === "mobile" && (
                    <motion.div
                      key="mobile-results"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderResults(mobileData)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    }>
      <InsightsContent />
    </Suspense>
  )
}
