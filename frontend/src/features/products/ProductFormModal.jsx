import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Utensils, DollarSign, Package, AlertCircle } from 'lucide-react';

export default function ProductFormModal({ open, onClose, onSubmit, categories, initialData, loading }) {
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    price: '',
    stock: '',
    minimum_stock: '5',
    description: '',
    is_active: true,
    is_reward_item: false,
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
        is_reward_item: !!initialData.is_reward_item,
      });
    } else {
      setForm({
        category_id: '',
        name: '',
        price: '',
        stock: '',
        minimum_stock: '5',
        description: '',
        is_active: true,
        is_reward_item: false,
      });
    }
    setImageFile(null);
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'stock' && initialData) return; // stok dikunci saat edit
      formData.append(key, (key === 'is_active' || key === 'is_reward_item') ? (value ? 1 : 0) : value);
    });
    if (imageFile) formData.append('image', imageFile);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-semibold">
              {initialData ? 'Edit Data' : 'Tambah Baru'}
            </span>
            <h3 className="text-white font-black text-xl font-display uppercase tracking-tight">
              {initialData ? 'Perbarui Menu Makanan' : 'Tambah Menu Baru'}
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
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Kategori Menu</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red transition"
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Pilih kategori menu...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Nama Menu / Produk</label>
            <input
              required
              placeholder="Contoh: Mie Goreng Spesial, Matcha Latte..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">Harga Jual (Rp)</label>
              <input
                required
                type="number"
                min="0"
                placeholder="15000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-tech placeholder-zinc-500 outline-none focus:border-cust-red transition"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                Stok Awal {initialData && <span className="text-zinc-500 font-normal">(kunci)</span>}
              </label>
              <input
                required={!initialData}
                disabled={!!initialData}
                type="number"
                min="0"
                placeholder="50"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-tech placeholder-zinc-500 outline-none focus:border-cust-red transition disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Stok Minimum (Peringatan Habis)</label>
            <input
              required
              type="number"
              min="0"
              value={form.minimum_stock}
              onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-tech placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Deskripsi Produk (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Deskripsi singkat rasa, porsi, atau bahan..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Foto Menu (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2.5 border-t border-zinc-800/80">
            <label className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-800 text-cust-red focus:ring-cust-red w-4 h-4"
              />
              <span>Produk aktif (ditampilkan di menu pelanggan & kasir)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_reward_item || false}
                onChange={(e) => setForm({ ...form, is_reward_item: e.target.checked })}
                className="rounded border-zinc-700 bg-zinc-800 text-cust-red focus:ring-cust-red w-4 h-4"
              />
              <span>Tersedia sebagai pilihan hadiah Reward Loyalitas</span>
            </label>
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
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>
        </div>
      </form>
    </div>
  );
}