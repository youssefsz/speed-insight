"use client"

import { useState } from "react"

interface Technology {
  name: string
  link: string
  logo: string
}

export function TechStack() {
  const technologies: Technology[] = [
    { 
      name: "Next.js 15", 
      link: "https://nextjs.org",
      logo: "https://cdn.simpleicons.org/nextdotjs"
    },
    { 
      name: "React 19", 
      link: "https://react.dev",
      logo: "https://cdn.simpleicons.org/react/61DAFB"
    },
    { 
      name: "TypeScript", 
      link: "https://www.typescriptlang.org",
      logo: "https://cdn.simpleicons.org/typescript/3178C6"
    },
    { 
      name: "TailwindCSS 4", 
      link: "https://tailwindcss.com",
      logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4"
    },
    { 
      name: "Framer Motion", 
      link: "https://www.framer.com/motion",
      logo: "https://cdn.simpleicons.org/framer"
    },
    { 
      name: "ShadCN UI", 
      link: "https://ui.shadcn.com",
      logo: "https://ui.shadcn.com/favicon.ico"
    },
    { 
      name: "Magic UI", 
      link: "https://magicui.design",
      logo: "https://magicui.design/icon.png"
    },
    { 
      name: "React Bits", 
      link: "https://www.reactbits.dev",
      logo: "https://www.reactbits.dev/favicon.ico"
    },
    { 
      name: "Tweakcn", 
      link: "https://tweakcn.com",
      logo: "https://tweakcn.com/favicon.ico"
    },
    { 
      name: "Google PSI API", 
      link: "https://developers.google.com/speed/docs/insights/v5/about",
      logo: "https://www.gstatic.com/pagespeed/insights/ui/logo/favicon_48.png"
    },
    { 
      name: "OGL", 
      link: "https://github.com/oframe/ogl",
      logo: "https://cdn.simpleicons.org/webgl/990000"
    }
  ]

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const handleImageError = (idx: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {technologies.map((tech, idx) => {
        // Don't invert logos for colored icons (React, TypeScript, TailwindCSS, Magic UI, Google PSI)
        const shouldInvert = !["React 19", "Magic UI", "TypeScript", "TailwindCSS 4", "Google PSI API"].includes(tech.name)
        
        return (
          <a
            key={idx}
            href={tech.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 border rounded-xl bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={tech.logo} 
                alt={`${tech.name} logo`}
                className={`w-full h-full object-contain transition-all group-hover:scale-110 ${
                  shouldInvert ? "dark:invert-[0.9] dark:brightness-200" : ""
                }`}
                onError={(e) => handleImageError(idx, e)}
              />
            </div>
            <div className="font-medium text-xs group-hover:text-primary transition-colors text-center">
              {tech.name}
            </div>
          </a>
        )
      })}
    </div>
  )
}
