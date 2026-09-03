import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-cust-bg/95 backdrop-blur-md border-b border-cust-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Elysium Arena" className="h-14 w-auto" />
          <span className="text-cust-text-primary font-black text-2xl tracking-tight uppercase hidden sm:block">Elysium Arena</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-bold uppercase tracking-wide transition ${
                  active ? 'text-cust-red' : 'text-cust-text-secondary hover:text-cust-text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <button
                onClick={handleDashboard}
                className="text-cust-text-secondary hover:text-cust-text-primary text-base font-bold transition"
              >
                Halo, {user.name?.split(' ')[0]}
              </button>
              <button
                onClick={logout}
                className="border-2 border-cust-border text-cust-text-primary text-base font-bold uppercase px-6 py-3.5 hover:border-cust-red transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-cust-text-secondary hover:text-cust-text-primary text-base font-bold uppercase transition"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-cust-red hover:bg-cust-red-dark text-white text-base font-bold uppercase px-6 py-3.5 transition"
              >
                Booking Sekarang
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cust-text-primary">
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cust-border px-4 py-5 flex flex-col gap-5 bg-cust-bg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="text-cust-text-secondary hover:text-cust-text-primary text-base font-bold uppercase"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-cust-border pt-5 flex flex-col gap-4">
            {user ? (
              <>
                <button onClick={handleDashboard} className="text-left text-cust-text-primary text-base font-bold uppercase">
                  Dashboard Saya
                </button>
                <button onClick={logout} className="text-left text-cust-red text-base font-bold uppercase">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-cust-text-primary text-base font-bold uppercase">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-cust-red text-base font-bold uppercase">
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