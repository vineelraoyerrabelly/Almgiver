import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, refreshProfile, updateProfile } = useAuth();
  const { data: donations, loading } = useFetch('/donations/user', []);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(formData);
      setFormData((prev) => ({ ...prev, password: '' }));
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[32px] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
          My profile
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">{user?.name}</h1>
        <div className="mt-4 rounded-2xl bg-brand-50 px-4 py-4 text-sm text-brand-800">
          {user?.role} · {user?.college?.name}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
            placeholder="Your name"
          />
          <input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
            placeholder="Email"
          />
          <button className="rounded-2xl bg-ink px-5 py-3 font-semibold text-white transition hover:bg-brand-700">
            Save changes
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Need to change your password? Use the forgot-password flow from the login page.
        </p>
      </section>

      <section className="rounded-[32px] bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
              Donation history
            </p>
            <h2 className="mt-3 text-3xl font-black text-ink">Your contributions</h2>
          </div>
          <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
            {donations?.length || 0} gifts
          </div>
        </div>

        {loading ? (
          <Loader label="Loading donations" />
        ) : (
          <div className="mt-6 space-y-4">
            {donations?.length ? (
              donations.map((donation) => (
                <div
                  key={donation._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {donation.campaignId?.title || 'Campaign removed'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Donor: {donation.donorName} · {donation.donorRole}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-700">
                      INR {donation.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">{donation.paymentId}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Your donation history will appear here.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
