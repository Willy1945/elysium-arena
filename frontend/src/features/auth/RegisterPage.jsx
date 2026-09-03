import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'CUSTOMER') navigate('/');
      else navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setGeneralError(err.response.data.message || 'Data yang diisi belum valid.');
      } else {
        setGeneralError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cust-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <Gamepad2 className="text-cust-red" size={30} strokeWidth={2.5} />
          <span className="text-cust-text-primary font-black text-xl uppercase tracking-tight">Elysium Arena</span>
        </Link>

        <div className="bg-cust-elevated border border-cust-border p-8">
          <h1 className="text-cust-text-primary font-black text-2xl uppercase mb-1">Daftar Akun</h1>
          <p className="text-cust-text-secondary text-sm mb-6">Buat akun buat mulai booking dan main.</p>

          {generalError && (
            <div className="bg-cust-red/10 border border-cust-red/30 text-cust-red text-sm p-3 mb-5">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Nama Lengkap</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
              {errors.name && <p className="text-cust-red text-xs mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
              {errors.email && <p className="text-cust-red text-xs mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">No. HP <span className="text-cust-text-secondary/50 normal-case">(opsional)</span></label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
              {errors.phone && <p className="text-cust-red text-xs mt-1">{errors.phone[0]}</p>}
            </div>

            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Password</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
              {errors.password && <p className="text-cust-red text-xs mt-1">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Konfirmasi Password</label>
              <input
                required
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-3.5 mt-2 transition disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-cust-text-secondary text-sm mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-cust-red font-bold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}