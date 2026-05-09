import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function SearchResults({ siteData }) {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q && siteData) {
      setLoading(true);
      const query = q.toLowerCase();
      
      const allSearchable = [
        ...(siteData.products || []).map(p => ({ ...p, type: 'product' })),
        ...(siteData.pages || []).map(p => ({ ...p, type: 'page' })),
      ];

      const filtered = allSearchable.filter(item => {
        const searchableText = [
          item.title || '',
          item.slug || '',
          item.excerpt || '',
          item.sections ? JSON.stringify(item.sections) : '',
          item.type || ''
        ].join(' ').toLowerCase();
        return searchableText.includes(query);
      });

      setResults(filtered);
      setLoading(false);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [q, siteData]);

  return (
    <Layout>
      <Head>
        <title>Search Results for "{q}" | {siteData?.settings?.siteTitle || 'Agoura Feed'}</title>
      </Head>

      <section className="bg-[#FDFCFA] py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* Header */}
          <div className="mb-14">
            <h1 
              className="text-[32px] md:text-[42px] font-bold text-[#1a1a2e] mb-3 tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Search Results
            </h1>
            <p className="text-[#1a1a2e]/35 text-[14px]">
               {loading ? 'Searching...' : `Found ${results.length} results for "${q}"`}
            </p>
          </div>

          {loading ? (
            <div className="py-40 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#3a6186]/20 border-t-[#3a6186] animate-spin mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((item) => (
                <Link 
                  href={item.type === 'product' ? `/product/${item.slug}` : (item.slug === 'home' ? '/' : `/${item.slug}`)} 
                  key={`${item.type}-${item.id}`} 
                  className="group card-hover bg-white rounded-[24px] overflow-hidden border border-[#e8e4de]/60"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#f7f5f2]">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3a6186]">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-[#1a1a2e] text-[15px] tracking-[-0.02em] mb-2">{item.title}</h3>
                    <p className="text-[12px] text-[#1a1a2e]/35 leading-relaxed line-clamp-2 mb-4">
                       {item.excerpt || `Explore our premium ${item.type} collection.`}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#3a6186]">
                      View Details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white rounded-[28px] border border-[#e8e4de]/60">
              <div className="text-5xl mb-6">🔎</div>
              <h2 
                className="text-[24px] font-bold text-[#1a1a2e] mb-3 tracking-[-0.02em]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                No results found
              </h2>
              <p className="text-[#1a1a2e]/40 text-[14px] max-w-sm mx-auto mb-8">
                We couldn't find anything matching your search. Try different keywords or browse our shop.
              </p>
              <Link 
                href="/categories" 
                className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full text-[13px] font-semibold hover:bg-[#3a6186] transition-all duration-400 shadow-lg shadow-[#1a1a2e]/10"
              >
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recommended */}
      {!loading && results.length === 0 && siteData?.products && (
        <section className="py-20 bg-[#f7f5f2]/40">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h2 
              className="text-[28px] font-bold text-[#1a1a2e] mb-12 tracking-[-0.03em] text-center"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Top Recommended
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {siteData.products.slice(0, 4).map((item) => (
                <Link href="/categories" key={item.id} className="group text-center space-y-4">
                  <div className="aspect-square rounded-[24px] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500">
                    <img src={item.image || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="font-semibold text-[#1a1a2e] text-[14px] tracking-[-0.01em]">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();

    return {
      props: {
        siteData: data || null,
        settings: data?.settings || {},
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: { siteData: null, settings: {} },
      revalidate: 60,
    };
  }
}
