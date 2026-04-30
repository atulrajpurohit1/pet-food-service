import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const WP_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882'}/wp-json`;

export default function Profile() {
  const { user, token, loading: authLoading, login, logout, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    
    // Simulate account creation
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      avatar: avatarPreview || 'https://via.placeholder.com/400?text=Pet+Parent'
    };
    
    login('registered_token', newUser);
    setMessage({ type: 'success', text: 'Welcome! Your account is ready.' });
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  if (!user) return (
    <Layout>
      <Head><title>Join PawFresh | Create Your Profile</title></Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 py-24 px-4">
        <div className="max-w-xl w-full bg-white rounded-[4rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          <div className="p-12 md:p-16 text-center">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight italic mb-2">Join PawFresh</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Create your pet parent profile today</p>
            
            {message.text && (
              <div className={`mb-10 p-4 rounded-2xl text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 animate-shake'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-8">
              <div className="flex flex-col items-center mb-10">
                 <div className="relative group">
                    <img 
                      src={avatarPreview || 'https://via.placeholder.com/200?text=Photo'} 
                      className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-gray-50 shadow-lg bg-gray-50"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-primary/80 rounded-[2.5rem] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span className="text-lg mb-1">📸</span>
                      <span className="text-[8px] font-black uppercase tracking-widest">Optional</span>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAvatarPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                 </div>
                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">Profile Photo (Optional)</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-left space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900 placeholder:text-gray-200"
                  />
                </div>
                <div className="text-left space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900 placeholder:text-gray-200"
                  />
                </div>
              </div>

              <div className="text-left space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900 placeholder:text-gray-200"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-primary transition-all mt-6"
              >
                Create My Account
              </button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <Head><title>My Profile | PawFresh</title></Head>

      <section className="bg-gray-50/50 min-h-screen py-24 px-4">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
            
            {/* Header Aesthetic */}
            <div className="h-48 bg-gray-900 relative">
               <div className="absolute inset-0 opacity-20">
                  <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <img 
                      src={avatarPreview || 'https://via.placeholder.com/200'} 
                      className="w-40 h-40 rounded-[3rem] object-cover border-8 border-white shadow-2xl bg-white"
                    />
                    {isEditing && (
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-primary/80 rounded-[3rem] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <span className="text-xl mb-1">📸</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
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

            <div className="pt-28 pb-16 px-10 md:px-20 text-center">
              
              {!isEditing ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight italic mb-2">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-10">{user.email}</p>
                  
                  {message.text && (
                    <div className={`mb-8 p-4 rounded-2xl text-xs font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 animate-shake'}`}>
                      {message.text}
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-primary transition-all"
                    >
                      Edit Account Details
                    </button>
                    <button onClick={logout} className="text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest text-[10px] mt-4 transition-colors">
                      Log Out from Store
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">First Name</label>
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Last Name</label>
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary font-bold text-gray-900"
                    />
                  </div>

                  <div className="pt-8 flex flex-col gap-4">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:bg-gray-900 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving Changes...' : 'Save & Update Profile'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setIsEditing(false); setAvatarPreview(user.avatar); }}
                      className="text-gray-400 hover:text-gray-900 font-black uppercase tracking-widest text-[10px] transition-colors"
                    >
                      Cancel Changes
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

          <div className="mt-12 text-center">
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Personalized Nutrition for your Best Friend</p>
          </div>

        </div>
      </section>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </Layout>
  );
}
