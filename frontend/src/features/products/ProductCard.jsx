import { UtensilsCrossed, Pencil, Trash2, PackagePlus } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatRupiah, STOCK_STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function ProductCard({ product, onEdit, onDelete, onAdjustStock }) {
  const stockStatus = STOCK_STATUS_CONFIG[product.stock_status] || STOCK_STATUS_CONFIG.in_stock;

  return (
    <div className="group bg-surface-elevated border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-all">
      <div className="relative h-48 bg-surface-inset">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed size={36} className="text-text-secondary opacity-30" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded">
          {product.category?.name}
        </div>

        {!product.is_active && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Nonaktif</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-text-primary font-semibold text-sm leading-tight">{product.name}</h3>
          <span className="text-text-primary font-bold text-sm whitespace-nowrap ml-2">{formatRupiah(product.price)}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-text-secondary text-xs">Stok: {product.stock}</span>
          <Badge colorVar={stockStatus.color}>{stockStatus.label}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onAdjustStock(product)}
            title="Sesuaikan Stok"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-inset hover:text-accent-light transition"
          >
            <PackagePlus size={15} />
          </button>
          <button
            onClick={() => onEdit(product)}
            title="Edit"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-inset hover:text-text-primary transition"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(product)}
            title="Hapus"
            className="flex items-center justify-center py-2 rounded-lg border border-border text-text-secondary hover:bg-status-occupied/10 hover:text-status-occupied transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}