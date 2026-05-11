import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSettings } from '../context/SettingsContext';

const DEFAULT_LOGO = '/agoura-feed-logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { siteTitle, navItems, logoUrl } = useSettings();

  const resolvedLogo = logoUrl || DEFAULT_LOGO;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return <header className="h-[80px]"></header>;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-500"
      style={{ background: 'linear-gradient(135deg, #7EC8E3 0%, #72C2E0 20%, #8AD4EC 40%, #A0E0F2 60%, #6DBFE0 80%, #82D0EB 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between h-[80px] items-center">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src={resolvedLogo}
              alt={siteTitle || 'Agoura Feed'}
              className="h-[62px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
              draggable={false}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems?.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`relative px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-[#0a3055] bg-white/25' 
                      : 'text-[#1a3a5c]/80 hover:text-[#0a2040] hover:bg-white/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[180px] focus:w-[240px] bg-white/30 border-0 rounded-full px-4 pl-9 py-2 text-[13px] font-medium outline-none transition-all duration-300 placeholder:text-[#1a3a5c]/50 text-[#0a2040] backdrop-blur-sm"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1a3a5c]/50 group-focus-within:text-[#0a3055] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#1a3a5c]/80 hover:bg-white/20 transition-colors"
              >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/30 px-5 pt-4 pb-6" style={{ background: 'linear-gradient(180deg, #8AD4EC 0%, #A0E0F2 100%)' }}>
          <form onSubmit={handleSearch} className="relative w-full mb-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/30 border-0 rounded-2xl px-4 pl-10 py-3 text-sm font-medium outline-none transition-all placeholder:text-[#1a3a5c]/50 text-[#0a2040] backdrop-blur-sm"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a5c]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
          <div className="space-y-1">
            {navItems?.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                    isActive 
                      ? 'text-[#0a3055] bg-white/25' 
                      : 'text-[#1a3a5c]/80 hover:text-[#0a2040] hover:bg-white/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
