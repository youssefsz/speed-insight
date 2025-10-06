"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppleSpinner } from "@/components/ui/apple-spinner"

interface LoadingProgressProps {
  type: "desktop" | "mobile"
}

/**
 * Realistic loading progress component that simulates actual PageSpeed Insights analysis steps
 */
export function LoadingProgress({ type }: LoadingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    { 
      message: "Initializing analysis", 
      duration: 1000,
      progress: 5
    },
    { 
      message: "Loading page resources", 
      duration: 2000,
      progress: 15
    },
    { 
      message: "Rendering page content", 
      duration: 2500,
      progress: 30
    },
    { 
      message: "Measuring performance metrics", 
      duration: 3000,
      progress: 50
    },
    { 
      message: "Analyzing Core Web Vitals", 
      duration: 2500,
      progress: 70
    },
    { 
      message: "Calculating opportunities", 
      duration: 2000,
      progress: 85
    },
    { 
      message: "Finalizing report", 
      duration: 1500,
      progress: 95
    },
  ]

  useEffect(() => {
    if (currentStep >= steps.length) return

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      setProgress(steps[currentStep].progress)
    }, steps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep])

  // Smooth progress bar animation
  useEffect(() => {
    if (currentStep < steps.length) {
      const targetProgress = steps[currentStep].progress
      const increment = (targetProgress - progress) / 20

      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment
          if (
            (increment > 0 && next >= targetProgress) ||
            (increment < 0 && next <= targetProgress)
          ) {
            clearInterval(interval)
            return targetProgress
          }
          return next
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [currentStep])

  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-32">
      <motion.div
        className="text-center space-y-8 max-w-md mx-auto px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Apple Spinner */}
        <AppleSpinner size="lg" className="text-primary mx-auto" />

        {/* Main Title */}
        <div className="space-y-2">
          <motion.h3
            className="text-xl sm:text-2xl font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Analyzing {type === "desktop" ? "Desktop" : "Mobile"} Performance
          </motion.h3>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-3">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(progress)}% complete
          </motion.p>
        </div>

        {/* Step-by-step messages */}
        <div className="min-h-[60px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1">
                <p className="text-base sm:text-lg font-medium text-foreground">
                  {steps[currentStep].message}
                </p>
                <motion.div
                  className="flex gap-1 ml-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Additional context */}
        <motion.p
          className="text-xs sm:text-sm text-muted-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          This typically takes 10-30 seconds
        </motion.p>
      </motion.div>
    </div>
  )
}
