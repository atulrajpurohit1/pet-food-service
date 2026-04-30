import Layout from '../components/Layout';
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
      {/* Page Hero */}
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tight">Privacy <span className="text-green-600">Policy</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
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
            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Questions About Your Privacy?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions or concerns about this privacy policy or our data practices, please don&apos;t hesitate to reach out.
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
