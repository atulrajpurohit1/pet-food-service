import Link from 'next/link';

export default function ImageTextSection({ data }) {
  if (!data) return null;
  const isLeft = data.imagePosition !== 'right';

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          {/* Image */}
          {data.image && (
            <div className="flex-1 relative animate-fade-in-up">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${isLeft ? 'from-[#3a6186]/15 to-[#89B4D4]/10' : 'from-[#e8985e]/15 to-[#f2c078]/10'} rounded-[28px] ${isLeft ? 'rotate-2' : '-rotate-2'} scale-[1.03]`} />
                <div className="relative rounded-[28px] overflow-hidden shadow-xl shadow-[#1a1a2e]/8">
                  <img src={data.image} className="w-full h-full object-cover" alt={data.title} />
                </div>
              </div>
            </div>
          )}
          
          {/* Text */}
          <div className="flex-1 space-y-6 animate-fade-in-up delay-200">
            {data.tag && (
              <span className="inline-flex items-center gap-2 text-[#3a6186] font-semibold uppercase tracking-[0.15em] text-[11px]">
                <span className="w-8 h-[1.5px] bg-[#3a6186]/40" />
                {data.tag}
              </span>
            )}
            {data.title && (
              <h2 
                className="text-[30px] md:text-[40px] font-bold text-[#1a1a2e] tracking-[-0.03em] leading-[1.15]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {data.title}
              </h2>
            )}
            {data.body && (
              <p className="text-[#1a1a2e]/50 text-[16px] leading-[1.8]">{data.body}</p>
            )}
            {data.linkLabel && (
              <Link 
                href={data.linkHref || '#'} 
                className="group inline-flex items-center gap-2 text-[#3a6186] font-semibold text-[13px] pt-2 hover:gap-3 transition-all duration-300"
              >
                {data.linkLabel}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
