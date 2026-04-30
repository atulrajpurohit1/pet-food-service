import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { useQuery as useQueryReact } from '@apollo/client/react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';

const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export default function ProductDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();

  const { loading, error, data } = useQueryReact(GET_PRODUCT_BY_SLUG, {
    variables: { id: slug },
    skip: !slug,
  });

  if (loading) return <Layout><div className="flex justify-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div></Layout>;
  if (error) return <Layout><div className="text-center py-40 text-red-500">Error: {error.message}</div></Layout>;
  if (!data?.product) return <Layout><div className="text-center py-40">Product not found.</div></Layout>;

  const product = data.product;

  return (
    <Layout>
      <Head>
        <title>{product.title} | PawFresh Pet Nutrition</title>
        <meta name="description" content={`Buy ${product.title} - Premium nutrition for your pets.`} />
      </Head>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="bg-gray-100 rounded-[3rem] overflow-hidden aspect-square border border-gray-100 shadow-sm">
            <img 
              src={product.featuredImage?.node.sourceUrl || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=1200"} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <nav className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
               <a href="/" className="hover:text-green-600">Home</a>
               <span>/</span>
               <a href="/categories" className="hover:text-green-600">Products</a>
               <span>/</span>
               <span className="text-gray-900">{product.title}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tight">{product.title}</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-black text-green-600">$24.99</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">In Stock</span>
            </div>

            <div 
              className="text-gray-600 text-lg leading-relaxed prose prose-green"
              dangerouslySetInnerHTML={{ __html: product.content }}
            />

            <div className="pt-8 space-y-4">
              <div className="flex items-center space-x-4">
                 <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50">
                    <button className="w-10 h-10 flex items-center justify-center hover:text-green-600 font-bold">-</button>
                    <span className="px-4 font-bold text-gray-900">1</span>
                    <button className="w-10 h-10 flex items-center justify-center hover:text-green-600 font-bold">+</button>
                 </div>
                 <button 
                  onClick={() => addToCart({ ...product, price: 24.99 })}
                  className="flex-grow bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl text-xl shadow-xl shadow-green-900/20 transition-all flex items-center justify-center space-x-3"
                 >
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                   <span>Add to Cart</span>
                 </button>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-xl transition-all">
                Buy It Now
              </button>
            </div>

            {/* Feature List */}
            <ul className="grid grid-cols-2 gap-4 pt-12">
               {[
                 { label: "100% Organic", icon: "🌱" },
                 { label: "Grain Free", icon: "🌾" },
                 { label: "High Protein", icon: "🥩" },
                 { label: "No Additives", icon: "✨" }
               ].map(item => (
                 <li key={item.label} className="flex items-center space-x-3 text-gray-500 font-bold">
                   <span className="text-2xl">{item.icon}</span>
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
