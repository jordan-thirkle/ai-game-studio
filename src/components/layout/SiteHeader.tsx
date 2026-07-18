"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/stats", label: "Stats" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-forest-950)]/90 backdrop-blur-xl border-b border-[var(--color-border)]"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3 text-[var(--color-eigen-cream)] no-underline" aria-label="Eigen Studio home">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-eigen-green)] flex items-center justify-center font-bold text-[var(--color-forest-950)] text-sm">
            E
          </div>
          <span className="font-semibold text-lg tracking-tight">Eigen Studio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-xs font-mono text-[var(--color-eigen-bright)] flex items-center gap-1.5" aria-label="System status: online">
            <span className="w-2 h-2 rounded-full bg-[var(--color-eigen-bright)] inline-block" aria-hidden="true" />
            SYSTEM ONLINE
          </span>
        </nav>

        <button
          className="md:hidden p-2 text-[var(--color-eigen-cream)] bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-[var(--color-forest-950)]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <button
            className="absolute top-5 right-5 p-2 text-[var(--color-eigen-cream)] bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-2xl font-semibold text-[var(--color-eigen-cream)] hover:text-[var(--color-eigen-gold)] transition-colors no-underline py-3"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
