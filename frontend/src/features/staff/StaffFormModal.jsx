import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'STAFF_CAFE', label: 'Staff Cafe' },
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">{initialData ? 'Edit Staff' : 'Tambah Staff'}</h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-text-secondary text-xs mb-1">Nama</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">No. HP (opsional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">
              Password {initialData && <span className="text-text-secondary/60">(kosongkan jika tidak diganti)</span>}
            </label>
            <input
              type="password"
              required={!initialData}
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:opacity-90 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}