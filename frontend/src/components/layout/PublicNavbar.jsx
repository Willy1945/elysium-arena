import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, User, LogOut,
  CalendarCheck, MessageSquarePlus, Gift, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Efek glassmorphism dinamis saat discroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup mobile menu saat pindah rute
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] py-1'
          : 'bg-[#0a0a0c]/60 backdrop-blur-md border-b border-white/[0.04] py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo dengan efek glow */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src="/images/logo.png"
                alt="Elysium Arena"
                className="h-11 w-auto transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-cust-red/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-black text-xl tracking-tight uppercase leading-none font-display">
                Elysium Arena
              </span>
              <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest mt-0.5">
                Gaming Center
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links dengan Animated Pill Indicator */}
          <nav className="hidden md:flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.06]">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 z-10 ${
                    active ? 'text-white' : 'text-cust-text-secondary hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/[0.08] border border-cust-red/40 rounded-lg -z-0 shadow-[0_0_15px_rgba(227,30,36,0.25)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: User Dropdown / Auth CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                    dropdownOpen
                      ? 'bg-white/[0.08] border-cust-red/40 text-white'
                      : 'bg-white/[0.03] border-white/[0.08] text-cust-text-secondary hover:text-white hover:border-white/[0.15]'
                  }`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-md object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cust-red to-cust-red-dark flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(227,30,36,0.3)]">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {user.name?.split(' ')[0]}
                  </span>
                  <motion.div
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </motion.button>

                {/* Animated Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-2 w-60 bg-[#121215]/95 backdrop-blur-2xl border border-white/[0.1] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.7)] py-2 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.08]">
                        <p className="text-white font-bold text-xs uppercase tracking-wide">{user.name}</p>
                        <p className="text-cust-text-secondary text-[11px] font-mono-tech mt-0.5 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-text-secondary hover:text-white hover:bg-white/[0.05] transition"
                        >
                          <CalendarCheck size={14} className="text-cust-red" />
                          <span>Dashboard Saya</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-text-secondary hover:text-white hover:bg-white/[0.05] transition"
                        >
                          <User size={14} className="text-cust-red" />
                          <span>Edit Profil</span>
                        </Link>
                        <Link
                          to="/rewards"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-text-secondary hover:text-white hover:bg-white/[0.05] transition"
                        >
                          <Gift size={14} className="text-amber-400" />
                          <span>Reward Saya</span>
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-text-secondary hover:text-white hover:bg-white/[0.05] transition"
                        >
                          <MessageSquarePlus size={14} className="text-cust-red" />
                          <span>Kirim Masukan</span>
                        </Link>
                      </div>

                      <div className="border-t border-white/[0.08] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-cust-red hover:bg-cust-red/10 transition font-medium"
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
                  className="text-xs font-bold uppercase tracking-wider text-cust-text-secondary hover:text-white px-3 py-2 transition"
                >
                  Masuk
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition shadow-[0_0_20px_rgba(227,30,36,0.35)] hover:shadow-[0_0_25px_rgba(227,30,36,0.55)]"
                  >
                    <Sparkles size={13} />
                    <span>Booking Sekarang</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#0c0c0e]/95 backdrop-blur-2xl border-b border-white/[0.08] px-5 py-5 shadow-2xl"
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
                        ? 'bg-cust-red/15 text-cust-red border border-cust-red/30'
                        : 'text-cust-text-secondary hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/[0.08] mt-4 pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/[0.06] mb-1">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-md object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-cust-red flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-bold text-xs">{user.name}</p>
                      <p className="text-cust-text-secondary text-[10px] font-mono-tech">{user.email}</p>
                    </div>
                  </div>

                  <Link to="/dashboard" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-cust-text-secondary hover:text-white flex items-center gap-2.5">
                    <CalendarCheck size={14} className="text-cust-red" /> Dashboard Saya
                  </Link>
                  <Link to="/profile" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-cust-text-secondary hover:text-white flex items-center gap-2.5">
                    <User size={14} className="text-cust-red" /> Edit Profil
                  </Link>
                  <Link to="/rewards" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-cust-text-secondary hover:text-white flex items-center gap-2.5">
                    <Gift size={14} className="text-amber-400" /> Reward Saya
                  </Link>
                  <Link to="/feedback" className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-cust-text-secondary hover:text-white flex items-center gap-2.5">
                    <MessageSquarePlus size={14} className="text-cust-red" /> Kirim Masukan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-cust-red bg-cust-red/10 border border-cust-red/20 rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Keluar Akun
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-white/[0.04] border border-white/[0.08] rounded-lg"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-cust-red hover:bg-cust-red-dark rounded-lg shadow-[0_0_20px_rgba(227,30,36,0.35)]"
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