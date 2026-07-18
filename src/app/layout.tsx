import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Eigen Studio — AI-Native Game Development",
    template: "%s | Eigen Studio",
  },
  description:
    "We build worlds that learn. AI-native game development studio using iterative scoring and agent-driven workflows.",
  keywords: [
    "game development",
    "AI",
    "three.js",
    "interactive",
    "iterative design",
  ],
  openGraph: {
    title: "Eigen Studio — AI-Native Game Development",
    description:
      "We build worlds that learn. AI-native game development studio.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eigen Studio — AI-Native Game Development",
    description:
      "We build worlds that learn. AI-native game development studio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="visually-hidden focus:not-sically-hidden focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--color-eigen-gold)] focus:text-[var(--color-forest-950)] focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
