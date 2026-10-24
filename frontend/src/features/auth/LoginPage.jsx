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
  KeyRound,
  CheckCircle2,
  X,
  MessageCircle,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api/authService';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State Lupa Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setForgotSuccess(res.data?.message || 'Tautan reset password telah dikirim ke email Anda!');
    } catch (err) {
      console.error('Forgot password error:', err);
      setForgotError(
        err.response?.data?.message ||
        'Gagal mengirim email reset password. Pastikan email terdaftar atau hubungi staf kasir.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-zinc-950 flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] bg-cust-red/[0.04] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[160px]" />

      {/* ── LEFT SHOWCASE PANEL (Desktop: Visual Narrative & Arena Perks) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 border-r border-zinc-200 overflow-hidden bg-zinc-50/50">
        {/* Background Image with Light Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url('/images/hero-gaming-room.jpg')` }}
        />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/images/logo-elysium.png"
              alt="Elysium Arena Logo"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
            />
            <div>
              <span className="font-display font-black text-2xl tracking-wider uppercase text-zinc-950 block leading-tight">
                ELYSIUM ARENA
              </span>
              <p className="font-mono text-[10px] tracking-[0.2em] text-cust-red uppercase font-bold">
                Surga Para Gamer • Sumedang
              </p>
            </div>
          </Link>

          {/* Operational Hours Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-zinc-700 tracking-wider uppercase font-mono">
              Buka 10:00 - 22:00 WIB
            </span>
          </div>
        </div>

        {/* Center Main Headline & Bento Perks */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cust-red" />
            <span className="text-xs uppercase tracking-wider text-cust-red font-bold">
              Portal Member & Reservasi
            </span>
          </div>

          <h1 className="font-display font-black text-4xl xl:text-5xl uppercase tracking-tight text-zinc-950 leading-[1.1] mb-4">
            SELAMAT DATANG <br />
            KEMBALI DI <span className="text-cust-red">ELYSIUM ARENA.</span>
          </h1>

          <p className="text-zinc-600 text-sm xl:text-base leading-relaxed mb-8 font-medium">
            Masuk ke akun member Anda untuk mengelola reservasi stasiun PC & PS5, 
            memantau durasi bermain, serta menukarkan poin reward.
          </p>

          {/* Micro Bento Perk Cards with Elevation */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mb-2.5 text-cust-red shadow-2xs">
                <Cpu size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Rig 240Hz Ready
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                PC RTX 40-Series & PS5 VIP siap dimainkan.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-2.5 text-amber-600 shadow-2xs">
                <Shield size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Smart Lock Station
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                Akses stasiun aman dan otomatis aktif saat login.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5 text-emerald-700 shadow-2xs">
                <Award size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Loyalty Reward
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                Kumpulkan poin tiap booking untuk klaim hadiah.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta Details */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-zinc-200 text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-cust-red" />
            <span>Jl. Mayor Abdurahman No.209, Sumedang</span>
          </div>
          <span>Hotline CS: +62 838-6900-2070</span>
        </div>
      </div>

      {/* ── RIGHT AUTH FORM CONTAINER ── */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10 my-auto">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo-elysium.png"
                alt="Elysium Arena Logo"
                className="h-10 w-auto object-contain drop-shadow-xs"
              />
              <div>
                <span className="font-display font-black text-xl tracking-wider uppercase text-zinc-950 block leading-tight">
                  ELYSIUM ARENA
                </span>
                <p className="font-mono text-[9px] tracking-wider text-cust-red uppercase font-bold">
                  Surga Para Gamer
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] font-bold">
              Sumedang
            </div>
          </div>

          {/* Card Enclosure with Elevation */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-7 sm:p-9 shadow-[0_20px_45px_rgba(0,0,0,0.08)] relative">

            {/* Header Content */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-sm bg-cust-red" />
                <span className="text-[11px] font-bold text-cust-red tracking-wider uppercase">
                  Masuk ke Akun Member
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 uppercase tracking-tight">
                MASUK KE AKUN
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
                Masukkan email dan password terdaftar Anda untuk mulai reservasi.
              </p>
            </div>

            {/* Animated Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2.5 font-medium shadow-2xs"
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
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-2 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-4 py-3 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(form.email || '');
                      setForgotError('');
                      setForgotSuccess('');
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] font-mono-tech text-zinc-500 hover:text-cust-red cursor-pointer transition font-medium"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-11 py-3 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium tracking-wide shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition"
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
                className="w-full mt-3 bg-cust-red hover:bg-cust-red-dark text-white font-bold tracking-wider uppercase text-xs py-3.5 rounded-xl transition duration-200 disabled:opacity-50 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
            <p className="text-center text-zinc-600 text-xs sm:text-sm mt-6 font-medium">
              Belum memiliki akun member?{' '}
              <Link to="/register" className="text-cust-red font-bold hover:underline ml-1">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-zinc-900 z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
                title="Tutup dialog"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-cust-red flex items-center justify-center mb-3 shadow-2xs">
                  <KeyRound size={20} />
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-zinc-950">
                  Lupa Password Akun?
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
                  Masukkan email terdaftar Anda. Kami akan mengirimkan tautan aman untuk membuat kata sandi baru.
                </p>
              </div>

              {/* Alert Success */}
              {forgotSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl mb-4 flex items-start gap-2.5 font-medium shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Email Terkirim!</p>
                    <p className="text-emerald-700 leading-relaxed">{forgotSuccess}</p>
                    <p className="text-[11px] text-emerald-600">Periksa juga folder Spam atau Promosi jika email belum masuk.</p>
                  </div>
                </div>
              )}

              {/* Alert Error */}
              {forgotError && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl mb-4 flex items-start gap-2.5 font-medium shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-cust-red shrink-0 mt-0.5" />
                  <span className="leading-snug">{forgotError}</span>
                </div>
              )}

              {/* Form Input */}
              {!forgotSuccess && (
                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  <div>
                    <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                      Email Terdaftar
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        autoFocus
                        placeholder="nama@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:bg-white transition font-medium shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold tracking-wider uppercase text-xs py-3 rounded-xl transition shadow-[0_4px_16px_rgba(227,30,36,0.3)] hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Mengirim Tautan...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={14} />
                        <span>Kirim Link Reset Password</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Fast WhatsApp Help Option */}
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-500 font-medium">Sedang di arena & butuh bantuan cepat?</span>
                </div>
                <a
                  href={`https://wa.me/6283869002070?text=${encodeURIComponent(
                    `Halo Admin Elysium Arena, saya butuh bantuan reset password akun saya${
                      forgotEmail ? ` dengan email: ${forgotEmail}` : ''
                    }. Mohon dibantu.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition shadow-2xs"
                >
                  <MessageCircle size={15} className="text-emerald-600" />
                  <span>Bantuan Cepat via WhatsApp Kasir</span>
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
