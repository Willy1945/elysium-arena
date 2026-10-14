import { useState, useEffect } from 'react';
import { X, Shield, Mail, User, Phone, Lock } from 'lucide-react';

const ROLES = [
  { value: 'ADMIN', label: 'Admin (Akses Penuh Operasional)' },
  { value: 'STAFF_CAFE', label: 'Staff Cafe (Akses F&B & Kitchen)' },
];

export default function StaffFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'ADMIN', password: '' });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || 'ADMIN',
        password: '',
      });
    } else {
      setForm({ name: '', email: '', phone: '', role: 'ADMIN', password: '' });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (initialData && !payload.password) delete payload.password;
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-semibold">
              {initialData ? 'Edit Data' : 'Tambah Baru'}
            </span>
            <h3 className="text-white font-black text-xl font-display uppercase tracking-tight">
              {initialData ? 'Perbarui Akun Staff' : 'Registrasi Staff Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <User size={13} className="text-zinc-500" /> Nama Lengkap
            </label>
            <input
              required
              placeholder="Contoh: Budi Santoso"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-zinc-500" /> Email Login
            </label>
            <input
              required
              type="email"
              placeholder="staff@elysiumarena.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition font-mono-tech"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Phone size={13} className="text-zinc-500" /> No. WhatsApp / HP (opsional)
            </label>
            <input
              placeholder="081234567890"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Shield size={13} className="text-zinc-500" /> Peran / Role Akses
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-cust-red transition"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} className="bg-zinc-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Lock size={13} className="text-zinc-500" /> Password{' '}
              {initialData && <span className="text-zinc-500 font-normal">(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              required={!initialData}
              minLength={8}
              placeholder={initialData ? '••••••••' : 'Minimal 8 karakter'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition disabled:opacity-50 shadow-lg shadow-cust-red/20"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Buat Akun'}
          </button>
        </div>
      </form>
    </div>
  );
}