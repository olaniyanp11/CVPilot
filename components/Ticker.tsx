const items = [
  "✦ ATS Optimized",
  "✦ AI-Powered Rewrites",
  "✦ Keyword Gap Analysis",
  "✦ Real-Time Match Score",
  "✦ 3× More Interviews",
  "✦ Section Weakness Scan",
  "✦ One-Click PDF Export",
  "✦ Version History",
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <div className="mt-[72px] bg-ink overflow-hidden py-3 border-b border-white/5">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-white/50 text-xs font-body tracking-widest uppercase px-8 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
