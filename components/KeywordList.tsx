"use client";

export default function KeywordList({
  title,
  items,
  variant = "missing",
}: {
  title: string;
  items: string[];
  variant?: "missing" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((k) => (
            <span
              key={k}
              className={
                variant === "missing"
                  ? "rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700"
                  : "rounded-full border border-black/10 bg-cream-100/40 px-3 py-1 text-xs font-semibold text-ink/80"
              }
            >
              {k}
            </span>
          ))
        ) : (
          <p className="text-sm text-ink/70">None.</p>
        )}
      </div>
    </div>
  );
}

