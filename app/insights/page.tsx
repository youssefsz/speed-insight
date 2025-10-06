"use client"

import React, { useEffect, useState, Suspense, useMemo, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
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
import { LoadingProgress } from "@/components/loading-progress"
import Link from "next/link"

// CountUp Number Component
interface CountUpNumberProps {
  target: number
  duration?: number
  delay?: number
}

function CountUpNumber({ target, duration = 1.5, delay = 0 }: CountUpNumberProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * target)
      
      setCount(currentCount)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration, isVisible])

  return <span>{count}</span>
}

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
  const [mobileLoading, setMobileLoading] = useState(true)
  const [desktopLoading, setDesktopLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("desktop")
  // const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false)

  // Refs for scroll animations
  const headerRef = useRef(null)
  const metricsRef = useRef(null)
  const opportunitiesRef = useRef(null)
  const diagnosticsRef = useRef(null)
  const cwvRef = useRef(null)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const fetchDesktopData = async (/* forceRefresh = false */) => {
    if (!url) return
    
    // if (forceRefresh) {
    //   setIsRefreshing(true)
    // }
    setDesktopLoading(true)
    setError(null)

    try {
      // const refreshParam = forceRefresh ? '&refresh=true' : ''
      const testUrl = url // Assign to const to satisfy TypeScript
      
      // Fetch desktop data first
      const desktopResponse = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(testUrl)}&strategy=desktop`/* ${refreshParam} */
      )

      if (!desktopResponse.ok) {
        const errorData = await desktopResponse.json()
        
        // Create user-friendly error message with suggestion
        let errorMessage = errorData.error || "Failed to fetch desktop performance data"
        if (errorData.suggestion) {
          errorMessage += ` ${errorData.suggestion}`
        }
        
        throw new Error(errorMessage)
      }

      const desktopJson = await desktopResponse.json()
      setDesktopData(desktopJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setDesktopLoading(false)
      // setIsRefreshing(false)
    }
  }

  const fetchMobileData = async (/* forceRefresh = false */) => {
    if (!url) return
    
    setMobileLoading(true)

    try {
      // const refreshParam = forceRefresh ? '&refresh=true' : ''
      const testUrl = url // Assign to const to satisfy TypeScript
      
      // Fetch mobile data separately
      const mobileResponse = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(testUrl)}&strategy=mobile`/* ${refreshParam} */
      )

      if (!mobileResponse.ok) {
        const errorData = await mobileResponse.json()
        
        // Create user-friendly error message with suggestion
        let errorMessage = errorData.error || "Failed to fetch mobile performance data"
        if (errorData.suggestion) {
          errorMessage += ` ${errorData.suggestion}`
        }
        
        throw new Error(errorMessage)
      }

      const mobileJson = await mobileResponse.json()
      setMobileData(mobileJson)
    } catch (err) {
      // Only set error if desktop also failed (has error)
      // Otherwise, user can still view desktop data
      if (!desktopData) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setMobileLoading(false)
    }
  }

  const fetchData = async (/* forceRefresh = false */) => {
    // Reset data if force refreshing
    // if (forceRefresh) {
    //   setMobileData(null)
    //   setDesktopData(null)
    // }

    // Fetch desktop first
    await fetchDesktopData(/* forceRefresh */)
    
    // Then fetch mobile in the background
    fetchMobileData(/* forceRefresh */)
  }

  useEffect(() => {
    if (!url) {
      router.push("/")
      return
    }

    fetchData(/* false */)
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Top Category Scores */}
        <motion.div 
          ref={headerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Performance", score: performanceScore, icon: "⚡" },
            { label: "Accessibility", score: 0.96, icon: "♿" },
            { label: "Best Practices", score: 1.0, icon: "✓" },
            { label: "SEO", score: 1.0, icon: "🔍" }
          ].map((category, index) => {
            const percent = Math.round(category.score * 100)
            const color = category.score >= 0.9 ? "text-green-600 dark:text-green-400" : category.score >= 0.5 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
            const strokeColor = category.score >= 0.9 ? "#16a34a" : category.score >= 0.5 ? "#ca8a04" : "#dc2626"
            
            return (
              <motion.div 
                key={category.label} 
                variants={scaleIn}
                className="flex flex-col items-center gap-3 p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Background Circle */}
                  <svg 
                    className="absolute inset-0 w-20 h-20 transform -rotate-90"
                    viewBox="0 0 40 40"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-muted/30"
                    />
                  </svg>
                  
                  {/* Progress Circle */}
                  <motion.svg 
                    className="absolute inset-0 w-20 h-20 transform -rotate-90"
                    viewBox="0 0 40 40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke={strokeColor}
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="100.53"
                      strokeDashoffset="100.53"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 100.53 }}
                      animate={{ 
                        strokeDashoffset: 100.53 - (category.score * 100.53)
                      }}
                      transition={{ 
                        delay: 0.5 + index * 0.1, 
                        duration: 2, 
                        ease: "easeOut" 
                      }}
                    />
                  </motion.svg>
                  
                  {/* Animated Number */}
                  <motion.div 
                    className={`text-lg font-bold ${color} relative z-10 flex items-center justify-center`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.8 + index * 0.1, 
                      duration: 0.4, 
                      type: "spring", 
                      stiffness: 200 
                    }}
                  >
                    <CountUpNumber target={percent} duration={1.5} delay={1 + index * 0.1} />
                  </motion.div>
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground">{category.label}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Performance Circle and Screenshot Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Performance Circle */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInLeft}
            className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border rounded-lg bg-card hover:shadow-lg transition-shadow duration-300"
          >
            <PerformanceCircle 
              score={performanceScore}
              metrics={metricsForCircle}
              formatValue={formatMetricValue}
            />
          </motion.div>

          {/* Right: Screenshot */}
          {screenshot && (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-3 sm:p-4 border-b">
                <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Page Screenshot
                </h4>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  Visual representation of the tested page
                </p>
              </div>
              <div className="p-4 sm:p-6 bg-muted/20 flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
                <motion.div 
                  className="relative rounded-lg overflow-hidden shadow-xl border bg-white dark:bg-gray-900"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                >
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
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Metrics Section - Full Width Below */}
        <motion.div 
          ref={metricsRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="border rounded-lg bg-card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Metrics
            </h4>
            <motion.button 
              onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">{isMetricsExpanded ? "Collapse view" : "Expand view"}</span>
              <span className="sm:hidden">{isMetricsExpanded ? "Collapse" : "Expand"}</span>
              <motion.span
                animate={{ rotate: isMetricsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </motion.button>
          </div>

          {/* Metrics Grid - responsive: 1 col mobile, 2 cols tablet+ */}
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-4 sm:gap-y-6"
          >
            {keyMetrics.map(({ key, label, abbr, weight }) => {
              const audit = audits[key]
              if (!audit) return null

              const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
              const value = audit.numericValue ?? 0
              const color = score >= 0.9 ? "text-green-500" : score >= 0.5 ? "text-amber-500" : "text-red-500"
              const bgColor = score >= 0.9 ? "bg-green-500" : score >= 0.5 ? "bg-amber-500" : "bg-red-500"

              return (
                <motion.div 
                  key={key} 
                  variants={item}
                  className="space-y-2 group"
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${bgColor}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.3, type: "spring", stiffness: 200 }}
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <motion.div 
                    className={`text-xl sm:text-2xl font-semibold ${color}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {formatMetricValue(key, value)}
                  </motion.div>
                  
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
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Real-World Assessment - Core Web Vitals */}
        {data.loadingExperience?.metrics && (
          <motion.div
            ref={cwvRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <CoreWebVitalsAssessment 
              metrics={data.loadingExperience.metrics}
              overallCategory={data.loadingExperience.overall_category}
            />
          </motion.div>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <motion.div
            ref={opportunitiesRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-muted-foreground uppercase tracking-wide">
              Opportunities
            </h4>
            <motion.div 
              variants={staggerContainer}
              className="space-y-2"
            >
              {opportunities.map(([key, audit], index) => {
                const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
                const wastedBytes = audit.details?.items?.[0]?.wastedBytes

                return (
                  <motion.div 
                    key={key} 
                    variants={item}
                    className="p-3 sm:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
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
                          <motion.span 
                            className="text-xs text-orange-600 dark:text-orange-400 font-semibold whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          >
                            {formatMetricValue("time", wastedMs)}
                          </motion.span>
                        )}
                        {wastedBytes && (
                          <motion.span 
                            className="text-xs text-muted-foreground whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                          >
                            {(wastedBytes / 1024).toFixed(0)} KB
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Diagnostics */}
        {diagnostics.length > 0 && (
          <motion.div
            ref={diagnosticsRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h4 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-muted-foreground uppercase tracking-wide">
              Diagnostics
            </h4>
            <motion.div 
              variants={staggerContainer}
              className="space-y-2"
            >
              {diagnostics.map(([key, audit], index) => (
                <motion.div 
                  key={key} 
                  variants={item}
                  className="p-3 sm:p-4 border rounded-lg bg-card flex items-center gap-3 hover:shadow-md transition-shadow duration-300"
                  whileHover={{ scale: 1.01, x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm break-words">{audit.title}</span>
                  </div>
                  {audit.displayValue && (
                    <motion.span 
                      className="text-xs text-muted-foreground whitespace-nowrap"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      {audit.displayValue}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 md:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/">
              <InteractiveHoverButtonBack>
                Back to Home
              </InteractiveHoverButtonBack>
            </Link>
            
            {(mobileData || desktopData) && (
              <div className="flex items-center gap-2">
                <DownloadMenu 
                  data={activeTab === 'desktop' ? desktopData : mobileData}
                  deviceType={activeTab as 'desktop' | 'mobile'}
                  url={url}
                  title="Performance Report"
                  className="flex-shrink-0"
                />
                {/* Force Refresh Button - Commented Out */}
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchData(true)}
                  disabled={isRefreshing || (desktopLoading && mobileLoading)}
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
                </Button> */}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Performance Report</h1>
            <p className="text-sm sm:text-base text-muted-foreground break-all">{url}</p>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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

        {/* Results - Always show tabs immediately */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
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
              </motion.div>

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
                      {desktopLoading && !desktopData ? (
                        <LoadingProgress type="desktop" />
                      ) : (
                        renderResults(desktopData)
                      )}
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
                      {mobileLoading && !mobileData ? (
                        <LoadingProgress type="mobile" />
                      ) : (
                        renderResults(mobileData)
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </div>
          </Tabs>
          </motion.div>
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
