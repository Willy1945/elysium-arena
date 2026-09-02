import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GameCard from './GameCard';
import GameFormModal from './GameFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { gameService } from '../../api/gameService';
import { useToast } from '../../context/ToastContext';

export default function GamesPage() {
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [deletingGame, setDeletingGame] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.platform = activeFilter;
      const { data } = await gameService.getAll(params);
      setGames(data.data);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleOpenCreate = () => {
    setEditingGame(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (game) => {
    setEditingGame(game);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingGame) {
        await gameService.update(editingGame.id, formData);
        toast.success('Game berhasil diperbarui.');
      } else {
        await gameService.create(formData);
        toast.success('Game berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan game.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await gameService.remove(deletingGame.id);
      toast.success('Game berhasil dihapus.');
      setDeletingGame(null);
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus game.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Game Catalog</h2>
          <p className="text-text-secondary text-sm">Kelola daftar game yang tersedia per platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['All', 'PS5', 'PS4', 'PC'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeFilter === f
                  ? 'bg-accent text-accent-lighter'
                  : 'border border-border text-text-secondary hover:bg-surface-elevated'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} /> Tambah Game
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : games.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-text-secondary text-sm">Belum ada game. Tambahkan game pertama kamu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onEdit={handleOpenEdit} onDelete={setDeletingGame} />
          ))}
        </div>
      )}

      <GameFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingGame}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deletingGame}
        title="Hapus Game?"
        message={`Yakin ingin menghapus ${deletingGame?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingGame(null)}
        loading={saving}
      />
    </DashboardLayout>
  );
}