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
            <div className="w-8 h-8 rounded-lg bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] flex items-center justify-center">
              <span className="text-[var(--taupe-50)] dark:text-[var(--taupe-950)] text-sm font-bold">UI</span>
            </div>
            <span className="font-semibold text-lg">Apple UI</span>
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--background-secondary)] border border-[var(--border)] text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
            Available for Claude, Cursor & more
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-balance">
            Build Apple-quality UI
            <br />
            <span className="text-[var(--foreground-muted)]">with AI assistance</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto text-balance">
            Generate Human Interface Guidelines-compliant components for React, SwiftUI, and Tailwind. Seamless MCP integration for your favorite AI tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] rounded-full font-medium hover:opacity-90 transition-all"
            >
              Start building for $7.99/mo
            </a>
            <a
              href="#docs"
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] rounded-full font-medium hover:bg-[var(--taupe-100)] dark:hover:bg-[var(--taupe-800)] transition-all"
            >
              View documentation
            </a>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 px-6 border-y border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-[var(--foreground-subtle)] mb-8">Works with your favorite AI tools</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-2xl font-bold">C</span>
              <span className="font-medium">Claude</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-2xl font-mono font-bold">&gt;_</span>
              <span className="font-medium">Cursor</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <span className="text-2xl font-bold">W</span>
              <span className="font-medium">Windsurf</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--foreground-subtle)]">
              <span className="text-2xl font-bold">Cx</span>
              <span className="font-medium">Codex</span>
              <span className="text-xs bg-[var(--taupe-200)] dark:bg-[var(--taupe-700)] px-2 py-0.5 rounded-full">Soon</span>
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
              Everything you need to build beautiful, HIG-compliant interfaces
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
                Analyze your code for Apple HIG compliance. Get scores, issues, and actionable recommendations.
              </p>
              <code className="text-sm text-[var(--accent-blue)] font-mono">review_design</code>
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
                Create Apple-styled components for React, SwiftUI, React Native, Tailwind, or CSS.
              </p>
              <code className="text-sm text-[var(--accent-blue)] font-mono">generate_component</code>
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
                Access Human Interface Guidelines for colors, typography, spacing, animations, and more.
              </p>
              <code className="text-sm text-[var(--accent-blue)] font-mono">get_style_guide</code>
            </div>
          </div>
        </div>
      </section>

      {/* Components Section */}
      <section id="components" className="py-24 px-6 bg-[var(--background-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">30+ component types</h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
              From buttons to complex layouts, all following Apple design principles
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'button', 'card', 'modal', 'navigation-bar', 'tab-bar', 'sidebar', 'list',
              'form-input', 'toggle', 'slider', 'alert', 'sheet', 'menu', 'toolbar',
              'search-bar', 'segmented-control', 'stepper', 'picker', 'avatar', 'badge',
              'tooltip', 'checkbox', 'radio-group', 'textarea', 'progress-ring',
              'skeleton', 'toast', 'accordion', 'divider', 'breadcrumb'
            ].map((component) => (
              <span
                key={component}
                className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-full text-sm font-medium text-[var(--foreground-muted)]"
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">How it works</h2>
            <p className="text-[var(--foreground-muted)]">Get started in three simple steps</p>
          </div>
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] text-[var(--taupe-50)] dark:text-[var(--taupe-950)] flex items-center justify-center font-semibold flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Configure your IDE</h3>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple pricing</h2>
            <p className="text-[var(--foreground-muted)]">One plan, everything included</p>
          </div>
          <div className="max-w-md mx-auto p-8 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
            <div className="text-center mb-8">
              <div className="text-5xl font-semibold mb-2">$7.99</div>
              <div className="text-[var(--foreground-muted)]">per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                'All 3 MCP tools',
                '30+ component types',
                '5 platform outputs (React, SwiftUI, etc.)',
                'Unlimited requests',
                'Design token access',
                'Priority support'
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
            <p className="text-center text-sm text-[var(--foreground-subtle)] mt-4">Cancel anytime. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
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
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#" className="px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--taupe-100)] dark:hover:bg-[var(--taupe-800)] transition-colors">
              Claude Desktop guide
            </a>
            <a href="#" className="px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--taupe-100)] dark:hover:bg-[var(--taupe-800)] transition-colors">
              Cursor guide
            </a>
            <a href="#" className="px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full text-sm font-medium hover:bg-[var(--taupe-100)] dark:hover:bg-[var(--taupe-800)] transition-colors">
              API reference
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--taupe-950)] dark:bg-[var(--taupe-100)] flex items-center justify-center">
              <span className="text-[var(--taupe-50)] dark:text-[var(--taupe-950)] text-xs font-bold">UI</span>
            </div>
            <span className="font-medium">Apple UI MCP</span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--foreground-muted)]">
            <a href="#features" className="hover:text-[var(--foreground)]">Features</a>
            <a href="#pricing" className="hover:text-[var(--foreground)]">Pricing</a>
            <a href="#docs" className="hover:text-[var(--foreground)]">Docs</a>
          </div>
          <p className="text-sm text-[var(--foreground-subtle)]">2024 Apple UI MCP</p>
        </div>
      </footer>
    </div>
  );
}
