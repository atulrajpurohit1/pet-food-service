import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfUse() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using the Agoura Feed website, you agree to be bound by these Terms of Use and all applicable laws and regulations.",
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
        "All content on this website, including text, graphics, logos, images, and software, is the property of Agoura Feed and is protected by copyright and trademark laws.",
        "You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.",
        "The Agoura Feed name, logo, and all related trademarks are the exclusive property of Agoura Feed."
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
        "Agoura Feed is not liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.",
        "Our total liability for any claim arising from these terms or your use of the service shall not exceed the amount you paid for the specific product giving rise to the claim.",
        "We do not guarantee that our website will be uninterrupted, error-free, or free of viruses or other harmful components."
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which Agoura Feed operates.",
        "Any disputes arising from these terms shall be resolved through binding arbitration, unless otherwise required by applicable law.",
        "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect."
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Terms of Use | Agoura Feed</title>
      </Head>

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#252542] to-[#1a1a2e]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3a6186]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <h1 
            className="text-[40px] md:text-[56px] font-bold text-white mb-4 tracking-[-0.03em]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Terms of <span className="text-[#89B4D4]">Use</span>
          </h1>
          <p className="text-white/50 text-[15px] max-w-xl mx-auto leading-[1.7]">
            Please read these terms carefully before using our website and services.
          </p>
          <p className="text-white/25 text-[12px] mt-4">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28 bg-[#FDFCFA]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-14">
          {sections.map((section, index) => (
            <div key={section.title}>
              <div className="flex items-start gap-5">
                <span className="flex-shrink-0 w-10 h-10 bg-[#3a6186]/8 text-[#3a6186] rounded-xl flex items-center justify-center font-semibold text-[14px]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h2 
                    className="text-[20px] font-bold text-[#1a1a2e] mb-5 tracking-[-0.02em]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#1a1a2e]/55 text-[14px] leading-[1.7]">
                        <span className="text-[#3a6186]/40 mt-1.5 flex-shrink-0 text-[10px]">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < sections.length - 1 && (
                <div className="divider-gradient mt-12" />
              )}
            </div>
          ))}

          {/* Contact CTA */}
          <div className="bg-[#f7f5f2] p-10 rounded-[24px] border border-[#e8e4de]/60">
            <h2 
              className="text-[20px] font-bold text-[#1a1a2e] mb-3 tracking-[-0.02em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Have Questions About These Terms?
            </h2>
            <p className="text-[#1a1a2e]/50 text-[14px] leading-[1.7] mb-6">
              If you have any questions about these Terms of Use, please contact our support team. We&apos;re happy to help clarify anything.
            </p>
            <Link 
              href="/contact" 
              className="group inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-7 py-3 rounded-full text-[13px] font-semibold hover:bg-[#3a6186] transition-all duration-400 shadow-lg shadow-[#1a1a2e]/10"
            >
              Contact Us
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
