'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Apple UI MCP"
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">Apple UI MCP</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Features</a>
            <a href="#components" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Components</a>
            <a href="#pricing" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Pricing</a>
            <a href="#docs" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Docs</a>
          </div>
          <a
            href="#pricing"
            className="px-4 py-2 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-6xl md:text-6xl font-semibold mb-6 tracking-tight text-balance">
                Build Apple Style
                <br />
                UI UX Design
                <br />
                <span className="text-[var(--foreground-muted)]">with an MCP</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full font-medium hover:opacity-90 transition-all"
                >
                  Start building for $19.99/mo
                </a>
              </div>
            </div>

            {/* Right: Before/After Comparison */}
            <div className="grid grid-cols-2 gap-2">
              {/* Without */}
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <span className="px-2 py-0.5 w-[120px] bg-[var(--taupe-200)] dark:bg-[var(--taupe-700)] text-[var(--foreground-muted)] text-s text-center font-medium rounded-full">
                  Without MCP
                </span>
                <div className="rounded-xl overflow-hidden p-2 flex justify-center items-center">
                  <img
                    src="/Without.png"
                    alt="UI without Apple UI MCP"
                    className="w-full h-auto mx-auto"
                  />
                </div>
              </div>

              {/* With */}
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <span className="px-2 py-0.5 w-[120px] bg-[var(--accent-green)] text-white text-s text-center font-medium rounded-full">
                  With MCP
                </span>
                <div className="rounded-xl overflow-hidden p-2 flex justify-center items-center">
                  <img
                    src="/With.png"
                    alt="UI with Apple UI MCP"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-[var(--foreground-subtle)] mb-8">Works with your favorite AI tools</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">Claude</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">Gemini</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">Codex</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">VS Code</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">Cursor</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="font-medium">Windsurf</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Three powerful tools</h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              Everything you need to build beautiful interfaces
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tool 1 */}
            <div className="p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Review Design</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Analyze your codebase. Get scores, issues, and actionable recommendations.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Component</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Create Apple-styled components for React, SwiftUI, React Native, Tailwind, or CSS. 30+
              </p>
            </div>

            {/* Tool 3 */}
            <div className="p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Style Guide</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Access Guidelines for colors, typography, spacing, animations, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">How it works</h2>
            <p className="text-[var(--foreground-muted)]">Get started in three simple steps</p>
          </div>
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Configure it</h3>
                <p className="text-[var(--foreground-muted)]">Add Apple UI MCP to Claude Desktop, Cursor, or any MCP-compatible tool with your API key.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ask for components</h3>
                <p className="text-[var(--foreground-muted)]">Simply ask: "Generate an Apple-style button in React" or "Review my form for HIG compliance."</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get production-ready code</h3>
                <p className="text-[var(--foreground-muted)]">Receive complete code with styles, usage examples, accessibility notes, and design tokens.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-[var(--background-secondary)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple pricing</h2>
            <p className="text-[var(--foreground-muted)]">One plan, everything included</p>
          </div>
          <div className="max-w-md mx-auto p-8 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
            <div className="text-center mb-8">
              <div className="text-5xl font-semibold mb-2">$19.99</div>
              <div className="text-[var(--foreground-muted)]">per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'Review Tool',
                'Generate Tool',
                'Guide Tool',
                '30+ component types',
                'Multiple platform outputs (React, SwiftUI, etc.)'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.location.href = '/api/checkout?email=' + email}
              className="w-full py-4 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full font-medium hover:opacity-90 transition-all"
            >
              Get started
            </button>
            <p className="text-center text-sm text-[var(--foreground-subtle)] mt-4">Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Quick setup</h2>
            <p className="text-[var(--foreground-muted)]">Add this to your MCP client configuration</p>
          </div>
          <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-2xl p-6 overflow-x-auto">
            <pre className="text-sm font-mono">
{`{
  "mcpServers": {
    "appleui": {
      "url": "https://appleui-mcp.vercel.app/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img  
              src="/logo.png"
              alt="Apple UI MCP"
              className="w-8 h-8"
            />
            <span className="font-medium">Apple UI MCP</span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--foreground-muted)]">
            <a href="#features" className="hover:text-[var(--foreground)]">Features</a>
            <a href="#pricing" className="hover:text-[var(--foreground)]">Pricing</a>
            <a href="#docs" className="hover:text-[var(--foreground)]">Docs</a>
          </div>
          <p className="text-sm text-[var(--foreground-subtle)]">© 2026 TrueSmartTech OÜ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
