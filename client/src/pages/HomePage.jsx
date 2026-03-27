import { ArrowRight, HandCoins, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const { user } = useAuth();
  const { data: campaigns, loading } = useFetch(user ? '/campaigns' : null, [user?._id]);
  const featured = campaigns?.slice(0, 3) || [];

  return (
    <div className="space-y-14">
      <section className="grid gap-10 overflow-hidden rounded-[36px] bg-ink px-8 py-12 text-white shadow-soft lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-brand-100">
            Project Almgiver · Go-Live college fundraising platform
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Where Alumni Give Back with Purpose
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Every institution runs inside its own trusted fundraising space, with
            private campaign visibility, role-based access, donor transparency, and
            payment-ready operations for a real go-live rollout.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-400"
            >
              {user ? 'Explore My College Campaigns' : 'Login To View Campaigns'}
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-white/50"
            >
              Become a Donor
            </Link>
          </div>
        </div>
        <div className="grid gap-4 rounded-[30px] bg-white/10 p-6">
          {[
            ['Secure donations', 'JWT auth, protected admin tools, and Razorpay test flow.', ShieldCheck],
            ['Campaign visibility', 'Search, progress bars, and live totals keep supporters informed.', Sparkles],
            ['Actionable dashboards', 'Track funds raised, donors, campaigns, and gift history.', HandCoins]
          ].map(([title, text, Icon]) => (
            <div key={title} className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <Icon className="mb-4 text-brand-200" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
              {user ? `${user.college?.name} live campaigns` : 'Launch-ready access'}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              {user
                ? 'Support live initiatives for your college community'
                : 'Sign in to enter your college fundraising workspace'}
            </h2>
          </div>
          {user && (
            <Link to="/campaigns" className="text-sm font-semibold text-brand-700">
              View all campaigns
            </Link>
          )}
        </div>

        {!user ? (
          <div className="rounded-[32px] bg-white p-8 shadow-soft">
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Project Almgiver is designed for go-live deployment. Register under
              your college to access the right campus workspace, browse live
              campaigns, and keep administration restricted to your institution.
            </p>
          </div>
        ) : loading ? (
          <Loader label="Loading campaigns" />
        ) : featured.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] bg-white p-8 shadow-soft text-slate-600">
            No campaigns have been published for your college yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
