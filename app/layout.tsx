import type { Metadata } from 'next';
import './globals.css';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
