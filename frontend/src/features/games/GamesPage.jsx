import { useState, useEffect, useCallback } from 'react';
import { Plus, Gamepad2 } from 'lucide-react';
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
        toast.success('Informasi game berhasil diperbarui.');
      } else {
        await gameService.create(formData);
        toast.success('Game baru berhasil ditambahkan.');
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
      toast.success('Game berhasil dihapus dari katalog.');
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
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Gamepad2 size={14} />
            <span>Katalog Game Arena</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Game Vault & Library
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Kelola judul game yang terinstal di PlayStation 5, PS4, dan PC stasiun arena.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1">
            {['All', 'PS5', 'PS4', 'PC'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFilter === f
                    ? 'bg-cust-red text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {f === 'All' ? 'Semua Platform' : f}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cust-red/10 shrink-0"
          >
            <Plus size={16} /> Tambah Game
          </button>
        </div>
      </div>

      {/* ── GAMES GRID ── */}
      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat daftar game...
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-[#121216]/50">
          <Gamepad2 size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-white font-semibold text-sm">Tidak ada game pada filter ini.</p>
          <p className="text-zinc-500 text-xs mt-1">Tambahkan game baru untuk mengisi katalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={handleOpenEdit}
              onDelete={setDeletingGame}
            />
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
        message={`Yakin ingin menghapus ${deletingGame?.name} dari daftar katalog?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingGame(null)}
        loading={saving}
      />
    </DashboardLayout>
  );
}