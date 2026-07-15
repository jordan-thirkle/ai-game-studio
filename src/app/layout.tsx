import type { Metadata } from 'next';
import { StatusBanner } from '@/components/StatusBanner';
import './globals.css';

const SITE_URL = 'https://ai-game-studio.vercel.app';
const SITE_NAME = 'AI Game Studio';
const SITE_DESC =
  'A portfolio of games built entirely by AI agents. Each iteration is scored, documented, and shared. Watch the journey from prototype to AAA quality through self-improving systems.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Building Games with Self-Improving Agents`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
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
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0f0a" />
        <meta name="msapplication-TileColor" content="#0a0f0a" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#0a0f0a] text-[#e8e0d0] min-h-screen">
        <StatusBanner />
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f0a]/80 backdrop-blur-md border-b border-[#2a3a22]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <span className="font-semibold text-lg">AI Game Studio</span>
            </a>
            <div className="flex items-center gap-6 text-sm">
              <a href="/games" className="hover:text-[#f0d890] transition-colors">
                Games
              </a>
              <a href="/blog" className="hover:text-[#f0d890] transition-colors">
                Blog
              </a>
              <a href="/docs/score-methodology" className="hover:text-[#f0d890] transition-colors">
                Scoring
              </a>
              <a href="/skills/graveyard" className="hover:text-[#f0d890] transition-colors">
                Graveyard
              </a>
              <a href="/ledgers" className="hover:text-[#f0d890] transition-colors">
                Ledgers
              </a>
              <a href="/about" className="hover:text-[#f0d890] transition-colors">
                About
              </a>
              <a
                href="https://github.com/jordan-thirkle"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f0d890] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
