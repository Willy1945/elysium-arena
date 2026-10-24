import { UtensilsCrossed, Pencil, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatRupiah, STOCK_STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function ProductCard({ product, onEdit, onDelete }) {
  const stockStatus = STOCK_STATUS_CONFIG[product.stock_status] || STOCK_STATUS_CONFIG.in_stock;

  return (
    <div className="group bg-white border border-zinc-950 rounded-2xl overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#18181b] shadow-[2px_2px_0px_0px_#18181b] transition-all flex flex-col">
      <div className="relative h-44 bg-zinc-100 overflow-hidden">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
            <UtensilsCrossed size={36} className="text-zinc-400" />
          </div>
        )}

        <div className="absolute top-3 left-3 bg-white text-zinc-950 border border-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b]">
          {product.category?.name}
        </div>

        {!product.is_active && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white border border-zinc-950 rounded-xl shadow-[2px_2px_0px_0px_#18181b]">
              Nonaktif
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-zinc-950 font-bold text-sm line-clamp-1 group-hover:text-cust-red transition">
              {product.name}
            </h3>
            <span className="text-zinc-950 font-black text-sm font-mono-tech whitespace-nowrap">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-600 text-xs font-mono-tech">
              Stok: <strong className="text-zinc-950 font-black">{product.stock}</strong>
            </span>
            <Badge colorVar={stockStatus.color}>{stockStatus.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-200">
          <button
            onClick={() => onEdit(product)}
            title="Edit Data Produk"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product)}
            title="Hapus Produk"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-zinc-950 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
