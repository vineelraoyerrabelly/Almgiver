import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

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
          color: '#607631'
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
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-6">
        <img
          src={
            campaign.image ||
            'https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=1600&q=80'
          }
          alt={campaign.title}
          className="h-[360px] w-full rounded-[32px] object-cover shadow-soft"
        />
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <h1 className="text-4xl font-black text-ink">{campaign.title}</h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
            {campaign.college?.name}
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">{campaign.description}</p>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
            Campaign progress
          </p>
          <div className="mt-5 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-brand-500" style={{ width: `${percentage}%` }} />
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
            <p className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              {percentage}% complete
            </p>
          </div>
          <div className="mt-6 rounded-2xl bg-sand p-4 text-sm text-slate-600">
            Deadline: {new Date(campaign.deadline).toLocaleDateString()}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">Make a donation</h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Donation amount (INR)
            </span>
            <input
              type="number"
              min="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
            />
          </label>
          <button
            type="button"
            onClick={handleDonate}
            disabled={processing}
            className="mt-5 w-full rounded-2xl bg-ink px-5 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? 'Preparing payment...' : 'Donate with Razorpay'}
          </button>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Recent donations</h2>
          <div className="mt-4 space-y-3">
            {campaign.recentDonations?.length ? (
              campaign.recentDonations.map((donation) => (
                <div
                  key={donation._id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
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
                  <p className="font-semibold text-brand-700">
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
