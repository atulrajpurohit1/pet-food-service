import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information such as your name, email address, phone number, and shipping address when you create an account or place an order.",
        "Payment information is processed securely through our third-party payment providers. We do not store your full credit card details on our servers.",
        "Usage data including pages visited, time spent on site, browser type, and device information to improve your experience.",
        "Pet profile information you voluntarily share, such as pet names, breeds, ages, and dietary preferences."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders, including shipping and delivery notifications.",
        "To personalize your shopping experience and provide tailored product recommendations for your pets.",
        "To send you promotional communications, newsletters, and special offers (you can opt out at any time).",
        "To improve our website, products, and customer service based on your feedback and usage patterns.",
        "To comply with legal obligations and protect against fraudulent activity."
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you (e.g., shipping carriers, payment processors).",
        "We may disclose your information when required by law or to protect our rights, safety, or property."
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits.",
        "Access to personal information is restricted to authorized employees and contractors who need it to perform their job functions.",
        "While we strive to protect your personal information, no method of transmission over the internet is 100% secure."
      ]
    },
    {
      title: "Cookies & Tracking",
      content: [
        "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.",
        "You can control cookie preferences through your browser settings. Disabling cookies may affect some site functionality.",
        "We use analytics tools like Google Analytics to understand how visitors interact with our website."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "You have the right to access, correct, or delete your personal information at any time by contacting us or through your account settings.",
        "You can opt out of marketing communications by clicking the unsubscribe link in any email or updating your preferences.",
        "You may request a copy of all personal data we hold about you.",
        "If you are located in the EU, you have additional rights under GDPR, including the right to data portability and the right to lodge a complaint."
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.",
        "If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information promptly."
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Privacy Policy | Agoura Feed</title>
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
            Privacy <span className="text-[#89B4D4]">Policy</span>
          </h1>
          <p className="text-white/50 text-[15px] max-w-xl mx-auto leading-[1.7]">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
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
              Questions About Your Privacy?
            </h2>
            <p className="text-[#1a1a2e]/50 text-[14px] leading-[1.7] mb-6">
              If you have any questions or concerns about this privacy policy or our data practices, please don&apos;t hesitate to reach out.
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
