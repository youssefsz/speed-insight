# SpeedInsight - Professional Website Performance Testing

A modern, feature-rich Next.js 2025 web application that replicates the full functionality of Google PageSpeed Insights. Built with Next.js 15, React 19, ShadCN UI, Framer Motion, and TailwindCSS 4.

![SpeedInsight Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Core Functionality
- 🚀 **Real-time Performance Testing** - Test any website using Google PageSpeed Insights API v5
- 📱 **Mobile & Desktop Analysis** - Comprehensive testing for both device types with separate tabs
- 📊 **Core Web Vitals Assessment** - Detailed real-world metrics (LCP, INP, CLS) from Chrome UX Report with distribution analysis
- 🎯 **Interactive Performance Circle** - Visual performance score with hoverable metric segments showing detailed breakdowns
- 💡 **Optimization Opportunities** - Top actionable insights ranked by potential time savings
- 📈 **Comprehensive Metrics** - 6 key performance metrics with expandable details, weights, and descriptions
- ⚡ **Instant Results** - Fast, efficient testing with smart caching (5-minute cache)
- 🔄 **Force Refresh** - Bypass cache to get the latest performance data
- ✅ **Real-time URL Validation** - Professional validation with visual feedback (success/error states)
- 🎨 **Beautiful UI** - Modern design with ShadCN components and smooth animations
- 📥 **Download Reports** - Export reports in multiple formats (PDF, DOCX, Markdown, TXT, Image) - Coming Soon

### Technical Highlights
- ✅ **Next.js 15 App Router** - Modern server and client components with edge runtime
- ✅ **React 19** - Latest React features and optimizations
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **TailwindCSS 4** - Modern utility-first CSS framework
- ✅ **Framer Motion** - Smooth, performant animations and transitions
- ✅ **OGL WebGL** - Beautiful animated thread background on homepage
- ✅ **Dark/Light Mode** - Animated theme switching with persistence via next-themes
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop (mobile-first approach)
- ✅ **Accessibility** - WCAG compliant with keyboard navigation, ARIA labels, and screen reader support
- ✅ **SEO Optimized** - Comprehensive metadata and Open Graph tags
- ✅ **Secure API** - Server-side API key handling, input validation, and rate limiting (10 requests/minute per IP)
- ✅ **Professional Pages** - About, Privacy Policy, and Terms of Service pages included

## 🌟 What Makes SpeedInsight Special?

### Beyond Basic PageSpeed Testing
While Google's PageSpeed Insights provides the raw data, SpeedInsight transforms it into a **beautiful, intuitive experience**:

1. **Interactive Visualizations**: Hover over performance circle segments to see detailed metric breakdowns
2. **Real-World Data**: Chrome UX Report integration shows actual user experiences from the past 28 days
3. **Smart Validation**: Real-time URL validation with professional feedback prevents errors before testing
4. **Comprehensive Analysis**: 6 key metrics, Core Web Vitals, opportunities, and diagnostics all in one view
5. **Modern Tech Stack**: Built with Next.js 15, React 19, and TailwindCSS 4 for optimal performance
6. **Beautiful Design**: Glassmorphism effects, smooth animations, and thoughtful UX throughout
7. **Export Ready**: Download reports in multiple formats for sharing with clients or teams (coming soon)

### Key Differentiators
- ✨ **Better UX**: Intuitive interface vs. Google's utilitarian design
- 🎨 **Modern Design**: Beautiful dark/light mode with smooth animations
- 📊 **Enhanced Visualizations**: Interactive charts and detailed breakdowns
- 🚀 **Faster**: Edge runtime and smart caching for instant results
- 🔒 **Secure**: Rate limiting, validation, and best security practices
- 📱 **Mobile-First**: Fully responsive design that works everywhere

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm, npm, or yarn (pnpm recommended)
- Google PageSpeed Insights API key (optional but recommended for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/youssefsz/speed-insight.git
   cd speed-insight
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_PAGESPEED_API_KEY=your_api_key_here
   ```

   To get an API key:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the PageSpeed Insights API
   - Create credentials (API key)
   - Copy the API key to your `.env.local` file

   **Note:** The application will work without an API key but may be subject to stricter rate limits.

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
speed-insight/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── pagespeed/         # API route for PageSpeed Insights with rate limiting
│   ├── about/                 # About page with tech stack and creator info
│   ├── insights/              # Performance results page with detailed metrics
│   ├── privacy-policy/        # Privacy policy page
│   ├── terms/                 # Terms of service page
│   ├── layout.tsx             # Root layout with navigation and footer
│   ├── page.tsx               # Landing page with hero and WebGL background
│   └── globals.css            # Global styles with TailwindCSS 4 configuration
├── components/                 # React components
│   ├── ui/                    # ShadCN UI components (40+ components)
│   │   ├── animated-theme-toggler.tsx    # Custom theme switch
│   │   ├── aurora-text.tsx               # Animated text effect
│   │   ├── interactive-hover-button.tsx  # Interactive button with hover effects
│   │   ├── sparkles-text.tsx            # Sparkles animation for text
│   │   ├── shine-border.tsx             # Animated border effect
│   │   └── ...                          # Other UI components
│   ├── core-web-vitals-assessment.tsx    # Real-world CWV data visualization
│   ├── performance-circle.tsx            # Interactive performance visualization
│   ├── download-menu.tsx                 # Multi-format download menu
│   ├── tech-stack.tsx                   # Technology stack display
│   ├── navbar.tsx                       # Navigation bar with glassmorphism
│   ├── footer.tsx                       # Site footer with links
│   ├── theme-provider.tsx               # Theme context provider
│   └── Threads.tsx                      # WebGL background using OGL
├── hooks/                      # Custom React hooks
│   └── use-mobile.ts          # Mobile detection hook
├── lib/                        # Utility functions and helpers
│   ├── download/              # Download functionality (5 formats)
│   │   ├── download-manager.ts          # Centralized download manager
│   │   ├── pdf-generator.ts             # PDF report generation
│   │   ├── docx-generator.ts            # Word document generation
│   │   ├── markdown-generator.ts        # Markdown export
│   │   ├── txt-generator.ts             # Plain text export
│   │   └── image-generator.ts           # Image capture (PNG/JPEG)
│   └── utils.ts               # Helper utilities
├── types/                      # TypeScript type definitions
│   └── page-speed.ts          # PageSpeed API response types
├── public/                     # Static assets
├── .env.local                 # Environment variables (create this)
├── .env.example               # Example environment variables
├── components.json            # ShadCN configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🎨 Key Components

### Landing Page (`/`)
- Hero section with animated WebGL thread background (OGL library)
- URL input with real-time validation and visual feedback (green/red states)
- Auto-correction (adds `https://` if missing)
- Debounced validation (500ms delay)
- Professional error messages for invalid URLs
- Sparkles text effect on "Performance" title
- Shine border animation on input container
- Smooth page transitions with Framer Motion

### Insights Page (`/insights`)
- **Tabbed Interface**: Animated tabs for Mobile and Desktop results
- **Performance Overview**: 4 category scores (Performance, Accessibility, Best Practices, SEO)
- **Interactive Performance Circle**: Hoverable segments showing metric breakdowns with weights
- **Screenshot Display**: Visual representation of tested page
- **Expandable Metrics Section**: 6 key metrics (FCP, SI, LCP, TTI, TBT, CLS) with:
  - Individual scores and values
  - Weight percentages in performance calculation
  - Detailed descriptions with clickable links
  - Expand/collapse functionality
- **Core Web Vitals Assessment**: Real Chrome UX Report data featuring:
  - LCP, INP, CLS metrics (Core Web Vitals)
  - Additional metrics: FCP, FID, TTFB
  - Distribution bars showing good/needs work/poor percentages
  - Percentile markers with precise positioning
  - Pass/Fail status based on real-world data
- **Optimization Opportunities**: Top 8 opportunities ranked by wasted time
- **Diagnostics**: Passed audits with display values
- **Force Refresh**: Button to bypass cache and get latest data
- **Download Menu**: Multi-format export (coming soon)
- **Comprehensive Loading States**: Skeleton animations for all sections

### About Page (`/about`)
- Creator information with portfolio links
- Project description and mission
- Interactive tech stack grid with hover effects
- Key features showcase
- Open source section with GitHub links
- Responsive layout with beautiful cards

### API Route (`/api/pagespeed`)
- **Security Features**:
  - Server-side API key storage
  - URL validation and sanitization
  - Per-IP rate limiting (10 requests/minute)
  - CORS configuration with origin validation
  - URL length limits (2048 characters)
  - Protocol restrictions (HTTP/HTTPS only)
- **Caching Strategy**:
  - 5-minute response caching
  - Force refresh parameter support
  - Cache headers (s-maxage=300, stale-while-revalidate=600)
- **Error Handling**:
  - Specific error messages for different scenarios
  - Rate limit headers in responses
  - Comprehensive logging
- **Edge Runtime**: Optimal performance with edge deployment

### Global Components
- **Navbar**: Floating navigation with glassmorphism effect and smooth transitions
- **Footer**: Responsive footer with links to About, Privacy Policy, and Terms pages
- **Theme Provider**: Context provider for dark/light mode with next-themes
- **Theme Toggle**: Animated theme switcher with smooth transitions
- **Threads Background**: WebGL animated thread background with mouse interaction
- **Performance Circle**: Interactive circular visualization with metric segments
- **Core Web Vitals Assessment**: Comprehensive real-world data visualization
- **Download Menu**: VS Code-style nested menu for export options
- **Tech Stack**: Grid display of all technologies with logos

## 🔒 Security Features

- ✅ **Server-side API key storage** - API keys never exposed to client
- ✅ **Input validation and sanitization** - Comprehensive URL validation
- ✅ **URL protocol validation** - HTTP/HTTPS only, blocks dangerous protocols
- ✅ **Rate limiting** - 10 requests per minute per IP address
- ✅ **CORS configuration** - Configurable origin allowlist
- ✅ **URL length limits** - Max 2048 characters to prevent abuse
- ✅ **Edge runtime security** - Runs in edge environment for better isolation
- ✅ **Environment variable protection** - Secure .env.local configuration
- ✅ **Error message sanitization** - No sensitive data in error responses

## 🎭 Animation Features

- **Page Transitions**: Smooth entry/exit animations with Framer Motion
- **WebGL Background**: Interactive thread animation with mouse tracking (OGL)
- **Tab Switching**: Animated transitions between Mobile/Desktop views
- **Loading States**: Comprehensive skeleton animations for all sections
- **Hover Effects**: 
  - Interactive hover buttons with gradient animations
  - Tech stack cards with scale transforms
  - Navigation links with smooth transitions
- **Theme Transitions**: Smooth color transitions when switching dark/light mode
- **Sparkles Effect**: Dynamic sparkle animation on hero text
- **Shine Border**: Animated gradient border on input container
- **Metric Expansion**: Smooth height animations for metric details
- **Performance Circle**: Animated segments with hover effects
- **Progress Bars**: Animated distribution bars in Core Web Vitals
- **Percentile Markers**: Smooth positioning animations
- **Menu Animations**: Nested dropdown with fade/scale transitions
- **Icon Rotations**: Animated chevrons and refresh icons
- **Scroll Animations**: Fade-in effects on page load

## 📱 Responsive Design

- **Mobile-first approach** - Optimized for small screens first
- **Responsive Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Adaptive Components**:
  - Performance circle scales appropriately
  - Metrics grid: 1 column (mobile), 2 columns (tablet+)
  - Category scores: 2 columns (mobile), 4 columns (desktop)
  - Tech stack: 2 columns (mobile), 3 (tablet), 4 (desktop)
- **Responsive Typography**: Dynamic font sizes using Tailwind's responsive classes
- **Touch-friendly**: Large tap targets, no hover-only functionality
- **Flexible Layouts**: All grids and flexbox layouts adapt smoothly
- **Hidden Elements**: Optional descriptions hide on mobile to save space
- **Responsive Images**: Screenshot sizing adapts to viewport
- **Menu Adaptation**: Compact labels on mobile, full text on desktop

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **ARIA Labels**: Comprehensive labels for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG 2.1 AA compliant contrast ratios
- **Screen Reader Support**: Descriptive labels and announcements
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Alternative Text**: All images have descriptive alt text
- **Form Validation**: Clear error messages and validation feedback
- **Skip Links**: Easy navigation for keyboard users

## 📊 Metrics Analyzed

### Performance Metrics
- **First Contentful Paint (FCP)** - 10% weight - Measures when the first content appears
- **Speed Index (SI)** - 10% weight - How quickly content is visually displayed
- **Largest Contentful Paint (LCP)** - 25% weight - When the main content loads
- **Time to Interactive (TTI)** - 10% weight - When the page becomes fully interactive
- **Total Blocking Time (TBT)** - 30% weight - Sum of all time periods between FCP and TTI
- **Cumulative Layout Shift (CLS)** - 15% weight - Visual stability during page load

### Core Web Vitals (Real User Data)
- **Largest Contentful Paint (LCP)** - Loading performance (good: < 2.5s)
- **Interaction to Next Paint (INP)** - Interactivity (good: < 200ms)
- **Cumulative Layout Shift (CLS)** - Visual stability (good: < 0.1)
- **First Contentful Paint (FCP)** - Initial rendering (good: < 1.8s)
- **First Input Delay (FID)** - Legacy interactivity metric (good: < 100ms)
- **Time to First Byte (TTFB)** - Server response time (good: < 800ms)

### Additional Insights
- **Opportunities** - Optimization suggestions with potential time savings
- **Diagnostics** - Passed audits and best practices
- **Screenshots** - Visual representation of the tested page
- **Distribution Analysis** - Percentage breakdown of good/needs work/poor user experiences

## 🔧 Configuration

### TailwindCSS

The project uses TailwindCSS 4 with custom configuration in `app/globals.css`:
- Custom color palette with CSS variables
- Dark mode support
- Custom animations (marquee)
- Extended theme with custom fonts and spacing

### Next.js

Configuration in `next.config.ts`:
- TypeScript support
- Image optimization
- App Router
- Edge runtime for API routes

### TypeScript

Configuration in `tsconfig.json`:
- Strict mode enabled
- Path aliases (`@/*`)
- Modern ES2017+ target

## 📊 Performance Optimization

### Implemented Optimizations
- **Dynamic Imports**: Heavy components like Threads (WebGL) loaded with `next/dynamic` and SSR disabled
- **Response Caching**: 5-minute cache for PageSpeed API responses with stale-while-revalidate
- **Edge Runtime**: API routes run on edge for minimal latency
- **Parallel Fetching**: Mobile and desktop data fetched simultaneously with `Promise.all`
- **Debounced Validation**: 500ms debounce on URL input to reduce unnecessary validations
- **Optimized Animations**: Hardware-accelerated transforms and opacity changes
- **Rate Limiting**: In-memory rate limiting prevents API abuse
- **Lazy Loading**: Images use native lazy loading attributes
- **Code Splitting**: Automatic code splitting via Next.js App Router
- **Turbopack**: Ultra-fast builds in development mode
- **Suspense Boundaries**: Loading states with React Suspense

### Performance Targets
- ⚡ **60 FPS** animations using Framer Motion
- 🚀 **Sub-100ms** API response times with edge runtime
- 📦 **Minimal Bundle Size** with tree shaking and code splitting
- 🎯 **Lighthouse Score 90+** on production builds

## 🌐 Deployment

> **⚠️ Ethical Notice**: We recommend **avoiding Vercel** for deployment due to their support of actions in Palestine. Please consider ethical alternatives below.

### Recommended Alternative Platforms

#### 1. Render (Recommended)

[Render.com](https://render.com) - Modern, developer-friendly platform with excellent Next.js support

**Deployment Steps:**
1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Environment Variables**: Add `GOOGLE_PAGESPEED_API_KEY`
5. Deploy!

**Benefits:**
- ✅ Free SSL certificates
- ✅ Automatic deployments from Git
- ✅ Great Next.js support
- ✅ Edge network with CDN
- ✅ Generous free tier

#### 2. Netlify

[Netlify](https://netlify.com) - Popular platform with excellent DX

**Deployment Steps:**
1. Push to GitHub
2. Import site on Netlify
3. Build settings: `pnpm build`
4. Add environment variables
5. Deploy!

#### 3. Railway

[Railway.app](https://railway.app) - Simple infrastructure platform

**Deployment Steps:**
1. Connect GitHub repository
2. Add `GOOGLE_PAGESPEED_API_KEY` environment variable
3. Railway auto-detects Next.js
4. Deploy automatically!

#### 4. Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) - Fast edge deployment

**Deployment Steps:**
1. Connect Git repository
2. Framework preset: Next.js
3. Build command: `pnpm build`
4. Add environment variables
5. Deploy on Cloudflare's global edge network

#### 5. Self-Hosted Options

**Docker Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

**VPS Deployment** (DigitalOcean, Linode, Hetzner):
1. Set up a VPS with Ubuntu
2. Install Node.js 18+
3. Clone repository
4. Install dependencies: `pnpm install`
5. Build: `pnpm build`
6. Use PM2 for process management: `pm2 start npm --name "speedinsight" -- start`
7. Set up Nginx as reverse proxy

### General Requirements for All Platforms

Make sure to:
1. Set the `GOOGLE_PAGESPEED_API_KEY` environment variable
2. Configure build command: `pnpm build` or `npm run build`
3. Configure start command: `pnpm start` or `npm start`
4. Ensure Node.js 18+ runtime
5. Set proper environment variables for production

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_PAGESPEED_API_KEY` | Optional | Google PageSpeed Insights API key for production use |

## 🧪 Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Adding New Components

To add a new ShadCN component:
```bash
pnpm dlx shadcn@latest add [component-name]
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Creator

**Youssef Dhibi** - Developer & Creator
- Portfolio: [youssef.tn](https://youssef.tn)
- GitHub: [@youssefsz](https://github.com/youssefsz)
- Email: me@youssef.tn

## 📧 Support

For questions, bug reports, or feature requests:
- Open an issue on [GitHub](https://github.com/youssefsz/speed-insight/issues)
- Email: me@youssef.tn

## 🙏 Acknowledgments

### Core Technologies
- [Next.js 15](https://nextjs.org/) - The React Framework with App Router
- [React 19](https://react.dev/) - UI Library with latest features
- [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Google PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/v5/about) - Performance Analysis

### UI & Styling
- [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS Framework
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful UI Components
- [Magic UI](https://magicui.design/) - Animated Components
- [React Bits](https://www.reactbits.dev/) - React Component Library
- [Tweakcn](https://tweakcn.com/) - UI Component Variants
- [Radix UI](https://www.radix-ui.com/) - Unstyled accessible components
- [Lucide React](https://lucide.dev/) - Beautiful icon library

### Animation & Effects
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- [OGL](https://github.com/oframe/ogl) - Minimal WebGL library for thread background
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### Document Generation
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [docx](https://docx.js.org/) - DOCX document creation
- [html2canvas](https://html2canvas.hertzen.com/) - Screenshot capture
- [file-saver](https://github.com/eligrey/FileSaver.js) - Client-side file saving

### Utilities
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [clsx](https://github.com/lukeed/clsx) - Conditional className utility
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Merge Tailwind classes
- [date-fns](https://date-fns.org/) - Date utility library
- [Zod](https://zod.dev/) - TypeScript-first schema validation

### Deployment Platforms
- [Render](https://render.com/) - Modern hosting platform with excellent Next.js support
- [Netlify](https://netlify.com/) - Popular JAMstack platform
- [Railway](https://railway.app/) - Simple infrastructure platform
- [Cloudflare Pages](https://pages.cloudflare.com/) - Edge deployment platform

## 📸 Screenshots

Visit the [About Page](/about) to see the full tech stack and project information.

### Key Features Showcase
- **🏠 Landing Page**: WebGL animated background with real-time URL validation
- **📊 Results Dashboard**: Interactive performance circle with detailed metrics
- **📈 Core Web Vitals**: Real-world data from 28 days of Chrome UX Report
- **🎨 Beautiful UI**: Dark/light mode with smooth animations
- **📱 Responsive Design**: Looks great on all devices

## 🔗 Live Demo

🌐 **Deploy your own instance** using any of the recommended platforms above (Render, Netlify, Railway, etc.)

Or run locally with:
```bash
pnpm dev
# Open http://localhost:3000
```

## 📚 Related Resources

- **API Documentation**: [Google PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/v5/about)
- **Core Web Vitals**: [Web Vitals Initiative](https://web.dev/vitals/)
- **Next.js Docs**: [Next.js Documentation](https://nextjs.org/docs)
- **TailwindCSS**: [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

<div align="center">

**Built with ❤️ by [Youssef Dhibi](https://youssef.tn)**

Using Next.js 15, React 19, TypeScript, and modern web technologies

⭐ Star this repo if you find it useful!

</div>