import { formatRupiah, ORDER_STATUS_CONFIG, ORDER_STATUS_FLOW, ORDER_STATUS_ACTION_LABEL } from '../../utils/format';
import Badge from '../../components/common/Badge';
import { Monitor, User } from 'lucide-react';

export default function OrderCard({ order, onAdvance, onCancel, acting }) {
  const status = ORDER_STATUS_CONFIG[order.status] || { label: order.status, color: 'neutral' };
  const nextStatus = ORDER_STATUS_FLOW[order.status];
  const actionLabel = ORDER_STATUS_ACTION_LABEL[order.status];

  return (
    <div className="bg-zinc-50 border border-zinc-950 rounded-xl p-4 flex flex-col gap-3 shadow-[2px_2px_0px_0px_#18181b] hover:bg-white transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-zinc-950 font-black text-xs font-mono-tech tracking-wide">{order.order_code}</p>
          <div className="flex items-center gap-1.5 text-zinc-600 text-xs mt-0.5">
            {order.session ? (
              <>
                <Monitor size={12} className="text-cust-red" />
                <span className="font-bold text-zinc-900">{order.session.device_code}</span>
              </>
            ) : (
              <>
                <User size={12} className="text-zinc-500" />
                <span className="font-medium">{order.user?.name || 'Take-away'}</span>
              </>
            )}
          </div>
        </div>
        <Badge colorVar={status.color}>{status.label}</Badge>
      </div>

      <div className="flex flex-col gap-1.5 bg-white border border-zinc-950 rounded-lg p-3 shadow-[1px_1px_0px_0px_#18181b]">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-zinc-800 font-bold">
              {item.product.name} <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
            </span>
            <span className="text-zinc-900 font-mono-tech font-bold">{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-zinc-500 text-xs uppercase tracking-wider font-mono-tech font-bold">Total Tagihan</span>
        <span className="text-zinc-950 font-black text-sm font-mono-tech">{formatRupiah(order.total_price)}</span>
      </div>

      {nextStatus && (
        <div className="flex gap-2 pt-1 border-t border-zinc-200">
          <button
            onClick={() => onAdvance(order, nextStatus)}
            disabled={acting}
            className="flex-1 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 cursor-pointer"
          >
            {actionLabel}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order)}
              disabled={acting}
              className="px-3 border border-zinc-950 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[1px_1px_0px_0px_#18181b] transition disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
