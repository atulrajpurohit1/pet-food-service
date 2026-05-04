import Link from 'next/link';

export default function BannerSection({ data }) {
  if (!data) return null;
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#252542] to-[#1a1a2e]" />
      
      {/* Image overlay */}
      {data.image && (
        <img src={data.image} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="" />
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3a6186]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center space-y-8">
        {data.title && (
          <h2 
            className="text-[32px] md:text-[44px] font-bold text-white tracking-[-0.03em] leading-[1.15]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="text-white/50 text-[15px] max-w-xl mx-auto leading-[1.7]">{data.subtitle}</p>
        )}
        {data.ctaLabel && (
          <div className="pt-2">
            <Link 
              href={data.ctaHref || '#'} 
              className="group inline-flex items-center gap-2 bg-white text-[#1a1a2e] px-8 py-3.5 rounded-full text-[13px] font-semibold hover:bg-[#89B4D4] hover:text-white transition-all duration-400 shadow-lg shadow-black/20"
            >
              {data.ctaLabel}
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
