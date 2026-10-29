import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowLeft, User, Mail, Phone, Lock, Save, Shield } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';
import UserAvatar from '../../components/common/UserAvatar';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    authService.getProfile()
      .then(({ data }) => {
        const u = data.user || data.data || data;
        if (!u) {
          console.error('Struktur response profile tidak dikenali:', data);
          return;
        }
        setForm((prev) => ({
          ...prev,
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || ''
        }));
        setAvatarPreview(u.avatar || null);
      })
      .catch((err) => {
        console.error('Gagal memuat profile:', err.response?.data || err.message);
      });
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (avatarFile) formData.append('avatar', avatarFile);
    if (form.new_password) {
      formData.append('current_password', form.current_password);
      formData.append('new_password', form.new_password);
      formData.append('new_password_confirmation', form.new_password_confirmation);
    }

    try {
      const { data } = await authService.updateProfile(formData);
      if (setUser) setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profil berhasil diperbarui.');
      setForm((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }));
      setAvatarFile(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        toast.error(err.response.data.message || 'Data yang diisi belum valid.');
      } else {
        toast.error('Gagal memperbarui profil.');
      }
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-semibold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <User size={14} />
            <span>Pengaturan Akun</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl sm:text-4xl uppercase tracking-tight">
            Edit Profil Pelanggan
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
            Kelola data akun pribadi, nomor kontak WhatsApp untuk konfirmasi booking, dan perbarui kata sandi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">
              Foto Profil Pelanggan
            </p>
            <div className="flex items-center gap-5">
              <div className="relative">
                <UserAvatar
                  src={avatarPreview}
                  name={form.name || user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-zinc-200 shadow-md"
                  fallbackClassName="w-20 h-20 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-cust-red font-display font-black text-3xl shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-cust-red hover:bg-cust-red-dark text-white rounded-full flex items-center justify-center border-2 border-white transition cursor-pointer shadow-sm"
                  title="Upload Foto"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <p className="text-zinc-950 font-bold text-sm">{form.name || 'Nama Belum Diisi'}</p>
                <p className="text-zinc-500 text-xs mt-0.5 font-medium">{form.email}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-cust-red text-xs font-bold uppercase tracking-wider mt-2 hover:underline cursor-pointer"
                >
                  Pilih Foto Baru
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-5">
              Informasi Dasar
            </p>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <User size={13} /> Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
                {errors.name && <p className="text-cust-red text-xs mt-1 font-semibold">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Mail size={13} /> Alamat Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
                {errors.email && <p className="text-cust-red text-xs mt-1 font-semibold">{errors.email[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Phone size={13} /> Nomor WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
                {errors.phone && <p className="text-cust-red text-xs mt-1 font-semibold">{errors.phone[0]}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
            <p className="text-zinc-950 text-xs font-bold uppercase tracking-wider mb-1">
              Ganti Kata Sandi
            </p>
            <p className="text-zinc-500 text-xs mb-5 font-medium">
              Kosongkan bagian ini jika kamu tidak ingin mengganti kata sandi.
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lock size={13} /> Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
                {errors.current_password && <p className="text-cust-red text-xs mt-1 font-semibold">{errors.current_password[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lock size={13} /> Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
                {errors.new_password && <p className="text-cust-red text-xs mt-1 font-semibold">{errors.new_password[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-zinc-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lock size={13} /> Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={form.new_password_confirmation}
                  onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm px-4 py-3 outline-none focus:border-cust-red transition shadow-xs placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-xs tracking-wider py-4 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}</span>
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}