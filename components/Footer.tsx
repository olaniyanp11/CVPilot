import Link from "next/link";

const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                CVPilot
              </span>
            </div>

            <p className="text-white/60 text-sm font-light leading-relaxed max-w-xs">
              AI-powered resume optimization for serious job seekers. Get more
              interviews, faster.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white text-xs font-semibold uppercase tracking-widest mb-5">
                {category}
              </p>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/60 text-sm hover:text-white transition-colors font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2025 CVPilot. All rights reserved.
          </p>

          <p className="text-white/40 text-xs tracking-wide">
            Built for serious job seekers. 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}