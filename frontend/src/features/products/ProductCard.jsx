import { UtensilsCrossed, Pencil, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatRupiah, STOCK_STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function ProductCard({ product, onEdit, onDelete }) {
  const stockStatus = STOCK_STATUS_CONFIG[product.stock_status] || STOCK_STATUS_CONFIG.in_stock;

  return (
    <div className="group bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-xl flex flex-col">
      <div className="relative h-44 bg-zinc-900 overflow-hidden">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <UtensilsCrossed size={36} className="text-zinc-700" />
          </div>
        )}

        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-800 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category?.name}
        </div>

        {!product.is_active && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-zinc-900/90 border border-zinc-800 rounded-full">
              Nonaktif
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold text-sm line-clamp-1 group-hover:text-cust-red transition">
              {product.name}
            </h3>
            <span className="text-white font-bold text-sm font-mono-tech whitespace-nowrap">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-xs font-mono-tech">
              Stok: <strong className="text-zinc-200">{product.stock}</strong>
            </span>
            <Badge colorVar={stockStatus.color}>{stockStatus.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80">
          <button
            onClick={() => onEdit(product)}
            title="Edit Data Produk"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition cursor-pointer"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product)}
            title="Hapus Produk"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-rose-400 hover:border-rose-900/40 hover:bg-rose-950/20 text-xs font-semibold transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}