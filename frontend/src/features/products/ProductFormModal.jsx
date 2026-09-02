import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductFormModal({ open, onClose, onSubmit, categories, initialData, loading }) {
  const [form, setForm] = useState({
    category_id: '', name: '', price: '', stock: '', minimum_stock: '5', description: '', is_active: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        category_id: initialData.category?.id || '',
        name: initialData.name || '',
        price: initialData.price || '',
        stock: initialData.stock ?? '',
        minimum_stock: initialData.minimum_stock ?? '5',
        description: initialData.description || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({ category_id: '', name: '', price: '', stock: '', minimum_stock: '5', description: '', is_active: true });
    }
    setImageFile(null);
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'stock' && initialData) return; // stok tidak dikirim saat edit
      formData.append(key, key === 'is_active' ? (value ? 1 : 0) : value);
    });
    if (imageFile) formData.append('image', imageFile);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">{initialData ? 'Edit Produk' : 'Tambah Produk'}</h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Kategori</label>
          <select
            required
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Pilih kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Nama Produk</label>
          <input
            required
            placeholder="Mie Goreng"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-text-secondary text-xs mb-1">Harga (Rp)</label>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-xs mb-1">
              Stok Awal {initialData && <span className="text-text-secondary/60">(kunci saat edit)</span>}
            </label>
            <input
              required={!initialData}
              disabled={!!initialData}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Stok Minimum (peringatan)</label>
          <input
            required
            type="number"
            min="0"
            value={form.minimum_stock}
            onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Deskripsi</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Gambar Produk</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-text-secondary" />
        </div>

        <label className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Produk aktif (tampil di menu)
        </label>

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