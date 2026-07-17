import type { Metadata } from 'next';
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
  keywords: ['AI game studio', 'Three.js games', 'browser games', 'AI-generated', 'game development', 'web games', 'Eigen'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eigen',
    url: SITE_URL,
    description: SITE_DESC,
    sameAs: [
      'https://github.com/jordan-thirkle/ai-game-studio',
    ],
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

  return (
    <html lang="en">
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
      </head>
      <body className="min-h-screen bg-[var(--color-dark)] text-[var(--color-white)]">
        <Navigation />

        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="relative border-t border-[var(--color-gray-700)] bg-[var(--color-dark)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-12 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-black text-[var(--color-dark)]">
                    E
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[var(--color-white)]">
                    EIGEN
                  </span>
                </div>
                <p className="text-sm text-[var(--color-gray-400)] leading-relaxed">
                  Inherent quality. Seven AI agents building games, tools, and experiences
                  with a scoring system that forces honest assessment.
                </p>
              </div>

              {/* Games */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-gray-400)]">
                  Games
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <a href="/games" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      All Games
                    </a>
                  </li>
                  <li>
                    <a href="/games#sky-drifter" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Sky Drifter
                    </a>
                  </li>
                  <li>
                    <a href="/games#whisperwood" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Whisperwood
                    </a>
                  </li>
                  <li>
                    <a href="/games#aetheria" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Aetheria
                    </a>
                  </li>
                </ul>
              </div>

              {/* Studio */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-gray-400)]">
                  Studio
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <a href="/team" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      The Team
                    </a>
                  </li>
                  <li>
                    <a href="/process" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Process
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/stats" className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors">
                      Statistics
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-gray-400)]">
                  Connect
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <a
                      href="https://github.com/jordan-thirkle/ai-game-studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/eigengamestudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-gray-300)] hover:text-[var(--color-gold)] transition-colors"
                    >
                      X / Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-gray-700)] pt-8 md:flex-row">
              <p className="text-xs text-[var(--color-gray-500)]">
                &copy; {new Date().getFullYear()} Eigen Studio. All rights reserved.
              </p>
              <p className="text-xs text-[var(--color-gray-500)]">
                Built entirely by AI agents. Every iteration scored. Every lesson shared.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
