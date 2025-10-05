import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Performance Insights",
  description: "View detailed website performance insights, Core Web Vitals analysis, and optimization recommendations powered by Google PageSpeed Insights.",
  keywords: ["performance insights", "website analysis", "core web vitals", "performance report", "speed optimization"],
  openGraph: {
    title: "Performance Insights - SpeedInsight",
    description: "View detailed website performance insights and Core Web Vitals analysis.",
    url: "https://speed-insight.youssef.tn/insights",
    type: "website",
    images: [
      {
        url: "/imgs/OG-img.png",
        width: 1200,
        height: 630,
        alt: "SpeedInsight Performance Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performance Insights - SpeedInsight",
    description: "View detailed website performance insights and Core Web Vitals analysis.",
    images: ["/imgs/OG-img.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
