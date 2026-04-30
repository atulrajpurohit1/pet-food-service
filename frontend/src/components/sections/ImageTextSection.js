import Link from 'next/link';

export default function ImageTextSection({ data }) {
  if (!data) return null;
  const isLeft = data.imagePosition !== 'right';

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
          {data.image && (
            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={data.image} className="w-full h-full object-cover" alt={data.title} />
            </div>
          )}
          <div className="flex-1 space-y-8">
            {data.tag && (
              <span className="text-green-600 font-black uppercase tracking-[0.3em] text-[10px]">{data.tag}</span>
            )}
            {data.title && (
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight italic uppercase leading-tight">{data.title}</h2>
            )}
            {data.body && (
              <p className="text-gray-500 text-lg font-medium leading-relaxed">{data.body}</p>
            )}
            {data.linkLabel && (
              <Link href={data.linkHref || '#'} className="inline-block border-b-2 border-gray-900 pb-1 font-black uppercase tracking-widest text-xs hover:text-green-600 hover:border-green-600 transition-all">
                {data.linkLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
