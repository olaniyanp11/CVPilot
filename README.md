# CVPilot — AI Resume Optimizer (Next.js)

CVPilot is an AI resume optimization tool built with **Next.js App Router** and **Tailwind CSS**.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS v3**
- **TypeScript**
- **Lucide React** (icons)
- **Google Gemini API** (AI analysis + rewriting)

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Create `.env.local` in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Then restart `pnpm dev`.

## Project Structure

```
cvpilot/
├── app/
│   ├── globals.css       # Tailwind + custom animations
│   ├── layout.tsx        # Root layout + metadata
│   └── page.tsx          # Page assembly
│   ├── upload/           # Resume upload UI
│   ├── analyze/          # Job description input + analysis trigger
│   ├── dashboard/        # Results + PDF export
│   └── api/              # Route handlers (upload/analyze/export)
├── components/
│   ├── ResumeUpload.tsx
│   ├── JobInput.tsx
│   ├── ScoreCard.tsx
│   ├── KeywordList.tsx
│   └── ResumePreview.tsx
├── lib/
│   ├── parser.ts         # PDF/DOCX → text
│   ├── scoring.ts        # Non-AI scoring (weighted)
│   └── gemini.ts         # Gemini API integration (server-only)
├── types/
│   ├── resume.ts
│   └── analysis.ts
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

## Design System

| Token | Value |
|-------|-------|
| Font display | Syne 700/800 |
| Font body | DM Sans 300/400/500 |
| Primary | `#1a4fff` |
| Background | `#f8f6f0` (cream-100) |
| Ink | `#0c0c0c` |

## Sections

1. **Navbar** — Fixed, scroll-aware, mobile responsive
2. **Ticker** — Scrolling features strip (dark)
3. **Hero** — Headline + CTAs + live score preview cards
4. **LogoBar** — Company trust logos
5. **Features** — 6-cell border grid
6. **How it Works** — Dark section with 4 steps + stat bar
7. **Testimonials** — 6 cards, 2-col on mobile
8. **Pricing** — 3 tiers, featured card elevated
9. **CTA Banner** — Blue full-width with grid pattern
10. **Footer** — 4-col with brand + links
