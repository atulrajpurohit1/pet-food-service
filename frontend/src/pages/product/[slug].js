import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function ProductDetails({ product, settings }) {
  const router = useRouter();
  const { addToCart } = useCart();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFA]">
        <div className="w-8 h-8 rounded-full border-2 border-[#3a6186]/20 border-t-[#3a6186] animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFA] py-20 px-5">
          <h1 className="text-4xl font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Product Not Found</h1>
          <Link href="/categories" className="bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#3a6186] transition-all">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{product.title} | {settings?.siteTitle || 'Agoura Feed'}</title>
        <meta name="description" content={`Buy ${product.title} - Premium nutrition for your pets.`} />
      </Head>

      <section className="py-24 px-4 bg-[#FDFCFA] min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-10">
          {/* Image */}
          <div className="bg-white rounded-[32px] overflow-hidden aspect-square border border-[#e8e4de]/60 shadow-xl shadow-[#1a1a2e]/5">
            <img 
              src={product.image || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=1200"} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <nav className="text-[12px] font-bold text-[#1a1a2e]/40 uppercase tracking-widest flex items-center space-x-2">
               <Link href="/" className="hover:text-[#3a6186] transition-colors">Home</Link>
               <span>/</span>
               <Link href="/categories" className="hover:text-[#3a6186] transition-colors">Categories</Link>
               <span>/</span>
               <span className="text-[#3a6186]">{product.title}</span>
            </nav>

            <h1 
              className="text-[40px] md:text-[56px] font-bold text-[#1a1a2e] leading-tight tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-black text-[#e8985e]">${product.price || '24.99'}</span>
              <span className="bg-[#16a34a]/10 text-[#16a34a] px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest">In Stock</span>
            </div>

            {product.content && (
              <div 
                className="text-[#1a1a2e]/60 text-[16px] leading-relaxed prose prose-p:mb-4"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />
            )}

            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                 <button 
                  onClick={() => addToCart({ ...product, price: product.price || 24.99 })}
                  className="flex-grow bg-[#1a1a2e] hover:bg-[#3a6186] text-white font-bold py-4 rounded-2xl text-[15px] shadow-xl shadow-[#1a1a2e]/10 transition-all duration-300 flex items-center justify-center space-x-3"
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                   <span>Add to Cart</span>
                 </button>
              </div>
            </div>

            {/* Feature List */}
            <ul className="grid grid-cols-2 gap-5 pt-10 border-t border-[#e8e4de]/60">
               {[
                 { label: "100% Organic", icon: "🌱" },
                 { label: "Grain Free", icon: "🌾" },
                 { label: "High Protein", icon: "🥩" },
                 { label: "No Additives", icon: "✨" }
               ].map(item => (
                 <li key={item.label} className="flex items-center gap-3 text-[#1a1a2e]/60 font-semibold text-[14px]">
                   <span className="w-10 h-10 flex items-center justify-center bg-[#f7f5f2] rounded-xl text-lg">{item.icon}</span>
                   <span>{item.label}</span>
                 </li>
               ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    
    const products = data.products || [];
    
    const paths = products.map(p => ({
      params: { slug: p.slug },
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    
    const products = data.products || [];
    const product = products.find(p => p.slug === slug);

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product,
        settings: data.settings || {},
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
}
