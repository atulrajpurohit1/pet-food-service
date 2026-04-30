export default function CardsGridSection({ data }) {
  if (!data) return null;
  const items = data.items || [];
  const hasIcons = items.some(i => i.icon);
  // If items have no icons, use the large mission/vision card style
  const useLargeStyle = !hasIcons && items.length <= 2;

  return (
    <section className={`py-24 ${hasIcons ? 'bg-gray-50/50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        {data.title && (
          <h2 className="text-4xl font-black text-gray-900 mb-20 tracking-tight italic uppercase">{data.title}</h2>
        )}
        <div className={`grid grid-cols-1 ${useLargeStyle ? 'md:grid-cols-2' : items.length <= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-8`}>
          {items.map((item, i) => (
            <div key={i} className={`${useLargeStyle ? 'p-16 text-left' : 'p-12'} bg-white border border-gray-100 rounded-[3rem] space-y-6 shadow-sm hover:shadow-xl transition-all`}>
              {item.icon && <div className="text-4xl">{item.icon}</div>}
              {item.title && (
                <h3 className={`font-black text-gray-900 uppercase tracking-tight ${useLargeStyle ? 'text-2xl italic' : 'text-xs tracking-widest'}`}>{item.title}</h3>
              )}
              {item.description && (
                <p className={`${useLargeStyle ? 'text-gray-500 font-medium leading-relaxed' : 'text-[10px] text-gray-400 font-bold leading-relaxed'}`}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
