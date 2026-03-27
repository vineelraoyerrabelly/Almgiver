import { Search, SlidersHorizontal } from 'lucide-react';
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
      <div className="panel rounded-[36px] p-8">
        <p className="section-kicker text-sm font-semibold text-[#1d52db]">
          My college campaigns
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-ink">Support your own campus initiatives</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Discover live campaigns, filter by status, and move from browsing to
              donating without leaving your college workspace.
            </p>
          </div>
          <div className="rounded-full border border-[#dceaff] bg-[#edf4ff] px-4 py-2 text-sm font-semibold text-[#173fad]">
            {campaigns.length} matching campaigns
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-[28px] bg-[#edf4ff]/80 p-4 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your college campaigns"
              className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 outline-none transition focus:border-[#5f95ff]"
            />
          </label>

          <label className="relative block">
            <SlidersHorizontal
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-11 py-3 outline-none transition focus:border-[#5f95ff]"
            >
              <option value="all">All campaigns</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <Loader label="Finding campaigns" />}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>}

      {campaigns.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="panel rounded-[32px] p-8 text-slate-600">
            No campaigns match your current search and filter combination.
          </div>
        )
      )}
    </div>
  );
};

export default CampaignListPage;
