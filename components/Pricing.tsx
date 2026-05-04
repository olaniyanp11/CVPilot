"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import clsx from "clsx";

const plans = [
  {
    badge: "Free",
    name: "Starter",
    price: "$0",
    period: "Forever free",
    features: [
      "3 resume analyses / month",
      "ATS match score",
      "Keyword gap report",
      "Basic suggestions",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    badge: "Most popular",
    name: "Pro",
    price: "$12",
    period: "per month",
    features: [
      "Unlimited analyses",
      "Full AI bullet rewriter",
      "Section-by-section feedback",
      "PDF export",
      "Version history",
      "Priority support",
    ],
    cta: "Start Pro trial",
    featured: true,
  },
  {
    badge: "Teams",
    name: "Business",
    price: "$49",
    period: "per month, up to 10 users",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Bulk resume processing",
      "API access",
      "Custom branding",
    ],
    cta: "Contact sales",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 bg-cream-200/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-ink-faint text-xs uppercase tracking-widest font-medium mb-4">
            Simple pricing
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight tracking-tight text-ink">
            Start free. Upgrade when ready.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                "rounded-2xl p-7 flex flex-col",
                plan.featured
                  ? "bg-ink text-white shadow-2xl shadow-ink/20 md:-mt-4 md:mb-4"
                  : "bg-white border border-ink/8"
              )}
            >
              {/* Badge */}
              <span
                className={clsx(
                  "text-xs font-semibold px-3 py-1 rounded-full self-start mb-5 uppercase tracking-wider",
                  plan.featured
                    ? "bg-white/10 text-white/70"
                    : "bg-pilot-blue-light text-pilot-blue"
                )}
              >
                {plan.badge}
              </span>

              {/* Name */}
              <h3
                className={clsx(
                  "font-display font-bold text-xl mb-1",
                  plan.featured ? "text-white" : "text-ink"
                )}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className={clsx(
                    "font-display font-extrabold text-4xl tracking-tight",
                    plan.featured ? "text-white" : "text-ink"
                  )}
                >
                  {plan.price}
                </span>
              </div>
              <p
                className={clsx(
                  "text-xs mb-7",
                  plan.featured ? "text-white/40" : "text-ink-faint"
                )}
              >
                {plan.period}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className={clsx(
                        "mt-0.5 flex-shrink-0",
                        plan.featured ? "text-emerald-400" : "text-success"
                      )}
                    />
                    <span
                      className={clsx(
                        "text-sm",
                        plan.featured ? "text-white/70" : "text-ink-muted"
                      )}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#"
                className={clsx(
                  "w-full text-center py-3 rounded-full text-sm font-medium transition-colors duration-200",
                  plan.featured
                    ? "bg-pilot-blue text-white hover:bg-pilot-blue-dark"
                    : "border border-ink/15 text-ink hover:border-ink/40 hover:bg-cream-100"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-ink-faint text-xs mt-8">
          No credit card required to start. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
