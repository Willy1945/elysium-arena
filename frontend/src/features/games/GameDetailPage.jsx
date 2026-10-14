import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Joystick, Gamepad2, Monitor, Layers } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import GameFormModal from './GameFormModal';
import { gameService } from '../../api/gameService';
import { STATUS_CONFIG, resolveImageUrl } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const PLATFORM_BADGE_STYLE = {
  PS5: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  PS4: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
  PC: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
};

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await gameService.getById(id);
      setGame(data.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await gameService.update(id, formData);
      toast.success('Perubahan data game berhasil disimpan.');
      setEditOpen(false);
      fetchGame();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await gameService.remove(id);
      toast.success('Game berhasil dihapus dari katalog.');
      navigate('/admin/games');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus game.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat data game...
        </div>
      </DashboardLayout>
    );
  }

  if (!game) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Game tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ── TOP NAV LINK ── */}
      <div className="mb-6">
        <Link
          to="/admin/games"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition"
        >
          <ArrowLeft size={14} /> Kembali ke Game Vault
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri — Cover & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl p-3">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80">
              {game.cover_image ? (
                <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Joystick size={48} className="text-zinc-700" />
                </div>
              )}
            </div>

            <div className="flex gap-2.5 mt-3 px-1 pb-1">
              <button
                onClick={() => setEditOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl py-2.5 text-xs font-semibold transition"
              >
                <Pencil size={13} /> Edit Game
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-rose-900/40 text-rose-400 hover:bg-rose-950/20 rounded-xl py-2.5 text-xs font-semibold transition"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan — Info & Device List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h1 className="text-white text-3xl font-black font-display uppercase tracking-tight">
                {game.name}
              </h1>
              <div className="flex gap-1.5 flex-wrap">
                {game.platforms?.map((p) => (
                  <span
                    key={p}
                    className={`text-xs font-mono-tech font-bold px-3 py-1 rounded-lg border ${
                      PLATFORM_BADGE_STYLE[p] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {game.description ? (
              <div className="pt-4 border-t border-zinc-800/80">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase tracking-wider mb-1.5">Deskripsi Game</p>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{game.description}</p>
              </div>
            ) : (
              <p className="text-zinc-500 text-xs italic pt-2">Belum ada keterangan deskripsi untuk game ini.</p>
            )}
          </div>

          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cust-red" />
                <h2 className="text-white font-bold text-sm uppercase tracking-wider font-display">
                  Tersedia di Stasiun Rig
                </h2>
              </div>
              <span className="font-mono-tech text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                {game.devices?.length || 0} Stasiun
              </span>
            </div>

            {game.devices?.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8">Game ini belum terpasang di stasiun manapun.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {game.devices?.map((device) => {
                  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
                  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
                  return (
                    <Link
                      key={device.id}
                      to={`/admin/devices/${device.id}`}
                      className="group flex items-center justify-between bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 hover:border-zinc-700 transition shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-300 group-hover:text-cust-red transition">
                          <TypeIcon size={16} />
                        </div>
                        <div>
                          <p className="text-white text-xs font-semibold">{device.code}</p>
                          <p className="text-zinc-500 text-[10px] uppercase font-mono-tech">{device.device_type?.name}</p>
                        </div>
                      </div>
                      <Badge colorVar={status.color}>{status.label}</Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <GameFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initialData={game}
        loading={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Game?"
        message={`Yakin ingin menghapus ${game.name} dari katalog?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={saving}
      />
    </DashboardLayout>
  );
}