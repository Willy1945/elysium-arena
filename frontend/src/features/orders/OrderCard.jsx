import { formatRupiah, ORDER_STATUS_CONFIG, ORDER_STATUS_FLOW, ORDER_STATUS_ACTION_LABEL } from '../../utils/format';
import Badge from '../../components/common/Badge';

export default function OrderCard({ order, onAdvance, onCancel, acting }) {
  const status = ORDER_STATUS_CONFIG[order.status];
  const nextStatus = ORDER_STATUS_FLOW[order.status];
  const actionLabel = ORDER_STATUS_ACTION_LABEL[order.status];

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-primary font-semibold text-sm">{order.order_code}</p>
          <p className="text-text-secondary text-xs">{order.session ? order.session.device_code : order.user?.name}</p>
        </div>
        <Badge colorVar={status.color}>{status.label}</Badge>
      </div>

      <div className="flex flex-col gap-1 bg-surface-inset rounded-lg p-2.5">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <span className="text-text-primary">{item.product.name} ×{item.quantity}</span>
            <span className="text-text-secondary">{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-xs">Total</span>
        <span className="text-text-primary font-semibold text-sm">{formatRupiah(order.total_price)}</span>
      </div>

      {nextStatus && (
        <div className="flex gap-2">
          <button
            onClick={() => onAdvance(order, nextStatus)}
            disabled={acting}
            className="flex-1 bg-accent hover:opacity-90 text-white text-xs font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {actionLabel}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onCancel(order)}
              disabled={acting}
              className="px-3 border border-status-occupied/30 text-status-occupied text-xs rounded-lg hover:bg-status-occupied/10 transition disabled:opacity-50"
            >
              Batal
            </button>
          )}
        </div>
      )}
    </div>
  );
}