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
  PS5: 'bg-blue-50 text-blue-800 border-zinc-950',
  PS4: 'bg-slate-100 text-slate-800 border-zinc-950',
  PC: 'bg-emerald-50 text-emerald-800 border-zinc-950',
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
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider transition"
        >
          <ArrowLeft size={14} /> Kembali ke Game Vault
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri — Cover & Actions */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b] p-3">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-950">
              {game.cover_image ? (
                <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                  <Joystick size={48} className="text-zinc-400" />
                </div>
              )}
            </div>

            <div className="flex gap-2.5 mt-3 px-1 pb-1">
              <button
                onClick={() => setEditOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
              >
                <Pencil size={13} /> Edit Game
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-950 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan — Info & Device List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h1 className="text-zinc-950 text-3xl font-black font-display uppercase tracking-tight">
                {game.name}
              </h1>
              <div className="flex gap-1.5 flex-wrap">
                {game.platforms?.map((p) => (
                  <span
                    key={p}
                    className={`text-xs font-mono-tech font-bold px-3 py-1 rounded-lg border shadow-[1px_1px_0px_0px_#18181b] ${
                      PLATFORM_BADGE_STYLE[p] || 'bg-zinc-100 text-zinc-800 border-zinc-950'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {game.description ? (
              <div className="pt-4 border-t border-zinc-200">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1.5">Deskripsi Game</p>
                <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">{game.description}</p>
              </div>
            ) : (
              <p className="text-zinc-500 text-xs italic pt-2">Belum ada keterangan deskripsi untuk game ini.</p>
            )}
          </div>

          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cust-red" />
                <h2 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                  Tersedia di Stasiun Rig
                </h2>
              </div>
              <span className="font-mono-tech text-xs font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 border border-zinc-950 text-zinc-900 shadow-[1px_1px_0px_0px_#18181b]">
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
                      className="group flex items-center justify-between bg-zinc-50 border border-zinc-950 rounded-xl p-3.5 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white border border-zinc-950 text-zinc-800 group-hover:text-cust-red shadow-[1px_1px_0px_0px_#18181b] transition">
                          <TypeIcon size={16} />
                        </div>
                        <div>
                          <p className="text-zinc-950 text-xs font-bold">{device.code}</p>
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
