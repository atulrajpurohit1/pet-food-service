import Link from 'next/link';

export default function BannerSection({ data }) {
  if (!data) return null;
  return (
    <section className="py-24 relative overflow-hidden bg-gray-900">
      {data.image && <img src={data.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />}
      <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
        {data.title && (
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase">{data.title}</h2>
        )}
        {data.subtitle && (
          <p className="text-gray-300 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto leading-relaxed">{data.subtitle}</p>
        )}
        {data.ctaLabel && (
          <Link href={data.ctaHref || '#'} className="inline-block bg-white text-gray-900 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-green-600 hover:text-white transition-all shadow-xl">
            {data.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
