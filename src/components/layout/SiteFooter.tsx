import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-32" role="contentinfo">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-eigen-green)] flex items-center justify-center font-bold text-[var(--color-forest-950)] text-sm" aria-hidden="true">
                E
              </div>
              <span className="font-semibold text-lg text-[var(--color-eigen-cream)]">Eigen Studio</span>
            </div>
            <p className="text-sm text-[var(--color-eigen-muted)] leading-relaxed">
              AI-native game development studio. Build. Score. Learn. Ship. Repeat.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold text-[var(--color-eigen-cream)] mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="list-none p-0 m-0 space-y-2">
              <li><Link href="/games" className="text-sm text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline">Games</Link></li>
              <li><Link href="/stats" className="text-sm text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline">Stats</Link></li>
              <li><Link href="/about" className="text-sm text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline">About</Link></li>
              <li><Link href="/contact" className="text-sm text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline">Contact</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-eigen-cream)] mb-4 uppercase tracking-wider">Status</h3>
            <p className="text-sm text-[var(--color-eigen-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-eigen-bright)] inline-block" aria-hidden="true" />
              All systems operational
            </p>
            <p className="text-xs text-[var(--color-eigen-muted)] mt-4 font-mono opacity-60">
              &copy; {new Date().getFullYear()} Eigen Studio
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
