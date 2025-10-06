import { NextRequest, NextResponse } from "next/server"

/**
 * API Route Handler for Google PageSpeed Insights
 * 
 * This route securely handles requests to the Google PageSpeed Insights API v5.
 * It implements proper input validation, sanitization, and error handling.
 * 
 * Security measures:
 * - API key stored server-side
 * - URL validation and sanitization
 * - Per-IP rate limiting
 * - CORS headers with configurable origins
 * - Request size limits
 * - Comprehensive error handling
 */

// Rate limiting store (in-memory for edge runtime)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute per IP
const MAX_URL_LENGTH = 2048 // Maximum URL length

// Retry configuration (no timeouts)
const MAX_RETRIES = 2 // Number of retry attempts
const RETRY_DELAY = 2000 // Initial delay between retries (2 seconds)

// Types for PageSpeed API response
interface PageSpeedResponse {
  lighthouseResult?: {
    categories: {
      performance: {
        score: number
      }
    }
    audits: Record<string, unknown>
  }
  loadingExperience?: {
    metrics: Record<string, unknown>
  }
}

/**
 * Validates and sanitizes the URL input
 */
function validateUrl(url: string): { valid: boolean; error?: string; sanitized?: string } {
  try {
    // Remove any whitespace
    const trimmed = url.trim()
    
    if (!trimmed) {
      return { valid: false, error: "URL is required" }
    }

    // Check URL length limit
    if (trimmed.length > MAX_URL_LENGTH) {
      return { valid: false, error: `URL too long. Maximum length is ${MAX_URL_LENGTH} characters` }
    }

    // Ensure URL has a protocol
    let urlWithProtocol = trimmed
    if (!trimmed.match(/^https?:\/\//i)) {
      urlWithProtocol = `https://${trimmed}`
    }

    // Parse and validate URL
    const parsedUrl = new URL(urlWithProtocol)
    
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS protocols are allowed" }
    }

    // Ensure there's a valid hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.length < 3) {
      return { valid: false, error: "Invalid hostname" }
    }

    return { valid: true, sanitized: parsedUrl.toString() }
  } catch (error) {
    return { valid: false, error: "Invalid URL format" }
  }
}

/**
 * Checks rate limiting for the given IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = ip
  
  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetTime) {
      rateLimitStore.delete(k)
    }
  }
  
  const current = rateLimitStore.get(key)
  
  if (!current) {
    // First request from this IP
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW }
  }
  
  if (now > current.resetTime) {
    // Window has expired, reset
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW }
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: current.resetTime }
  }
  
  // Increment counter
  current.count++
  rateLimitStore.set(key, current)
  
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - current.count, resetTime: current.resetTime }
}

/**
 * Gets the client IP address from the request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  // Fallback to a default identifier for edge runtime
  // In edge runtime, request.ip is not available
  return 'edge-runtime-ip'
}

/**
 * Sleeps for the specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Makes a request to Google PageSpeed API with retry logic (no timeouts)
 */
async function fetchPageSpeedWithRetry(url: string, strategy: string, apiKey?: string): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
        },
        cache: 'no-store' // Always fresh for retries
      })
      
      // If successful or client error (4xx), return immediately
      if (response.ok || response.status >= 400 && response.status < 500) {
        return response
      }
      
      // For server errors (5xx), throw to trigger retry
      throw new Error(`Server error: ${response.status}`)
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Don't retry on client errors or max retries reached
      if (attempt === MAX_RETRIES) {
        break
      }
      
      // Wait before retrying with exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt)
      console.log(`PageSpeed API attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  
  throw lastError || new Error('Max retries exceeded')
}

/**
 * Handles the PageSpeed API response and error cases
 */
async function handlePageSpeedResponse(
  response: Response, 
  rateLimit: { remaining: number; resetTime: number },
  request: NextRequest,
  forceRefresh: boolean
): Promise<NextResponse> {
  if (!response.ok) {
    const errorText = await response.text()
    console.error("PageSpeed API Error:", errorText)
    
    // Handle specific error cases
    if (response.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }
    
    if (response.status === 400) {
      return NextResponse.json(
        { error: "Invalid URL or PageSpeed API error" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to fetch PageSpeed data" },
      { status: response.status }
    )
  }

  const data: PageSpeedResponse = await response.json()

  // Return the response with appropriate headers
  return NextResponse.json(data, {
    headers: {
      // If force refresh, don't cache. Otherwise cache for 5 minutes
      "Cache-Control": forceRefresh 
        ? "no-cache, no-store, must-revalidate" 
        : "public, s-maxage=300, stale-while-revalidate=600",
      // Rate limiting headers
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
      // CORS headers
      ...getCORSHeaders(request.headers.get('origin'))
    },
  })
}

/**
 * Sets CORS headers based on environment configuration
 */
function getCORSHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['http://localhost:3000']
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
  
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  } else if (allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*'
  } else {
    // Default to first allowed origin if no match
    headers['Access-Control-Allow-Origin'] = allowedOrigins[0] || 'http://localhost:3000'
  }
  
  return headers
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP and check rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      const resetTimeSeconds = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: "Too many requests. Please try again later.",
          resetIn: resetTimeSeconds
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            ...getCORSHeaders(request.headers.get('origin'))
          }
        }
      )
    }

    // Get URL and strategy from query parameters
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get("url")
    const strategy = searchParams.get("strategy") || "mobile" // mobile or desktop
    const forceRefresh = searchParams.get("refresh") === "true" // Force bypass cache

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            ...getCORSHeaders(request.headers.get('origin'))
          }
        }
      )
    }

    const validation = validateUrl(url)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            ...getCORSHeaders(request.headers.get('origin'))
          }
        }
      )
    }

    // Validate strategy
    if (!["mobile", "desktop"].includes(strategy)) {
      return NextResponse.json(
        { error: "Strategy must be 'mobile' or 'desktop'" },
        { 
          status: 400,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            ...getCORSHeaders(request.headers.get('origin'))
          }
        }
      )
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY

    // Build PageSpeed API URL
    const pagespeedUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
    pagespeedUrl.searchParams.set("url", validation.sanitized!)
    pagespeedUrl.searchParams.set("strategy", strategy)
    
    // Add API key if available
    if (apiKey && apiKey !== "your_api_key_here") {
      pagespeedUrl.searchParams.set("key", apiKey)
    }

    // Request the most important metrics
    pagespeedUrl.searchParams.set("category", "PERFORMANCE")

    try {
      // Make request to Google PageSpeed Insights API with retry logic
      const response = await fetchPageSpeedWithRetry(pagespeedUrl.toString(), strategy, apiKey)
      return await handlePageSpeedResponse(response, rateLimit, request, forceRefresh)
    } catch (error) {
      console.error("PageSpeed API error:", error)
      
      // Handle errors with helpful suggestions (no timeout handling)
      return NextResponse.json(
        { 
          error: "Unable to analyze the website right now. This might be temporary.",
          suggestion: "Please check that the website is accessible and try again. If the problem persists, the website might be blocking automated requests."
        },
        { 
          status: 502,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            ...getCORSHeaders(request.headers.get('origin'))
          }
        }
      )
    }

  } catch (error) {
    console.error("PageSpeed API Route Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: {
          ...getCORSHeaders(request.headers.get('origin'))
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getCORSHeaders(request.headers.get('origin'))
    }
  })
}

// Export runtime configuration
export const runtime = "edge"
