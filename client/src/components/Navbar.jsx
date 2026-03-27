import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, HeartHandshake, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-[#dceaff] text-[#173fad] shadow-sm'
      : 'text-slate-600 hover:bg-[#edf4ff] hover:text-[#1d52db]'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#dceaff] bg-white/90 px-4 py-4 shadow-float backdrop-blur sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#5f95ff] via-[#356ef5] to-[#173fad] p-2.5 text-white shadow-soft">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">Almgiver</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Project Almgiver
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[#dceaff] bg-[#edf4ff]/90 px-3 py-2 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/campaigns" className={navClass}>
            Campaigns
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-[#dceaff] bg-[#edf4ff] px-4 py-2 text-sm font-medium text-[#173fad] sm:flex">
                <Sparkles size={14} />
                {user.name} · {user.college?.name}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#dceaff] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#93bbff] hover:text-[#1d52db]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#dceaff] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#93bbff] hover:text-[#1d52db]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1d52db] to-[#173fad] px-4 py-2 text-sm font-semibold text-white transition hover:from-[#356ef5] hover:to-[#173fad]"
              >
                <HeartHandshake size={16} />
                Join & Give
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
