const companies = [
  { name: "Google", logo: "https://cdn.simpleicons.org/google" },
  { name: "Meta", logo: "https://cdn.simpleicons.org/meta" },
  { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe" },
  { name: "Figma", logo: "https://cdn.simpleicons.org/figma" },
  { name: "Shopify", logo: "https://cdn.simpleicons.org/shopify" },
  { name: "Airbnb", logo: "https://cdn.simpleicons.org/airbnb" },
  { name: "Netflix", logo: "https://cdn.simpleicons.org/netflix" },
  { name: "Notion", logo: "https://cdn.simpleicons.org/notion" },
];

export default function LogoBar() {
  const loop = [...companies, ...companies]; // duplicate for seamless scroll

  return (
    <section className="py-12 border-y border-white/10 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-8">
          CVPilot users have landed roles at
        </p>

        {/* MARQUEE WRAPPER */}
        <div className="relative">
          {/* fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10" />

          {/* scrolling track */}
          <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
            {loop.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap opacity-60 hover:opacity-100 transition"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <span className="font-semibold text-white/40 tracking-tight">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
