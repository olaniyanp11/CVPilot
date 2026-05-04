"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream-100/90 backdrop-blur-xl border-b border-ink/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 rounded-full bg-pilot-blue inline-block animate-pulse" />
          <span className="font-display font-bold text-xl tracking-tight text-ink-muted">
            CVPilot
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/upload"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Upload
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium bg-ink text-white px-5 py-2.5 rounded-full hover:bg-pilot-blue transition-colors duration-200"
          >
            Start free →
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-ink-muted"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-ink/5 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base text-ink-muted"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/upload"
            className="w-full text-center text-sm font-medium bg-black text-white px-5 py-3 rounded-full mt-2"
          >
            Start free →
          </Link>
        </div>
      )}
    </header>
  );
}
