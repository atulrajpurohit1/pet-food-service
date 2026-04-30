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
      
      // Combine products and pages for searching
      const allSearchable = [
        ...(siteData.products || []).map(p => ({ ...p, type: 'product' })),
        ...(siteData.pages || []).map(p => ({ ...p, type: 'page' })),
      ];

      const filtered = allSearchable.filter(item => 
        (item.title || '').toLowerCase().includes(query) || 
        (item.slug || '').toLowerCase().includes(query) ||
        (item.excerpt || '').toLowerCase().includes(query)
      );

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
        <title>Search Results for "{q}" | {siteData?.settings?.siteTitle || 'PawFresh'}</title>
      </Head>

      <section className="bg-white py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Results Header */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
              Search Results
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
               {loading ? 'Searching...' : `Found ${results.length} related results for "${q}"`}
            </p>
          </div>

          {loading ? (
            <div className="py-40 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {results.map((item) => (
                <Link 
                  href={item.type === 'product' ? `/categories` : (item.slug === 'home' ? '/' : `/${item.slug}`)} 
                  key={`${item.type}-${item.id}`} 
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg mb-2">{item.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                       {item.excerpt || `Explore our premium ${item.type} collection.`}
                    </p>
                    <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-1 inline-block">
                       View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-100">
              <div className="text-6xl mb-8">🔎</div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">No pack found</h2>
              <p className="text-gray-400 font-medium max-w-sm mx-auto mb-12">We couldn't find anything matching your search. Try different keywords or browse our shop.</p>
              <Link href="/categories" className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all">
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Grid */}
      {!loading && results.length === 0 && siteData?.products && (
        <section className="py-32 border-t border-gray-50 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="text-3xl font-black text-gray-900 mb-16 tracking-tight uppercase italic text-center">Top Recommended</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {siteData.products.slice(0, 4).map((item) => (
                  <Link href="/categories" key={item.id} className="group text-center space-y-6">
                     <div className="aspect-square rounded-[3rem] overflow-hidden shadow-xl group-hover:scale-105 transition-all duration-500">
                        <img src={item.image || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600'} alt={item.title} className="w-full h-full object-cover" />
                     </div>
                     <h4 className="font-black text-gray-900 uppercase tracking-tighter text-sm">{item.title}</h4>
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
