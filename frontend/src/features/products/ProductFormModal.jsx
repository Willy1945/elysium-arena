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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[4px_4px_0px_0px_#18181b]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold">
              {initialData ? 'Edit Data' : 'Tambah Baru'}
            </span>
            <h3 className="text-zinc-950 font-black text-xl font-display uppercase tracking-tight">
              {initialData ? 'Perbarui Menu Makanan' : 'Tambah Menu Baru'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Kategori Menu</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition font-bold"
            >
              <option value="" className="text-zinc-400">Pilih kategori menu...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="text-zinc-950">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Nama Menu / Produk</label>
            <input
              required
              placeholder="Contoh: Mie Goreng Spesial, Matcha Latte..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Harga Jual (Rp)</label>
              <input
                required
                type="number"
                min="0"
                placeholder="15000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 font-mono-tech font-bold placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
              />
            </div>
            <div>
              <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                Stok Awal {initialData && <span className="text-zinc-500 font-normal lowercase">(kunci)</span>}
              </label>
              <input
                required={!initialData}
                disabled={!!initialData}
                type="number"
                min="0"
                placeholder="50"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 font-mono-tech font-bold placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition disabled:opacity-50 disabled:bg-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Stok Minimum (Peringatan Habis)</label>
            <input
              required
              type="number"
              min="0"
              value={form.minimum_stock}
              onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 font-mono-tech font-bold placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Deskripsi Produk (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Deskripsi singkat rasa, porsi, atau bahan..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Foto Menu (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-zinc-700 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-2 file:border-zinc-950 file:text-xs file:font-bold file:bg-zinc-100 file:text-zinc-950 hover:file:bg-zinc-200 file:shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2.5 border-t border-zinc-200">
            <label className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-800 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded border border-zinc-950 text-cust-red focus:ring-cust-red w-4 h-4 cursor-pointer"
              />
              <span>Produk aktif (ditampilkan di menu pelanggan & kasir)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-800 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.is_reward_item || false}
                onChange={(e) => setForm({ ...form, is_reward_item: e.target.checked })}
                className="rounded border border-zinc-950 text-cust-red focus:ring-cust-red w-4 h-4 cursor-pointer"
              />
              <span>Tersedia sebagai pilihan hadiah Reward Loyalitas</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 font-bold uppercase tracking-wider py-2.5 rounded-xl text-xs sm:text-sm shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider py-2.5 rounded-xl text-xs sm:text-sm border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>
        </div>
      </form>
    </div>
  );
}
