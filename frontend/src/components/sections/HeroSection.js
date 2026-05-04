import Link from 'next/link';

export default function HeroSection({ data }) {
  if (!data) return null;
  const hasImage = !!data.image;
  const hasCta = !!data.ctaPrimaryLabel;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#3a6186]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-50px] w-[400px] h-[400px] bg-[#e8985e]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 space-y-8 animate-fade-in-up">
            {data.tag && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#3a6186]/8 text-[#3a6186] rounded-full text-[11px] font-semibold uppercase tracking-[0.1em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3a6186] animate-pulse" />
                {data.tag}
              </span>
            )}
            <h1 
              className="text-[42px] md:text-[64px] lg:text-[72px] font-bold text-[#1a1a2e] leading-[1.08] tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-[16px] md:text-[18px] text-[#1a1a2e]/50 font-normal max-w-lg leading-[1.7]">
                {data.subtitle}
              </p>
            )}
            {hasCta && (
              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href={data.ctaPrimaryHref || '/categories'} 
                  className="group inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full text-[13px] font-semibold hover:bg-[#3a6186] transition-all duration-400 shadow-lg shadow-[#1a1a2e]/15"
                >
                  {data.ctaPrimaryLabel}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                {data.ctaSecondaryLabel && (
                  <Link 
                    href={data.ctaSecondaryHref || '/about'} 
                    className="inline-flex items-center gap-2 bg-transparent text-[#1a1a2e] px-8 py-3.5 rounded-full text-[13px] font-semibold border border-[#e8e4de] hover:border-[#1a1a2e]/20 hover:bg-[#1a1a2e]/3 transition-all duration-300"
                  >
                    {data.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
          
          {/* Image */}
          {hasImage && (
            <div className="flex-1 relative animate-fade-in-up delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a6186]/20 to-[#89B4D4]/20 rounded-[32px] transform rotate-3 scale-[1.02]" />
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#1a1a2e]/10">
                  <img src={data.image} alt={data.title} className="w-full object-cover aspect-[4/3]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/10 to-transparent" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
