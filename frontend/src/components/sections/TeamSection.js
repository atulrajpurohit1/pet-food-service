export default function TeamSection({ data }) {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="py-20 md:py-28">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((person, i) => (
            <div key={i} className="group text-center">
              <div className="relative mb-6 mx-auto w-full max-w-[320px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a6186]/15 to-[#89B4D4]/10 rounded-[28px] rotate-3 scale-[1.02] group-hover:rotate-1 transition-transform duration-700" />
                <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-lg shadow-[#1a1a2e]/8">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
              </div>
              <h4 
                className="text-[18px] font-semibold text-[#1a1a2e] tracking-[-0.02em] mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {person.name}
              </h4>
              <p className="text-[12px] text-[#3a6186]/60 font-medium tracking-[0.05em]">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
