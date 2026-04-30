export default function ContactInfoSection({ data }) {
  if (!data) return null;

  return (
    <div className="w-full lg:w-[400px] space-y-12">
      <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 space-y-12">
        {data.phone && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone</h3>
            <p className="text-xl font-black text-gray-900">{data.phone}</p>
          </div>
        )}
        {data.email && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</h3>
            <p className="text-xl font-black text-gray-900">{data.email}</p>
          </div>
        )}
        {data.address && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Address</h3>
            <p className="text-xl font-black text-gray-900 leading-relaxed italic">{data.address}</p>
          </div>
        )}
      </div>
      {data.urgentTitle && (
        <div className="bg-primary p-12 rounded-[3.5rem] text-white space-y-6">
          <h3 className="text-2xl font-black uppercase tracking-tight italic leading-tight">{data.urgentTitle}</h3>
          {data.urgentText && <p className="text-sm font-bold opacity-80 leading-relaxed">{data.urgentText}</p>}
          <button className="w-full bg-white text-primary py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 hover:text-white transition-all">
            Live Chat
          </button>
        </div>
      )}
    </div>
  );
}
