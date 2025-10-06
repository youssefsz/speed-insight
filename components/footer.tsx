"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SparklesText } from "@/components/ui/sparkles-text"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <SparklesText 
              className="text-2xl font-bold text-primary"
              colors={{ first: "#a855f7", second: "#ec4899" }}
              sparklesCount={3}
            >
              <span style={{ fontFamily: "var(--font-heading), cursive" }}>SpeedInsight</span>
            </SparklesText>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Professional website performance testing powered by Google PageSpeed Insights API.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-sm">Quick Links</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors cursor-pointer">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-sm">Resources</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://developers.google.com/speed/docs/insights/v5/get-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  PageSpeed API Docs
                </a>
              </li>
              <li>
                <a
                  href="https://web.dev/vitals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Core Web Vitals
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-sm">Legal</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SpeedInsight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
