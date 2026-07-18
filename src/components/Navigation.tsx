'use client';

import { useState, useEffect, useCallback } from 'react';

const navLinks = [
  { href: '/games', label: 'Games' },
  { href: '/about', label: 'About' },
  { href: '/stats', label: 'Stats' },
  { href: '/blog', label: 'Blog' },
];

function ThemeToggle({ className = '' }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('eigen-theme');
    if (stored === 'light') {
      setIsLight(true);
    } else if (!stored) {
      setIsLight(window.matchMedia('(prefers-color-scheme: light)').matches);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
      localStorage.setItem('eigen-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('eigen-theme', 'dark');
    }
  }, [isLight]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-gray-400)] transition-all duration-300 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-white)] ${className}`}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isLight ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isLight ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="/" className="group flex items-center gap-3" aria-label="Eigen — Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-black text-[var(--color-dark)] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[var(--color-accent)]/30 group-hover:scale-105">
              E
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-white)]">
              EIGEN
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 text-sm font-medium text-[var(--color-gray-300)] md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors hover:text-[var(--color-white)] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--color-accent)] after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/jordan-thirkle/ai-game-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[var(--color-white)]"
              aria-label="View source on GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-gray-300)] transition-colors hover:text-[var(--color-white)]"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative h-5 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                    isOpen ? 'top-2 rotate-45' : 'top-0 rotate-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                    isOpen ? 'top-2 -rotate-45' : 'top-4 rotate-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-72 border-l border-[var(--color-gray-700)] bg-[var(--color-panel)] p-8 pt-24 transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-4 py-3 text-lg font-medium text-[var(--color-gray-300)] transition-all hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-white)] ${
                  isOpen ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {link.label}
              </a>
            ))}
            <div className="my-4 h-px bg-[var(--color-gray-700)]" />
            <a
              href="https://github.com/jordan-thirkle/ai-game-studio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-4 py-3 text-lg font-medium text-[var(--color-gray-300)] transition-all hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-white)] ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${navLinks.length * 0.05}s` }}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
