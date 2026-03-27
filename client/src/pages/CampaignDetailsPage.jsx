import {
  CalendarDays,
  CircleDollarSign,
  Landmark,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: campaign, loading, error } = useFetch(`/campaigns/${id}`, [id]);
  const [amount, setAmount] = useState(1000);
  const [processing, setProcessing] = useState(false);

  const handleDonate = async () => {
    if (!user) {
      toast.error('Please login to donate');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Unable to load Razorpay checkout');
      return;
    }

    try {
      setProcessing(true);
      const { data } = await api.post('/donations/create-order', {
        campaignId: id,
        amount
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Almgiver',
        description: data.campaign.title,
        order_id: data.order.id,
        handler: async (response) => {
          await api.post('/donations', {
            campaignId: id,
            amount,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });

          toast.success('Donation completed successfully');
          window.location.reload();
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#1d52db'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation could not be processed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader label="Loading campaign details" />;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>;
  if (!campaign) return null;

  const percentage = Math.min(
    100,
    Math.round((campaign.currentAmount / campaign.goalAmount) * 100 || 0)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/70 shadow-float">
          <img
            src={
              campaign.image ||
              'https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=1600&q=80'
            }
            alt={campaign.title}
            className="h-[360px] w-full object-cover"
          />
          <div className="grid gap-4 border-t border-slate-100 bg-white/92 p-6 sm:grid-cols-3">
            {[
              ['Raised', `INR ${campaign.currentAmount.toLocaleString()}`, CircleDollarSign],
              ['Goal', `INR ${campaign.goalAmount.toLocaleString()}`, Landmark],
              ['Supporters', `${campaign.recentDonations?.length || 0} recent donors`, Users]
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-[24px] bg-slate-50 px-4 py-4">
                <Icon size={18} className="text-[#1d52db]" />
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-[32px] p-8">
          <h1 className="text-4xl font-black text-ink">{campaign.title}</h1>
          <p className="section-kicker mt-3 text-sm font-semibold text-[#1d52db]">
            {campaign.college?.name}
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">{campaign.description}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="panel rounded-[32px] p-8">
          <p className="section-kicker text-sm font-semibold text-[#1d52db]">
            Campaign progress
          </p>
          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#5f95ff] to-[#173fad]"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-ink">
                INR {campaign.currentAmount.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                raised of INR {campaign.goalAmount.toLocaleString()}
              </p>
            </div>
            <p className="rounded-full bg-[#edf4ff] px-4 py-2 text-sm font-semibold text-[#173fad]">
              {percentage}% complete
            </p>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sand px-4 py-3 text-sm text-slate-600">
            <CalendarDays size={16} />
            Deadline: {new Date(campaign.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="panel rounded-[32px] p-8">
          <h2 className="text-2xl font-bold text-ink">Make a donation</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {[500, 1000, 2500, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  amount === preset
                    ? 'bg-[#1d52db] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#edf4ff] hover:text-[#173fad]'
                }`}
              >
                INR {preset.toLocaleString()}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Donation amount (INR)
            </span>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
            />
          </label>

          <button
            type="button"
            onClick={handleDonate}
            disabled={processing}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#1d52db] to-[#173fad] px-5 py-3 font-semibold text-white transition hover:from-[#356ef5] hover:to-[#173fad] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? 'Preparing payment...' : 'Donate with Razorpay'}
          </button>
        </div>

        <div className="panel rounded-[32px] p-8">
          <h2 className="text-xl font-bold text-ink">Recent donations</h2>
          <div className="mt-4 space-y-3">
            {campaign.recentDonations?.length ? (
              campaign.recentDonations.map((donation) => (
                <div
                  key={donation._id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{donation.donorName}</p>
                    <p className="text-xs text-slate-500">
                      {donation.donorRole} · {donation.donorCollegeName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-semibold text-[#173fad]">
                    INR {donation.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Be the first donor for this campaign.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CampaignDetailsPage;
