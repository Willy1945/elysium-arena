import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowLeft, User, Mail, Phone, Lock, Save } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../api/authService';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', current_password: '', new_password: '', new_password_confirmation: '' });
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
        setForm((prev) => ({ ...prev, name: u.name || '', email: u.email || '', phone: u.phone || '' }));
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
      setForm((prev) => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase mb-8 transition">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-1">Akun Saya</p>
          <h1 className="text-cust-text-primary font-black text-3xl uppercase">Edit Profil</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="bg-cust-elevated border border-cust-border p-6">
            <p className="text-cust-text-secondary text-xs font-bold uppercase mb-4">Foto Profil</p>
            <div className="flex items-center gap-5">
              <div className="relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-cust-border" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-cust-red/15 border-2 border-cust-border flex items-center justify-center text-cust-red font-black text-2xl">
                    {initials || <User size={28} />}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-cust-red rounded-full flex items-center justify-center border-2 border-cust-bg hover:bg-cust-red-dark transition"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-cust-text-primary font-bold text-sm">{form.name || 'Nama Belum Diisi'}</p>
                <p className="text-cust-text-secondary text-xs mt-0.5">{form.email}</p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-cust-red text-xs font-bold uppercase mt-2 hover:underline"
                >
                  Ganti Foto
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Info Dasar */}
          <div className="bg-cust-elevated border border-cust-border p-6">
            <p className="text-cust-text-secondary text-xs font-bold uppercase mb-5">Informasi Dasar</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <User size={13} /> Nama Lengkap
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
                {errors.name && <p className="text-cust-red text-xs mt-1">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <Mail size={13} /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
                {errors.email && <p className="text-cust-red text-xs mt-1">{errors.email[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <Phone size={13} /> No. HP
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
                {errors.phone && <p className="text-cust-red text-xs mt-1">{errors.phone[0]}</p>}
              </div>
            </div>
          </div>

          {/* Ganti Password */}
          <div className="bg-cust-elevated border border-cust-border p-6">
            <p className="text-cust-text-secondary text-xs font-bold uppercase mb-1">Ganti Password</p>
            <p className="text-cust-text-secondary text-xs mb-5">Kosongkan kalau tidak ingin ganti password.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <Lock size={13} /> Password Lama
                </label>
                <input
                  type="password"
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
                {errors.current_password && <p className="text-cust-red text-xs mt-1">{errors.current_password[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <Lock size={13} /> Password Baru
                </label>
                <input
                  type="password"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
                {errors.new_password && <p className="text-cust-red text-xs mt-1">{errors.new_password[0]}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-cust-text-secondary text-xs font-bold uppercase mb-2">
                  <Lock size={13} /> Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={form.new_password_confirmation}
                  onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
                  className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-4 transition disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}