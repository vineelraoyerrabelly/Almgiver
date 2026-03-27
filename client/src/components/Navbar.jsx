import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-600 p-2 text-white shadow-soft">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">Almgiver</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Project Almgiver
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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
              <div className="hidden rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 sm:block">
                {user.name} · {user.college?.name}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
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
