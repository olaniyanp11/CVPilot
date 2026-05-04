"use client";

import { Upload, FileText, Sparkles, Download, ArrowUpRight } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Resume",
    desc: "Drop your PDF or DOCX. We extract and parse your entire resume instantly.",
    meta: "PDF · DOCX",
  },
  {
    num: "02",
    icon: FileText,
    title: "Paste Job Description",
    desc: "Paste the job post or enter a URL. CVPilot reads exactly what the employer wants.",
    meta: "Text · URL",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "AI Analysis",
    desc: "Our engine runs a multi-step analysis: parse, compare, score, suggest. All in seconds.",
    meta: "≈ 8 seconds",
  },
  {
    num: "04",
    icon: Download,
    title: "Accept & Export",
    desc: "Review AI suggestions, accept what you like, and download your optimized resume.",
    meta: "Export PDF",
  },
];

const stats = [
  { val: "87%", label: "Avg score increase" },
  { val: "3×", label: "More interview callbacks" },
  { val: "60s", label: "Time to first analysis" },
  { val: "12k+", label: "Resumes optimized" },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="relative bg-ink py-32 px-6 overflow-hidden"
    >
      {/* Ambient grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
        }}
      />
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.45), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-white/30" />
              <p className="text-white/50 text-[11px] uppercase tracking-[0.25em] font-medium">
                The process
              </p>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl leading-[1.02] tracking-tight text-white">
              From upload
              <br />
              to offer<span className="text-white/30">—</span>
              <span className="italic font-light text-white/70">
                in minutes.
              </span>
            </h2>
          </div>
          <p className="text-white/50 text-base font-light leading-relaxed max-w-sm md:text-right">
            No learning curve. No complex setup. Just upload, analyze, and
            download.
          </p>
        </div>

        {/* Steps rail */}
        <div className="relative">
          {/* Horizontal timeline (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-0 right-0 top-[88px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative bg-ink p-8 transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  {/* Top row: number + node */}
                  <div className="flex items-start justify-between mb-10">
                    <span className="font-display font-extrabold text-5xl text-white/[0.08] leading-none tracking-tight group-hover:text-white/20 transition-colors duration-500">
                      {step.num}
                    </span>
                    <div className="relative">
                      {/* node on the timeline */}
                      <div className="hidden lg:block absolute -top-[34px] left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white/30 ring-4 ring-ink group-hover:bg-white group-hover:ring-white/10 transition-all" />
                      <div className="w-11 h-11 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 group-hover:border-white/30 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-white text-lg mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/45 text-sm font-light leading-relaxed mb-6">
                    {step.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="text-white/40 text-[11px] uppercase tracking-[0.18em] font-medium">
                      {step.meta}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-white/20 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="mt-16 flex flex-col lg:flex-row lg:items-stretch border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm">
          <div className="px-8 py-6 lg:py-0 lg:flex lg:items-center border-b lg:border-b-0 lg:border-r border-white/10 lg:max-w-[260px]">
            <p className="text-white/60 text-sm font-light leading-relaxed">
              <span className="text-white font-medium">Real numbers</span> from
              real candidates using CVPilot today.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 flex-1">
            {stats.map((s, i) => (
              <div
                key={s.val}
                className={`px-6 py-8 text-center md:text-left ${
                  i < stats.length - 1 ? "border-r border-white/10" : ""
                } ${
                  i < 2 ? "border-b md:border-b-0 border-white" : ""
                }`}
              >
                <p className="font-display font-extrabold text-4xl text-white tracking-tight mb-2 tabular-nums">
                  {s.val}
                </p>
                <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.2em]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
