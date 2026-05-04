export default function TestimonialsSection({ data }) {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div 
              key={i} 
              className="group card-hover bg-white p-8 rounded-[24px] border border-[#e8e4de]/60 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 text-[60px] leading-none text-[#3a6186]/8 font-serif pointer-events-none">&ldquo;</div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-[#e8985e]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-[#1a1a2e]/60 text-[15px] leading-[1.7] mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#e8e4de]/40">
                {t.image && (
                  <img src={t.image} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f7f5f2]" alt={t.name} />
                )}
                <div>
                  <p className="font-semibold text-[#1a1a2e] text-[13px] tracking-[-0.01em]">{t.name}</p>
                  <p className="text-[11px] text-[#1a1a2e]/35 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
