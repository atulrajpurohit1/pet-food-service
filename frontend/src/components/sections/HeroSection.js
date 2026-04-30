import Link from 'next/link';

export default function HeroSection({ data }) {
  if (!data) return null;
  const hasImage = !!data.image;
  const hasCta = !!data.ctaPrimaryLabel;

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            {data.tag && (
              <span className="inline-block px-4 py-1.5 bg-green-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                {data.tag}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1] italic uppercase">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-lg text-gray-500 font-medium max-w-lg leading-relaxed">{data.subtitle}</p>
            )}
            {hasCta && (
              <div className="flex flex-wrap gap-4">
                <Link href={data.ctaPrimaryHref || '/categories'} className="bg-gray-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all shadow-xl">
                  {data.ctaPrimaryLabel}
                </Link>
                {data.ctaSecondaryLabel && (
                  <Link href={data.ctaSecondaryHref || '/about'} className="border-2 border-gray-100 text-gray-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">
                    {data.ctaSecondaryLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
          {hasImage && (
            <div className="flex-1 relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="rounded-[4rem] overflow-hidden shadow-2xl">
                <img src={data.image} alt={data.title} className="w-full object-cover aspect-[4/3]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
