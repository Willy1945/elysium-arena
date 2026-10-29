import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, User, LogOut,
  CalendarCheck, Gift, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../common/UserAvatar';

const NAV_LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Device', path: '/browse-devices' },
  { label: 'Game', path: '/browse-games' },
  { label: 'Menu', path: '/menu' },
  { label: 'Kontak', path: '/contact' },
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const hasDarkHero = ['/', '/browse-devices', '/browse-games', '/menu', '/contact', '/kontak', '/feedback'].includes(location.pathname);
  const isDarkHeader = hasDarkHero && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isDarkHeader
          ? 'bg-black/35 backdrop-blur-md border-b border-white/10 text-white py-2'
          : scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-zinc-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.06)] py-1 text-zinc-950'
          : 'bg-white/90 backdrop-blur-md border-b border-zinc-200/70 py-2 text-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src="/images/logoElysiumFix.png"
                alt="Elysium Arena"
                className="h-11 w-auto transition-transform duration-300 drop-shadow-sm"
              />
              <div className="absolute inset-0 rounded-full bg-cust-red/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className={`font-black text-xl tracking-tight uppercase leading-none font-display group-hover:text-cust-red transition-colors ${
                isDarkHeader ? 'text-white' : 'text-zinc-950'
              }`}>
                Elysium Arena
              </span>
              <span className="text-[10px] font-mono-tech text-cust-red font-bold uppercase tracking-widest mt-0.5">
                Surga Para Gamer
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">

            <nav className="flex items-center gap-5 lg:gap-7">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 text-xs lg:text-[13px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                      active
                        ? 'text-cust-red font-black'
                        : isDarkHeader
                        ? 'text-white/80 hover:text-white'
                        : 'text-zinc-600 hover:text-cust-red'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cust-red rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className={`h-5 w-px ${isDarkHeader ? 'bg-white/20' : 'bg-zinc-200'}`} />

            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      dropdownOpen
                        ? isDarkHeader
                          ? 'bg-white/20 border-white/40 text-white'
                          : 'bg-zinc-100 border-cust-red/40 text-zinc-950'
                        : isDarkHeader
                        ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300 shadow-xs'
                    }`}
                  >
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      className="w-7 h-7 rounded-md object-cover border border-zinc-200"
                      fallbackClassName="w-7 h-7 rounded-md bg-gradient-to-br from-cust-red to-cust-red-dark flex items-center justify-center text-white font-bold text-xs shadow-xs"
                    />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {user.name?.split(' ')[0]}
                    </span>
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className={isDarkHeader ? 'text-white/70' : 'text-zinc-500'} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] py-2 overflow-hidden z-50 text-zinc-900"
                      >
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <p className="text-zinc-900 font-bold text-xs uppercase tracking-wide">{user.name}</p>
                          <p className="text-zinc-500 text-[11px] font-mono-tech mt-0.5 truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition"
                          >
                            <CalendarCheck size={14} className="text-cust-red" />
                            <span>Dashboard Saya</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition"
                          >
                            <User size={14} className="text-cust-red" />
                            <span>Edit Profil</span>
                          </Link>
                          <Link
                            to="/rewards"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition"
                          >
                            <Gift size={14} className="text-amber-500" />
                            <span>Reward Saya</span>
                          </Link>
                        </div>

                        <div className="border-t border-zinc-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-red hover:bg-red-50 transition font-medium cursor-pointer"
                          >
                            <LogOut size={14} />
                            <span>Keluar Akun</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className={`text-xs font-black uppercase tracking-wider px-3 py-2 transition ${
                      isDarkHeader
                        ? 'text-white hover:text-cust-red'
                        : 'text-zinc-800 hover:text-cust-red'
                    }`}
                  >
                    Masuk
                  </Link>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-lg transition shadow-[0_4px_16px_rgba(227,30,36,0.35)] hover:shadow-[0_6px_22px_rgba(227,30,36,0.5)]"
                    >
                      <Sparkles size={13} />
                      <span>Booking Sekarang</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg border transition-colors ${
              isDarkHeader
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-zinc-100 border-zinc-200 text-zinc-800'
            }`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto bg-white/95 backdrop-blur-2xl border-b border-zinc-200 px-5 py-5 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition ${
                      active
                        ? 'bg-red-50 text-cust-red border border-red-200'
                        : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-zinc-200 mt-4 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200 mb-1">
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      className="w-8 h-8 rounded-md object-cover"
                      fallbackClassName="w-8 h-8 rounded-md bg-cust-red flex items-center justify-center text-white font-bold text-xs"
                    />
                    <div>
                      <p className="text-zinc-900 font-bold text-xs">{user.name}</p>
                      <p className="text-zinc-500 text-[10px] font-mono-tech">{user.email}</p>
                    </div>
                  </div>

                  <Link to="/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 flex items-center gap-2.5">
                    <CalendarCheck size={14} className="text-cust-red" /> Dashboard Saya
                  </Link>
                  <Link to="/profile" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 flex items-center gap-2.5">
                    <User size={14} className="text-cust-red" /> Edit Profil
                  </Link>
                  <Link to="/rewards" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 flex items-center gap-2.5">
                    <Gift size={14} className="text-amber-500" /> Reward Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-cust-red bg-red-50 border border-red-200 rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Keluar Akun
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-lg hover:bg-zinc-200 transition"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-cust-red hover:bg-cust-red-dark rounded-lg shadow-[0_4px_16px_rgba(227,30,36,0.25)]"
                  >
                    Booking Sekarang
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
