const Loader = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center py-10">
    <div className="rounded-full border-4 border-brand-100 border-t-brand-600 h-10 w-10 animate-spin" />
    <span className="ml-3 text-sm font-medium text-slate-600">{label}</span>
  </div>
);

export default Loader;

