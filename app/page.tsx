'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to start checkout');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Apple UI MCP"
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg hidden sm:inline">Apple UI MCP</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Pricing</a>
            <a href="#docs" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/dashboard"
              className="hidden sm:inline-flex px-4 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              className="px-4 py-3 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full text-sm font-medium hover:opacity-90 active:opacity-80 transition-opacity"
            >
              Get Started
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 -mr-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
            <div className="px-4 py-4 space-y-1">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
              >
                Pricing
              </a>
              <a
                href="#docs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
              >
                Docs
              </a>
              <a
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] rounded-xl transition-colors"
              >
                Dashboard
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight text-balance">
                Build Apple Style
                <br />
                UI UX Design
                <br />
                <span className="text-[var(--foreground-muted)]">with an MCP</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full font-medium hover:opacity-90 active:opacity-80 transition-all"
                >
                  Start building for €9.99/mo
                </a>
              </div>
            </div>

            {/* Right: Before/After Comparison */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-8 lg:mt-0">
              {/* Without */}
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <span className="px-2 py-1 text-xs sm:text-sm bg-[var(--taupe-200)] dark:bg-[var(--taupe-700)] text-[var(--foreground-muted)] text-center font-medium rounded-full">
                  Without MCP
                </span>
                <div className="rounded-xl overflow-hidden p-1 sm:p-2 flex justify-center items-center">
                  <img
                    src="/Without.png"
                    alt="UI without Apple UI MCP"
                    className="w-full h-auto mx-auto rounded-lg"
                  />
                </div>
              </div>

              {/* With */}
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <span className="px-2 py-1 text-xs sm:text-sm bg-[var(--accent-green)] text-white text-center font-medium rounded-full">
                  With MCP
                </span>
                <div className="rounded-xl overflow-hidden p-1 sm:p-2 flex justify-center items-center">
                  <img
                    src="/With.png"
                    alt="UI with Apple UI MCP"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs sm:text-sm text-[var(--foreground-subtle)] mb-6 sm:mb-8">Works with your favorite AI tools</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">Claude</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">Gemini</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">Codex</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">VS Code</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">Cursor</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-sm sm:text-base font-medium">Windsurf</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Three powerful tools</h2>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-xl mx-auto px-4">
              Everything you need to build beautiful interfaces
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Tool 1 */}
            <div className="p-6 sm:p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Review Design</h3>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)]">
                Analyze your codebase. Get scores, issues, and actionable recommendations.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="p-6 sm:p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Generate Component</h3>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)]">
                Create Apple-styled components for React, SwiftUI, React Native, Tailwind, or CSS. 30+
              </p>
            </div>

            {/* Tool 3 */}
            <div className="p-6 sm:p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Style Guide</h3>
              <p className="text-sm sm:text-base text-[var(--foreground-muted)]">
                Access Guidelines for colors, typography, spacing, animations, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">How it works</h2>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)]">Get started in three simple steps</p>
          </div>
          <div className="space-y-8 sm:space-y-12">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">1</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Configure it</h3>
                <p className="text-sm sm:text-base text-[var(--foreground-muted)]">Add Apple UI MCP to Claude Desktop, Cursor, or any MCP-compatible tool with your API key.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">2</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Ask for components</h3>
                <p className="text-sm sm:text-base text-[var(--foreground-muted)]">Simply ask: "Generate an Apple-style button in React" or "Review my form for HIG compliance."</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0 text-sm sm:text-base">3</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Get production-ready code</h3>
                <p className="text-sm sm:text-base text-[var(--foreground-muted)]">Receive complete code with styles, usage examples, accessibility notes, and design tokens.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--background-secondary)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Simple pricing</h2>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)]">One plan, everything included</p>
          </div>
          <div className="max-w-md mx-auto p-6 sm:p-8 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl font-semibold mb-2">€9.99</div>
              <div className="text-sm sm:text-base text-[var(--foreground-muted)]">per month</div>
            </div>
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                'Review Tool',
                'Generate Tool',
                'Guide Tool',
                '30+ component types',
                'Multiple platform outputs (React, SwiftUI, etc.)'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[var(--accent-green)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 mb-4 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--taupe-500)] text-base"
            />
            {error && (
              <p className="text-center text-sm text-red-500 mb-4">{error}</p>
            )}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full font-medium hover:opacity-90 active:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Get started'}
            </button>
            <p className="text-center text-xs sm:text-sm text-[var(--foreground-subtle)] mt-4">Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Quick setup</h2>
            <p className="text-sm sm:text-base text-[var(--foreground-muted)]">Add this to your MCP client configuration</p>
          </div>
          <div className="bg-[var(--taupe-950)] text-[var(--taupe-100)] rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono">
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
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Apple UI MCP"
              className="w-8 h-8"
            />
            <span className="font-medium">Apple UI MCP</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-[var(--foreground-muted)]">
            <a href="#features" className="py-2 hover:text-[var(--foreground)] transition-colors">Features</a>
            <a href="#pricing" className="py-2 hover:text-[var(--foreground)] transition-colors">Pricing</a>
            <a href="#docs" className="py-2 hover:text-[var(--foreground)] transition-colors">Docs</a>
            <a href="/dashboard" className="py-2 hover:text-[var(--foreground)] transition-colors">Dashboard</a>
          </div>
          <p className="text-xs sm:text-sm text-[var(--foreground-subtle)] text-center">© 2026 TrueSmartTech OÜ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
