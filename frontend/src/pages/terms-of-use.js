import Layout from '../components/Layout';
import Link from 'next/link';

export default function TermsOfUse() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using the PawFresh website, you agree to be bound by these Terms of Use and all applicable laws and regulations.",
        "If you do not agree with any part of these terms, you must not use our website or services.",
        "We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms."
      ]
    },
    {
      title: "Account Registration",
      content: [
        "You must provide accurate, current, and complete information during the registration process and keep your account information up to date.",
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account and make purchases.",
        "We reserve the right to suspend or terminate your account if we suspect unauthorized or fraudulent activity."
      ]
    },
    {
      title: "Products & Orders",
      content: [
        "All product descriptions, images, and pricing are provided as accurately as possible but may contain errors. We reserve the right to correct any errors and update information without prior notice.",
        "Prices are subject to change without notice. All prices are displayed in the applicable local currency and include or exclude taxes as indicated.",
        "We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraud.",
        "Order confirmation does not guarantee acceptance. We may cancel orders after confirmation if stock is unavailable or other issues arise."
      ]
    },
    {
      title: "Shipping & Delivery",
      content: [
        "Delivery times are estimates and are not guaranteed. We are not liable for delays caused by shipping carriers, weather, or other circumstances beyond our control.",
        "Risk of loss and title for items pass to you upon delivery to the shipping carrier.",
        "You are responsible for providing accurate shipping information. We are not responsible for orders delivered to incorrect addresses provided by the customer."
      ]
    },
    {
      title: "Returns & Refunds",
      content: [
        "Unopened products may be returned within 30 days of delivery for a full refund, minus any shipping costs.",
        "Opened or partially consumed products may be eligible for a refund or exchange at our discretion if there is a quality concern.",
        "Refunds will be processed to the original payment method within 5-10 business days after we receive the returned product.",
        "Custom or personalized orders are non-refundable unless defective or damaged upon arrival."
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on this website, including text, graphics, logos, images, and software, is the property of PawFresh and is protected by copyright and trademark laws.",
        "You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.",
        "The PawFresh name, logo, and all related trademarks are the exclusive property of PawFresh Pet Nutrition."
      ]
    },
    {
      title: "Prohibited Conduct",
      content: [
        "You may not use our website for any unlawful purpose or in a way that could damage, disable, or impair the site.",
        "Automated data collection (scraping, crawling, or harvesting) without our prior written consent is strictly prohibited.",
        "You may not attempt to gain unauthorized access to any part of the website, other accounts, or computer systems.",
        "Posting false reviews, misleading information, or engaging in any form of harassment is not permitted."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "PawFresh is not liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.",
        "Our total liability for any claim arising from these terms or your use of the service shall not exceed the amount you paid for the specific product giving rise to the claim.",
        "We do not guarantee that our website will be uninterrupted, error-free, or free of viruses or other harmful components."
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which PawFresh operates.",
        "Any disputes arising from these terms shall be resolved through binding arbitration, unless otherwise required by applicable law.",
        "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect."
      ]
    }
  ];

  return (
    <Layout>
      {/* Page Hero */}
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tight">Terms of <span className="text-green-600">Use</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our website and services.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section, index) => (
            <div key={section.title} className="group">
              <div className="flex items-start gap-6">
                <span className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center font-black text-lg">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">{section.title}</h2>
                  <ul className="space-y-4">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                        <span className="text-green-500 mt-1.5 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < sections.length - 1 && (
                <div className="mt-12 border-b border-gray-100" />
              )}
            </div>
          ))}

          {/* Contact Section */}
          <div className="bg-gray-50 p-12 rounded-[2rem] border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Have Questions About These Terms?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions about these Terms of Use, please contact our support team. We&apos;re happy to help clarify anything.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-900/20">
              Contact Us
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
