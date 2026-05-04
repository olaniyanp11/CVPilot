"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function CtaBanner() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
        className="relative bg-black rounded-3xl px-10 py-20 text-center overflow-hidden"
      >
        {/* Background decoration */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {/* Floating blobs */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"
          />

          <motion.div
            animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"
          />

          {/* Grid pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="cta-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <motion.p
            variants={item}
            className="text-white/50 text-xs uppercase tracking-widest font-medium mb-5"
          >
            Get started today
          </motion.p>

          <motion.h2
            variants={item}
            className="font-display font-extrabold text-4xl md:text-6xl leading-tight tracking-tight text-white mb-5"
          >
            Ready to land your
            <br />
            next job?
          </motion.h2>

          <motion.p
            variants={item}
            className="text-white/60 text-lg font-light mb-10 max-w-md mx-auto"
          >
            Upload your resume and get your ATS score in 60 seconds — it&apos;s free.
          </motion.p>

          <motion.div variants={item}>
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-8 py-4 rounded-full shadow-xl"
              >
                Optimize my resume for free →
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            variants={item}
            className="text-white/30 text-xs mt-6"
          >
            No sign up required · Instant results
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}