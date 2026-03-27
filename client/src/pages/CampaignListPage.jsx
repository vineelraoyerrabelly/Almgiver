import { useMemo, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import useFetch from '../hooks/useFetch';

const CampaignListPage = () => {
  const { data, loading, error } = useFetch('/campaigns', []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const campaigns = useMemo(() => {
    return (data || []).filter((campaign) => {
      const matchesQuery =
        campaign.title.toLowerCase().includes(query.toLowerCase()) ||
        campaign.description.toLowerCase().includes(query.toLowerCase());
      const deadline = new Date(campaign.deadline) >= new Date();
      const matchesStatus =
        status === 'all' || (status === 'active' ? deadline : !deadline);
      return matchesQuery && matchesStatus;
    });
  }, [data, query, status]);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
          Campaign Directory
        </p>
        <h1 className="mt-3 text-4xl font-black text-ink">Support active initiatives</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_220px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or mission"
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
          >
            <option value="all">All campaigns</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading && <Loader label="Finding campaigns" />}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default CampaignListPage;

