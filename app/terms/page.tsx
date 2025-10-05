import { Metadata } from "next"
import Link from "next/link"
import { InteractiveHoverButtonBack } from "@/components/ui/interactive-hover-button-back"

export const metadata: Metadata = {
  title: "Terms of Service - SpeedInsight",
  description: "Terms of Service for SpeedInsight",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-36 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/">
          <InteractiveHoverButtonBack className="mb-8">
            Back to Home
          </InteractiveHoverButtonBack>
        </Link>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            <strong>Last Updated:</strong> October 5, 2025
            </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using SpeedInsight (the &quot;Service&quot;), you accept and agree to be bound by 
              these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use 
              the Service. We reserve the right to modify these Terms at any time, and your continued 
              use of the Service constitutes acceptance of any modifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              SpeedInsight provides website performance testing and analysis services powered by the 
              Google PageSpeed Insights API. The Service allows users to test website performance, 
              analyze Core Web Vitals, and receive optimization recommendations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 Acceptable Use</h3>
            <p className="text-muted-foreground mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the Service only for lawful purposes</li>
              <li>Provide valid and accessible website URLs for testing</li>
              <li>Not attempt to bypass rate limits or security measures</li>
              <li>Not use the Service to test websites you do not have permission to test</li>
              <li>Not reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Not use the Service in any way that could damage, disable, or impair our servers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Prohibited Activities</h3>
            <p className="text-muted-foreground mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use automated scripts, bots, or scrapers to access the Service</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest personal information from other users</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Our Property</h3>
            <p className="text-muted-foreground mb-4">
              All content, features, and functionality of the Service, including but not limited to 
              text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, 
              and software, are the exclusive property of SpeedInsight or its licensors and are 
              protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 License to Use</h3>
            <p className="text-muted-foreground">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access 
              and use the Service for personal or business purposes in accordance with these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Service Availability and Modifications</h2>
            <h3 className="text-xl font-semibold mb-3">5.1 Availability</h3>
            <p className="text-muted-foreground mb-4">
              We strive to provide reliable and continuous service. However, we do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>The results will be accurate, reliable, or complete</li>
              <li>Any errors or defects will be corrected</li>
              <li>The Service will be available at all times</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Modifications</h3>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
              at any time, with or without notice. We shall not be liable to you or any third party for 
              any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              The Service uses the Google PageSpeed Insights API. Your use of the Service is also 
              subject to Google&apos;s Terms of Service and Privacy Policy. We are not responsible for 
              the availability, accuracy, or functionality of third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Rate Limiting</h2>
            <p className="text-muted-foreground">
              To ensure fair usage and maintain service quality, we implement rate limiting. Excessive 
              use may result in temporary or permanent suspension of access to the Service. We reserve 
              the right to determine what constitutes excessive use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-4">
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. TO THE FULLEST EXTENT 
              PERMITTED BY LAW, SPEEDINSIGHT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING 
              BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
              <li>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
              <li>TITLE</li>
              <li>QUIET ENJOYMENT</li>
              <li>ACCURACY OF DATA</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not warrant that the Service will meet your requirements or that the operation of 
              the Service will be uninterrupted or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SPEEDINSIGHT, 
              ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Loss of or damage to property</li>
              <li>Claims of third parties</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This limitation applies whether such liability arises from negligence, breach of 
              contract, tort, or any other legal theory, even if we have been advised of the 
              possibility of such damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless SpeedInsight and its officers, 
              directors, employees, agents, and licensors from and against any claims, liabilities, 
              damages, losses, and expenses, including reasonable attorneys&apos; fees and costs, arising 
              out of or in any way connected with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Your access to or use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any URLs you submit for testing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law and Jurisdiction</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the 
              United States and the State of California, without regard to its conflict of law 
              provisions. You agree to submit to the personal and exclusive jurisdiction of the 
              courts located in California for the resolution of any disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mb-3">12.1 Informal Resolution</h3>
            <p className="text-muted-foreground mb-4">
              Before filing a formal claim, you agree to contact us and attempt to resolve the 
              dispute informally. We will attempt to resolve the dispute informally by contacting 
              you via email.
            </p>

            <h3 className="text-xl font-semibold mb-3">12.2 Arbitration</h3>
            <p className="text-muted-foreground">
              If we cannot resolve the dispute informally, any dispute arising out of or relating 
              to these Terms or the Service will be resolved through binding arbitration in 
              accordance with the Commercial Arbitration Rules of the American Arbitration 
              Association.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is held to be invalid, illegal, or unenforceable, 
              the validity, legality, and enforceability of the remaining provisions shall not 
              be affected or impaired.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Waiver</h2>
            <p className="text-muted-foreground">
              No waiver of any term of these Terms shall be deemed a further or continuing waiver 
              of such term or any other term, and our failure to assert any right or provision 
              under these Terms shall not constitute a waiver of such right or provision.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Entire Agreement</h2>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy, constitute the entire agreement 
              between you and SpeedInsight regarding the Service and supersede all prior or 
              contemporaneous understandings and agreements, written or oral.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Email:</strong> legal@speedinsight.com<br />
              <strong>Address:</strong> 123 Performance Lane, Web City, IN 12345, USA
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">17. Age Restrictions</h2>
            <p className="text-muted-foreground">
              The Service is not intended for users under the age of 13. By using the Service, 
              you represent and warrant that you are at least 13 years old. If you are between 
              13 and 18 years old, you represent that you have your parent or guardian&apos;s 
              permission to use the Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
