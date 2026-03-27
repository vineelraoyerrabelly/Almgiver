import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode = 'login' }) => {
  const isRegister = mode === 'register';
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    role: 'alumni',
    adminRegistrationKey: ''
  });
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    if (!isRegister) {
      return;
    }

    api
      .get('/colleges')
      .then(({ data }) => setColleges(data))
      .catch(() => setColleges([]));
  }, [isRegister]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const action = isRegister ? register : login;
      const payload = isRegister
        ? formData
        : { email: formData.email, password: formData.password };
      const user = await action(payload);
      toast.success(isRegister ? 'Account created successfully' : 'Welcome back');
      navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/dashboard'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white/85 shadow-float lg:grid-cols-2">
      <div className="royal-shell px-8 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">
          Almgiver
        </p>
        <h1 className="mt-4 text-4xl font-black">
          {isRegister ? 'Join your alumni network' : 'Welcome back'}
        </h1>
        <p className="mt-4 max-w-md text-slate-300">
          Join your college space, browse only your campus campaigns, and support
          fundraising with student, alumni, and admin access tailored to your role.
        </p>
        <div className="mt-8 space-y-4">
          {[
            'College-specific campaign visibility',
            'Royal-blue go-live fundraising workspace',
            'Secure alumni, student, and admin access'
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-blue-50"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white/90 px-8 py-10 backdrop-blur sm:px-10">
        {isRegister && (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
              placeholder="Ananya Rao"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
            placeholder="alumni@example.edu"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
          <input
            required
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
            placeholder="••••••••"
          />
        </label>
        {isRegister && (
          <>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                College name
              </span>
              <input
                required
                list="college-options"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
                placeholder="Enter your college name"
              />
              <datalist id="college-options">
                {colleges.map((college) => (
                  <option key={college._id} value={college.name} />
                ))}
              </datalist>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Account role</span>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            {formData.role === 'admin' && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Admin registration key
                </span>
                <input
                  required
                  value={formData.adminRegistrationKey}
                  onChange={(e) =>
                    setFormData({ ...formData, adminRegistrationKey: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#5f95ff]"
                  placeholder="Enter the shared admin key"
                />
              </label>
            )}
          </>
        )}
        <button
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-[#1d52db] to-[#173fad] px-5 py-3 font-semibold text-white transition hover:from-[#356ef5] hover:to-[#173fad] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
        </button>
        <p className="text-sm text-slate-500">
          {isRegister ? 'Already have an account?' : 'Need a new account?'}{' '}
          <Link
            to={isRegister ? '/login' : '/register'}
            className="font-semibold text-[#173fad]"
          >
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>
        {!isRegister && (
          <p className="text-sm text-slate-500">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="font-semibold text-[#173fad]">
              Reset it here
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthPage;
