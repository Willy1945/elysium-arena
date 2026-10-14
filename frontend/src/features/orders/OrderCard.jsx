import { formatRupiah, ORDER_STATUS_CONFIG, ORDER_STATUS_FLOW, ORDER_STATUS_ACTION_LABEL } from '../../utils/format';
import Badge from '../../components/common/Badge';
import { Monitor, User } from 'lucide-react';

export default function OrderCard({ order, onAdvance, onCancel, acting }) {
  const status = ORDER_STATUS_CONFIG[order.status] || { label: order.status, color: 'neutral' };
  const nextStatus = ORDER_STATUS_FLOW[order.status];
  const actionLabel = ORDER_STATUS_ACTION_LABEL[order.status];

  return (
    <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-4 flex flex-col gap-3 shadow-md hover:border-zinc-700 transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-bold text-xs font-mono-tech tracking-wide">{order.order_code}</p>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
            {order.session ? (
              <>
                <Monitor size={12} className="text-cust-red" />
                <span className="font-semibold text-zinc-300">{order.session.device_code}</span>
              </>
            ) : (
              <>
                <User size={12} className="text-zinc-500" />
                <span>{order.user?.name || 'Take-away'}</span>
              </>
            )}
          </div>
        </div>
        <Badge colorVar={status.color}>{status.label}</Badge>
      </div>

      <div className="flex flex-col gap-1.5 bg-black/40 border border-zinc-800/60 rounded-xl p-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">
              {item.product.name} <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
            </span>
            <span className="text-zinc-400 font-mono-tech">{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-zinc-500 text-xs uppercase tracking-wider font-mono-tech font-semibold">Total Tagihan</span>
        <span className="text-white font-bold text-sm font-mono-tech">{formatRupiah(order.total_price)}</span>
      </div>

      {nextStatus && (
        <div className="flex gap-2 pt-1 border-t border-zinc-800/60">
          <button
            onClick={() => onAdvance(order, nextStatus)}
            disabled={acting}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-50 shadow-md shadow-cust-red/10 cursor-pointer"
          >
            {actionLabel}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order)}
              disabled={acting}
              className="px-3 border border-rose-900/40 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      )}
    </div>
  );
}