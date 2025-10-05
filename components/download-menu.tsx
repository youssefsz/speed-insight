/**
 * Download Menu Component
 * VS Code-style compact nested menu for download options
 */

"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, File, Image, FileType, Monitor, Smartphone, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DownloadManager, DownloadFormat, DeviceType, DownloadOptions, DownloadProgress } from '@/lib/download/download-manager'
import { PageSpeedData } from '@/types/page-speed'
import { toast } from 'sonner'

interface DownloadMenuProps {
  data: PageSpeedData | null
  deviceType: 'desktop' | 'mobile'
  url?: string
  title?: string
  className?: string
}

const formatIcons = {
  pdf: FileText,
  markdown: FileType,
  docx: File,
  txt: FileType,
  image: Image,
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
}

export function DownloadMenu({ 
  data, 
  deviceType, 
  url, 
  title, 
  className = '' 
}: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadManager] = useState(() => new DownloadManager())
  const menuRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)

  const availableFormats = downloadManager.getAvailableFormats()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveSubmenu(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleFormatSelect = async (format: DownloadFormat) => {
    if (!data) return

    setIsDownloading(true)
    setIsOpen(false)
    setActiveSubmenu(null)

    // Show initial toast
    const toastId = toast.loading('Preparing download...')

    try {
      const options: DownloadOptions = {
        format,
        deviceType,
        url,
        title,
        includeScreenshot: true,
        imageFormat: 'png',
        imageQuality: 0.9,
        imageScale: 2,
      }

      await downloadManager.downloadReport(data, options, (progress) => {
        // Update toast with progress
        if (progress.stage === 'generating') {
          toast.loading(progress.message, { id: toastId })
        } else if (progress.stage === 'downloading') {
          toast.loading(progress.message, { id: toastId })
        } else if (progress.stage === 'complete') {
          toast.success(progress.message, { id: toastId })
        }
      })

    } catch (error) {
      console.error('Download failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Download failed'
      toast.error(errorMessage, { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleMouseEnter = (format: DownloadFormat) => {
    setActiveSubmenu(format)
  }

  const handleMouseLeave = () => {
    setActiveSubmenu(null)
  }

  if (!data) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Download Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        variant="outline"
        size="sm"
        className="gap-2 cursor-pointer"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Download</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight size={16} />
        </motion.div>
      </Button>

      {/* Main Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[180px]"
          >
            <div className="p-1">
              {availableFormats.map((format) => {
                const Icon = formatIcons[format.value]
                const isActive = activeSubmenu === format.value
                
                return (
                  <div
                    key={format.value}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(format.value)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => {
                        // Temporarily disabled - show coming soon notification
                        toast.info('Coming soon', {
                          description: `Download feature is coming soon!`
                        })
                        setIsOpen(false)
                        setActiveSubmenu(null)
                        // Original download function (disabled for now):
                        // handleFormatSelect(format.value)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors text-left"
                    >
                      <Icon size={14} className="text-muted-foreground" />
                      <span className="flex-1">{format.label}</span>
                      <ChevronRight size={12} className="text-muted-foreground" />
                    </button>

                    {/* Submenu for Device Selection */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          ref={submenuRef}
                          initial={{ opacity: 0, x: -5, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-full top-0 ml-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[160px]"
                        >
                          <div className="p-1">
                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border mb-1">
                              Device Type
                            </div>
                            {['desktop', 'mobile'].map((device) => {
                              const DeviceIcon = deviceIcons[device as DeviceType]
                              const isCurrentDevice = device === deviceType
                              
                              return (
                                <button
                                  key={device}
                                  onClick={() => {
                                    // Temporarily disabled - show coming soon notification
                                    toast.info('Coming soon', {
                                      description: `Download for ${device} is coming soon!`
                                    })
                                    setIsOpen(false)
                                    setActiveSubmenu(null)
                                    // Original download function (disabled for now):
                                    // handleFormatSelect(format.value)
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors text-left"
                                >
                                  <DeviceIcon size={14} className="text-muted-foreground" />
                                  <span className="flex-1 capitalize">{device}</span>
                                  {isCurrentDevice && (
                                    <Check size={12} className="text-primary" />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
