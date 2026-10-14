import { Gamepad2, Monitor, Eye, Pencil, Trash2, CalendarPlus, CalendarClock, Zap } from 'lucide-react';
import { formatRupiah, STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function DeviceCard({ device, onEdit, onDelete, onViewDetail, onBooking, onStartWalkIn }) {
  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
  const Icon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isAvailable = device.status === 'available';

  return (
    <div className="group bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cover Image Banner */}
        <div className="relative h-44 bg-zinc-900 overflow-hidden">
          {device.photo ? (
            <img
              src={resolveImageUrl(device.photo)}
              alt={device.code}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <Icon size={44} className="text-zinc-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/50" />

          {/* Type Badge (Top-Left) */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-white text-[11px] font-bold">
            <Icon size={13} className="text-cust-red" />
            <span>{device.device_type?.name}</span>
          </div>

          {/* Status Badge (Top-Right) */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase backdrop-blur-md border ${status.badgeClass || 'bg-zinc-900/80 text-zinc-300 border-zinc-700'}`}>
              {status.label}
            </span>
          </div>

          {/* Price Tag Bottom Left */}
          <div className="absolute bottom-2.5 left-4">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Tarif Sewa</p>
            <p className="font-display font-black text-xl text-white">
              {formatRupiah(device.price_per_hour)}
              <span className="text-xs font-normal text-zinc-400 font-sans">/jam</span>
            </p>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-black text-white text-lg uppercase tracking-tight">
              {device.code}
            </h3>
            <span className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-0.5 font-mono-tech">
              {device.games?.length || 0} Game
            </span>
          </div>

          {device.today_bookings_count > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/40 border border-amber-500/20 rounded-lg px-2.5 py-1 mb-3">
              <CalendarClock size={12} className="shrink-0" />
              <span>{device.today_bookings_count} booking terdaftar hari ini</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Strip */}
      <div className={`p-3 pt-0 border-t border-zinc-800/60 grid ${isAvailable && onStartWalkIn ? 'grid-cols-5' : 'grid-cols-4'} gap-1.5`}>
        {isAvailable && onStartWalkIn && (
          <button
            onClick={() => onStartWalkIn(device)}
            title="Mulai Sesi Walk-In (Langsung Main)"
            className="flex items-center justify-center py-2.5 rounded-xl bg-cust-red/15 hover:bg-cust-red border border-cust-red/40 text-cust-red hover:text-white transition cursor-pointer"
          >
            <Zap size={14} />
          </button>
        )}
        <button
          onClick={() => onBooking(device)}
          title="Booking Stasiun Ini"
          disabled={device.status === 'maintenance'}
          className="flex items-center justify-center py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <CalendarPlus size={14} />
        </button>
        <button
          onClick={() => onViewDetail(device)}
          title="Lihat Detail Spesifikasi"
          className="flex items-center justify-center py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
        >
          <Eye size={14} />
        </button>
        <button
          onClick={() => onEdit(device)}
          title="Edit Data Stasiun"
          className="flex items-center justify-center py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(device)}
          title="Hapus Stasiun"
          className="flex items-center justify-center py-2.5 rounded-xl bg-zinc-900 hover:bg-red-950/50 hover:text-red-400 border border-zinc-800 text-zinc-400 transition cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}