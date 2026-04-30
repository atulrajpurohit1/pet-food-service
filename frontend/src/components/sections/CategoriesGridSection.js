import Link from 'next/link';

export default function CategoriesGridSection({ data }) {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="py-24 bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {data.title && (
          <h2 className="text-4xl font-black text-gray-900 mb-16 tracking-tight italic uppercase">{data.title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((cat, i) => (
            <Link href="/categories" key={i} className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all">
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight mb-2">{cat.name}</h3>
              {cat.subtitle && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cat.subtitle}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
