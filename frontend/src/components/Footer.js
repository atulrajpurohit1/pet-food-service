import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';

const getSocialIcon = (platform) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (p.includes('instagram')) return <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (p.includes('twitter') || p.includes(' x ')) return <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
};

const DEFAULT_LOGO = '/agoura-feed-logo.png';

export default function Footer() {
  const { siteTitle, contact, socialLinks, logoUrl } = useSettings();

  const resolvedLogo = logoUrl || DEFAULT_LOGO;

  return (
    <footer className="relative bg-[#1a1a2e] text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#1f1f35] to-[#252542] pointer-events-none" />
      
      {/* Decorative blur orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3a6186]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#89B4D4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
            
            {/* Brand Column */}
            <div className="md:col-span-6 lg:col-span-4 space-y-6">
              <Link href="/" className="inline-flex items-center group">
                <img 
                  src={resolvedLogo}
                  alt={siteTitle || 'Agoura Feed'}
                  className="h-[62px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
                  draggable={false}
                />
              </Link>
              <p className="text-white/40 text-[14px] leading-relaxed max-w-[280px]">
                Premium pet nutrition crafted with care. Healthy food for happy pets since 2020.
              </p>
              <div className="flex gap-2 pt-2">
                {(socialLinks || []).map(social => (
                  <a 
                    key={social.platform} 
                    href={social.url || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/40 hover:bg-[#3a6186]/30 hover:text-[#89B4D4] transition-all duration-300"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
                {(!socialLinks || socialLinks.length === 0) && [
                  { platform: 'Instagram', url: 'https://www.instagram.com/agourafeed/' },
                  { platform: 'Twitter', url: 'https://x.com/AgouraHS' },
                  { platform: 'Facebook', url: 'https://www.facebook.com/p/Agoura-Feed-100069321308888/' }
                ].map(social => (
                  <a 
                    key={social.platform} 
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/40 hover:bg-[#3a6186]/30 hover:text-[#89B4D4] transition-all duration-300"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 lg:col-span-2">
              <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-6">Navigate</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Categories', href: '/categories' },
                  { label: 'Contact', href: '/contact' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/50 hover:text-white text-[14px] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="md:col-span-3 lg:col-span-2">
              <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-6">Shop</h3>
              <ul className="space-y-3">
                {['Dog Food', 'Cat Food', 'Treats & Chews', 'Supplements'].map(cat => {
                  let slug = cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
                  if (cat === 'Treats & Chews') slug = 'treats';
                  return (
                    <li key={cat}>
                        <Link href={`/categories/${slug}`} className="text-white/50 hover:text-white text-[14px] transition-colors duration-300">
                        {cat}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-6 lg:col-span-4">
              <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-6">Get in Touch</h3>
              <ul className="space-y-4">
                <li>
                  <a href={`tel:${(contact?.phone || '(818) 889-1989').replace(/[^\d+]/g, '')}`} className="flex items-start gap-3 group text-white/50 hover:text-white transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-[#89B4D4]/60 mt-0.5 flex-shrink-0 group-hover:text-[#89B4D4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-[14px]">
                      {contact?.phone || '(818) 889-1989'}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${(contact?.email || 'agourafeed@yahoo.com').trim()}`} className="flex items-start gap-3 group text-white/50 hover:text-white transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-[#89B4D4]/60 mt-0.5 flex-shrink-0 group-hover:text-[#89B4D4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[14px]">
                      {contact?.email || 'agourafeed@yahoo.com'}
                    </span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(contact?.address || '28327 Agoura Rd, Agoura Hills, CA 91301-2405')}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex items-start gap-3 group text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#89B4D4]/60 mt-0.5 flex-shrink-0 group-hover:text-[#89B4D4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[14px] leading-relaxed">
                      {contact?.address || '28327 Agoura Rd, Agoura Hills, CA 91301-2405'}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom divider + copyright */}
          <div className="divider-gradient opacity-20" />
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/25 text-[12px] tracking-wide">
              © {new Date().getFullYear()} {siteTitle || 'Agoura Feed'}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-white/25 hover:text-white/50 text-[12px] transition-colors">Privacy</Link>
              <Link href="/terms-of-use" className="text-white/25 hover:text-white/50 text-[12px] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
