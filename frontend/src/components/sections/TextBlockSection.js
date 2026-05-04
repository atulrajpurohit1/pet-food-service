export default function TextBlockSection({ data }) {
  if (!data) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
        {data.title && (
          <h2 
            className="text-[30px] md:text-[38px] font-bold text-[#1a1a2e] tracking-[-0.03em] leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {data.title}
          </h2>
        )}
        {data.body && (
          <p className="text-[#1a1a2e]/50 text-[16px] leading-[1.8]">{data.body}</p>
        )}
      </div>
    </section>
  );
}
