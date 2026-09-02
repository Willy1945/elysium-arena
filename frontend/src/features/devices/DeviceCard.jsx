import { Gamepad2, Monitor, Eye, Pencil, Trash2, CalendarPlus, CalendarClock } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatRupiah, STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function DeviceCard({ device, onEdit, onDelete, onViewDetail, onBooking }) {
  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
  const Icon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;

  return (
    <div className="group bg-surface-elevated border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-all">
      {/* Cover Image */}
      <div className="relative h-40 bg-surface-inset overflow-hidden">
        {device.photo ? (
          <img
            src={resolveImageUrl(device.photo)}
            alt={device.code}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon size={36} className="text-text-secondary opacity-30" />
          </div>
        )}

        {/* Type icon badge — pojok kiri atas */}
        <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
          <Icon size={15} className="text-accent-light" />
        </div>

        {/* Status badge — pojok kanan atas */}
        <div className="absolute top-2.5 right-2.5">
          <Badge colorVar={status.color}>{status.label}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-text-primary font-semibold text-sm leading-tight">{device.code}</h3>
            <p className="text-text-secondary text-[11px] mt-0.5">{device.device_type?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-text-primary font-bold text-sm leading-tight">{formatRupiah(device.price_per_hour)}</p>
            <p className="text-text-secondary text-[10px]">/ jam</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-4 min-h-[22px]">
            <span className="text-[10px] text-text-secondary bg-surface-inset border border-border rounded px-2 py-1">
              {device.games?.length || 0} game
            </span>
          {device.today_bookings_count > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-accent-light bg-accent/10 border border-accent/20 rounded px-2 py-1">
              <CalendarClock size={10} />
              {device.today_bookings_count} booking hari ini
            </span>
          )}
        </div>

        {/* Secondary Actions — 1 baris rata, tidak wrap */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => onBooking(device)}
            title="Booking"
            disabled={device.status === 'maintenance'}
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-inset hover:text-accent-light transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <CalendarPlus size={14} />
          </button>
          <button
            onClick={() => onViewDetail(device)}
            title="Lihat Detail"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-inset hover:text-accent-light transition"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(device)}
            title="Edit"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-inset hover:text-text-primary transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(device)}
            title="Hapus"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-status-occupied/10 hover:text-status-occupied hover:border-status-occupied/30 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}