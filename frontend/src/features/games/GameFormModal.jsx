import { useState, useEffect } from 'react';
import { X, Gamepad2 } from 'lucide-react';

const PLATFORM_OPTIONS = ['PS5', 'PS4', 'PC'];

export default function GameFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState({ name: '', platforms: [], description: '' });
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        platforms: initialData.platforms || [],
        description: initialData.description || '',
      });
    } else {
      setForm({ name: '', platforms: [], description: '' });
    }
    setCoverFile(null);
  }, [initialData, open]);

  if (!open) return null;

  const togglePlatform = (platform) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.platforms.length === 0) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    form.platforms.forEach((p) => formData.append('platforms[]', p));
    if (coverFile) formData.append('cover_image', coverFile);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-semibold">
              {initialData ? 'Edit Data' : 'Tambah Baru'}
            </span>
            <h3 className="text-white font-black text-xl font-display uppercase tracking-tight">
              {initialData ? 'Perbarui Data Game' : 'Tambah Game Baru'}
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
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Nama Game</label>
            <input
              required
              placeholder="Contoh: EA Sports FC 26, Valorant..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-2">
              Platform Tersedia <span className="text-zinc-500 font-normal">(pilih satu atau lebih)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORM_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold font-mono-tech border transition ${
                    form.platforms.includes(p)
                      ? 'border-cust-red bg-cust-red/20 text-white shadow-md shadow-cust-red/10'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {form.platforms.length === 0 && (
              <p className="text-rose-400 text-[11px] mt-1.5 font-mono-tech">Wajib memilih minimal 1 platform.</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Deskripsi Singkat (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Genre, multiplayer, atau info ringkas..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Cover Image (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
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
            disabled={loading || form.platforms.length === 0}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition disabled:opacity-50 shadow-lg shadow-cust-red/20"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Game'}
          </button>
        </div>
      </form>
    </div>
  );
}