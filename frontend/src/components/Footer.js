import Link from 'next/link';
import { useSettings } from '../context/SettingsContext';

const getSocialIcon = (platform) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  if (p.includes('instagram')) return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (p.includes('twitter') || p.includes(' x ')) return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
};

export default function Footer() {
  const { siteTitle, logoUrl, contact } = useSettings();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-24">
          
          {/* Logo & Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteTitle} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white uppercase">{siteTitle || 'PawFresh'}</span>
                <span className="text-[9px] font-black uppercase text-green-500 tracking-widest leading-none">Premium Pet Nutrition</span>
              </div>
            </Link>
            <div className="text-gray-500 text-xs font-bold leading-relaxed space-y-2">
              <p>Premium pet nutrition made with love.</p>
              <p>Healthy food for happy pets since 2020.</p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-black text-white mb-8 tracking-tight">Quick Links</h3>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-sm font-black text-white mb-8 tracking-tight">Categories</h3>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li><Link href="/categories" className="hover:text-white transition-colors">Dog Food</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Cat Food</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Treats & Chews</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Supplements</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-black text-white mb-8 tracking-tight">Contact Us</h3>
            <ul className="space-y-4 text-xs font-bold text-gray-500">
              <li className="flex items-center space-x-2">
                <span>{contact?.phone || '1-800-PAWFRESH'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>{contact?.email || 'hello@pawfresh.com'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span>{contact?.address || '123 Pet Avenue, NY 10001'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} {siteTitle || 'PawFresh'}. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-gray-600">
            {['Instagram', 'Twitter', 'Facebook'].map(p => (
              <a key={p} href="#" className="hover:text-white transition-colors">
                {getSocialIcon(p)}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
