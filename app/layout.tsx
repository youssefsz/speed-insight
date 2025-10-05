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
  title: "SpeedInsight - Professional Website Performance Testing",
  description: "Test your website performance with Google PageSpeed Insights API. Get detailed insights into Core Web Vitals, performance scores, and optimization recommendations.",
  keywords: ["website performance", "pagespeed insights", "core web vitals", "website speed test", "performance optimization", "LCP", "FID", "CLS"],
  authors: [{ name: "SpeedInsight" }],
  creator: "SpeedInsight",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speedinsight.com",
    title: "SpeedInsight - Professional Website Performance Testing",
    description: "Test your website performance with Google PageSpeed Insights API. Get detailed insights into Core Web Vitals and optimization recommendations.",
    siteName: "SpeedInsight",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedInsight - Professional Website Performance Testing",
    description: "Test your website performance with Google PageSpeed Insights API.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} ${plexMono.variable} ${caveat.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
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
