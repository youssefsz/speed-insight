import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Globe, ExternalLink } from "lucide-react"
import { SparklesText } from "@/components/ui/sparkles-text"
import { TechStack } from "@/components/tech-stack"
import { InteractiveHoverButtonBack } from "@/components/ui/interactive-hover-button-back"

export const metadata: Metadata = {
  title: "About - SpeedInsight",
  description: "Learn about SpeedInsight and the developer behind it",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link href="/">
          <InteractiveHoverButtonBack className="mb-12">
            Back to Home
          </InteractiveHoverButtonBack>
        </Link>

        {/* Hero Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            About{" "}
            <SparklesText 
              className="text-5xl md:text-7xl font-bold text-primary inline-block"
              colors={{ first: "#a855f7", second: "#ec4899" }}
              sparklesCount={5}
            >
              SpeedInsight
            </SparklesText>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional website performance testing made beautiful and accessible
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Creator Card */}
          <div className="border rounded-2xl p-8 bg-card space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-xl" />
              <img
                src="https://youssef.tn/ysf.webp"
                alt="Youssef Dhibi"
                className="relative rounded-2xl w-full h-full object-cover border border-border/50"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Youssef Dhibi</h3>
              <p className="text-sm text-muted-foreground">Developer & Creator</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="https://youssef.tn" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Button variant="outline" size="sm" className="w-full gap-2 group cursor-pointer">
                  <Globe size={16} />
                  Portfolio
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </a>
              <a href="https://github.com/youssefsz" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Button variant="outline" size="sm" className="w-full gap-2 group cursor-pointer">
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </a>
            </div>
          </div>

          {/* What is SpeedInsight - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-6 border rounded-2xl p-8 bg-card">
            <h2 className="text-2xl font-semibold">What is SpeedInsight?</h2>
            <p className="text-muted-foreground leading-relaxed">
              SpeedInsight is a modern web application that brings the power of Google PageSpeed Insights 
              directly to your fingertips. Built with cutting-edge technologies and modern design principles, 
              it provides comprehensive website performance analysis with a beautiful, intuitive interface.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Test any website for performance issues, analyze Core Web Vitals, and receive detailed 
              optimization recommendations, all through an elegant, easy-to-use interface that makes 
              performance optimization accessible to everyone.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Built With</h2>
          <TechStack />
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Real-time performance testing with Google PageSpeed Insights API v5",
              "Interactive performance circle with hoverable metric segments",
              "Comprehensive Core Web Vitals assessment with detailed distributions",
              "Mobile and desktop analysis with separate results",
              "Beautiful WebGL animated backgrounds using OGL",
              "Dark and light mode with smooth animated transitions",
              "Fully responsive design across all devices",
              "Professional URL validation with real-time feedback"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 border rounded-xl bg-card hover:bg-accent/20 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source Section */}
        <div className="border rounded-2xl p-8 bg-card/50 backdrop-blur-sm mb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl  flex items-center justify-center mx-auto">
              <Github className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed">
              SpeedInsight is open source and available on GitHub. Contributions, issues, and feature 
              requests are welcome. View the source code, report bugs, or contribute to make SpeedInsight 
              even better.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/youssefsz/speed-insight"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Button className="gap-2 group cursor-pointer">
                  <Github size={18} />
                  View Repository
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </a>
              <a
                href="mailto:me@youssef.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Button variant="outline" className="gap-2 group cursor-pointer">
                  Report Issues
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 pt-12 border-t">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Start Testing Your Website</h3>
            <p className="text-muted-foreground">
              Ready to optimize your website&apos;s performance? Test any URL and get detailed insights in seconds.
            </p>
            <Link href="/">
              <InteractiveHoverButtonBack className="h-12 px-8">
                Go Home
              </InteractiveHoverButtonBack>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
