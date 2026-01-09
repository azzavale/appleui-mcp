export default function TermsOfService() {
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Terms of Service</h1>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">Last updated: January 9, 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-[var(--foreground-muted)]">
                By accessing or using Apple UI MCP (the &quot;Service&quot;) operated by TrueSmartTech OÜ (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Disclaimer of Affiliation</h2>
              <p className="text-[var(--foreground-muted)]">
                <strong>Apple UI MCP is not affiliated with, endorsed by, or sponsored by Apple Inc.</strong> The Service provides design guidance inspired by publicly available design principles. &quot;Apple&quot; and related trademarks are the property of Apple Inc. Any use of Apple-related terminology is solely for descriptive purposes to indicate the style of design guidance provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Description of Service</h2>
              <p className="text-[var(--foreground-muted)]">
                Apple UI MCP is a Model Context Protocol (MCP) server that provides AI-powered design guidance, component generation, and style reference tools. The Service is designed to help developers create user interfaces that follow established design principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Account Registration</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                To use the Service, you must:
              </p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials and API keys</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be at least 18 years old or have parental consent</li>
              </ul>
              <p className="text-[var(--foreground-muted)] mt-4">
                You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Subscription and Payment</h2>
              <h3 className="text-lg font-medium mb-2">Billing</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                The Service is offered on a monthly subscription basis at the price displayed at checkout. Payments are processed securely through Stripe. By subscribing, you authorize us to charge your payment method on a recurring monthly basis.
              </p>

              <h3 className="text-lg font-medium mb-2">Cancellation</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                You may cancel your subscription at any time through your dashboard. Upon cancellation, you will retain access to the Service until the end of your current billing period. No refunds will be provided for partial months.
              </p>

              <h3 className="text-lg font-medium mb-2">Price Changes</h3>
              <p className="text-[var(--foreground-muted)]">
                We reserve the right to modify subscription prices. Any price changes will be communicated in advance and will take effect at the start of your next billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Acceptable Use</h2>
              <p className="text-[var(--foreground-muted)] mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Share, sell, or transfer your API keys to third parties</li>
                <li>Attempt to circumvent any rate limits or usage restrictions</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Use the Service to develop a competing product</li>
                <li>Overload, disable, or impair the Service infrastructure</li>
                <li>Use automated systems to access the Service in a manner that sends more requests than a human could reasonably produce</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                The Service, including its original content, features, and functionality, is owned by TrueSmartTech OÜ and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-[var(--foreground-muted)]">
                Code generated by the Service is provided for your use in your projects. You retain ownership of your projects that incorporate generated code.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-[var(--foreground-muted)] mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRUESMARTTECH OÜ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-[var(--foreground-muted)]">
                Our total liability shall not exceed the amount you paid for the Service in the twelve (12) months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-[var(--foreground-muted)]">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Service Availability</h2>
              <p className="text-[var(--foreground-muted)]">
                We strive to maintain high availability but do not guarantee uninterrupted access to the Service. We may modify, suspend, or discontinue the Service at any time with reasonable notice when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Termination</h2>
              <p className="text-[var(--foreground-muted)]">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
              <p className="text-[var(--foreground-muted)]">
                These Terms shall be governed by and construed in accordance with the laws of Estonia, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of Estonia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">13. Changes to Terms</h2>
              <p className="text-[var(--foreground-muted)]">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">14. Contact Us</h2>
              <p className="text-[var(--foreground-muted)]">
                If you have any questions about these Terms, please contact us:
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
