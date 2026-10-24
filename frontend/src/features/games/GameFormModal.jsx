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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-[4px_4px_0px_0px_#18181b]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold">
              {initialData ? 'Edit Data' : 'Tambah Baru'}
            </span>
            <h3 className="text-zinc-950 font-black text-xl font-display uppercase tracking-tight">
              {initialData ? 'Perbarui Data Game' : 'Tambah Game Baru'}
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
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Nama Game</label>
            <input
              required
              placeholder="Contoh: EA Sports FC 26, Valorant..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-2">
              Platform Tersedia <span className="text-zinc-500 font-normal lowercase">(pilih satu atau lebih)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORM_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold font-mono-tech border-2 uppercase tracking-wider transition ${
                    form.platforms.includes(p)
                      ? 'border-zinc-950 bg-cust-red text-white shadow-[2px_2px_0px_0px_#18181b]'
                      : 'border-zinc-950 bg-white text-zinc-800 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {form.platforms.length === 0 && (
              <p className="text-rose-600 text-[11px] mt-1.5 font-mono-tech font-bold">Wajib memilih minimal 1 platform.</p>
            )}
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Deskripsi Singkat (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Genre, multiplayer, atau info ringkas..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Cover Image (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="w-full text-xs text-zinc-700 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-2 file:border-zinc-950 file:text-xs file:font-bold file:bg-zinc-100 file:text-zinc-950 hover:file:bg-zinc-200 file:shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
            />
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
            disabled={loading || form.platforms.length === 0}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider py-2.5 rounded-xl text-xs sm:text-sm border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
