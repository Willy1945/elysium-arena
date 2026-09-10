import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Menu, X, ChevronDown, User, LogOut, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Device', path: '/browse-devices' },
  { label: 'Game', path: '/browse-games' },
  { label: 'Menu', path: '/menu' },
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-cust-bg/95 backdrop-blur-md border-b border-cust-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Elysium Arena" className="h-14 w-auto" />
            <span className="text-cust-text-primary font-black text-2xl tracking-tight uppercase hidden sm:block">
              Elysium Arena
            </span>
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 text-cust-text-primary hover:text-cust-red transition"
                >
                  <div className="w-9 h-9 rounded-full bg-cust-red flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-base font-bold">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-cust-elevated border border-cust-border shadow-xl py-2">
                    <div className="px-4 py-3 border-b border-cust-border">
                      <p className="text-cust-text-primary font-bold text-sm">{user.name}</p>
                      <p className="text-cust-text-secondary text-xs mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-cust-text-secondary hover:bg-cust-bg hover:text-cust-text-primary text-sm font-medium transition"
                    >
                      <CalendarCheck size={16} /> Dashboard Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-cust-red hover:bg-cust-bg text-sm font-medium transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-cust-text-secondary hover:text-cust-text-primary text-base font-bold uppercase transition">
                  Masuk
                </Link>
                <Link to="/register" className="bg-cust-red hover:bg-cust-red-dark text-white text-base font-bold uppercase px-6 py-3.5 transition">
                  Booking Sekarang
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cust-text-primary">
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cust-border px-4 py-5 flex flex-col gap-5 bg-cust-bg">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="text-cust-text-secondary hover:text-cust-text-primary text-base font-bold uppercase">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-cust-border pt-5 flex flex-col gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cust-red flex items-center justify-center text-white font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-cust-text-primary font-bold text-sm">{user.name}</span>
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-left text-cust-text-primary text-base font-bold uppercase flex items-center gap-2">
                  <CalendarCheck size={16} /> Dashboard Saya
                </Link>
                <button onClick={handleLogout} className="text-left text-cust-red text-base font-bold uppercase flex items-center gap-2">
                  <LogOut size={16} /> Logout
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