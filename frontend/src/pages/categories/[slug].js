import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function CategoryDetail({ category, settings, products }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFA]">
        <div className="w-8 h-8 rounded-full border-2 border-[#3a6186]/20 border-t-[#3a6186] animate-spin"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFA] py-20 px-5">
          <h1 className="text-4xl font-bold text-[#1a1a2e] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Category Not Found</h1>
          <Link href="/categories" className="bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#3a6186] transition-all">
            Back to Categories
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{`${category.name === 'Treats' ? 'Treats & Chews' : category.name} | ${settings?.siteTitle || 'Agoura Feed'}`}</title>
        <meta name="description" content={category.subtitle || `Premium ${category.name === 'Treats' ? 'Treats & Chews' : category.name} for your pets.`} />
      </Head>

      <main className="bg-[#FDFCFA] min-h-screen">
        {/* Category Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3a6186]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e8985e]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <Link href="/categories" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#3a6186] uppercase tracking-wider hover:translate-x-[-4px] transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Categories
                </Link>
                <h1 
                  className="text-[48px] md:text-[64px] font-bold text-[#1a1a2e] leading-tight tracking-[-0.03em]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {category.name === 'Treats' ? 'Treats & Chews' : category.name}
                </h1>
                <p className="text-[18px] text-[#1a1a2e]/50 max-w-lg leading-relaxed">
                  {category.subtitle || `Explore our handpicked selection of premium ${category.name.toLowerCase()} products designed for the health and happiness of your pets.`}
                </p>
              </div>
              
              <div className="flex-1 w-full max-w-[500px]">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#3a6186]/10 rounded-[32px] transform rotate-3 scale-[1.02] transition-transform group-hover:rotate-1" />
                  <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Placeholder */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 
                  className="text-[28px] md:text-[36px] font-bold text-[#1a1a2e] tracking-[-0.02em]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Recommended Products
                </h2>
                <p className="text-[#1a1a2e]/40 text-[14px] mt-2">Best sellers in {category.name}</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button className="w-10 h-10 rounded-full border border-[#e8e4de] flex items-center justify-center text-[#1a1a2e]/40 hover:bg-[#1a1a2e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="w-10 h-10 rounded-full border border-[#e8e4de] flex items-center justify-center text-[#1a1a2e]/40 hover:bg-[#1a1a2e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products && products.length > 0 ? products.map((product) => (
                <Link 
                  href={`/product/${product.slug}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#f7f5f2] mb-5">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600'} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-[16px] transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="block text-[13px] font-bold text-[#1a1a2e]">View Details</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e] text-[16px] tracking-[-0.01em]">{product.title}</h3>
                  <p className="text-[14px] text-[#1a1a2e]/40 mt-1">Premium Quality</p>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center bg-[#f7f5f2]/50 rounded-[32px] border border-dashed border-[#e8e4de]">
                  <p className="text-[#1a1a2e]/30 italic">New products coming soon to this category!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    
    let allCatItems = [];
    let allCardItems = [];

    // Collect all grid items from all pages
    data.pages.forEach(p => {
      const catGrids = p.sections?.filter(s => s.type === 'categories_grid') || [];
      catGrids.forEach(grid => {
        if (grid.data?.items) {
          allCatItems = [...allCatItems, ...grid.data.items];
        }
      });

      const cardGrids = p.sections?.filter(s => s.type === 'cards_grid') || [];
      cardGrids.forEach(grid => {
        if (grid.data?.items) {
          allCardItems = [...allCardItems, ...grid.data.items];
        }
      });
    });
    
    const catPaths = allCatItems.map(cat => ({
      params: { 
        slug: (cat.name || '').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      },
    })).filter(p => p.params.slug);

    const cardPaths = allCardItems.map(card => ({
      params: { 
        slug: (card.title || 'categories').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      },
    })).filter(p => p.params.slug);

    // Remove duplicates
    const uniqueSlugs = new Set();
    const paths = [...catPaths, ...cardPaths].filter(p => {
      if (uniqueSlugs.has(p.params.slug)) return false;
      uniqueSlugs.add(p.params.slug);
      return true;
    });

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
    
    let allCatItems = [];
    let allCardItems = [];

    data.pages.forEach(p => {
      const catGrids = p.sections?.filter(s => s.type === 'categories_grid') || [];
      catGrids.forEach(grid => {
        if (grid.data?.items) {
          allCatItems = [...allCatItems, ...grid.data.items];
        }
      });

      const cardGrids = p.sections?.filter(s => s.type === 'cards_grid') || [];
      cardGrids.forEach(grid => {
        if (grid.data?.items) {
          allCardItems = [...allCardItems, ...grid.data.items];
        }
      });
    });
    
    let category = allCatItems.find(cat => {
      if (!cat.name) return false;
      const catSlug = cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
      return catSlug === slug;
    });

    if (!category) {
      const card = allCardItems.find(c => {
        if (!c.title) return false;
        const cSlug = c.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '');
        return cSlug === slug;
      });
      
      if (card) {
        let defaultImage = card.image;
        if (!defaultImage && card.title?.toUpperCase() === 'ORGANIC FOOD') defaultImage = '/organic-food.png';
        if (!defaultImage && card.title?.toUpperCase() === 'TOYS') defaultImage = '/toys.png';
        
        category = {
          name: card.title,
          subtitle: card.description,
          image: defaultImage || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600'
        };
      }
    }

    if (!category) {
      return { notFound: true };
    }

    return {
      props: {
        category,
        settings: data.settings || {},
        products: data.products || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return { notFound: true };
  }
}
