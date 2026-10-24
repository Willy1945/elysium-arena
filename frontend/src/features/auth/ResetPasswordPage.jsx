import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock, Eye, EyeOff, ShieldCheck, CheckCircle2,
  AlertCircle, ArrowRight, ArrowLeft, Mail, KeyRound, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../api/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [emailParam, tokenParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Token reset password tidak valid atau tidak ditemukan dalam tautan.');
      return;
    }

    if (password.length < 8) {
      setError('Password baru minimal terdiri dari 8 karakter.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message ||
        'Gagal memperbarui kata sandi. Tautan mungkin telah kedaluwarsa (maks. 60 menit).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Background Gradients & Ambient Neon Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cust-red/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[400px] h-[300px] bg-red-950/20 rounded-full blur-[120px]" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <img
            src="/images/logo-elysium.png"
            alt="Elysium Arena Logo"
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
          />
          <div className="text-left">
            <span className="font-display font-black text-2xl tracking-wider uppercase text-white group-hover:text-cust-red transition-colors block leading-none">
              ELYSIUM ARENA
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] text-cust-red uppercase font-bold mt-1 block">
              Surga Para Gamer • Sumedang
            </span>
          </div>
        </Link>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative z-10 text-zinc-900"
      >
        {success ? (
          /* SUCCESS STATE */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="font-mono-tech text-[11px] font-bold text-emerald-700 tracking-wider uppercase">
                BERHASIL DIPERBARUI
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-zinc-950 mt-1">
                Password Berhasil Diganti!
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Kata sandi baru akun Anda telah aktif. Anda sekarang dapat masuk kembali ke Elysium Arena.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-[0_4px_16px_rgba(227,30,36,0.3)] hover:shadow-lg transition cursor-pointer"
              >
                <span>Masuk ke Akun Sekarang</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
                <KeyRound size={13} />
                <span>Pemulihan Kata Sandi</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight">
                Buat Password Baru
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                Tentukan kata sandi baru yang aman untuk akun Elysium Arena Anda.
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl mb-5 flex items-start gap-2.5 font-medium shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 text-cust-red shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address (Read-only / verified) */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Email Akun
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    readOnly={!!emailParam}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cust-red transition font-medium shadow-2xs"
                  />
                </div>
              </div>

              {/* Password Baru */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs sm:text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none focus:border-cust-red transition font-medium shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div>
                <label className="block text-zinc-800 text-xs font-mono-tech uppercase tracking-wider mb-1.5 font-bold">
                  Ulangi Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Ulangi password baru..."
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-950 text-xs sm:text-sm pl-10 pr-11 py-2.5 rounded-xl outline-none focus:border-cust-red transition font-medium shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Requirement Hint */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-600 font-medium space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-zinc-800">
                  <Sparkles size={12} className="text-cust-red" />
                  <span>Petunjuk Keamanan:</span>
                </p>
                <p>• Gunakan kombinasi huruf besar, angka, dan minimal 8 karakter.</p>
                <p>• Tautan reset ini berlaku selama 60 menit sejak dikirim.</p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold tracking-wider uppercase text-xs py-3.5 rounded-xl transition shadow-[0_4px_16px_rgba(227,30,36,0.3)] hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Menyimpan Password Baru...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={15} />
                    <span>Simpan Password Baru</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-cust-red transition uppercase tracking-wider"
              >
                <ArrowLeft size={13} />
                <span>Kembali ke Halaman Login</span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
