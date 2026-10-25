import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Coffee,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    form.password_confirmation.length > 0 &&
    form.password === form.password_confirmation;
  const passwordsMismatch =
    form.password_confirmation.length > 0 &&
    form.password !== form.password_confirmation;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (form.password !== form.password_confirmation) {
      setGeneralError('Konfirmasi password tidak sesuai dengan password.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'CUSTOMER') navigate('/');
      else navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setGeneralError(
          err.response.data.message || 'Periksa kembali data pendaftaran Anda.'
        );
      } else {
        setGeneralError(
          err.response?.data?.message ||
            'Registrasi gagal. Silakan coba kembali beberapa saat lagi.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-zinc-950 flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-cust-red/[0.04] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[160px]" />

      {/* ── LEFT SHOWCASE PANEL (Desktop: Visual Narrative & Member Perks) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 border-r border-zinc-200 overflow-hidden bg-zinc-50/50">
        {/* Background Image with Light Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity scale-105 pointer-events-none"
          style={{ backgroundImage: `url('/images/gaming-hall.jpg')` }}
        />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/images/logoElysiumFix.png"
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

          {/* Member Registration Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cust-red" />
            <span className="text-[11px] font-bold text-zinc-700 tracking-wider uppercase font-mono">
              Registrasi Member Gratis
            </span>
          </div>
        </div>

        {/* Center Main Headline & Bento Perks */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cust-red" />
            <span className="text-xs uppercase tracking-wider text-cust-red font-bold">
              Pendaftaran Member Baru
            </span>
          </div>

          <h1 className="font-display font-black text-4xl xl:text-5xl uppercase tracking-tight text-zinc-950 leading-[1.1] mb-4">
            GABUNG MENJADI MEMBER <br />
            <span className="text-cust-red">ELYSIUM ARENA.</span>
          </h1>

          <p className="text-zinc-600 text-sm xl:text-base leading-relaxed mb-8 font-medium">
            Daftarkan diri Anda untuk merasakan pengalaman gaming terbaik. 
            Nikmati kemudahan reservasi stasiun PC & PS5, pesan makanan antar ke meja, serta kumpulkan poin reward.
          </p>

          {/* Micro Bento Perk Cards with Elevation */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-2.5 text-amber-600 shadow-2xs">
                <Award size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Loyalty Points
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                Kumpulkan poin otomatis untuk voucer & minuman gratis.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center mb-2.5 text-cust-red shadow-2xs">
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Priority Booking
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                Pilih stasiun favorit & durasi bermain secara real-time.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 hover:border-cust-red/40 p-3.5 rounded-xl transition-all shadow-xs hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5 text-emerald-700 shadow-2xs">
                <Coffee size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-black text-sm uppercase text-zinc-950 tracking-wide">
                Kafe & Refreshment
              </h4>
              <p className="text-zinc-600 text-[11px] mt-0.5 leading-tight font-medium">
                Pesan hidangan kafe langsung diantar ke meja gaming Anda.
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
                src="/images/logoElysiumFix.png"
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
                  Pendaftaran Member Baru
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-950 uppercase tracking-tight">
                BUAT AKUN MEMBER
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
                Lengkapi formulir di bawah ini untuk membuat akun member Elysium Arena Anda.
              </p>
            </div>

            {/* Animated General Error Alert */}
            <AnimatePresence>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2.5 font-medium shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 text-cust-red shrink-0 mt-0.5" />
                  <span className="leading-snug">{generalError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Register Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium shadow-2xs"
                  />
                </div>
                {errors.name && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1 font-bold">
                    <AlertCircle size={12} /> {errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
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
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium shadow-2xs"
                  />
                </div>
                {errors.email && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1 font-bold">
                    <AlertCircle size={12} /> {errors.email[0]}
                  </p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Nomor WhatsApp / HP
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium shadow-2xs"
                  />
                </div>
                {errors.phone && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1 font-bold">
                    <AlertCircle size={12} /> {errors.phone[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-medium shadow-2xs"
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
                {errors.password && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1 font-bold">
                    <AlertCircle size={12} /> {errors.password[0]}
                  </p>
                )}
              </div>

              {/* Password Confirmation with Realtime Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Konfirmasi Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] text-emerald-700 font-mono-tech flex items-center gap-1 font-bold">
                      <CheckCircle2 size={11} /> Cocok
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] text-amber-700 font-mono-tech flex items-center gap-1 font-bold">
                      <XCircle size={11} /> Belum cocok
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Ulangi password"
                    value={form.password_confirmation}
                    onChange={(e) =>
                      setForm({ ...form, password_confirmation: e.target.value })
                    }
                    className={`w-full bg-zinc-50 border text-zinc-950 text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none transition placeholder:text-zinc-400 font-medium shadow-2xs ${
                      passwordsMismatch
                        ? 'border-amber-400 focus:border-amber-500'
                        : passwordsMatch
                        ? 'border-emerald-400 focus:border-emerald-500'
                        : 'border-zinc-300 focus:border-cust-red focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition"
                    title={
                      showConfirmPassword
                        ? 'Sembunyikan konfirmasi password'
                        : 'Lihat konfirmasi password'
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-cust-red hover:bg-cust-red-dark text-white font-bold tracking-wider uppercase text-xs py-3.5 rounded-xl transition duration-200 disabled:opacity-50 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>MEMPROSES PENDAFTARAN...</span>
                  </>
                ) : (
                  <>
                    <span>DAFTAR SEBAGAI MEMBER</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <p className="text-center text-zinc-600 text-xs sm:text-sm mt-6 font-medium">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-cust-red font-bold hover:underline ml-1">
                Masuk ke Akun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
