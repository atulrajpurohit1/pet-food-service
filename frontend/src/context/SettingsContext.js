import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  siteTitle: 'Agoura Feed',
  siteTagline: 'Premium Pet Feed & Supplies',
  logoUrl: '',
  colors: {
    primary: '#3a6186',
    secondary: '#89B4D4',
    accent: '#e8985e',
  },
  menus: {
    header: [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'My Profile', href: '/profile' },
    ],
    footer: [],
  },
  socialLinks: [],
  contact: {
    email: 'agourafeed@yahoo.com',
    phone: '(818) 889-1989',
    address: '28327 Agoura Rd, Agoura Hills, CA 91301-2405',
  },
  footerText: `© ${new Date().getFullYear()} Agoura Feed. Crafted with love.`,
};

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = '/wp-proxy/wp-json/headless/v1/site';
        
        console.log(`[SettingsContext] Fetching through proxy: ${apiUrl}`);
        
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        } else {
          console.warn(`[SettingsContext] API returned ${res.status}: ${apiUrl}. Using fallbacks.`);
        }
      } catch (error) {
        console.warn('[SettingsContext] Could not connect to WordPress. Please ensure WordPress Studio is running.');
      }
    };

    // Only fetch if we don't have initialSettings or in development for live preview
    if (!initialSettings || process.env.NODE_ENV === 'development') {
      fetchSettings();
      
      // Development-only polling for live sync effect
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(fetchSettings, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  const settings = context || defaultSettings;
  
  // Provide navItems for backward compatibility with existing components
  return {
    ...settings,
    navItems: settings.menus?.header || defaultSettings.menus.header
  };
}
