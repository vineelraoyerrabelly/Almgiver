import { ArrowRight, HandCoins, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const HomePage = () => {
  const { user } = useAuth();
  const { data: campaigns, loading } = useFetch(user ? '/campaigns' : null, [user?._id]);
  const featured = campaigns?.slice(0, 3) || [];

  return (
    <div className="space-y-16">
      <section className="royal-shell grid gap-10 overflow-hidden rounded-[40px] px-8 py-10 text-white shadow-float lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-12">
        <div className="space-y-7">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur">
            Project Almgiver · Go-Live college fundraising platform
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-[0.95] sm:text-5xl lg:text-6xl">
            Where Alumni Give Back with Purpose
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Every institution runs inside its own trusted fundraising space, with
            private campaign visibility, role-based access, donor transparency, and
            payment-ready operations for a real go-live rollout.
          </p>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ['Private by college', 'No cross-campus visibility'],
              ['Donor transparency', 'Clear history and admin insights'],
              ['Payment ready', 'Razorpay-backed contribution flow']
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#356ef5] to-[#173fad] px-6 py-3 font-semibold text-white transition hover:from-[#5f95ff] hover:to-[#1d52db]"
            >
              {user ? 'Explore My College Campaigns' : 'Login To View Campaigns'}
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              Become a Donor
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-[34px] border border-white/12 bg-white/10 p-6 backdrop-blur">
          {[
            ['Secure donations', 'JWT auth, protected admin tools, and Razorpay test flow.', ShieldCheck],
            ['Campaign visibility', 'Search, progress bars, and live totals keep supporters informed.', Sparkles],
            ['Actionable dashboards', 'Track funds raised, donors, campaigns, and gift history.', HandCoins]
          ].map(([title, text, Icon]) => (
            <div
              key={title}
              className="rounded-[26px] border border-white/10 bg-gradient-to-br from-blue-400/12 to-white/5 p-5"
            >
              <Icon className="mb-4 text-blue-200" />
              <h3 className="mb-2 text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-kicker text-sm font-semibold text-[#1d52db]">
              {user ? `${user.college?.name} live campaigns` : 'Launch-ready access'}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink">
              {user
                ? 'Support live initiatives for your college community'
                : 'Sign in to enter your college fundraising workspace'}
            </h2>
          </div>
          {user && (
            <Link to="/campaigns" className="text-sm font-semibold text-[#173fad]">
              View all campaigns
            </Link>
          )}
        </div>

        {!user ? (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="panel rounded-[32px] p-8">
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Project Almgiver is designed for go-live deployment. Register under
                your college to access the right campus workspace, browse live
                campaigns, and keep administration restricted to your institution.
              </p>
            </div>
            <div className="panel rounded-[32px] p-8">
              <p className="section-kicker text-sm font-semibold text-[#1d52db]">
                What you get
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>Students can browse and follow live campaigns before giving.</p>
                <p>Alumni can donate with transparent campaign progress and donor history.</p>
                <p>Admins manage only their own college’s campaigns, users, and donations.</p>
              </div>
            </div>
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
          <div className="panel rounded-[32px] p-8 text-slate-600">
            No campaigns have been published for your college yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
