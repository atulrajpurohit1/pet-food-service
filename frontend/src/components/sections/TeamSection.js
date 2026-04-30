export default function TeamSection({ data }) {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {data.title && (
          <h2 className="text-4xl font-black text-gray-900 mb-20 uppercase tracking-tight italic">{data.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((person, i) => (
            <div key={i} className="space-y-6 group">
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{person.name}</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
