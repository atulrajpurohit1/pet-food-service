export default function CardsGridSection({ data }) {
  if (!data) return null;
  const items = (data.items || []).map(item => {
    if (item.title?.toUpperCase() === 'ORGANIC FOOD') return { ...item, image: '/organic-food.png' };
    if (item.title?.toUpperCase() === 'TOYS') return { ...item, image: '/toys.png' };
    return item;
  });
  const hasIcons = items.some(i => i.icon);
  const useLargeStyle = !hasIcons && items.length <= 2;

  return (
    <section className={`py-20 md:py-28 ${hasIcons ? 'bg-[#f7f5f2]/60' : ''}`}>
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
        <div className={`grid grid-cols-1 ${useLargeStyle ? 'md:grid-cols-2' : items.length <= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-6`}>
          {items.map((item, i) => (
            <div 
              key={i} 
              className={`group card-hover bg-white border border-[#e8e4de]/60 rounded-[24px] overflow-hidden ${
                useLargeStyle ? 'p-10 md:p-12' : 'p-8'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item.image ? (
                <div className="w-full h-48 mb-6 rounded-[16px] overflow-hidden bg-[#f7f5f2]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : item.icon && item.icon.length <= 4 ? (
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#3a6186]/8 text-2xl mb-5">
                  {item.icon}
                </div>
              ) : null}
              {item.title && (
                <h3 className={`font-semibold text-[#1a1a2e] tracking-[-0.02em] ${
                  useLargeStyle 
                    ? 'text-[22px] mb-4' 
                    : 'text-[15px] mb-3'
                }`} style={{ fontFamily: useLargeStyle ? "'Playfair Display', Georgia, serif" : undefined }}>
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className={`leading-relaxed ${
                  useLargeStyle 
                    ? 'text-[15px] text-[#1a1a2e]/50' 
                    : 'text-[13px] text-[#1a1a2e]/40'
                }`}>
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
