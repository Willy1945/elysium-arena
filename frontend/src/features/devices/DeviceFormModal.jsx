import { useState, useEffect } from 'react';
import { X, KeyRound, Copy, Check, Monitor, Gamepad2 } from 'lucide-react';
import { deviceService } from '../../api/deviceService';

export default function DeviceFormModal({ open, onClose, onSubmit, deviceTypes, games, initialData, loading }) {
  const [form, setForm] = useState({
    device_type_id: '',
    code: '',
    price_per_hour: '',
    status: 'available',
    description: '',
    game_ids: [],
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [tokenState, setTokenState] = useState({ loading: false, value: null, error: null, copied: false });
  const selectedType = deviceTypes.find((t) => t.id === Number(form.device_type_id));
  const isPc = selectedType?.name === 'PC';

  useEffect(() => {
    if (initialData) {
      setForm({
        device_type_id: initialData.device_type?.id || '',
        code: initialData.code || '',
        price_per_hour: initialData.price_per_hour || '',
        status: initialData.status || 'available',
        description: initialData.description || '',
        game_ids: initialData.games?.map((g) => g.id) || [],
      });
    } else {
      setForm({ device_type_id: '', code: '', price_per_hour: '', status: 'available', description: '', game_ids: [] });
    }
    setPhotoFile(null);
    setTokenState({ loading: false, value: null, error: null, copied: false });
  }, [initialData, open]);

  if (!open) return null;

  const toggleGame = (gameId) => {
    setForm((prev) => ({
      ...prev,
      game_ids: prev.game_ids.includes(gameId)
        ? prev.game_ids.filter((id) => id !== gameId)
        : [...prev.game_ids, gameId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'game_ids') {
        value.forEach((id) => formData.append('game_ids[]', id));
      } else {
        formData.append(key, value);
      }
    });
    if (photoFile) formData.append('photo', photoFile);
    onSubmit(formData);
  };

  const handleGenerateToken = async () => {
    if (!initialData) return;
    const confirmed = window.confirm(
      'Membuat token baru akan membuat token lama (kalau sudah ada) tidak berlaku lagi. PC yang sudah pakai token lama harus di-update config.json-nya. Lanjutkan?'
    );
    if (!confirmed) return;

    setTokenState({ loading: true, value: null, error: null, copied: false });
    try {
      const res = await deviceService.generateClientToken(initialData.id);
      setTokenState({ loading: false, value: res.data.client_token, error: null, copied: false });
    } catch (err) {
      setTokenState({
        loading: false,
        value: null,
        error: err.response?.data?.message || 'Gagal membuat token.',
        copied: false,
      });
    }
  };

  const handleCopyToken = () => {
    if (!tokenState.value) return;
    navigator.clipboard.writeText(tokenState.value);
    setTokenState((prev) => ({ ...prev, copied: true }));
    setTimeout(() => setTokenState((prev) => ({ ...prev, copied: false })), 2000);
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
              {initialData ? 'Perbarui Stasiun Gaming' : 'Tambah Stasiun Gaming Baru'}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Tipe Stasiun</label>
            <select
              required
              value={form.device_type_id}
              onChange={(e) => setForm({ ...form, device_type_id: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red transition"
            >
              <option value="" className="bg-zinc-900 text-zinc-500">Pilih tipe...</option>
              {deviceTypes.map((t) => (
                <option key={t.id} value={t.id} className="bg-zinc-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Kode Stasiun</label>
            <input
              required
              placeholder="Contoh: PS5 #01, PC #05"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Tarif Sewa (Rp / Jam)</label>
            <input
              required
              type="number"
              min="0"
              placeholder="15000"
              value={form.price_per_hour}
              onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono-tech placeholder-zinc-500 outline-none focus:border-cust-red transition"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Status Rig</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red transition"
            >
              <option value="available" className="bg-zinc-900 text-emerald-400">Available (Tersedia)</option>
              <option value="booked" className="bg-zinc-900 text-amber-400">Booked (Dipesan)</option>
              <option value="occupied" className="bg-zinc-900 text-rose-400">Occupied (Sedang Dipakai)</option>
              <option value="maintenance" className="bg-zinc-900 text-zinc-400">Maintenance (Perbaikan)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-xs font-medium mb-1.5">Deskripsi / Spesifikasi</label>
          <textarea
            rows={2}
            placeholder="Spesifikasi hardware, ukuran monitor, controller..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
          />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 text-xs font-medium mb-1.5">Foto Stasiun (Opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
          />
        </div>

        {initialData && isPc && (
          <div className="mb-5 border border-zinc-800 rounded-2xl p-4 bg-zinc-900/50">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="flex items-center gap-1.5 text-white text-xs font-semibold">
                <KeyRound size={14} className="text-cust-red" /> Token Smart Lock Client
              </label>
              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={tokenState.loading}
                className="text-cust-red text-xs font-semibold hover:underline disabled:opacity-50"
              >
                {tokenState.loading ? 'Membuat...' : 'Generate Token Baru'}
              </button>
            </div>

            {tokenState.error && (
              <p className="text-rose-400 text-xs mt-1 font-mono-tech">{tokenState.error}</p>
            )}

            {tokenState.value && (
              <div className="mt-2.5">
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono-tech text-white break-all select-all">
                    {tokenState.value}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition shrink-0"
                    title="Copy token"
                  >
                    {tokenState.copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
                <p className="text-amber-400 text-[11px] mt-2 leading-relaxed">
                  Simpan token sekarang. Token ini diperlukan di file <code className="text-white bg-black/50 px-1 py-0.5 rounded">config.json</code> PC Client Smart Lock.
                </p>
              </div>
            )}

            {!tokenState.value && !tokenState.error && (
              <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                Generate token untuk mengintegrasikan PC stasiun ini dengan daemon smart lock Windows.
              </p>
            )}
          </div>
        )}

        {(() => {
          const selectedType = deviceTypes.find((t) => t.id === Number(form.device_type_id));
          const filteredGames = games?.filter((g) => g.platforms?.includes(selectedType?.name)) || [];

          if (!selectedType) return null;

          return (
            <div className="mb-6">
              <label className="block text-zinc-400 text-xs font-medium mb-2">
                Game Terinstal ({selectedType.name})
              </label>
              {filteredGames.length === 0 ? (
                <p className="text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl p-3 text-center">
                  Belum ada game untuk platform {selectedType.name}.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-zinc-800 rounded-2xl p-3 bg-zinc-900/40">
                  {filteredGames.map((game) => (
                    <label key={game.id} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.game_ids.includes(game.id)}
                        onChange={() => toggleGame(game.id)}
                        className="rounded border-zinc-700 bg-zinc-800 text-cust-red focus:ring-cust-red w-3.5 h-3.5"
                      />
                      <span className="line-clamp-1">{game.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

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
            {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Stasiun'}
          </button>
        </div>
      </form>
    </div>
  );
}