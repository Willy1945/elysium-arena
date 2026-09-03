import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      setError(err.response?.data?.message || 'Login gagal.');
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
    <div className="min-h-screen bg-cust-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <Gamepad2 className="text-cust-red" size={30} strokeWidth={2.5} />
          <span className="text-cust-text-primary font-black text-xl uppercase tracking-tight">Elysium Arena</span>
        </Link>

        <div className="bg-cust-elevated border border-cust-border p-8">
          <h1 className="text-cust-text-primary font-black text-2xl uppercase mb-1">Masuk</h1>
          <p className="text-cust-text-secondary text-sm mb-6">Masuk untuk booking dan pantau sesi kamu.</p>

          {error && (
            <div className="bg-cust-red/10 border border-cust-red/30 text-cust-red text-sm p-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
            </div>

            <div>
              <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-3.5 mt-2 transition disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-cust-text-secondary text-sm mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-cust-red font-bold hover:underline">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}