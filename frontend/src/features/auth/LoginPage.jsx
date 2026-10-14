import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  Award,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      redirectByRole(user.role);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Autentikasi gagal. Periksa kembali email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === 'OWNER' || role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'STAFF_CAFE') navigate('/cafe/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-cust-red/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── LEFT SHOWCASE PANEL (Desktop: Visual Narrative & Arena Perks) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 border-r border-[#1f1f24] overflow-hidden">
        {/* Background Image with Dark Vignette & Cyber Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('/images/hero-gaming-room.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#070709]/40 to-[#070709]" />

        {/* Ambient scanline accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cust-red/50 to-transparent" />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cust-red to-[#8b0000] p-0.5 shadow-[0_0_20px_rgba(227,30,36,0.4)] group-hover:shadow-[0_0_25px_rgba(227,30,36,0.7)] transition-all duration-300">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="text-cust-red w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl tracking-wider uppercase text-white">
                  ELYSIUM ARENA
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono-tech font-bold uppercase tracking-wider bg-cust-red/20 text-cust-red border border-cust-red/30 rounded">
                  APEX
                </span>
              </div>
              <p className="font-mono-tech text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                Next-Gen Gaming & Café Lounge
              </p>
            </div>
          </Link>

          {/* Live Telemetry Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111116]/80 border border-white/10 backdrop-blur-md shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono-tech text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
              ARENA ONLINE
            </span>
          </div>
        </div>

        {/* Center Main Headline & Bento Perks */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cust-red/10 border border-cust-red/25 mb-5">
            <Cpu className="w-3.5 h-3.5 text-cust-red" />
            <span className="font-mono-tech text-xs uppercase tracking-widest text-cust-red font-semibold">
              HIGH PERFORMANCE RIGS READY
            </span>
          </div>

          <h1 className="font-display font-black text-5xl xl:text-6xl uppercase tracking-tight text-white leading-[1.05] mb-5">
            ENTER THE <span className="text-cust-red">ELYSIUM ARENA</span>
          </h1>

          <p className="text-neutral-300 text-base leading-relaxed mb-8">
            Pusat gaming kompetitif berstandar turnamen. Nikmati kemudahan reservasi stasiun PC, 
            sinkronisasi Smart Lock otomatis, dan layanan café premium antar langsung ke meja Anda.
          </p>

          {/* Micro Bento Perk Cards */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cust-red/15 border border-cust-red/20 flex items-center justify-center mb-2.5 text-cust-red">
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Ultra Low Ping
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                Dedicated 1 Gbps fiber & RTX 40-Series.
              </p>
            </div>

            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-2.5 text-amber-400">
                <Shield size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Smart Lock PC
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                Buka kunci otomatis & sesi terlindungi.
              </p>
            </div>

            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-2.5 text-emerald-400">
                <Award size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Loyalty Reward
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                +10 poin tiap booking, klaim hadiah.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta Details */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5 font-mono-tech text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cust-red animate-pulse" />
            <span>TERMINAL: EA-AUTH-NODE-01</span>
          </div>
          <span>SECURE PROTOCOL // 256-BIT SSL</span>
        </div>
      </div>

      {/* ── RIGHT AUTH FORM CONTAINER ── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10 my-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cust-red/20 border border-cust-red/40 flex items-center justify-center">
                <Gamepad2 className="text-cust-red w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-wider uppercase text-white">
                  ELYSIUM ARENA
                </span>
                <p className="font-mono-tech text-[9px] tracking-widest text-neutral-400 uppercase">
                  Apex Gaming Lounge
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-tech text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ONLINE
            </div>
          </div>

          {/* Card Enclosure */}
          <div className="bg-[#111115]/90 border border-[#23232a] rounded-3xl p-7 sm:p-9 shadow-xl relative backdrop-blur-xl">

            {/* Header Content */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-sm bg-cust-red" />
                <span className="font-mono-tech text-[11px] font-bold text-cust-red tracking-[0.25em] uppercase">
                  ACCESS PROTOCOL // SIGN IN
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                MASUK KE ARENA
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Masukkan akun terdaftar kamu untuk booking dan kendalikan sesi stasiun.
              </p>
            </div>

            {/* Animated Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-cust-red/10 border border-cust-red/40 text-red-300 text-xs sm:text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-cust-red shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider mb-2 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Password
                  </label>
                  <span className="text-[11px] font-mono-tech text-neutral-500 hover:text-neutral-300 cursor-pointer transition">
                    Lupa password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-11 py-3 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-cust-red hover:bg-cust-red-dark text-white font-bold tracking-wider uppercase text-xs py-3.5 rounded-xl transition duration-200 disabled:opacity-50 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun Saya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <p className="text-center text-neutral-400 text-xs sm:text-sm mt-6">
              Belum memiliki akun member?{' '}
              <Link to="/register" className="text-cust-red font-bold hover:underline ml-1">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}