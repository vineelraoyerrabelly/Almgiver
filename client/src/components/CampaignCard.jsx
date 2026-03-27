import { Link } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const percentage = Math.min(
    100,
    Math.round((campaign.currentAmount / campaign.goalAmount) * 100 || 0)
  );

  return (
    <article className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-soft transition hover:-translate-y-1">
      <img
        src={
          campaign.image ||
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
        }
        alt={campaign.title}
        className="h-52 w-full object-cover"
      />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-ink">{campaign.title}</h3>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {percentage}% funded
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {campaign.description}
        </p>
        <div>
          <div className="mb-2 h-2.5 rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-brand-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>INR {campaign.currentAmount.toLocaleString()}</span>
            <span>Goal INR {campaign.goalAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Ends {new Date(campaign.deadline).toLocaleDateString()}
          </span>
          <Link
            to={`/campaigns/${campaign._id}`}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CampaignCard;

