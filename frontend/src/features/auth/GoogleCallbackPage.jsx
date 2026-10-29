import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Activity, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const toast = useToast();
  const [error, setError] = useState('');
  const isProcessed = useRef(false);

  useEffect(() => {

    if (isProcessed.current) return;
    isProcessed.current = true;

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      toast.error(errorParam);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
      return;
    }

    if (!token) {
      setError('Token autentikasi tidak ditemukan. Mengarahkan kembali ke halaman login...');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
      return;
    }

    if (userParam) {
      try {
        const decodedUser = JSON.parse(atob(decodeURIComponent(userParam)));
        loginWithToken(decodedUser, token);
        toast.success(`Selamat datang di Elysium Arena, ${decodedUser.name}!`);

        const role = decodedUser.role;
        let target = '/dashboard';
        if (role === 'OWNER' || role === 'ADMIN') {
          target = '/admin/dashboard';
        } else if (role === 'STAFF_CAFE') {
          target = '/cafe/dashboard';
        }

        navigate(target, { replace: true });
        return;
      } catch (e) {
        console.error('Gagal decode user data:', e);
      }
    }

    localStorage.setItem('token', token);
    axiosClient
      .get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const user = data.data || data;
        loginWithToken(user, token);
        toast.success(`Selamat datang di Elysium Arena, ${user.name}!`);

        let target = '/dashboard';
        if (user.role === 'OWNER' || user.role === 'ADMIN') {
          target = '/admin/dashboard';
        } else if (user.role === 'STAFF_CAFE') {
          target = '/cafe/dashboard';
        }

        navigate(target, { replace: true });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Gagal memuat profil pengguna dari Google.';
        setError(msg);
        toast.error(msg);
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      });
  }, [searchParams, navigate, loginWithToken, toast]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-8 text-center shadow-[0_20px_45px_rgba(0,0,0,0.06)]">
        {error ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-cust-red flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h2 className="font-display font-black text-xl text-zinc-950 uppercase">Gagal Autentikasi</h2>
            <p className="text-zinc-600 text-xs leading-relaxed">{error}</p>
            <p className="text-zinc-400 text-[11px] font-mono-tech mt-2">Mengarahkan ke halaman login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-cust-red flex items-center justify-center mx-auto">
              <Activity size={28} className="animate-spin text-cust-red" />
            </div>
            <h2 className="font-display font-black text-xl text-zinc-950 uppercase tracking-tight">
              Menghubungkan Akun Google
            </h2>
            <p className="text-zinc-600 text-xs">
              Sedang memverifikasi kredensial dan menyiapkan sesi Anda...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
