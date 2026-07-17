import type { Metadata } from 'next';
import { StatusBanner } from '@/components/StatusBanner';
import './globals.css';

const SITE_URL = 'https://ai-game-studio-one.vercel.app';
const SITE_NAME = 'Eigen';
const SITE_DESC =
  'An AI software studio. Seven agents building games, tools, and experiences with inherent quality. Every iteration scored. Every lesson shared.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Inherent Quality`,
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
    'theme-color': '#0A0A0F',
  },
};

const navLinks = [
  { href: '/games', label: 'Games' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/team', label: 'Team' },
  { href: '/process', label: 'Process' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs/score-methodology', label: 'Scoring' },
  { href: '/about', label: 'About' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="msapplication-TileColor" content="#0A0A0F" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#0A0A0F] text-white">
        <StatusBanner />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-[#0A0A0F]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-sm font-bold text-white">
                E
              </div>
              <span className="text-lg font-semibold text-white">Eigen</span>
            </a>

            {/* Nav Links */}
            <div className="hidden items-center gap-6 text-sm text-gray-400 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/jordan-thirkle/ai-game-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        <main className="pt-20">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-800 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-xs font-bold text-white">
                E
              </div>
              <span className="text-sm font-medium text-white">Eigen</span>
              <span className="text-sm text-gray-500">Inherent quality.</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/team" className="hover:text-white">Team</a>
              <a href="/blog" className="hover:text-white">Blog</a>
              <a href="https://github.com/jordan-thirkle/ai-game-studio" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
