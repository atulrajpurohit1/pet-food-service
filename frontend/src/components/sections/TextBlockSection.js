export default function TextBlockSection({ data }) {
  if (!data) return null;
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {data.title && (
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight italic">{data.title}</h2>
        )}
        {data.body && (
          <p className="text-gray-500 text-lg font-medium leading-relaxed">{data.body}</p>
        )}
      </div>
    </section>
  );
}
