/**
 * DOCX Generator Utility
 * Generates DOCX reports from performance data using docx library
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx'
import { PageSpeedData } from '@/types/page-speed'

export interface DocxGeneratorOptions {
  title?: string
  url?: string
  deviceType: 'desktop' | 'mobile'
  includeScreenshot?: boolean
}

export class DocxGenerator {
  /**
   * Generate DOCX from performance data
   */
  async generateDocx(data: PageSpeedData, options: DocxGeneratorOptions): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header
            ...this.createHeader(options),
            
            // Performance Overview
            ...this.createPerformanceOverview(data),
            
            // Metrics Section
            ...this.createMetricsSection(data),
            
            // Opportunities Section
            ...this.createOpportunitiesSection(data),
            
            // Diagnostics Section
            ...this.createDiagnosticsSection(data),
            
            // Footer
            ...this.createFooter(options)
          ]
        }
      ]
    })

    const buffer = await Packer.toBlob(doc)
    return buffer
  }

  private createHeader(options: DocxGeneratorOptions): (Paragraph | Table)[] {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "Performance Report",
            bold: true,
            size: 32,
            color: "007ACC"
          })
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `URL: ${options.url || 'N/A'}`,
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Device: ${options.deviceType.toUpperCase()}`,
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${new Date().toLocaleString()}`,
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      })
    ]
  }

  private createPerformanceOverview(data: PageSpeedData): Paragraph[] {
    if (!data.lighthouseResult?.categories) return []

    const performanceScore = data.lighthouseResult.categories.performance.score
    const scorePercent = Math.round(performanceScore * 100)

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "Performance Overview",
            bold: true,
            size: 28,
            color: "007ACC"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 300
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Overall Performance Score: ${scorePercent}/100`,
            bold: true,
            size: 26
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 300
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Status: ${this.getScoreInterpretation(performanceScore)}`,
            size: 24,
            color: this.getScoreColor(performanceScore)
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400
        }
      })
    ]
  }

  private createMetricsSection(data: PageSpeedData): (Paragraph | Table)[] {
    if (!data.lighthouseResult?.audits) return []

    const keyMetrics = [
      { key: 'first-contentful-paint', label: 'First Contentful Paint', abbr: 'FCP' },
      { key: 'speed-index', label: 'Speed Index', abbr: 'SI' },
      { key: 'largest-contentful-paint', label: 'Largest Contentful Paint', abbr: 'LCP' },
      { key: 'interactive', label: 'Time to Interactive', abbr: 'TTI' },
      { key: 'total-blocking-time', label: 'Total Blocking Time', abbr: 'TBT' },
      { key: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', abbr: 'CLS' }
    ]

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Metric", bold: true })]
            })],
            width: { size: 40, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Value", bold: true })]
            })],
            width: { size: 20, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Score", bold: true })]
            })],
            width: { size: 20, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Status", bold: true })]
            })],
            width: { size: 20, type: WidthType.PERCENTAGE }
          })
        ]
      })
    ]

    keyMetrics.forEach(({ key, label, abbr }) => {
      const audit = data.lighthouseResult!.audits[key]
      if (!audit) return

      const score = audit.score !== null && audit.score !== undefined ? audit.score : 0
      const value = audit.numericValue ?? 0
      const formattedValue = this.formatMetricValue(key, value)
      const scorePercent = Math.round(score * 100)
      const status = this.getScoreStatus(score)

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [
                  new TextRun({ text: label, bold: true }),
                  new TextRun({ text: ` (${abbr})`, size: 20 })
                ]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: formattedValue, bold: true })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: `${scorePercent}/100` })]
              })]
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: status,
                  color: this.getScoreColor(score)
                })]
              })]
            })
          ]
        })
      )
    })

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: "Core Web Vitals",
            bold: true,
            size: 28,
            color: "007ACC"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 300
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "The following metrics are key indicators of your website's performance:",
            size: 24
          })
        ],
        spacing: {
          after: 300
        }
      }),
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 }
        }
      })
    ]
  }

  private createOpportunitiesSection(data: PageSpeedData): Paragraph[] {
    if (!data.lighthouseResult?.audits) return []

    const opportunities = Object.entries(data.lighthouseResult.audits)
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
      .slice(0, 5)

    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Optimization Opportunities",
            bold: true,
            size: 28,
            color: "007ACC"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 300
        }
      })
    ]

    if (opportunities.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "✅ No optimization opportunities found. Your site is performing well!",
              color: "28A745",
              bold: true
            })
          ],
          spacing: {
            after: 300
          }
        })
      )
    } else {
      opportunities.forEach(([key, audit], index) => {
        const wastedMs = audit.details?.items?.[0]?.wastedMs || 0
        const wastedBytes = audit.details?.items?.[0]?.wastedBytes

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${audit.title}`,
                bold: true,
                size: 26,
                color: "856404"
              })
            ],
            spacing: {
              before: 300,
              after: 200
            }
          })
        )

        if (audit.description) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: audit.description,
                  size: 24,
                  color: "856404"
                })
              ],
              spacing: {
                after: 200
              }
            })
          )
        }

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Potential Savings:",
                bold: true,
                size: 24,
                color: "155724"
              })
            ],
            spacing: {
              after: 200
            }
          })
        )

        if (wastedMs > 0) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• Time: ${this.formatMetricValue('time', wastedMs)}`,
                  size: 24,
                  color: "155724"
                })
              ],
              spacing: {
                after: 100
              }
            })
          )
        }

        if (wastedBytes) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• Data: ${(wastedBytes / 1024).toFixed(0)} KB`,
                  size: 24,
                  color: "155724"
                })
              ],
              spacing: {
                after: 200
              }
            })
          )
        }
      })
    }

    return paragraphs
  }

  private createDiagnosticsSection(data: PageSpeedData): Paragraph[] {
    if (!data.lighthouseResult?.audits) return []

    const diagnostics = Object.entries(data.lighthouseResult.audits)
      .filter(([_, audit]) => 
        audit.score !== null &&
        audit.score === 1 &&
        audit.title &&
        !["performance", "accessibility", "best-practices", "seo"].some(cat => audit.title?.toLowerCase().includes(cat))
      )
      .slice(0, 5)

    const paragraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Diagnostics",
            bold: true,
            size: 28,
            color: "007ACC"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 300
        }
      })
    ]

    if (diagnostics.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "No diagnostic information available.",
              size: 24
            })
          ],
          spacing: {
            after: 300
          }
        })
      )
    } else {
      diagnostics.forEach(([key, audit]) => {
        const details = audit.displayValue || 'Passed'
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `✅ ${audit.title}`,
                bold: true,
                size: 24,
                color: "0C5460"
              })
            ],
            spacing: {
              before: 200,
              after: 100
            }
          })
        )

        if (details !== 'Passed') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Details: ${details}`,
                  size: 22,
                  color: "0C5460"
                })
              ],
              spacing: {
                after: 200
              }
            })
          )
        }
      })
    }

    return paragraphs
  }

  private createFooter(options: DocxGeneratorOptions): Paragraph[] {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated by Speed Insight on ${new Date().toLocaleDateString()}`,
            size: 20,
            color: "666666"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 200
        }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "This performance report was generated using Google's PageSpeed Insights API.",
            size: 20,
            color: "666666"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 300
        }
      })
    ]
  }

  private formatMetricValue(key: string, value: number): string {
    if (key.includes("CLS")) {
      return value.toFixed(3)
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}s`
    }
    return `${Math.round(value)}ms`
  }

  private getScoreColor(score: number): string {
    if (score >= 0.9) return "28A745"
    if (score >= 0.5) return "FFC107"
    return "DC3545"
  }

  private getScoreInterpretation(score: number): string {
    if (score >= 0.9) return "Good"
    if (score >= 0.5) return "Needs Improvement"
    return "Poor"
  }

  private getScoreStatus(score: number): string {
    if (score >= 0.9) return "Good"
    if (score >= 0.5) return "Needs Improvement"
    return "Poor"
  }
}