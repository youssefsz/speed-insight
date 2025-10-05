"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Metric {
  key: string
  label: string
  abbr: string
  score: number
  value: number
  weight: number
}

interface PerformanceCircleProps {
  score: number
  metrics: Metric[]
  formatValue: (key: string, value: number) => string
}

export function PerformanceCircle({ score, metrics, formatValue }: PerformanceCircleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  const scorePercent = Math.round(score * 100)
  
  const getScoreColor = (s: number) => {
    if (s >= 0.9) return "#10b981" // green-500 - matches segments
    if (s >= 0.5) return "#f59e0b" // amber-500 - matches segments
    return "#ef4444" // red-500 - matches segments
  }

  // Calculate segment positions - 6 equal segments with gaps
  const gapAngle = 8 // Gap between segments in degrees
  const totalGaps = metrics.length * gapAngle
  const usableAngle = 360 - totalGaps
  const baseSegmentAngle = usableAngle / metrics.length
  const innerGap = 1.5 // Small gap at the end of each segment to prevent merging

  let currentAngle = -90 // Start from top

  const segments = metrics.map((metric, index) => {
    const segmentAngle = baseSegmentAngle
    const startAngle = currentAngle
    const endAngle = currentAngle + segmentAngle
    const midAngle = currentAngle + segmentAngle / 2

    // Calculate label position (outside the circle)
    const labelRadius = 110
    const labelX = 150 + labelRadius * Math.cos((midAngle * Math.PI) / 180)
    const labelY = 150 + labelRadius * Math.sin((midAngle * Math.PI) / 180)

    currentAngle = endAngle + gapAngle // Add gap after each segment

    return {
      ...metric,
      startAngle,
      endAngle: endAngle - innerGap, // Subtract small gap to prevent merging
      midAngle,
      labelX,
      labelY,
      segmentAngle,
      color: getScoreColor(metric.score)
    }
  })

  // Create arc path for SVG
  const createArc = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = {
      x: centerX + radius * Math.cos((startAngle * Math.PI) / 180),
      y: centerY + radius * Math.sin((startAngle * Math.PI) / 180)
    }
    const end = {
      x: centerX + radius * Math.cos((endAngle * Math.PI) / 180),
      y: centerY + radius * Math.sin((endAngle * Math.PI) / 180)
    }
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
  }

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative w-full max-w-[300px]">
        <svg 
          width="100%" 
          viewBox="0 0 300 300" 
          className="overflow-visible"
          style={{ aspectRatio: "1/1" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setHoveredSegment(null)
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Center filled circle background */}
          <circle
            cx="150"
            cy="150"
            r="75"
            fill={`${getScoreColor(score)}15`}
            className="transition-all duration-300"
          />

          {/* Main progress circle - only visible when NOT hovered */}
          <AnimatePresence>
            {!isHovered && (
              <>
                {/* Background circle */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-muted"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="85"
                  fill="none"
                  stroke={getScoreColor(score)}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - score)}`}
                  strokeLinecap="round"
                  style={{ 
                    transform: "rotate(-90deg)", 
                    transformOrigin: "150px 150px" 
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Segments - only visible on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {segments.map((segment, index) => {
                  const isActive = hoveredSegment === index
                  
                  // Create background arc (full segment)
                  const fullPath = createArc(150, 150, 85, segment.startAngle, segment.endAngle)
                  
                  // Create progress arc (based on score) - with small gap to prevent merging
                  const segmentLength = segment.endAngle - segment.startAngle
                  const progressAngle = segment.startAngle + segmentLength * segment.score
                  const progressPath = createArc(150, 150, 85, segment.startAngle, progressAngle)
                  
                  return (
                    <g key={segment.key}>
                      {/* Background arc (blue) */}
                      <path
                        d={fullPath}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="pointer-events-none"
                        style={{ opacity: 0.3 }}
                      />

                      {/* Progress arc (colored based on score) */}
                      <motion.path
                        d={progressPath}
                        fill="none"
                        stroke={segment.color}
                        strokeLinecap="round"
                        className="pointer-events-none"
                        style={{
                          filter: isActive ? "url(#glow)" : "none",
                          opacity: hoveredSegment === null ? 1 : isActive ? 1 : 0.4
                        }}
                        animate={{
                          strokeWidth: isActive ? 14 : 10
                        }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* Invisible wider path for better hover detection */}
                      <path
                        d={fullPath}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                        strokeLinecap="round"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredSegment(index)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />

                      {/* Label */}
                      <text
                        x={segment.labelX}
                        y={segment.labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-semibold select-none pointer-events-none"
                        style={{
                          fill: isActive ? segment.color : "currentColor",
                          fontSize: isActive ? "13px" : "11px",
                          fontWeight: isActive ? "700" : "600",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {segment.abbr}
                      </text>

                      {/* Score badge on segment when hovered */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.g
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-none"
                          >
                            <circle
                              cx={150 + 85 * Math.cos((segment.midAngle * Math.PI) / 180)}
                              cy={150 + 85 * Math.sin((segment.midAngle * Math.PI) / 180)}
                              r="12"
                              fill={segment.color}
                            />
                            <text
                              x={150 + 85 * Math.cos((segment.midAngle * Math.PI) / 180)}
                              y={150 + 85 * Math.sin((segment.midAngle * Math.PI) / 180)}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-[10px] font-bold"
                              fill="white"
                            >
                              {Math.round(segment.score * 100)}
                            </text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </g>
                  )
                })}
              </motion.g>
            )}
          </AnimatePresence>

          {/* Center score text - matches progress bar color */}
          <text
            x="150"
            y="150"
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold transition-all duration-300"
            fill={getScoreColor(score)}
            style={{ 
              fontSize: isHovered ? "52px" : "64px",
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
            }}
          >
            {scorePercent}
          </text>
        </svg>

        {/* Detailed tooltip */}
        <AnimatePresence>
          {hoveredSegment !== null && (
             <motion.div
               initial={{ opacity: 0, y: 10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 10, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className="absolute left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border rounded-lg shadow-xl p-3 sm:p-4 w-[90vw] sm:w-auto min-w-[240px] sm:min-w-[280px] max-w-[320px] z-50"
               style={{
                 top: "calc(100% - 40px)"
               }}
             >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-2 border-b">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: segments[hoveredSegment].color }}
                      />
                      <span className="text-sm font-bold">{segments[hoveredSegment].abbr}</span>
                    </div>
                    <h4 className="text-xs text-muted-foreground">{segments[hoveredSegment].label}</h4>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: segments[hoveredSegment].color }}
                    >
                      {Math.round(segments[hoveredSegment].score * 100)}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-semibold">
                      {formatValue(segments[hoveredSegment].key, segments[hoveredSegment].value)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Weight in Score</span>
                    <span className="font-semibold">{segments[hoveredSegment].weight}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="text-muted-foreground">
                        {segments[hoveredSegment].score >= 0.9 ? "Good" : segments[hoveredSegment].score >= 0.5 ? "Needs Improvement" : "Poor"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${segments[hoveredSegment].score * 100}%`,
                          backgroundColor: segments[hoveredSegment].color
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow pointing to circle */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-t border-l rotate-45"
                style={{ top: "-6px" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance label below */}
      <div className="text-center mt-4 sm:mt-6 px-4">
        <h3 className="text-xl sm:text-2xl font-semibold">Performance</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isHovered 
            ? hoveredSegment !== null 
              ? "Viewing metric details" 
              : "Hover segments for details"
            : "Hover to explore metrics"
          }
        </p>
      </div>
    </div>
  )
}
