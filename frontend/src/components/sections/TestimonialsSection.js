export default function TestimonialsSection({ data }) {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {data.title && (
          <h2 className="text-4xl font-black text-gray-900 mb-20 tracking-tight italic uppercase">{data.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {items.map((t, i) => (
            <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 space-y-6">
              <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600 font-medium leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                {t.image && <img src={t.image} className="w-10 h-10 rounded-full object-cover" alt={t.name} />}
                <div>
                  <p className="font-black text-gray-900 uppercase tracking-tight text-xs">{t.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
