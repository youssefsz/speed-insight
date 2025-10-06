"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { SparklesText } from "@/components/ui/sparkles-text"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full transition-all duration-300",
        isScrolled
          ? "w-[95%] md:w-[80%] max-w-6xl md:max-w-4xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg border border-gray-200/60 dark:border-slate-700/60"
          : "w-[95%] max-w-6xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/80 dark:border-slate-700/80 shadow-md"
      )}
    >
      <div className={cn(
        "flex items-center justify-between transition-all duration-300",
        isScrolled ? "px-6 py-4 md:px-4 md:py-3" : "px-6 py-4"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <SparklesText 
              className="text-2xl font-bold text-primary"
              colors={{ first: "#a855f7", second: "#ec4899" }}
              sparklesCount={3}
            >
              <span style={{ fontFamily: "var(--font-heading), cursive" }}>SpeedInsight</span>
            </SparklesText>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-lg font-semibold transition-all duration-300 cursor-pointer",
                  "tracking-wide",
                  isActive
                    ? "text-primary scale-105"
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                )}
                style={{ fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif" }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler 
            className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
            aria-label="Toggle theme"
          />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200/70 dark:border-slate-700/70"
          >
            <div className={cn(
              "flex flex-col gap-4 transition-all duration-300 items-center",
              isScrolled ? "px-6 py-4 md:px-4 md:py-3" : "px-6 py-4"
            )}>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "relative text-lg font-semibold transition-all duration-300 cursor-pointer",
                      "tracking-wide py-2 text-center",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    style={{ fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif" }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-navbar-indicator"
                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
