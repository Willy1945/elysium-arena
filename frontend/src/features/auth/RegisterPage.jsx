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
    <div className="min-h-screen bg-[#070709] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] bg-cust-red/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── LEFT SHOWCASE PANEL (Desktop: Visual Narrative & Member Perks) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 border-r border-[#1f1f24] overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('/images/gaming-hall.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#070709]/40 to-[#070709]" />

        {/* Ambient Top Scanline Accent */}
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
                  RECRUIT
                </span>
              </div>
              <p className="font-mono-tech text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                Next-Gen Gaming & Café Lounge
              </p>
            </div>
          </Link>

          {/* Member Registration Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111116]/80 border border-white/10 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono-tech text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              NEW MEMBER PRIVILEGES
            </span>
          </div>
        </div>

        {/* Center Main Headline & Bento Perks */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cust-red/10 border border-cust-red/25 mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-cust-red" />
            <span className="font-mono-tech text-xs uppercase tracking-widest text-cust-red font-semibold">
              JOIN THE ELITE CORPS
            </span>
          </div>

          <h1 className="font-display font-black text-5xl xl:text-6xl uppercase tracking-tight text-white leading-[1.05] mb-5">
            UNLOCK YOUR{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cust-red via-red-500 to-amber-500">
              GAMING IDENTITY
            </span>
          </h1>

          <p className="text-neutral-300 text-base leading-relaxed mb-8">
            Daftarkan diri Anda untuk merasakan pengalaman gaming tanpa hambatan. 
            Nikmati kemudahan reservasi stasiun PC, pesan makanan antar ke meja, dan kumpulkan poin loyalitas.
          </p>

          {/* Micro Bento Perk Cards */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-2.5 text-amber-400">
                <Award size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Loyalty Points
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                Kumpulkan poin otomatis untuk voucer & minuman gratis.
              </p>
            </div>

            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cust-red/15 border border-cust-red/20 flex items-center justify-center mb-2.5 text-cust-red">
                <Zap size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Priority Booking
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                Pilih stasiun favorit & durasi bermain secara real-time.
              </p>
            </div>

            <div className="bg-[#111116]/85 backdrop-blur-md border border-[#23232a] hover:border-cust-red/40 p-3.5 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-2.5 text-emerald-400">
                <Coffee size={16} strokeWidth={2.5} />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-white tracking-wide">
                Desk Delivery
              </h4>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-tight">
                Pesan menu café favorit langsung diantar ke meja gaming.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta Details */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5 font-mono-tech text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PORTAL: REGISTRATION_OPEN</span>
          </div>
          <span>ENCRYPTION: 256-BIT SSL ACTIVE</span>
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
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono-tech text-[10px]">
              <Sparkles size={11} />
              REGISTER
            </div>
          </div>

          {/* Tactical Card Enclosure */}
          <div className="bg-[#111115]/90 border border-[#23232a] rounded-2xl p-7 sm:p-9 shadow-2xl relative shadow-black/80 backdrop-blur-xl">
            {/* Corner Tactical Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cust-red/60 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cust-red/60 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cust-red/60 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cust-red/60 rounded-br-sm pointer-events-none" />

            {/* Header Content */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-sm bg-cust-red" />
                <span className="font-mono-tech text-[11px] font-bold text-cust-red tracking-[0.25em] uppercase">
                  CREATE ACCOUNT // NEW MEMBER
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                DAFTAR SEKARANG
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Lengkapi formulir di bawah ini untuk memulai petualangan gaming Anda.
              </p>
            </div>

            {/* Animated General Error Alert */}
            <AnimatePresence>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-cust-red/10 border border-cust-red/40 text-red-300 text-xs sm:text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2.5"
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
                <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium"
                  />
                </div>
                {errors.name && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
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
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium"
                  />
                </div>
                {errors.email && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email[0]}
                  </p>
                )}
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Nomor WhatsApp / HP
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono-tech uppercase">Opsional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium"
                  />
                </div>
                {errors.phone && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-[#272730] text-white text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition placeholder:text-neutral-600 font-medium"
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
                {errors.password && (
                  <p className="text-cust-red text-xs mt-1 font-mono-tech flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.password[0]}
                  </p>
                )}
              </div>

              {/* Password Confirmation with Realtime Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-neutral-300 text-xs font-mono-tech uppercase tracking-wider font-bold">
                    Konfirmasi Password
                  </label>
                  {passwordsMatch && (
                    <span className="text-[10px] text-emerald-400 font-mono-tech flex items-center gap-1">
                      <CheckCircle2 size={11} /> Cocok
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] text-amber-400 font-mono-tech flex items-center gap-1">
                      <XCircle size={11} /> Belum cocok
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
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
                    className={`w-full bg-[#0a0a0d] border text-white text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none transition placeholder:text-neutral-600 font-medium ${
                      passwordsMismatch
                        ? 'border-amber-500/60 focus:border-amber-500'
                        : passwordsMatch
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-[#272730] focus:border-cust-red focus:ring-1 focus:ring-cust-red/40'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white transition"
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
                className="w-full mt-4 group relative overflow-hidden bg-gradient-to-r from-cust-red to-[#b8151a] hover:from-[#f02830] hover:to-cust-red text-white font-display font-black tracking-wider uppercase text-base py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-[0_0_20px_rgba(227,30,36,0.35)] hover:shadow-[0_0_28px_rgba(227,30,36,0.55)] flex items-center justify-center gap-2 cursor-pointer"
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
            <p className="text-center text-neutral-400 text-xs sm:text-sm mt-6">
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