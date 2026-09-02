import { Gamepad2, Monitor, Clock, Plus, Square, AlertTriangle } from 'lucide-react';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { formatRupiah } from '../../utils/format';

export default function SessionCard({ session, onExtend, onEnd, actingId }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);
  const TypeIcon = session.device?.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isActing = actingId === session.id;

  return (
    <div className={`bg-surface-elevated border rounded-xl p-5 flex flex-col gap-4 transition ${
      isExpired ? 'border-status-occupied' : 'border-border'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon size={18} className="text-accent-light" />
          <h3 className="text-text-primary font-semibold">{session.device?.code}</h3>
        </div>
        {isExpired && (
          <span className="flex items-center gap-1 text-status-occupied text-[11px] font-medium">
            <AlertTriangle size={12} /> Waktu Habis
          </span>
        )}
      </div>

      <p className="text-text-secondary text-sm">{session.user?.name}</p>

      <div className={`text-center py-4 rounded-lg ${isExpired ? 'bg-status-occupied/10' : 'bg-surface-inset'}`}>
        <p className={`text-3xl font-bold tabular-nums ${isExpired ? 'text-status-occupied' : 'text-text-primary'}`}>
          {formatted}
        </p>
        <p className="text-text-secondary text-[11px] mt-1 flex items-center justify-center gap-1">
          <Clock size={10} /> Sisa Waktu
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>Durasi: {session.duration / 60} jam</span>
        <span className="text-text-primary font-medium">{formatRupiah(session.price)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onExtend(session)}
          disabled={isActing}
          className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-lg py-2 text-xs text-text-secondary hover:bg-surface-inset transition disabled:opacity-50"
        >
          <Plus size={13} /> Tambah Waktu
        </button>
        <button
          onClick={() => onEnd(session)}
          disabled={isActing}
          className="flex-1 flex items-center justify-center gap-1.5 border border-status-occupied/30 rounded-lg py-2 text-xs text-status-occupied hover:bg-status-occupied/10 transition disabled:opacity-50"
        >
          <Square size={13} /> Akhiri Sesi
        </button>
      </div>
    </div>
  );
}