import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Page Not Found | Agoura Feed</title>
      </Head>
      
      <main className="min-h-[80vh] flex items-center justify-center bg-[#FDFCFA] relative overflow-hidden px-5">
        {/* Background Decorations */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3a6186]/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#e8985e]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        
        <div className="relative z-10 text-center">
          <div className="mb-8 inline-block">
            <span className="text-[120px] md:text-[160px] font-bold text-[#1a1a2e]/5 leading-none select-none">404</span>
            <div className="mt-[-60px] md:mt-[-80px]">
              <h1 
                className="text-[32px] md:text-[48px] font-bold text-[#1a1a2e] tracking-[-0.03em]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Lost in the Field?
              </h1>
            </div>
          </div>
          
          <p className="text-[#1a1a2e]/50 text-[16px] md:text-[18px] max-w-md mx-auto mb-10 leading-relaxed">
            The page you're looking for seems to have wandered off. Let's get you back to the right path.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="bg-[#1a1a2e] text-white px-10 py-4 rounded-full text-[14px] font-semibold hover:bg-[#3a6186] transition-all duration-400 shadow-xl shadow-[#1a1a2e]/10"
            >
              Back to Home
            </Link>
            <Link 
              href="/categories" 
              className="bg-white border border-[#e8e4de] text-[#1a1a2e] px-10 py-4 rounded-full text-[14px] font-semibold hover:bg-[#f7f5f2] transition-all duration-400"
            >
              Browse Products
            </Link>
          </div>
          
          <div className="mt-20">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1a1a2e]/30 font-bold">
              Agoura Feed Premium Nutrition
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
