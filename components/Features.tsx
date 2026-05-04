"use client";

import { motion, type Variants } from "framer-motion";
import {
  BarChart2,
  Target,
  PenLine,
  Search,
  Download,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative bg-[#faf9f7] py-20 sm:py-28 px-4 sm:px-6 font-sans overflow-hidden"
    >
      {/* Ambient texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, #e8c99a22, transparent 40%), radial-gradient(circle at 90% 100%, #c2e5ca22, transparent 40%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-[#a07c5b]/40" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#a07c5b]">
                What you get
              </span>
            </div>
            <h2
              className="font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mb-5 text-[#1a1714]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Everything your resume needs{" "}
              <span className="italic font-light text-[#1a1714]/60">
                to win.
              </span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#6b6460] max-w-xl">
              CVPilot doesn&apos;t guess — it reads the job post, compares it to
              your resume, and tells you exactly what to fix.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6b6460]">
            <Sparkles size={14} className="text-[#a07c5b]" />
            <span>6 modules · 1 platform</span>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-[minmax(0,_1fr)]">
          {/* 1. ATS Score — hero */}
          <BentoCard
            custom={0}
            className="sm:col-span-2 lg:col-span-5 lg:row-span-2 min-h-[340px] sm:min-h-[400px] lg:min-h-[480px] bg-[#1a1714] text-[#f5f0ea] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80"
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/70 to-transparent"
            />
            <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                  <BarChart2 size={20} className="text-[#e8c99a]" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#e8c99a]/15 text-[#e8c99a] ring-1 ring-[#e8c99a]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e8c99a] animate-pulse" />
                  Live scoring
                </span>
              </div>

              {/* Big score visual */}
              <div className="my-6 sm:my-8">
                <div className="flex items-end gap-2 mb-3">
                  <span
                    className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none tracking-tight text-[#f5f0ea]"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    87
                  </span>
                  <span className="text-2xl text-[#a39a93] mb-2">/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden max-w-xs">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "87%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#e8c99a] to-[#c9a16a]"
                  />
                </div>
              </div>

              <div>
                <h3
                  className="font-bold text-2xl sm:text-3xl leading-tight mb-2"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Instant ATS Score
                </h3>
                <p className="text-sm leading-relaxed text-[#a39a93] max-w-md">
                  Real match score from 0–100 based on keyword alignment,
                  skills, and experience relevance — not guesses.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* 2. Keyword Gap */}
          <BentoCard
            custom={1}
            className="lg:col-span-4 bg-[#edf6ef] min-h-[260px]"
          >
            <div className="p-6 sm:p-7 flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#c2e5ca]">
                  <Target size={18} className="text-[#2d7a40]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2d7a40]/70">
                  12 missing
                </span>
              </div>
              <div>
                <h3
                  className="font-bold text-xl mb-2 text-[#1a3320]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Keyword Gap Analysis
                </h3>
                <p className="text-sm leading-relaxed text-[#4a6b52]">
                  See which keywords the employer wants that your resume is
                  missing — ranked by importance.
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-auto">
                {["React", "TypeScript", "CI/CD", "AWS"].map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#c2e5ca] text-[#1e5c2e]"
                  >
                    {kw}
                  </span>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white/60 text-[#4a6b52] ring-1 ring-[#c2e5ca]">
                  +12 more
                </span>
              </div>
            </div>
          </BentoCard>

          {/* 3. Version History */}
          <BentoCard
            custom={2}
            className="lg:col-span-3 bg-[#f0edf8] min-h-[260px]"
          >
            <div className="p-6 sm:p-7 flex flex-col gap-4 h-full">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#d9d0f0]">
                <Clock size={18} className="text-[#5b3fbf]" />
              </div>
              <div>
                <h3
                  className="font-bold text-xl mb-2 text-[#1e1540]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Version History
                </h3>
                <p className="text-sm leading-relaxed text-[#6b5da8]">
                  Track your resume&apos;s evolution over time.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 mt-auto">
                {[
                  { v: "v3", score: 87, active: true },
                  { v: "v2", score: 71, active: false },
                  { v: "v1", score: 53, active: false },
                ].map(({ v, score, active }) => (
                  <div key={v} className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-semibold w-6 ${
                        active ? "text-[#5b3fbf]" : "text-[#9b8fd4]"
                      }`}
                    >
                      {v}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#ddd6f5]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          active ? "bg-[#5b3fbf]" : "bg-[#b4a8e0]"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold w-7 text-right ${
                        active ? "text-[#5b3fbf]" : "text-[#9b8fd4]"
                      }`}
                    >
                      {score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* 4. AI Bullet Rewriter */}
          <BentoCard
            custom={3}
            className="lg:col-span-4 bg-[#fff8f0] min-h-[260px]"
          >
            <div className="p-6 sm:p-7 h-full flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#fde3c4]">
                <PenLine size={18} className="text-[#b85c00]" />
              </div>
              <div>
                <h3
                  className="font-bold text-xl mb-2 text-[#2b1800]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  AI Bullet Rewriter
                </h3>
                <p className="text-sm leading-relaxed text-[#7a4a1a]">
                  Weak bullets become punchy, quantified, action-driven
                  statements. One-click accept.
                </p>
              </div>
              <div className="mt-auto rounded-xl p-3 text-xs space-y-2 bg-[#fde3c4]/50 ring-1 ring-[#fde3c4]">
                <div className="text-[#7a4a1a] line-through opacity-60">
                  Helped with marketing campaigns
                </div>
                <div className="font-semibold text-[#b85c00] flex items-start gap-1">
                  <ArrowUpRight size={12} className="mt-0.5 shrink-0" />
                  Led 6 campaigns, driving 40% revenue growth
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 5. Section Weakness */}
          <BentoCard
            custom={4}
            className="lg:col-span-4 bg-[#fff0f2] min-h-[260px]"
          >
            <div className="p-6 sm:p-7 flex flex-col gap-4 h-full">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#ffd5db]">
                <Search size={18} className="text-[#c0283c]" />
              </div>
              <div>
                <h3
                  className="font-bold text-xl mb-2 text-[#2d0a0e]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  Section Weakness Scan
                </h3>
                <p className="text-sm leading-relaxed text-[#8a3040]">
                  Pinpoints which sections are dragging your score and exactly
                  how to fix them.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                {[
                  { label: "Summary", pct: 45, bad: true },
                  { label: "Experience", pct: 82, bad: false },
                  { label: "Skills", pct: 60, bad: true },
                ].map(({ label, pct, bad }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium w-20 shrink-0 ${
                        bad ? "text-[#c0283c]" : "text-[#4a1a20]"
                      }`}
                    >
                      {label}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-[#ffd5db]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          bad ? "bg-[#e8546a]" : "bg-[#5a9e6a]"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold w-9 text-right ${
                        bad ? "text-[#c0283c]" : "text-[#2d7a40]"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* 6. PDF Export */}
          <BentoCard
            custom={5}
            className="lg:col-span-3 bg-[#e8f4fc] min-h-[260px] overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#bddff7]/60 blur-2xl"
            />
            <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-4 h-full">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#bddff7]">
                <Download size={18} className="text-[#0e5ea0]" />
              </div>
              <div>
                <h3
                  className="font-bold text-xl mb-2 text-[#07274d]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  One-Click PDF Export
                </h3>
                <p className="text-sm leading-relaxed text-[#2d5e8a]">
                  Download a clean, professional PDF ready to submit.
                </p>
              </div>
              <button
                type="button"
                className="mt-auto group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#0e5ea0] w-fit"
              >
                Export now
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                />
              </button>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  className = "",
  custom,
}: {
  children: React.ReactNode;
  className?: string;
  custom: number;
}) {
  return (
    <motion.div
      custom={custom}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`group relative rounded-2xl sm:rounded-3xl border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
