import { Metadata } from "next"
import Link from "next/link"
import { InteractiveHoverButtonBack } from "@/components/ui/interactive-hover-button-back"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SpeedInsight Privacy Policy. Learn how we collect, use, and protect your data when using our website performance testing service. GDPR and CCPA compliant.",
  keywords: ["privacy policy", "data protection", "GDPR", "CCPA", "privacy", "data handling"],
  openGraph: {
    title: "Privacy Policy - SpeedInsight",
    description: "Learn how we collect, use, and protect your data when using SpeedInsight.",
    url: "https://speed-insight.youssef.tn/privacy-policy",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://speed-insight.youssef.tn/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/">
          <InteractiveHoverButtonBack className="mb-8">
            Back to Home
          </InteractiveHoverButtonBack>
        </Link>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            <strong>Last Updated:</strong> October 5, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to SpeedInsight (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
              and being transparent about how we collect, use, and share information. This Privacy Policy 
              explains our practices regarding data we collect through our website performance testing service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
            <p className="text-muted-foreground mb-4">
              When you use SpeedInsight, you provide us with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Website URLs that you submit for performance testing</li>
              <li>No personal information is required to use our service</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              We automatically collect certain information when you visit our website:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address (anonymized)</li>
              <li>Date and time of visit</li>
              <li>Pages viewed and features used</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our website performance testing service</li>
              <li>Process your requests through the Google PageSpeed Insights API</li>
              <li>Improve and optimize our service</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Third-Party Services</h3>
            <p className="text-muted-foreground mb-4">
              We share information with the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Google PageSpeed Insights API:</strong> URLs you submit are sent to Google&apos;s 
                PageSpeed Insights API for analysis. Google&apos;s privacy policy applies to their processing 
                of this data.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Legal Requirements</h3>
            <p className="text-muted-foreground">
              We may disclose your information if required by law or in response to valid requests by 
              public authorities (e.g., court orders, subpoenas).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain collected information for as long as necessary to provide our services and 
              fulfill the purposes outlined in this Privacy Policy. Performance test results may be 
              cached for up to 5 minutes to optimize service performance and reduce API costs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect your 
              information against unauthorized access, alteration, disclosure, or destruction. These 
              measures include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure API key storage and management</li>
              <li>Regular security assessments and updates</li>
              <li>Input validation and sanitization</li>
              <li>Rate limiting to prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Remember your theme preference (dark/light mode)</li>
              <li>Analyze site usage and improve user experience</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings. However, disabling cookies may 
              affect the functionality of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not directed to individuals under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you become aware that a child 
              has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country 
              of residence. These countries may have data protection laws different from your country. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Email:</strong> privacy@speedinsight.com<br />
              <strong>Address:</strong> 123 Performance Lane, Web City, IN 12345, USA
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. GDPR Compliance (EU Users)</h2>
            <p className="text-muted-foreground mb-4">
              If you are located in the European Economic Area (EEA), you have additional rights under 
              the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. California Privacy Rights (CCPA)</h2>
            <p className="text-muted-foreground mb-4">
              If you are a California resident, you have specific rights under the California Consumer 
              Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
