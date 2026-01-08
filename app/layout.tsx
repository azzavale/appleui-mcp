import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
  ],
};

export const metadata: Metadata = {
  title: 'Apple UI MCP - Build Apple-Quality UI with AI',
  description: 'Generate Apple Human Interface Guidelines-compliant UI components for React, SwiftUI, Tailwind, and CSS. Powered by MCP for Claude, Cursor, and Codex.',
  keywords: ['Apple', 'UI', 'UX', 'HIG', 'Human Interface Guidelines', 'MCP', 'Claude', 'Cursor', 'React', 'SwiftUI', 'Tailwind'],
  authors: [{ name: 'Apple UI MCP' }],
  openGraph: {
    title: 'Apple UI MCP - Build Apple-Quality UI with AI',
    description: 'Generate Apple HIG-compliant UI components with AI assistance.',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Apple UI MCP',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] safe-area-inset">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
