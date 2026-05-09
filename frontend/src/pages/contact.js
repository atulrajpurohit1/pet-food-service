import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import SectionRenderer from '../components/SectionRenderer';
import ContactInfoSection from '../components/sections/ContactInfoSection';

export default function Contact({ page, settings }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract hero and contact_info sections
  const heroSection = page?.sections?.find(s => s.type === 'hero');
  const contactSection = page?.sections?.find(s => s.type === 'contact_info');
  const heroData = heroSection?.data || {};
  const contactData = contactSection?.data || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetch('/wp-proxy/wp-json/headless/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok) { 
        setStatus('success'); 
        e.target.reset(); 
      } else { 
        console.error('Contact form submission failed:', result);
        setStatus('error'); 
      }
    } catch (err) { 
      console.error('Contact form network error:', err);
      setStatus('error'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Layout>
      <Head>
        <title>{`${heroData.title || 'Contact Us'} | ${settings?.siteTitle || 'Agoura Feed'}`}</title>
      </Head>
      <main className="bg-[#FDFCFA] min-h-screen">
        {/* Hero Banner */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#252542] to-[#1a1a2e]" />
          {heroData.image && <img src={heroData.image} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="Contact" />}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3a6186]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <h1 
              className="text-[40px] md:text-[56px] font-bold text-white mb-4 tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {heroData.title || 'Contact Us'}
            </h1>
            {heroData.subtitle && (
              <p className="text-white/50 text-[15px] max-w-xl mx-auto leading-[1.7]">{heroData.subtitle}</p>
            )}
          </div>
        </section>

        {/* Form + Contact Info */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28 flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Contact Form */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <h2 
                className="text-[26px] md:text-[32px] font-bold text-[#1a1a2e] tracking-[-0.03em]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Send us a Message
              </h2>
              <p className="text-[#1a1a2e]/40 text-[15px]">We typically respond within 24 hours.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input 
                  type="text" name="name" placeholder="Full Name" required 
                  className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-2xl px-5 py-4 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/25" 
                />
                <input 
                  type="email" name="email" placeholder="Email Address" required 
                  className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-2xl px-5 py-4 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/25" 
                />
              </div>
              <input 
                type="text" name="subject" placeholder="Subject" required 
                className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-2xl px-5 py-4 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/25" 
              />
              <textarea 
                name="message" placeholder="Your message..." rows="6" required 
                className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-2xl px-5 py-4 text-[14px] font-medium outline-none transition-all resize-none placeholder:text-[#1a1a2e]/25"
              ></textarea>
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full bg-[#1a1a2e] text-white py-4 rounded-2xl text-[14px] font-semibold hover:bg-[#3a6186] transition-all duration-400 shadow-lg shadow-[#1a1a2e]/10 disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && (
                <div className="bg-[#3a6186]/8 text-[#3a6186] p-4 rounded-xl text-center text-[14px] font-medium">
                  ✨ Message sent successfully!
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center text-[14px] font-medium">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
          {/* Contact Info from sections */}
          <ContactInfoSection data={contactData} />
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    const contactPage = data.pages.find(p => p.slug === 'contact');
    return { props: { page: contactPage || null, settings: data.settings || {} }, revalidate: 60 };
  } catch (error) {
    return { props: { page: null, settings: {} }, revalidate: 60 };
  }
}
