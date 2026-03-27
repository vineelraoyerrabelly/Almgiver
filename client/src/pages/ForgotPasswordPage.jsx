import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const { forgotPassword, resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleGenerateCode = async (event) => {
    event.preventDefault();
    try {
      const data = await forgotPassword({ email: formData.email });
      setFormData((prev) => ({ ...prev, resetToken: data.resetToken }));
      setStep(2);
      toast.success(`Reset code generated: ${data.resetToken}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to generate reset code');
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        resetToken: formData.resetToken,
        newPassword: formData.newPassword
      });
      toast.success('Password updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-600">
        Password reset
      </p>
      <h1 className="mt-4 text-4xl font-black text-ink">Reset access without profile prompts</h1>
      <p className="mt-4 text-base leading-8 text-slate-600">
        Password changes now happen only through this reset flow. Start with your
        email, then use the generated reset code to create a new password.
      </p>

      <form
        onSubmit={step === 1 ? handleGenerateCode : handleReset}
        className="mt-8 space-y-4"
      >
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
          placeholder="Email address"
        />

        {step === 2 && (
          <>
            <input
              required
              value={formData.resetToken}
              onChange={(e) => setFormData({ ...formData, resetToken: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
              placeholder="Reset code"
            />
            <input
              required
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
              placeholder="New password"
            />
            <input
              required
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-400"
              placeholder="Confirm new password"
            />
          </>
        )}

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-ink px-5 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Please wait...'
            : step === 1
              ? 'Generate reset code'
              : 'Reset password'}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-500">
        Back to{' '}
        <Link to="/login" className="font-semibold text-brand-700">
          login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
