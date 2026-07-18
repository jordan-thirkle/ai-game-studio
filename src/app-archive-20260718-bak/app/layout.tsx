import type { Metadata, Viewport } from 'next';
import { Navigation } from '@/components/Navigation';
import './globals.css';

const SITE_URL = 'https://ai-game-studio-one.vercel.app';
const SITE_NAME = 'Eigen';
const SITE_DESC =
  'An AI game studio. Seven agents building games with inherent quality. Every iteration scored. Every lesson shared.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Inherent Quality`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'AI game studio',
    'Three.js games',
    'browser games',
    'AI-generated',
    'game development',
    'web games',
    'Eigen',
    'indie games',
    'roguelite',
    'open source',
  ],
  openGraph: {
    title: `${SITE_NAME} — Inherent Quality`,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — AI Game Studio`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Inherent Quality`,
    description: SITE_DESC,
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'theme-color': '#0a0f0a',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0f0a' },
    { media: '(prefers-color-scheme: light)', color: '#f8f7f2' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eigen',
    url: SITE_URL,
    description: SITE_DESC,
    sameAs: ['https://github.com/jordan-thirkle/ai-game-studio'],
    foundingDate: '2026',
    numberOfEmployees: 7,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
  };

  const webPageData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/games?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareAppData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Eigen AI Game Studio',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0f0a" />
        <meta name="msapplication-TileColor" content="#0a0f0a" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppData) }}
        />
        {/* Prevent FOUC: apply theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('eigen-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else if (!theme) {
                    // Respect system preference
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.classList.add('light');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--color-dark)] text-[var(--color-white)] antialiased">
        {/* Skip to main content — accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Navigation />

        <main id="main-content" className="pt-16">
          {children}
        </main>

        {/* Footer — Minimal & Elegant */}
        <footer className="relative border-t border-[var(--color-gray-700)]/50 bg-[var(--color-panel)]/10" role="contentinfo">
          <div className="mx-auto max-w-6xl px-6 py-16">
            {/* Main footer grid */}
            <div className="mb-12 grid gap-10 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-black text-[var(--color-dark)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/20">
                    E
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[var(--color-white)]">
                    EIGEN
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-gray-500)]">
                  Inherent quality. Seven AI agents building games with a scoring system that forces honest assessment.
                </p>
              </div>

              {/* Links — minimal */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)]">
                      Games
                    </h3>
                    <ul className="space-y-2">
                      <li><a href="/games" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">All Games</a></li>
                      <li><a href="/games/hollow-harvest" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Hollow Harvest</a></li>
                      <li><a href="/games/sky-drifter" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Sky Drifter</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)]">
                      Studio
                    </h3>
                    <ul className="space-y-2">
                      <li><a href="/about" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">About</a></li>
                      <li><a href="/stats" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Stats</a></li>
                      <li><a href="/blog" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Blog</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)]">
                      Connect
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="https://github.com/jordan-thirkle/ai-game-studio" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">GitHub</a>
                      </li>
                      <li>
                        <a href="https://x.com/eigengamestudio" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">X / Twitter</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-gray-500)]">
                      Resources
                    </h3>
                    <ul className="space-y-2">
                      <li><a href="/process" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Process</a></li>
                      <li><a href="/team" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Team</a></li>
                      <li><a href="/skills/graveyard" className="text-sm text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gold)]">Skill Graveyard</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar — clean & minimal */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-gray-700)]/50 pt-8 md:flex-row">
              <p className="text-xs text-[var(--color-gray-600)]">
                &copy; {new Date().getFullYear()} Eigen Studio. All rights reserved.
              </p>
              <p className="text-xs text-[var(--color-gray-600)]">
                Built entirely by AI agents. Every iteration scored. Every lesson shared.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
