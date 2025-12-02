import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | The Fiscal Wire",
  description: "Terms of Service for The Fiscal Wire - Please read these terms carefully before using our website.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using The Fiscal Wire (&quot;the Website&quot;), you accept and agree to be bound by
                these Terms of Service. If you do not agree to these terms, please do not use our Website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground">
                The Fiscal Wire provides financial news, market data, analysis, and related content for
                informational purposes only. Our services include articles, market updates, newsletters,
                and other digital content related to finance and investing.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. Not Financial Advice</h2>
              <p className="text-muted-foreground">
                <strong>Important:</strong> The content on The Fiscal Wire is for informational and educational
                purposes only and should not be construed as financial, investment, tax, or legal advice.
                We are not licensed financial advisors or registered investment advisors.
              </p>
              <p className="text-muted-foreground">
                You should always conduct your own research and consult with qualified professionals before
                making any financial decisions. Past performance is not indicative of future results.
                Investing involves risk, including the potential loss of principal.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. User Accounts</h2>
              <p className="text-muted-foreground">
                If you create an account on our Website, you are responsible for maintaining the security
                of your account and password. You agree to accept responsibility for all activities that
                occur under your account.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You must not share your account credentials with others</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on The Fiscal Wire, including text, graphics, logos, images, and software,
                is the property of The Fiscal Wire or its content suppliers and is protected by copyright
                and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, create derivative works of, publicly display,
                or exploit any of our content without prior written permission.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. User Conduct</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the Website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the Website</li>
                <li>Interfere with or disrupt the Website or servers</li>
                <li>Use any automated means to access the Website without permission</li>
                <li>Transmit any viruses, malware, or other harmful code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post false, misleading, or defamatory content</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our Website may contain links to third-party websites or services. We are not responsible
                for the content, privacy policies, or practices of any third-party sites. You acknowledge
                and agree that we shall not be liable for any damage or loss caused by your use of any
                third-party content or services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE WEBSITE AND ALL CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
                OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED,
                ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              <p className="text-muted-foreground">
                WE MAKE NO WARRANTIES REGARDING THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT,
                INCLUDING MARKET DATA, PRICES, OR FINANCIAL INFORMATION.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE FISCAL WIRE SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS,
                LOST DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE WEBSITE OR ANY
                CONTENT THEREIN.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless The Fiscal Wire and its officers, directors,
                employees, and agents from any claims, damages, losses, or expenses arising from your
                use of the Website or violation of these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">11. Modifications to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be
                effective immediately upon posting to the Website. Your continued use of the Website
                after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">13. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: contact@thefiscalwire.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
