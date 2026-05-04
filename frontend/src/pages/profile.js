import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import SectionRenderer from '../components/SectionRenderer';

const WP_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882'}/wp-json`;

export default function Profile({ page, settings }) {
  const { user, token, loading: authLoading, login, logout, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Extract sections from WordPress
  const heroSection = page?.sections?.find(s => s.type === 'hero');
  const otherSections = page?.sections?.filter(s => s.type !== 'hero') || [];
  const heroData = heroSection?.data || {};

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      let newAvatarUrl = avatarPreview;
      if (fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];
        const mediaFormData = new FormData();
        mediaFormData.append('file', file);
        
        try {
          const mediaRes = await fetch(`${WP_API_URL}/wp/v2/media`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: mediaFormData
          });
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            newAvatarUrl = mediaData.source_url;
          }
        } catch (mediaErr) { console.error(mediaErr); }
      }

      const response = await fetch(`${WP_API_URL}/wp/v2/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          meta: { avatar: newAvatarUrl } 
        }),
      });

      if (response.ok) {
        updateUser({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email, avatar: newAvatarUrl });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        const errData = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: errData.message || 'Failed to update profile.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cannot connect to WordPress. Please check your connection.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      setMessage({ type: 'error', text: 'Name and Email are required!' });
      return;
    }
    
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      avatar: avatarPreview || 'https://via.placeholder.com/400?text=Pet+Parent'
    };
    
    login('registered_token', newUser);
    setMessage({ type: 'success', text: 'Welcome! Your account is ready.' });
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFA]">
      <div className="w-8 h-8 rounded-full border-2 border-[#3a6186]/20 border-t-[#3a6186] animate-spin"></div>
    </div>
  );

  // ─── Registration Form (Not Logged In) ───────────────────
  if (!user) return (
    <Layout>
      <Head><title>{`${heroData.title || 'Join Agoura Feed'} | ${settings?.siteTitle || 'Agoura Feed'}`}</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFA] py-24 px-5">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-[28px] shadow-xl shadow-[#1a1a2e]/5 border border-[#e8e4de]/60 overflow-hidden p-10 md:p-14">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#3a6186]/8 rounded-2xl mb-5">
                <span className="text-2xl">🐾</span>
              </div>
              <h1 
                className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.03em] mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {heroData.title || 'Join Agoura Feed'}
              </h1>
              <p className="text-[#1a1a2e]/35 text-[13px]">{heroData.subtitle || 'Create your pet parent profile today'}</p>
            </div>
            
            {message.text && (
              <div className={`mb-8 p-4 rounded-xl text-[13px] font-medium text-center ${
                message.type === 'success' ? 'bg-[#3a6186]/8 text-[#3a6186]' : 'bg-red-50 text-red-500'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img 
                    src={avatarPreview || 'https://via.placeholder.com/200?text=Photo'} 
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#e8e4de]/60 bg-[#f7f5f2]"
                  />
                  <div className="absolute inset-0 bg-[#3a6186]/70 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <span className="text-white text-lg">📸</span>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAvatarPreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
                <p className="text-[11px] text-[#1a1a2e]/25 font-medium mt-3">Profile photo (optional)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">First Name</label>
                  <input 
                    type="text" placeholder="John"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">Last Name</label>
                  <input 
                    type="text" placeholder="Doe"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">Email Address</label>
                <input 
                  type="email" placeholder="john@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all placeholder:text-[#1a1a2e]/20"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#1a1a2e] text-white py-4 rounded-xl text-[14px] font-semibold shadow-lg shadow-[#1a1a2e]/10 hover:bg-[#3a6186] transition-all duration-400 mt-2"
              >
                Create My Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );

  // ─── Profile View (Logged In) ────────────────────────
  return (
    <Layout>
      <Head><title>{`${heroData.title || 'My Profile'} | ${settings?.siteTitle || 'Agoura Feed'}`}</title></Head>

      <section className="bg-[#FDFCFA] min-h-screen py-20 px-5">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-white rounded-[28px] shadow-xl shadow-[#1a1a2e]/5 border border-[#e8e4de]/60 overflow-hidden">
            
            {/* Cover + Avatar */}
            <div className="h-40 bg-gradient-to-br from-[#3a6186] to-[#89B4D4] relative">
               <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                 <div className="relative group">
                   <img 
                     src={avatarPreview || 'https://via.placeholder.com/200'} 
                     className="w-32 h-32 rounded-[24px] object-cover border-4 border-white shadow-xl bg-white"
                   />
                   {isEditing && (
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute inset-0 bg-[#3a6186]/70 rounded-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                     >
                       <span className="text-white text-lg">📸</span>
                     </button>
                   )}
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                     const file = e.target.files[0];
                     if (file) {
                       const reader = new FileReader();
                       reader.onloadend = () => setAvatarPreview(reader.result);
                       reader.readAsDataURL(file);
                     }
                   }} />
                 </div>
               </div>
            </div>

            <div className="pt-24 pb-12 px-10 md:px-16 text-center">
              
              {!isEditing ? (
                <div>
                  <h1 
                    className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.03em] mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-[#3a6186] text-[13px] font-medium mb-8">{user.email}</p>
                  
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-xl text-[13px] font-medium ${
                      message.type === 'success' ? 'bg-[#3a6186]/8 text-[#3a6186]' : 'bg-red-50 text-red-500'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-[#1a1a2e] text-white py-4 rounded-xl text-[14px] font-semibold shadow-lg shadow-[#1a1a2e]/10 hover:bg-[#3a6186] transition-all duration-400"
                    >
                      Edit Account Details
                    </button>
                    <button 
                      onClick={logout} 
                      className="text-[#1a1a2e]/30 hover:text-red-400 text-[12px] font-medium mt-2 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] text-[#1a1a2e]/35 font-semibold ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#f7f5f2] border border-[#e8e4de]/60 rounded-xl px-4 py-3.5 text-[14px] font-medium outline-none transition-all"
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full bg-[#3a6186] text-white py-4 rounded-xl text-[14px] font-semibold shadow-lg shadow-[#3a6186]/15 hover:bg-[#1a1a2e] transition-all duration-400 disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setIsEditing(false); setAvatarPreview(user.avatar); }}
                      className="text-[#1a1a2e]/30 hover:text-[#1a1a2e] text-[12px] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

          <p className="text-center text-[11px] text-[#1a1a2e]/20 font-medium mt-8 tracking-wide">
            Personalized Nutrition for your Best Friend
          </p>

        </div>
      </section>

      {/* Render additional CMS sections below the profile card */}
      {otherSections.length > 0 && (
        <SectionRenderer sections={otherSections} settings={settings} />
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    const profilePage = data.pages.find(p => p.slug === 'profile');
    return { props: { page: profilePage || null, settings: data.settings || {} }, revalidate: 60 };
  } catch (error) {
    return { props: { page: null, settings: {} }, revalidate: 60 };
  }
}
