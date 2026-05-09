import Link from 'next/link';

export default function CategoriesGridSection({ data }) {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="py-20 md:py-28 bg-[#f7f5f2]/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {data.title && (
          <div className="text-center mb-16">
            <h2 
              className="text-[32px] md:text-[40px] font-bold text-[#1a1a2e] tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {data.title}
            </h2>
            <div className="w-12 h-[2px] bg-[#3a6186]/30 mx-auto mt-6" />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((cat, i) => (
            <Link 
              href={`/categories/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w-]+/g, '')}`} 
              key={i} 
              className="group card-hover bg-white rounded-[24px] border border-[#e8e4de]/60 overflow-hidden block cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" 
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-[#1a1a2e] text-[15px] tracking-[-0.02em] mb-1">{cat.name}</h3>
                {cat.subtitle && (
                  <p className="text-[12px] text-[#1a1a2e]/35 font-medium">{cat.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
