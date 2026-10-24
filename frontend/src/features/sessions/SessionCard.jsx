import { Gamepad2, Monitor, Clock, SlidersHorizontal, Square, AlertTriangle, User } from 'lucide-react';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { formatRupiah } from '../../utils/format';

export default function SessionCard({ session, onExtend, onEnd, actingId }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);
  const TypeIcon = session.device?.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isActing = actingId === session.id;

  return (
    <div
      className={`bg-white border-2 rounded-2xl p-6 shadow-[3px_3px_0px_0px_#18181b] flex flex-col justify-between transition-all duration-200 ${
        isExpired ? 'border-rose-600 bg-rose-50/30' : 'border-zinc-950'
      }`}
    >
      <div>
        {/* Header Unit & Alert */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-950 flex items-center justify-center text-cust-red shadow-[1px_1px_0px_0px_#18181b]">
              <TypeIcon size={16} />
            </div>
            <div>
              <h3 className="font-display font-black text-zinc-950 text-lg uppercase tracking-tight leading-none">
                {session.device?.code}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono-tech font-bold mt-0.5">
                {session.device?.device_type?.name} RIG
              </p>
            </div>
          </div>

          {isExpired ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 border border-zinc-950 text-rose-800 text-[10px] font-bold uppercase shadow-[1px_1px_0px_0px_#18181b] animate-pulse">
              <AlertTriangle size={12} /> Waktu Habis
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 border border-zinc-950 text-emerald-900 text-[10px] font-bold uppercase shadow-[1px_1px_0px_0px_#18181b]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Berjalan
            </span>
          )}
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-900 mb-4 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b]">
          <div className="flex items-center gap-2 min-w-0">
            <User size={13} className="text-zinc-600 shrink-0" />
            <span className="font-bold truncate">
              {session.is_guest
                ? (session.guest_name ? `Tamu: ${session.guest_name}` : 'Tamu Walk-In')
                : (session.user?.name || session.guest_name || 'Pelanggan')}
            </span>
          </div>
          {session.is_guest ? (
            <span className="shrink-0 text-[10px] font-mono-tech px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 border border-zinc-950 font-bold">
              Non-Member
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-zinc-950 font-bold">
              Member
            </span>
          )}
        </div>

        {/* Big Countdown Timer */}
        <div className="text-center py-5 rounded-xl bg-zinc-50 border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] mb-4">
          <p className="text-xs text-zinc-600 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Clock size={12} className="text-cust-red" />
            Sisa Waktu
          </p>
          <p className={`font-display font-black text-4xl tabular-nums ${isExpired ? 'text-cust-red' : 'text-zinc-950'}`}>
            {formatted}
          </p>
        </div>

        {/* Rate & Duration Info */}
        <div className="flex items-center justify-between text-xs text-zinc-600 mb-5 px-1 font-mono-tech">
          <span>Durasi: <strong className="text-zinc-950">{session.duration / 60} jam</strong></span>
          <span className="text-zinc-950 font-black">{formatRupiah(session.price)}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-200">
        <button
          onClick={() => onExtend(session)}
          disabled={isActing}
          className="flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 cursor-pointer"
        >
          <SlidersHorizontal size={13} />
          <span>Kelola Waktu</span>
        </button>
        <button
          onClick={() => onEnd(session)}
          disabled={isActing}
          className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-zinc-950 text-rose-700 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 cursor-pointer"
        >
          <Square size={13} />
          <span>Akhiri Sesi</span>
        </button>
      </div>
    </div>
  );
}
