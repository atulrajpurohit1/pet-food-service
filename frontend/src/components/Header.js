import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { siteTitle, navItems } = useSettings();

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
  if (!mounted) return <header className="h-[72px]"></header>;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'glass shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-baseline gap-1.5 select-none">
              <span 
                className="text-[#3a6186] font-bold text-[26px] tracking-[-0.03em] transition-colors group-hover:text-[#2c4a64]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Agoura
              </span>
              <span 
                className="text-[#89B4D4] font-medium text-[18px] italic tracking-[-0.01em] transition-colors group-hover:text-[#6a9bc0]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Feed
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems?.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-[-0.01em] rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-[#3a6186] bg-[#3a6186]/8' 
                      : 'text-[#1a1a2e]/60 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/4'
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
                  className="w-[180px] focus:w-[240px] bg-[#1a1a2e]/4 border-0 rounded-full px-4 pl-9 py-2 text-[13px] font-medium outline-none transition-all duration-300 placeholder:text-[#1a1a2e]/30"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1a1a2e]/30 group-focus-within:text-[#3a6186] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#1a1a2e]/60 hover:bg-[#1a1a2e]/5 transition-colors"
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
        <div className="glass border-t border-[#e8e4de]/50 px-5 pt-4 pb-6">
          <form onSubmit={handleSearch} className="relative w-full mb-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a2e]/4 border-0 rounded-2xl px-4 pl-10 py-3 text-sm font-medium outline-none transition-all placeholder:text-[#1a1a2e]/30"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a2e]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`block px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                    isActive 
                      ? 'text-[#3a6186] bg-[#3a6186]/8' 
                      : 'text-[#1a1a2e]/60 hover:text-[#1a1a2e] hover:bg-[#1a1a2e]/4'
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
