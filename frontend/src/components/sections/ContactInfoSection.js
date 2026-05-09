export default function ContactInfoSection({ data }) {
  if (!data) return null;

  const items = [
    { label: 'Phone', value: data.phone, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )},
    { label: 'Email', value: data.email, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { label: 'Address', value: data.address, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ].filter(item => item.value);

  return (
    <div className="w-full lg:w-[400px]">
      <div className="bg-[#f7f5f2] p-8 md:p-10 rounded-[28px] border border-[#e8e4de]/60 space-y-8">
        <h3 
          className="text-[22px] font-bold text-[#1a1a2e] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Contact Info
        </h3>
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#3a6186]/8 text-[#3a6186] flex-shrink-0 group-hover:bg-[#3a6186] group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] text-[#1a1a2e]/30 font-semibold uppercase tracking-[0.1em] mb-1">{item.label}</p>
              {item.label === 'Phone' ? (
                <a href={`tel:${item.value}`} className="text-[15px] font-semibold text-[#1a1a2e] leading-relaxed hover:text-[#3a6186] transition-colors">
                  {item.value}
                </a>
              ) : item.label === 'Email' ? (
                <a href={`mailto:${item.value}`} className="text-[15px] font-semibold text-[#1a1a2e] leading-relaxed hover:text-[#3a6186] transition-colors">
                  {item.value}
                </a>
              ) : (
                <p className="text-[15px] font-semibold text-[#1a1a2e] leading-relaxed">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
