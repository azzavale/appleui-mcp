export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Privacy Policy</h1>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">Last updated: January 9, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                TrueSmartTech OÜ (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates Apple UI MCP (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="text-[var(--foreground-muted)]">
                <strong>Disclaimer:</strong> Apple UI MCP is not affiliated with, endorsed by, or sponsored by Apple Inc. Any references to Apple design guidelines are for educational and compatibility purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                When you subscribe to our Service, we collect:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2 mb-4">
                <li>Email address</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Account credentials</li>
              </ul>

              <h3 className="text-lg font-medium mb-2">Usage Data</h3>
              <p className="text-[var(--foreground-muted)]">
                We automatically collect certain information when you use the Service, including:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li>API usage logs (requests made, timestamps)</li>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-[var(--foreground-muted)] mb-4">We use the collected information to:</p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li>Provide, operate, and maintain the Service</li>
                <li>Process your subscription and payments</li>
                <li>Send you important updates about the Service</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and analyze usage patterns to improve the Service</li>
                <li>Prevent fraudulent activity and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li><strong>Payment processors:</strong> Stripe processes payments on our behalf</li>
                <li><strong>Service providers:</strong> Third parties that help us operate the Service (hosting, analytics)</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-[var(--foreground-muted)]">
                We implement appropriate technical and organizational measures to protect your personal information. API keys are stored using SHA-256 hashing. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-[var(--foreground-muted)]">
                We retain your personal information for as long as your account is active or as needed to provide the Service. Usage logs are retained for up to 90 days. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-[var(--foreground-muted)] mt-4">
                To exercise these rights, contact us at info@truesmarttech.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. International Data Transfers</h2>
              <p className="text-[var(--foreground-muted)]">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-[var(--foreground-muted)]">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-[var(--foreground-muted)]">
                If you have any questions about this Privacy Policy, please contact us:
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
