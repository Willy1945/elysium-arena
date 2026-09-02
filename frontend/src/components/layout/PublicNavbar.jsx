import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Device', path: '/browse-devices' },
  { label: 'Game', path: '/browse-games' },
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDashboard = () => {
    if (user.role === 'CUSTOMER') navigate('/dashboard');
    else if (user.role === 'STAFF_CAFE') navigate('/cafe/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-cust-bg/95 backdrop-blur-md border-b border-cust-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Elysium Arena" className="h-10 w-auto" />
          <span className="text-cust-text-primary font-black text-lg tracking-tight uppercase hidden sm:block">Elysium Arena</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-wide transition ${
                  active ? 'text-cust-red' : 'text-cust-text-secondary hover:text-cust-text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold transition"
              >
                Halo, {user.name?.split(' ')[0]}
              </button>
              <button
                onClick={logout}
                className="border border-cust-border text-cust-text-primary text-sm font-bold uppercase px-5 py-2.5 hover:border-cust-red transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-cust-red hover:bg-cust-red-dark text-white text-sm font-bold uppercase px-5 py-2.5 transition"
              >
                Booking Sekarang
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cust-text-primary">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cust-border px-4 py-4 flex flex-col gap-4 bg-cust-bg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-cust-border pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <button onClick={handleDashboard} className="text-left text-cust-text-primary text-sm font-bold uppercase">
                  Dashboard Saya
                </button>
                <button onClick={logout} className="text-left text-cust-red text-sm font-bold uppercase">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-cust-text-primary text-sm font-bold uppercase">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-cust-red text-sm font-bold uppercase">
                  Booking Sekarang
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}