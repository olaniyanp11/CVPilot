"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";
import ScoreRing from "./ScoreRing";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const avatars = [
  { initials: "TK", bg: "bg-indigo-500" },
  { initials: "AM", bg: "bg-emerald-500" },
  { initials: "OB", bg: "bg-rose-500" },
  { initials: "SC", bg: "bg-amber-500" },
  { initials: "FD", bg: "bg-cyan-500" },
];

const keywords = [
  { label: "agile", found: false },
  { label: "SQL", found: false },
  { label: "Python", found: true },
  { label: "React", found: true },
  { label: "Scrum", found: false },
];

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 bg-black text-white overflow-hidden"
    >
      {/* ===== Premium Background System ===== */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* glow orbs */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[140px]" />

        {/* grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* noise */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
      </div>

      {/* Badge */}
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 backdrop-blur-md text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-wide"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        AI-powered career tool — free to start
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={item}
        className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.0] tracking-tight max-w-4xl mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
      >
        Your resume,{" "}
        <span className="relative inline-block">
          <span className="text-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
            optimized
          </span>
          <span className="absolute bottom-1 left-0 right-0 h-1 bg-blue-500/20 rounded-full" />
        </span>
        <br />
        to land the job.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={item}
        className="text-white/70 text-lg md:text-xl max-w-md mx-auto leading-relaxed font-light mb-10"
      >
        CVPilot reads any job post, scores your resume instantly, and rewrites it
        to beat ATS filters and impress hiring managers.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={item}
        className="flex flex-wrap gap-4 justify-center mb-10"
      >
        <Link
          href="/upload"
          className="relative inline-flex items-center gap-2 bg-blue-500 text-white font-medium text-sm px-7 py-3.5 rounded-full overflow-hidden shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition"
        >
          <span className="absolute inset-0 bg-blue-400 opacity-0 hover:opacity-20 transition-opacity" />
          Optimize my resume
          <ArrowRight size={16} />
        </Link>

        <Link
          href="#how"
          className="inline-flex items-center gap-2 bg-white/5 text-white font-medium text-sm px-7 py-3.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/10 backdrop-blur-md transition"
        >
          <Sparkles size={14} className="text-blue-400" />
          See how it works
        </Link>
      </motion.div>

      {/* Social proof */}
      <motion.div
        variants={item}
        className="flex items-center gap-3 justify-center mb-16"
      >
        <div className="flex -space-x-2">
          {avatars.map((av) => (
            <div
              key={av.initials}
              className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white text-[10px] font-bold ${av.bg}`}
            >
              {av.initials}
            </div>
          ))}
        </div>

        <p className="text-white/60 text-sm">
          <span className="text-white font-medium">12,400+</span> job seekers use CVPilot
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={fadeUpSlow}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full"
      >
        {/* Score */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:border-white/20 hover:bg-white/10 transition-all duration-300">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-medium">
            ATS Match Score
          </p>
          <ScoreRing score={87} />
          <p className="text-white/40 text-xs mt-3">↑ was 54% before CVPilot</p>
        </div>

        {/* Keywords */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:border-white/20 hover:bg-white/10 transition-all duration-300">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-medium">
            Keyword Analysis
          </p>

          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <span
                key={kw.label}
                className={`text-xs px-2.5 py-1 rounded-full font-medium border transition ${
                  kw.found
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-red-500/10 text-red-300 border-red-500/20"
                }`}
              >
                {kw.found ? "✓ " : ""}
                {kw.label}
              </span>
            ))}
          </div>

          <p className="text-white/40 text-xs mt-3">3 missing · 2 matched</p>
        </div>

        {/* Rewrite */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:border-white/20 hover:bg-white/10 transition-all duration-300">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-medium">
            AI Rewrite
          </p>

          <p className="text-white/70 text-xs leading-relaxed italic font-light">
            “Led cross-functional team of 8 engineers, delivering 3 product launches 2 weeks ahead of schedule, reducing time-to-market by 28%.”
          </p>

          <div className="mt-3 flex gap-2">
            <button className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium hover:bg-blue-500 hover:text-white transition">
              Accept
            </button>
            <button className="text-xs border border-white/10 text-white/60 px-3 py-1 rounded-full font-medium hover:border-white/30 transition">
              Edit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}