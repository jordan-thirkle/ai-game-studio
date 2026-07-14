import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Game Studio — Building Games with Self-Improving Agents',
  description: 'A portfolio of games built entirely by AI agents. Each iteration is scored, documented, and shared. Watch the journey from prototype to AAA quality.',
  openGraph: {
    title: 'AI Game Studio',
    description: 'Building games with self-improving AI agents',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f0a] text-[#e8e0d0] min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f0a]/80 backdrop-blur-md border-b border-[#2a3a22]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <span className="font-semibold text-lg">AI Game Studio</span>
            </a>
            <div className="flex items-center gap-6 text-sm">
              <a href="/" className="hover:text-[#f0d890] transition-colors">Games</a>
              <a href="/about" className="hover:text-[#f0d890] transition-colors">About</a>
              <a href="https://github.com/jordan-thirkle" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0d890] transition-colors">GitHub</a>
            </div>
          </div>
        </nav>
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
