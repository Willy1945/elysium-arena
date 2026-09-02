import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Joystick, Gamepad2, Monitor } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import GameFormModal from './GameFormModal';
import { gameService } from '../../api/gameService';
import { STATUS_CONFIG, resolveImageUrl } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const PLATFORM_STYLE = {
  PS5: '#00439c',
  PS4: '#7c8794',
  PC: '#16a34a',
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
      toast.success('Perubahan berhasil disimpan.');
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
      toast.success('Game berhasil dihapus.');
      navigate('/admin/games');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus game.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-text-secondary text-sm">Memuat data...</p>
      </DashboardLayout>
    );
  }

  if (!game) {
    return (
      <DashboardLayout>
        <p className="text-text-secondary text-sm">Game tidak ditemukan.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/admin/games" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 transition">
        <ArrowLeft size={16} /> Kembali ke Games
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri — Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-inset shadow-lg">
            {game.cover_image ? (
              <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Joystick size={48} className="text-text-secondary opacity-30" />
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-lg py-2 text-sm text-text-secondary hover:bg-surface-inset transition"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-lg py-2 text-sm text-status-occupied hover:bg-status-occupied/10 transition"
            >
              <Trash2 size={14} /> Hapus
            </button>
          </div>
        </div>

        {/* Kolom Kanan — Info & Device List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-text-primary text-2xl font-bold">{game.name}</h1>
              <div className="flex gap-1.5">
                {game.platforms?.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-bold px-2.5 py-1 rounded"
                    style={{ backgroundColor: PLATFORM_STYLE[p] || '#666', color: '#fff' }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {game.description && (
              <div>
                <p className="text-text-secondary text-xs mb-1">Deskripsi</p>
                <p className="text-text-primary text-sm">{game.description}</p>
              </div>
            )}
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h2 className="text-text-primary font-semibold mb-4">Tersedia di Device</h2>

            {game.devices?.length === 0 ? (
              <p className="text-text-secondary text-sm">Game ini belum terpasang di device manapun.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {game.devices?.map((device) => {
                  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
                  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
                  return (
                    <Link
                      key={device.id}
                      to={`/admin/devices/${device.id}`}
                      className="flex items-center gap-2.5 bg-surface-inset border border-border rounded-lg p-3 hover:border-accent/40 transition"
                    >
                      <TypeIcon size={16} className="text-accent-light shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate">{device.code}</p>
                        <Badge colorVar={status.color}>{status.label}</Badge>
                      </div>
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
        message={`Yakin ingin menghapus ${game.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={saving}
      />
    </DashboardLayout>
  );
}