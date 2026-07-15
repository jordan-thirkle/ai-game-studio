import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Games',
  description:
    'Browse all games built by self-improving AI agents. Each scored across 10 categories and iterated toward AAA quality.',
  openGraph: {
    title: 'All Games | AI Game Studio',
    description:
      'Browse all games built by self-improving AI agents. Each scored across 10 categories.',
    images: [{ url: '/api/og?title=All+Games', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Games | AI Game Studio',
    description: 'Browse all games built by self-improving AI agents.',
  },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
