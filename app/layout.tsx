import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://speed-insight.youssef.tn'),
  title: {
    default: "SpeedInsight - Professional Website Performance Testing",
    template: "%s | SpeedInsight"
  },
  description: "Test your website performance with Google PageSpeed Insights API. Get detailed insights into Core Web Vitals, performance scores, and optimization recommendations.",
  keywords: ["website performance", "pagespeed insights", "core web vitals", "website speed test", "performance optimization", "LCP", "FID", "CLS", "performance testing", "speed test", "web vitals", "lighthouse", "google pagespeed"],
  authors: [{ name: "SpeedInsight", url: "https://speed-insight.youssef.tnn" }],
  creator: "SpeedInsight",
  publisher: "SpeedInsight",
  category: "technology",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/favicons/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "android-chrome", url: "/favicons/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speed-insight.youssef.tn",
    title: "SpeedInsight - Professional Website Performance Testing",
    description: "Test your website performance with Google PageSpeed Insights API. Get detailed insights into Core Web Vitals and optimization recommendations.",
    siteName: "SpeedInsight",
    images: [
      {
        url: "/imgs/OG-img.png",
        width: 1200,
        height: 630,
        alt: "SpeedInsight - Test Your Website Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedInsight - Professional Website Performance Testing",
    description: "Test your website performance with Google PageSpeed Insights API.",
    images: ["/imgs/OG-img.png"],
    creator: "@speedinsight",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://speed-insight.youssef.tn",
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
};

/**
 * Structured Data (JSON-LD) for SEO
 * Provides rich information about the website to search engines
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://speed-insight.youssef.tn/#website",
      "url": "https://speed-insight.youssef.tn",
      "name": "SpeedInsight",
      "description": "Professional website performance testing with Google PageSpeed Insights API",
      "publisher": {
        "@id": "https://speed-insight.youssef.tn/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://speed-insight.youssef.tn/insights?url={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://speed-insight.youssef.tn/#organization",
      "name": "SpeedInsight",
      "url": "https://speed-insight.youssef.tn",
      "logo": {
        "@type": "ImageObject",
        "url": "https://speed-insight.youssef.tn/imgs/OG-img.png",
        "width": 1200,
        "height": 630
      },
      "sameAs": [
        "https://github.com/youssefsz/speed-insight"
      ]
    },
    {
      "@type": "WebApplication",
      "@id": "https://speed-insight.youssef.tn/#webapp",
      "name": "SpeedInsight",
      "url": "https://speed-insight.youssef.tn",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      },
      "description": "Test your website performance with Google PageSpeed Insights API. Get detailed insights into Core Web Vitals, performance scores, and optimization recommendations."
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('speed-insight-theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const activeTheme = theme === 'system' || !theme ? systemTheme : theme;
                
                if (activeTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${jakartaSans.variable} ${plexMono.variable} ${caveat.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="speed-insight-theme"
          enableColorScheme
        >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}