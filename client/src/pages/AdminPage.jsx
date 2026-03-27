import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loader from '../components/Loader';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  title: '',
  description: '',
  goalAmount: '',
  deadline: '',
  image: ''
};

const AdminPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const { data: campaigns, setData: setCampaigns, loading: campaignsLoading } = useFetch('/campaigns', []);
  const { data: donations, loading: donationsLoading } = useFetch('/donations/all', []);
  const { data: users, loading: usersLoading } = useFetch('/users', []);
  const { data: stats, loading: statsLoading } = useFetch('/donations/stats/admin', []);

  useEffect(() => {
    if (!editingId) {
      setForm(initialForm);
    }
  }, [editingId]);

  const submitCampaign = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        const { data } = await api.put(`/campaigns/${editingId}`, form);
        setCampaigns((prev) => prev.map((item) => (item._id === editingId ? data : item)));
        toast.success('Campaign updated');
      } else {
        const { data } = await api.post('/campaigns', form);
        setCampaigns((prev) => [data, ...(prev || [])]);
        toast.success('Campaign created');
      }

      setEditingId('');
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save campaign');
    }
  };

  const handleEdit = (campaign) => {
    setEditingId(campaign._id);
    setForm({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      deadline: campaign.deadline.slice(0, 10),
      image: campaign.image
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((item) => item._id !== id));
      toast.success('Campaign deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete campaign');
    }
  };

  return (
    <div className="space-y-8">
      <section className="royal-shell rounded-[28px] p-6 text-white shadow-float">
        <p className="section-kicker text-sm font-semibold text-blue-100">
          Admin scope
        </p>
        <p className="mt-3 text-2xl font-black">{user?.college?.name}</p>
        <p className="mt-2 text-sm text-blue-50/85">
          This dashboard is scoped to your college only. Campaigns, users, donors,
          and totals from other colleges are hidden.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(statsLoading
          ? []
          : [
              ['Total funds', `INR ${Number(stats?.totalFunds || 0).toLocaleString()}`],
              ['Donors', stats?.totalDonors || 0],
              ['Campaigns', stats?.totalCampaigns || 0],
              ['Users', stats?.totalUsers || 0]
            ]
        ).map(([label, value]) => (
          <div key={label} className="panel rounded-[28px] p-6">
            <p className="section-kicker text-sm font-semibold text-[#1d52db]">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black text-ink">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={submitCampaign} className="panel rounded-[32px] p-8">
          <h1 className="text-3xl font-black text-ink">
            {editingId ? 'Edit campaign' : 'Create campaign'}
          </h1>
          <div className="mt-6 space-y-4">
            {[
              ['title', 'Campaign title'],
              ['goalAmount', 'Goal amount'],
              ['deadline', 'Deadline'],
              ['image', 'Image URL']
            ].map(([key, label]) => (
              <input
                key={key}
                type={key === 'deadline' ? 'date' : key === 'goalAmount' ? 'number' : 'text'}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={label}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
                required={key !== 'image'}
              />
            ))}
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the campaign impact"
              rows="6"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
              required
            />
            <button className="w-full rounded-2xl bg-gradient-to-r from-[#1d52db] to-[#173fad] px-5 py-3 font-semibold text-white transition hover:from-[#356ef5] hover:to-[#173fad]">
              {editingId ? 'Update campaign' : 'Publish campaign'}
            </button>
          </div>
        </form>

        <div className="panel rounded-[32px] p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-ink">Campaign management</h2>
            {campaignsLoading && <Loader label="Loading campaigns" />}
          </div>
          <div className="mt-6 space-y-4">
            {campaigns?.map((campaign) => (
              <div
                key={campaign._id}
                className="rounded-2xl border border-[#dceaff] bg-white/90 p-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-semibold text-slate-900">{campaign.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      INR {campaign.currentAmount.toLocaleString()} / INR{' '}
                      {campaign.goalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(campaign)}
                      className="rounded-full border border-[#dceaff] bg-[#edf4ff] px-4 py-2 text-sm font-semibold text-[#173fad]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(campaign._id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="panel rounded-[32px] p-8">
          <h2 className="text-2xl font-bold text-ink">Recent donations</h2>
          {donationsLoading || !donations ? (
            <Loader label="Loading donations" />
          ) : (
            <div className="mt-5 space-y-4">
              {donations.slice(0, 8).map((donation) => (
                <div key={donation._id} className="flex items-center justify-between rounded-2xl border border-[#dceaff] bg-[#edf4ff]/60 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">{donation.userId?.name}</p>
                    <p className="text-sm text-slate-500">{donation.campaignId?.title}</p>
                    <p className="text-xs text-slate-500">
                      {donation.userId?.email} · {donation.donorRole} · {donation.donorCollegeName}
                    </p>
                  </div>
                  <p className="font-semibold text-[#173fad]">
                    INR {donation.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel rounded-[32px] p-8">
          <h2 className="text-2xl font-bold text-ink">Users</h2>
          {usersLoading || !users ? (
            <Loader label="Loading users" />
          ) : (
            <div className="mt-5 space-y-4">
              {users.slice(0, 10).map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded-2xl border border-[#dceaff] bg-white/90 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                    <p className="text-xs text-slate-500">{member.college?.name}</p>
                  </div>
                  <span className="rounded-full border border-[#dceaff] bg-[#edf4ff] px-3 py-1 text-xs font-semibold uppercase text-[#173fad]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
