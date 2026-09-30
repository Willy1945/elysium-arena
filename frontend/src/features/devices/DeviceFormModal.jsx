import { useState, useEffect } from 'react';
import { X, KeyRound, Copy, Check } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface-elevated border border-border rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">
            {initialData ? 'Edit Device' : 'Tambah Device'}
          </h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-text-secondary text-xs mb-1">Tipe Device</label>
            <select
              required
              value={form.device_type_id}
              onChange={(e) => setForm({ ...form, device_type_id: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Pilih tipe</option>
              {deviceTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">Kode/Nama</label>
            <input
              required
              placeholder="PS5 #01"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">Harga/Jam (Rp)</label>
            <input
              required
              type="number"
              min="0"
              value={form.price_per_hour}
              onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-xs mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
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
          <label className="block text-text-secondary text-xs mb-1">Foto Device</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="w-full text-sm text-text-secondary"
          />
        </div>

        {initialData && isPc && (
          <div className="mb-6 border border-border rounded-lg p-3 bg-surface-inset/50">
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="flex items-center gap-1.5 text-text-secondary text-xs">
                <KeyRound size={13} /> Token Smart Lock (untuk PC client)
              </label>
              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={tokenState.loading}
                className="text-accent text-xs font-medium hover:underline disabled:opacity-50"
              >
                {tokenState.loading ? 'Membuat...' : 'Generate Token'}
              </button>
            </div>

            {tokenState.error && (
              <p className="text-red-400 text-xs mt-1">{tokenState.error}</p>
            )}

            {tokenState.value && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-surface-elevated border border-border rounded px-2 py-1.5 text-[11px] text-text-primary break-all select-all">
                    {tokenState.value}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyToken}
                    className="shrink-0 text-text-secondary hover:text-text-primary"
                    title="Copy token"
                  >
                    {tokenState.copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                  </button>
                </div>
                <p className="text-amber-400 text-[11px] mt-1.5">
                  Simpan sekarang, token ini tidak akan ditampilkan lagi setelah modal ditutup. Tempel ke config.json di PC device ini.
                </p>
              </div>
            )}

            {!tokenState.value && !tokenState.error && (
              <p className="text-text-secondary text-[11px] mt-1">
                Klik "Generate Token" untuk membuat/mengganti token yang dipakai aplikasi smart lock di PC ini.
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
              <label className="block text-text-secondary text-xs mb-2">
                Game Tersedia ({selectedType.name})
              </label>
              {filteredGames.length === 0 ? (
                <p className="text-text-secondary text-xs border border-border rounded p-3">
                  Belum ada game dengan platform {selectedType.name}. Tambahkan dulu di halaman Games.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-border rounded p-2">
                  {filteredGames.map((game) => (
                    <label key={game.id} className="flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={form.game_ids.includes(game.id)}
                        onChange={() => toggleGame(game.id)}
                      />
                      {game.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

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