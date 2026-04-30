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
      const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
      const res = await fetch(`${wpUrl}/wp-json/headless/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) { setStatus('success'); e.target.reset(); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <Head>
        <title>{heroData.title || 'Contact Us'} | {settings?.siteTitle || 'PawFresh'}</title>
      </Head>
      <main className="bg-white min-h-screen">
        {/* Hero from sections */}
        <section className="py-24 relative overflow-hidden bg-gray-900">
          {heroData.image && <img src={heroData.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Contact" />}
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase italic">{heroData.title || 'Contact Us'}</h1>
            {heroData.subtitle && <p className="text-gray-300 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto leading-relaxed">{heroData.subtitle}</p>}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col lg:flex-row gap-20">
          {/* Contact Form */}
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">Send us a Message</h2>
              <p className="text-gray-500 font-medium italic">We typically respond within 24 hours.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" placeholder="Full Name" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                <input type="email" name="email" placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <input type="text" name="subject" placeholder="Subject" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
              <textarea name="message" placeholder="Message" rows="6" required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"></textarea>
              <button disabled={loading} type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all shadow-xl shadow-gray-200">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && <p className="bg-green-50 text-green-600 p-4 rounded-xl text-center font-bold text-sm">✨ Message sent successfully!</p>}
              {status === 'error' && <p className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm">❌ Something went wrong. Please try again.</p>}
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
