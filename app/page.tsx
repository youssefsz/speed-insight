"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SparklesText } from "@/components/ui/sparkles-text"
import { ShineBorder } from "@/components/ui/shine-border"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Caveat } from "next/font/google"

const caveat = Caveat({ 
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-caveat"
})

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

type ValidationState = {
  status: "idle" | "valid" | "invalid"
  message: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validation, setValidation] = useState<ValidationState>({ status: "idle", message: "" })
  const router = useRouter()
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Professional URL validation (memoized)
  const validateUrl = useCallback((value: string): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: false, message: "" }
    }

    // Remove whitespace
    const trimmed = value.trim()

    // Check for obviously invalid formats
    if (trimmed.includes(" ")) {
      return { isValid: false, message: "URL cannot contain spaces" }
    }

    // Add protocol if missing for validation
    let testUrl = trimmed
    if (!testUrl.match(/^https?:\/\//i)) {
      testUrl = `https://${trimmed}`
    }

    try {
      const parsed = new URL(testUrl)
      
      // Check for valid protocol
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { isValid: false, message: "Only HTTP and HTTPS protocols are supported" }
      }

      // Check for valid hostname
      if (!parsed.hostname || parsed.hostname.length < 3) {
        return { isValid: false, message: "" }
      }

      // Check for valid TLD (must have at least one dot)
      if (!parsed.hostname.includes(".")) {
        return { isValid: false, message: "" } // Don't show this validation message in UI
      }

      // Check for localhost/IP validation
      if (parsed.hostname === "localhost" || parsed.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return { isValid: false, message: "Please enter a public domain name" }
      }

      // All checks passed
      return { isValid: true, message: "Valid URL" }
    } catch (error) {
      return { isValid: false, message: "Invalid URL format" }
    }
  }, [])

  const handleUrlChange = useCallback((value: string) => {
    // Force lowercase conversion
    const lowercaseValue = value.toLowerCase()
    setUrl(lowercaseValue)
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Only reset validation state if not already idle (optimization)
    setValidation(prev => prev.status !== "idle" ? { status: "idle", message: "" } : prev)
    
    if (!lowercaseValue.trim()) {
      return
    }

    // Set debounced validation (500ms after user stops typing)
    debounceTimer.current = setTimeout(() => {
      const result = validateUrl(lowercaseValue)
      setValidation({
        status: result.isValid ? "valid" : "invalid",
        message: result.message
      })
    }, 500)
  }, [validateUrl])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const handleTest = useCallback(async () => {
    if (!url) return

    // Validate before proceeding
    const result = validateUrl(url)
    if (!result.isValid) {
      setValidation({
        status: "invalid",
        message: result.message
      })
      return
    }

    setIsLoading(true)
    
    // Auto-correct URL by adding https:// if missing
    let correctedUrl = url.trim()
    if (!correctedUrl.match(/^https?:\/\//i)) {
      correctedUrl = `https://${correctedUrl}`
    }

    // Navigate to insights page with URL as query parameter
    router.push(`/insights?url=${encodeURIComponent(correctedUrl)}`)
  }, [url, validateUrl, router])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 pt-36 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.h1
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-6xl md:text-8xl font-bold tracking-tight ${caveat.className}`}
            >
              <div className="mb-4">Test Your Website</div>
              <div className="inline-block">
                <SparklesText 
                  className="text-6xl md:text-8xl font-bold text-primary"
                  colors={{ first: "#a855f7", second: "#ec4899" }}
                  sparklesCount={8}
                >
                  Performance
                </SparklesText>
              </div>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Get detailed insights into your website&apos;s speed, performance metrics, and Core Web Vitals. 
              Powered by Google PageSpeed Insights API.
            </motion.p>

            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="space-y-3">
                <div className="relative flex flex-col sm:flex-row gap-4 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Enter your website URL (e.g., example.com)"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTest()}
                      className={`h-12 text-base pr-10 bg-white dark:bg-gray-900 transition-all ${
                        validation.status === "valid" 
                          ? "border-green-500 hover:border-green-600 focus-visible:ring-1 focus-visible:ring-green-500/30 focus-visible:border-green-600" 
                          : validation.status === "invalid" 
                          ? "border-red-500 hover:border-red-600 focus-visible:ring-1 focus-visible:ring-red-500/30 focus-visible:border-red-600" 
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary"
                      }`}
                      disabled={isLoading}
                    />
                    {validation.status !== "idle" && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validation.status === "valid" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <InteractiveHoverButton
                    onClick={handleTest}
                    disabled={!url || isLoading || validation.status !== "valid"}
                    className={`h-12 px-8 ${
                      !url || isLoading || validation.status !== "valid"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading ? "Testing..." : "Test Speed"}
                  </InteractiveHoverButton>
                </div>
                
                {/* Validation Message */}
                {validation.message && validation.status === "invalid" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
                  >
                    <AlertCircle size={16} />
                    <span>{validation.message}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}