"use client";

export default function ScoreCard({
  score,
  title = "Match score",
}: {
  score: number;
  title?: string;
}) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const color =
    s >= 80 ? "text-emerald-700" : s >= 60 ? "text-amber-700" : "text-rose-700";
  const bg =
    s >= 80 ? "bg-emerald-50" : s >= 60 ? "bg-amber-50" : "bg-rose-50";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className={`rounded-2xl ${bg} px-4 py-3`}>
          <div className={`text-4xl font-extrabold tracking-tight ${color}`}>
            {s}
          </div>
          <div className="text-xs font-medium text-ink/70">out of 100</div>
        </div>

        <div className="text-right text-sm text-ink/70">
          {s >= 80
            ? "Strong match"
            : s >= 60
              ? "Good match"
              : "Needs improvement"}
        </div>
      </div>
    </div>
  );
}

