import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface-elevated border border-border rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">
            {initialData ? 'Edit Game' : 'Tambah Game'}
          </h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Nama Game</label>
          <input
            required
            placeholder="EA Sports FC 26"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-2">
            Tersedia di Platform <span className="text-text-secondary/60">(bisa pilih lebih dari satu)</span>
          </label>
          <div className="flex gap-2">
            {PLATFORM_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                  form.platforms.includes(p)
                    ? 'border-accent bg-accent/10 text-accent-light'
                    : 'border-border text-text-secondary hover:bg-surface-inset'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {form.platforms.length === 0 && (
            <p className="text-status-occupied text-xs mt-1.5">Pilih minimal 1 platform.</p>
          )}
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

        <div className="mb-6">
          <label className="block text-text-secondary text-xs mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full text-sm text-text-secondary"
          />
        </div>

        <button
          type="submit"
          disabled={loading || form.platforms.length === 0}
          className="w-full bg-accent hover:opacity-90 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}