import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SessionCard from './SessionCard';
import ExtendSessionModal from './ExtendSessionModal';
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
    // Polling ringan tiap 15 detik untuk sinkronisasi antar admin (bukan sumber timer, cuma refresh data)
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleExtend = async (minutes) => {
    setActingId(extendTarget.id);
    try {
      await sessionService.extend(extendTarget.id, minutes);
      toast.success('Waktu berhasil ditambahkan.');
      setExtendTarget(null);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambah waktu.');
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
      <div className="mb-6">
        <h2 className="text-text-primary text-2xl font-semibold">Active Sessions</h2>
        <p className="text-text-secondary text-sm">Monitor sesi bermain yang sedang berjalan.</p>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-text-secondary text-sm">Belum ada sesi yang berjalan. Mulai session dari halaman Devices.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <ExtendSessionModal
        open={!!extendTarget}
        onClose={() => setExtendTarget(null)}
        onConfirm={handleExtend}
        loading={!!actingId}
      />

      <ConfirmDialog
        open={!!endTarget}
        title="Akhiri Sesi?"
        message={`Akhiri sesi ${endTarget?.device?.code} untuk ${endTarget?.user?.name}? Timer akan berhenti dan device kembali tersedia.`}
        onConfirm={handleEndConfirm}
        onCancel={() => setEndTarget(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}