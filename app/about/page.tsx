"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Globe, ExternalLink } from "lucide-react"
import { SparklesText } from "@/components/ui/sparkles-text"
import { TechStack } from "@/components/tech-stack"
import { InteractiveHoverButtonBack } from "@/components/ui/interactive-hover-button-back"
import { motion } from "framer-motion"

// Animation variants for smooth scroll effects
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <Link href="/">
            <InteractiveHoverButtonBack className="mb-12">
              Back to Home
            </InteractiveHoverButtonBack>
          </Link>
        </motion.div>

        {/* Hero Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            About{" "}
            <SparklesText 
              className="text-5xl md:text-7xl font-bold text-primary inline-block"
              colors={{ first: "#a855f7", second: "#ec4899" }}
              sparklesCount={5}
            >
              SpeedInsight
            </SparklesText>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Professional website performance testing made beautiful and accessible
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Creator Card */}
          <motion.div 
            className="border rounded-2xl p-8 bg-card space-y-6"
            variants={fadeInLeft}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
            }}
          >
            <motion.div 
              className="relative w-32 h-32 mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-xl" />
              <motion.img
                src="https://youssef.tn/ysf.webp"
                alt="Youssef Dhibi"
                className="relative rounded-2xl w-full h-full object-cover border border-border/50"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div 
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold">Youssef Dhibi</h3>
              <p className="text-sm text-muted-foreground">Developer & Creator</p>
            </motion.div>
            <motion.div 
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.a 
                href="https://youssef.tn" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="sm" className="w-full gap-2 group cursor-pointer">
                  <Globe size={16} />
                  Portfolio
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.a>
              <motion.a 
                href="https://github.com/youssefsz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="sm" className="w-full gap-2 group cursor-pointer">
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* What is SpeedInsight - Full width on mobile, 2 cols on desktop */}
          <motion.div 
            className="lg:col-span-2 space-y-6 border rounded-2xl p-8 bg-card"
            variants={fadeInRight}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
            }}
          >
            <motion.h2 
              className="text-2xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              What is SpeedInsight?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              SpeedInsight is a modern web application that brings the power of Google PageSpeed Insights 
              directly to your fingertips. Built with cutting-edge technologies and modern design principles, 
              it provides comprehensive website performance analysis with a beautiful, intuitive interface.
            </motion.p>
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Test any website for performance issues, analyze Core Web Vitals, and receive detailed 
              optimization recommendations, all through an elegant, easy-to-use interface that makes 
              performance optimization accessible to everyone.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-2xl font-semibold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Built With
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TechStack />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-2xl font-semibold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Key Features
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
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
              <motion.div 
                key={idx} 
                className="flex items-start gap-3 p-4 border rounded-xl bg-card hover:bg-accent/20 transition-colors"
                variants={fadeInUp}
                whileHover={{ 
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                />
                <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Open Source Section */}
        <motion.div 
          className="border rounded-2xl p-8 bg-card/50 backdrop-blur-sm mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
          }}
        >
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Github className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Open Source
            </motion.h2>
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              SpeedInsight is open source and available on GitHub. Contributions, issues, and feature 
              requests are welcome. View the source code, report bugs, or contribute to make SpeedInsight 
              even better.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="https://github.com/youssefsz/speed-insight"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="gap-2 group cursor-pointer">
                  <Github size={18} />
                  View Repository
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.a>
              <motion.a
                href="mailto:me@youssef.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="gap-2 group cursor-pointer">
                  Report Issues
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-20 pt-12 border-t"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h3 
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start Testing Your Website
            </motion.h3>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Ready to optimize your website&apos;s performance? Test any URL and get detailed insights in seconds.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/">
                <InteractiveHoverButtonBack className="h-12 px-8">
                  Go Home
                </InteractiveHoverButtonBack>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
