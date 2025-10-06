import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about SpeedInsight, a modern web application for website performance testing powered by Google PageSpeed Insights API. Built with Next.js, React, and cutting-edge technologies.",
  keywords: ["about speedinsight", "website performance tool", "pagespeed insights tool", "web performance testing", "developer tools"],
  openGraph: {
    title: "About SpeedInsight - Professional Performance Testing Tool",
    description: "Learn about SpeedInsight, a modern web application for website performance testing powered by Google PageSpeed Insights API.",
    url: "https://speed-insight.youssef.tn/about",
    type: "website",
    images: [
      {
        url: "/imgs/OG-img.png",
        width: 1200,
        height: 630,
        alt: "SpeedInsight About Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SpeedInsight",
    description: "Learn about SpeedInsight, a modern web application for website performance testing.",
    images: ["/imgs/OG-img.png"],
  },
  alternates: {
    canonical: "https://speed-insight.youssef.tn/about",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
