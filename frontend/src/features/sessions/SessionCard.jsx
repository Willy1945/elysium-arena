import { Gamepad2, Monitor, Clock, SlidersHorizontal, Square, AlertTriangle, User } from 'lucide-react';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { formatRupiah } from '../../utils/format';

export default function SessionCard({ session, onExtend, onEnd, actingId }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);
  const TypeIcon = session.device?.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isActing = actingId === session.id;

  return (
    <div
      className={`bg-[#121216] border rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-200 ${
        isExpired ? 'border-red-500/60 bg-red-950/10' : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div>
        {/* Header Unit & Alert */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red">
              <TypeIcon size={16} />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-lg uppercase tracking-tight leading-none">
                {session.device?.code}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono-tech mt-0.5">
                {session.device?.device_type?.name} RIG
              </p>
            </div>
          </div>

          {isExpired ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase animate-pulse">
              <AlertTriangle size={12} /> Waktu Habis
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Berjalan
            </span>
          )}
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-300 mb-4 bg-zinc-900/60 px-3 py-2 rounded-xl border border-zinc-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <User size={13} className="text-zinc-500 shrink-0" />
            <span className="font-medium truncate">
              {session.is_guest
                ? (session.guest_name ? `Tamu: ${session.guest_name}` : 'Tamu Walk-In')
                : (session.user?.name || session.guest_name || 'Pelanggan')}
            </span>
          </div>
          {session.is_guest ? (
            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-medium">
              Non-Member
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30 font-medium">
              Member
            </span>
          )}
        </div>

        {/* Big Countdown Timer */}
        <div className="text-center py-5 rounded-2xl bg-[#09090c] border border-zinc-800/80 mb-4">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Clock size={12} className="text-cust-red" />
            Sisa Waktu
          </p>
          <p className={`font-display font-black text-4xl tabular-nums ${isExpired ? 'text-cust-red' : 'text-white'}`}>
            {formatted}
          </p>
        </div>

        {/* Rate & Duration Info */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-5 px-1">
          <span>Durasi: <strong>{session.duration / 60} jam</strong></span>
          <span className="text-white font-semibold">{formatRupiah(session.price)}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/60">
        <button
          onClick={() => onExtend(session)}
          disabled={isActing}
          className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl py-2.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          <SlidersHorizontal size={13} />
          <span>Kelola Waktu</span>
        </button>
        <button
          onClick={() => onEnd(session)}
          disabled={isActing}
          className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-red-950/50 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 rounded-xl py-2.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          <Square size={13} />
          <span>Akhiri Sesi</span>
        </button>
      </div>
    </div>
  );
}