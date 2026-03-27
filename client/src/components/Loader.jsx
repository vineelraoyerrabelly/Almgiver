const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-5 py-3 shadow-soft backdrop-blur">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dceaff] border-t-[#1d52db]" />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  </div>
);

export default Loader;
