const testimonials = [
  {
    stars: 5,
    text: "My score went from 48% to 91% on a Google SWE role. Got an interview invite 3 days later. This tool is the real deal.",
    name: "Tobi K.",
    role: "Software Engineer, Lagos",
    initials: "TK",
    color: "bg-indigo-500",
  },
  {
    stars: 5,
    text: "I had no idea my resume was missing 14 keywords. CVPilot showed me exactly what to add. Hired within 3 weeks.",
    name: "Aisha M.",
    role: "Product Manager, Nairobi",
    initials: "AM",
    color: "bg-emerald-500",
  },
  {
    stars: 5,
    text: "The bullet rewriter alone is worth it. My experience section went from vague to powerful. Completely changed how I present myself.",
    name: "Sam C.",
    role: "Data Analyst, Accra",
    initials: "SC",
    color: "bg-amber-500",
  },
  {
    stars: 5,
    text: "I applied to 40 jobs with no replies. After CVPilot, I got 6 interviews in my first week. Game changer.",
    name: "Fatima D.",
    role: "UX Designer, Cairo",
    initials: "FD",
    color: "bg-cyan-500",
  },
  {
    stars: 5,
    text: "Honestly shocked at how specific the feedback was. It didn't just say 'improve your summary' — it rewrote it for me.",
    name: "Omar B.",
    role: "Marketing Manager, Abuja",
    initials: "OB",
    color: "bg-rose-500",
  },
  {
    stars: 5,
    text: "Went from 0 callbacks to 3 interview offers in 2 weeks. The ATS score feature alone explained everything I was doing wrong.",
    name: "Chidi E.",
    role: "Backend Engineer, London",
    initials: "CE",
    color: "bg-violet-500",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      <div className="max-w-xl mb-16">
        <p className="text-ink-faint text-xs uppercase tracking-widest font-medium mb-4">
          Real results
        </p>
        <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight tracking-tight text-ink mb-4">
          People are landing jobs faster.
        </h2>
        <p className="text-ink-muted text-lg font-light">
          Over 12,000 job seekers have sharpened their resumes and won more callbacks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white border border-ink/8 rounded-2xl p-7 hover:border-ink/20 hover:shadow-sm transition-all duration-200"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} className="text-amber-400 text-sm">★</span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-ink-soft text-sm leading-relaxed font-light italic mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${t.color}`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{t.name}</p>
                <p className="text-xs text-ink-faint">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
