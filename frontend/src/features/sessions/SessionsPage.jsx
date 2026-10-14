import { useState, useEffect, useCallback } from 'react';
import { Timer, Activity, Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SessionCard from './SessionCard';
import ExtendSessionModal from './ExtendSessionModal';
import StartSessionModal from './StartSessionModal';
import { sessionService } from '../../api/sessionService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function SessionsPage() {
  const toast = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendTarget, setExtendTarget] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [endTarget, setEndTarget] = useState(null);
  const [startWalkInOpen, setStartWalkInOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const { data } = await sessionService.getActive();
      setSessions(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleExtend = async (minutes) => {
    setActingId(extendTarget.id);
    try {
      await sessionService.extend(extendTarget.id, minutes);
      toast.success(minutes > 0 ? 'Waktu berhasil ditambahkan.' : 'Waktu berhasil dikurangi.');
      setExtendTarget(null);
      fetchSessions();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0]?.[0] : null;
      toast.error(firstError || err.response?.data?.message || 'Gagal mengubah durasi waktu.');
    } finally {
      setActingId(null);
    }
  };

  const handleEndClick = (session) => {
    setEndTarget(session);
  };

  const handleEndConfirm = async () => {
    setActingId(endTarget.id);
    try {
      await sessionService.end(endTarget.id);
      toast.success('Sesi berhasil diakhiri.');
      setEndTarget(null);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengakhiri sesi.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout>
      {/* ── HEADER TITLE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Timer size={14} />
            <span>Sesi Bermain Aktif</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Monitoring Stasiun Berjalan
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Kelola durasi bermain, sinkronisasi Smart Lock, dan penambahan waktu sewa secara realtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{sessions.length} Stasiun Berjalan</span>
          </div>

          <button
            onClick={() => setStartWalkInOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cust-red/20 active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Mulai Sesi Walk-In</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs uppercase tracking-wider">
          Memuat sesi aktif...
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-[#121216]/50">
          <Timer size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-white font-bold text-sm mb-1">Tidak Ada Sesi yang Berjalan</p>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-5">
            Semua stasiun sedang standby. Sesi akan otomatis muncul di sini saat pelanggan mulai bermain.
          </p>
          <button
            onClick={() => setStartWalkInOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cust-red/25 active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Mulai Sesi Walk-In Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onExtend={setExtendTarget}
              onEnd={handleEndClick}
              actingId={actingId}
            />
          ))}
        </div>
      )}

      {/* Modal Mulai Sesi Walk-In */}
      <StartSessionModal
        open={startWalkInOpen}
        onClose={() => setStartWalkInOpen(false)}
        onSuccess={fetchSessions}
      />

      <ExtendSessionModal
        open={!!extendTarget}
        onClose={() => setExtendTarget(null)}
        onConfirm={handleExtend}
        loading={!!actingId}
      />

      <ConfirmDialog
        open={!!endTarget}
        title="Akhiri Sesi Bermain?"
        message={`Yakin ingin menghentikan sesi ${endTarget?.device?.code} untuk pelanggan ${endTarget?.user?.name || endTarget?.guest_name || 'Tamu'}? Smart Lock akan langsung terkunci.`}
        confirmLabel="Akhiri Sesi"
        confirmingLabel="Mengakhiri Sesi..."
        onConfirm={handleEndConfirm}
        onCancel={() => setEndTarget(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}