import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const percentage = Math.min(
    100,
    Math.round((campaign.currentAmount / campaign.goalAmount) * 100 || 0)
  );

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/85 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-float">
      <div className="relative">
        <img
          src={
            campaign.image ||
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
          }
          alt={campaign.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
            {campaign.college?.name || 'College campaign'}
          </span>
          <span className="rounded-full bg-[#356ef5]/92 px-3 py-1 text-xs font-semibold text-white">
            {percentage}% funded
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold leading-tight text-ink">{campaign.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {campaign.description}
          </p>
        </div>

        <div>
          <div className="mb-3 h-2.5 rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-[#5f95ff] to-[#173fad]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-mist px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Raised</p>
              <p className="mt-1 font-semibold text-ink">
                INR {campaign.currentAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-[#dceaff] bg-[#edf4ff] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Goal</p>
              <p className="mt-1 font-semibold text-ink">
                INR {campaign.goalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} />
            Ends {new Date(campaign.deadline).toLocaleDateString()}
          </span>
          <Link
            to={`/campaigns/${campaign._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1d52db] to-[#173fad] px-4 py-2 text-sm font-semibold text-white transition hover:from-[#356ef5] hover:to-[#173fad]"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;
