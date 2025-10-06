import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AppleSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Apple-style loading spinner component
 * Replicates the iOS/macOS loading indicator with smooth animations
 */
export function AppleSpinner({ size = "md", className }: AppleSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const barSizes = {
    sm: { width: 2, height: 6, radius: 1 },
    md: { width: 3, height: 9, radius: 1.5 },
    lg: { width: 4, height: 12, radius: 2 },
  }

  const bars = 12
  const { width, height, radius } = barSizes[size]

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <motion.div
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: bars }).map((_, index) => {
          const angle = (360 / bars) * index
          const delay = index * (1 / bars)

          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${
                  sizeClasses[size] === "w-8 h-8" ? "10px" : sizeClasses[size] === "w-12 h-12" ? "15px" : "20px"
                })`,
              }}
            >
              <motion.div
                className="bg-current"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: `${radius}px`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }}
              />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

