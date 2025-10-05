/**
 * Download Manager
 * Coordinates all download functionality and provides a unified interface
 */

import { saveAs } from 'file-saver'
import { PDFGenerator } from './pdf-generator'
import { MarkdownGenerator } from './markdown-generator'
import { DocxGenerator } from './docx-generator'
import { TxtGenerator } from './txt-generator'
import { ImageGenerator } from './image-generator'
import { PageSpeedData } from '@/types/page-speed'

export type DownloadFormat = 'pdf' | 'markdown' | 'docx' | 'txt' | 'image'
export type DeviceType = 'desktop' | 'mobile'

export interface DownloadOptions {
  format: DownloadFormat
  deviceType: DeviceType
  url?: string
  title?: string
  includeScreenshot?: boolean
  imageFormat?: 'png' | 'jpeg'
  imageQuality?: number
  imageScale?: number
}

export interface DownloadProgress {
  stage: 'preparing' | 'generating' | 'downloading' | 'complete' | 'error'
  message: string
  progress?: number
}

export class DownloadManager {
  private pdfGenerator: PDFGenerator
  private markdownGenerator: MarkdownGenerator
  private docxGenerator: DocxGenerator
  private txtGenerator: TxtGenerator
  private imageGenerator: ImageGenerator

  constructor() {
    this.pdfGenerator = new PDFGenerator()
    this.markdownGenerator = new MarkdownGenerator()
    this.docxGenerator = new DocxGenerator()
    this.txtGenerator = new TxtGenerator()
    this.imageGenerator = new ImageGenerator()
  }

  /**
   * Download performance report in the specified format
   */
  async downloadReport(
    data: PageSpeedData,
    options: DownloadOptions,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      onProgress?.({ stage: 'preparing', message: 'Preparing download...' })

      const fileName = this.generateFileName(options.url || 'report', options.format, options.deviceType)
      
      onProgress?.({ stage: 'generating', message: 'Generating report...', progress: 0 })

      let blob: Blob
      let mimeType: string

      switch (options.format) {
        case 'pdf':
          onProgress?.({ stage: 'generating', message: 'Generating PDF...', progress: 25 })
          blob = await this.pdfGenerator.generatePDF(data, {
            title: options.title,
            url: options.url,
            deviceType: options.deviceType,
            includeScreenshot: options.includeScreenshot
          })
          mimeType = 'application/pdf'
          break

        case 'markdown':
          onProgress?.({ stage: 'generating', message: 'Generating Markdown...', progress: 25 })
          const markdownContent = this.markdownGenerator.generateMarkdown(data, {
            title: options.title,
            url: options.url,
            deviceType: options.deviceType,
            includeScreenshot: options.includeScreenshot
          })
          blob = new Blob([markdownContent], { type: 'text/markdown' })
          mimeType = 'text/markdown'
          break

        case 'docx':
          onProgress?.({ stage: 'generating', message: 'Generating DOCX...', progress: 25 })
          blob = await this.docxGenerator.generateDocx(data, {
            title: options.title,
            url: options.url,
            deviceType: options.deviceType,
            includeScreenshot: options.includeScreenshot
          })
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break

        case 'txt':
          onProgress?.({ stage: 'generating', message: 'Generating text file...', progress: 25 })
          const txtContent = this.txtGenerator.generateText(data, {
            title: options.title,
            url: options.url,
            deviceType: options.deviceType,
            includeScreenshot: options.includeScreenshot
          })
          blob = new Blob([txtContent], { type: 'text/plain' })
          mimeType = 'text/plain'
          break

        case 'image':
          onProgress?.({ stage: 'generating', message: 'Generating image...', progress: 25 })
          blob = await this.imageGenerator.generateImage(
            null, // No specific element to capture
            data,
            {
              title: options.title,
              url: options.url,
              deviceType: options.deviceType,
              format: options.imageFormat || 'png',
              quality: options.imageQuality || 0.9,
              scale: options.imageScale || 2
            }
          )
          mimeType = `image/${options.imageFormat || 'png'}`
          break

        default:
          throw new Error(`Unsupported format: ${options.format}`)
      }

      onProgress?.({ stage: 'downloading', message: 'Downloading file...', progress: 75 })

      // Create a proper blob with the correct MIME type
      const finalBlob = new Blob([blob], { type: mimeType })
      
      // Download the file
      saveAs(finalBlob, fileName)

      onProgress?.({ stage: 'complete', message: 'Download complete!', progress: 100 })

    } catch (error) {
      console.error('Download failed:', error)
      onProgress?.({ 
        stage: 'error', 
        message: error instanceof Error ? error.message : 'Download failed' 
      })
      throw error
    }
  }

  /**
   * Download image from a specific DOM element
   */
  async downloadElementAsImage(
    element: HTMLElement,
    options: Omit<DownloadOptions, 'format'> & { format: 'image' },
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      onProgress?.({ stage: 'preparing', message: 'Preparing image capture...' })

      const fileName = this.generateFileName(
        options.url || 'element', 
        'image', 
        options.deviceType
      )

      onProgress?.({ stage: 'generating', message: 'Capturing element...', progress: 50 })

      const blob = await this.imageGenerator.generateImage(element, {
        lighthouseResult: undefined,
        loadingExperience: undefined
      }, {
        title: options.title,
        url: options.url,
        deviceType: options.deviceType,
        format: options.imageFormat || 'png',
        quality: options.imageQuality || 0.9,
        scale: options.imageScale || 2
      })

      onProgress?.({ stage: 'downloading', message: 'Downloading image...', progress: 75 })

      const mimeType = `image/${options.imageFormat || 'png'}`
      const finalBlob = new Blob([blob], { type: mimeType })
      
      saveAs(finalBlob, fileName)

      onProgress?.({ stage: 'complete', message: 'Download complete!', progress: 100 })

    } catch (error) {
      console.error('Image download failed:', error)
      onProgress?.({ 
        stage: 'error', 
        message: error instanceof Error ? error.message : 'Image download failed' 
      })
      throw error
    }
  }

  /**
   * Get available download formats
   */
  getAvailableFormats(): Array<{ value: DownloadFormat; label: string; description: string }> {
    return [
      {
        value: 'pdf',
        label: 'PDF Document',
        description: 'Professional report in PDF format'
      },
      {
        value: 'markdown',
        label: 'Markdown',
        description: 'Structured text with formatting'
      },
      {
        value: 'docx',
        label: 'Word Document',
        description: 'Microsoft Word compatible document'
      },
      {
        value: 'txt',
        label: 'Plain Text',
        description: 'Simple text file'
      },
      {
        value: 'image',
        label: 'Image',
        description: 'Visual report as PNG or JPEG'
      }
    ]
  }

  /**
   * Get available device types
   */
  getAvailableDeviceTypes(): Array<{ value: DeviceType; label: string; description: string }> {
    return [
      {
        value: 'desktop',
        label: 'Desktop Report',
        description: 'Performance data for desktop devices'
      },
      {
        value: 'mobile',
        label: 'Mobile Report',
        description: 'Performance data for mobile devices'
      }
    ]
  }

  /**
   * Generate a filename for the download
   */
  private generateFileName(url: string, format: DownloadFormat, deviceType: DeviceType): string {
    // Clean the URL to make it filesystem-safe
    const cleanUrl = url
      .replace(/^https?:\/\//, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50) // Limit length
    
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const extension = this.getFileExtension(format)
    
    return `speed-insight_${cleanUrl}_${deviceType}_${timestamp}.${extension}`
  }

  /**
   * Get file extension for the format
   */
  private getFileExtension(format: DownloadFormat): string {
    switch (format) {
      case 'pdf': return 'pdf'
      case 'markdown': return 'md'
      case 'docx': return 'docx'
      case 'txt': return 'txt'
      case 'image': return 'png'
      default: return 'txt'
    }
  }

  /**
   * Validate download options
   */
  validateOptions(options: Partial<DownloadOptions>): string[] {
    const errors: string[] = []

    if (!options.format) {
      errors.push('Download format is required')
    }

    if (!options.deviceType) {
      errors.push('Device type is required')
    }

    if (options.format === 'image') {
      if (options.imageQuality && (options.imageQuality < 0 || options.imageQuality > 1)) {
        errors.push('Image quality must be between 0 and 1')
      }
      if (options.imageScale && options.imageScale < 0.1) {
        errors.push('Image scale must be at least 0.1')
      }
    }

    return errors
  }
}
