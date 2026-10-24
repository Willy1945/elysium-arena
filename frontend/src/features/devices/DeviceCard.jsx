import { Gamepad2, Monitor, Eye, Pencil, Trash2, CalendarPlus, CalendarClock, Zap } from 'lucide-react';
import { formatRupiah, STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function DeviceCard({ device, onEdit, onDelete, onViewDetail, onBooking, onStartWalkIn }) {
  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
  const Icon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isAvailable = device.status === 'available';

  return (
    <div className="group bg-white border border-zinc-950 rounded-2xl overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#18181b] shadow-[2px_2px_0px_0px_#18181b] transition-all flex flex-col justify-between">
      <div>
        {/* Cover Image Banner */}
        <div className="relative h-44 bg-zinc-100 overflow-hidden">
          {device.photo ? (
            <img
              src={resolveImageUrl(device.photo)}
              alt={device.code}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
              <Icon size={44} className="text-zinc-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

          {/* Type Badge (Top-Left) */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white border border-zinc-950 flex items-center gap-1.5 text-zinc-900 text-[11px] font-bold shadow-[1px_1px_0px_0px_#18181b]">
            <Icon size={13} className="text-cust-red" />
            <span>{device.device_type?.name}</span>
          </div>

          {/* Status Badge (Top-Right) */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] ${status.badgeClass || 'bg-zinc-100 text-zinc-800'}`}>
              {status.label}
            </span>
          </div>

          {/* Price Tag Bottom Left */}
          <div className="absolute bottom-2.5 left-4">
            <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-semibold">Tarif Sewa</p>
            <p className="font-display font-black text-xl text-white">
              {formatRupiah(device.price_per_hour)}
              <span className="text-xs font-normal text-zinc-300 font-sans">/jam</span>
            </p>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-black text-zinc-950 text-lg uppercase tracking-tight">
              {device.code}
            </h3>
            <span className="text-[11px] text-zinc-900 bg-zinc-100 border border-zinc-950 rounded-md px-2 py-0.5 font-mono-tech font-bold shadow-[1px_1px_0px_0px_#18181b]">
              {device.games?.length || 0} Game
            </span>
          </div>

          {device.today_bookings_count > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 bg-amber-50 border border-zinc-950 rounded-lg px-2.5 py-1 mb-3 font-bold shadow-[1px_1px_0px_0px_#18181b]">
              <CalendarClock size={12} className="shrink-0 text-amber-600" />
              <span>{device.today_bookings_count} booking terdaftar hari ini</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Strip */}
      <div className={`p-2.5 pt-0 border-t border-zinc-100 grid ${isAvailable && onStartWalkIn ? 'grid-cols-5' : 'grid-cols-4'} gap-1.5 bg-zinc-50/50`}>
        {isAvailable && onStartWalkIn && (
          <button
            onClick={() => onStartWalkIn(device)}
            title="Mulai Sesi Walk-In (Langsung Main)"
            className="flex items-center justify-center py-2 rounded-xl bg-red-50 hover:bg-cust-red border border-zinc-950 text-cust-red hover:text-white transition cursor-pointer shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
          >
            <Zap size={14} />
          </button>
        )}
        <button
          onClick={() => onBooking(device)}
          title="Booking Stasiun Ini"
          disabled={device.status === 'maintenance'}
          className="flex items-center justify-center py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
        >
          <CalendarPlus size={14} />
        </button>
        <button
          onClick={() => onViewDetail(device)}
          title="Lihat Detail Spesifikasi"
          className="flex items-center justify-center py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 transition cursor-pointer shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => onEdit(device)}
          title="Edit Data Stasiun"
          className="flex items-center justify-center py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 transition cursor-pointer shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(device)}
          title="Hapus Stasiun"
          className="flex items-center justify-center py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 border border-zinc-950 text-zinc-700 hover:border-red-600 transition cursor-pointer shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
