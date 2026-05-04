import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useSettings } from '../context/SettingsContext';

export default function Layout({ children }) {
  const settings = useSettings();
  const colors = settings?.colors || {};
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FDFCFA] font-sans text-[#1a1a2e]"
      style={hasMounted ? {
        '--color-primary': colors.primary || '#3a6186',
        '--color-secondary': colors.secondary || '#e8985e',
        '--color-accent': colors.accent || '#1a1a2e',
      } : {}}
    >
      <Header />
      <main className="flex-grow pt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
