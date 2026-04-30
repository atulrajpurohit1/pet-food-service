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
      className="min-h-screen flex flex-col bg-white font-sans text-gray-900 selection:bg-primary selection:text-white"
      style={hasMounted ? {
        '--color-primary': colors.primary || '#16a34a',
        '--color-secondary': colors.secondary || '#f97316',
        '--color-accent': colors.accent || '#111827',
      } : {}}
    >
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
