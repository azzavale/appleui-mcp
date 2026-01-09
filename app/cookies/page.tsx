export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Apple UI MCP" className="w-8 h-8" />
            <span className="font-semibold text-lg hidden sm:inline">Apple UI MCP</span>
          </a>
          <a
            href="/"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Back to Home
          </a>
        </nav>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Cookie Policy</h1>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">Last updated: January 9, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-[var(--foreground-muted)]">
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. This Cookie Policy explains how TrueSmartTech OÜ (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) uses cookies and similar technologies on Apple UI MCP (the &quot;Service&quot;).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                We use cookies for the following purposes:
              </p>

              <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                These cookies are necessary for the Service to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2 mb-4">
                <li>Authentication and session management</li>
                <li>Security features</li>
                <li>Remembering your preferences</li>
              </ul>

              <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                These cookies help us understand how visitors interact with the Service by collecting and reporting information anonymously. This helps us improve our Service.
              </p>

              <h3 className="text-lg font-medium mb-2">Functional Cookies</h3>
              <p className="text-[var(--foreground-muted)]">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-[var(--background-secondary)]">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Cookie Name</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3 rounded-tr-lg">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <td className="px-4 py-3 font-medium">session_id</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Maintains your login session</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Session</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Essential</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">auth_token</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Authentication verification</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">30 days</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Essential</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">theme</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Stores your theme preference</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">1 year</td>
                      <td className="px-4 py-3 text-[var(--foreground-muted)]">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                We use services from third parties that may set their own cookies:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li><strong>Stripe:</strong> For secure payment processing. <a href="https://stripe.com/privacy" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></li>
                <li><strong>Vercel:</strong> For hosting and analytics. <a href="https://vercel.com/legal/privacy-policy" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Managing Cookies</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                You can control and manage cookies in several ways:
              </p>

              <h3 className="text-lg font-medium mb-2">Browser Settings</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Most browsers allow you to refuse or accept cookies through their settings. Here are links to cookie management instructions for common browsers:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2 mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-[var(--accent-blue)] hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>

              <p className="text-[var(--foreground-muted)]">
                Please note that disabling essential cookies may affect the functionality of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Do Not Track</h2>
              <p className="text-[var(--foreground-muted)]">
                Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you do not want to be tracked. Our Service currently does not respond to Do Not Track signals, but you can manage cookies through your browser settings as described above.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Changes to This Policy</h2>
              <p className="text-[var(--foreground-muted)]">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-[var(--foreground-muted)]">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-4 bg-[var(--background-secondary)] rounded-xl">
                <p className="font-medium">TrueSmartTech OÜ</p>
                <p className="text-[var(--foreground-muted)]">Email: info@truesmarttech.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-[var(--foreground-subtle)]">
            © 2026 TrueSmartTech OÜ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
