import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, CheckCircle2, PackageCheck, AlertTriangle, ArrowRight, UtensilsCrossed, PackageOpen } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { cafeDashboardService } from '../../api/cafeDashboardService';

function StatCard({ icon: Icon, label, value, badgeClass, iconColor }) {
  return (
    <div className="bg-white border border-zinc-950 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#18181b] flex items-center justify-between">
      <div>
        <span className="text-zinc-600 text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-wider block font-bold mb-1">
          {label}
        </span>
        <span className="text-zinc-950 font-black text-2xl sm:text-3xl font-mono-tech">
          {value}
        </span>
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-zinc-950 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#18181b] ${badgeClass}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  );
}

export default function CafeDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    cafeDashboardService.getSummary().then(({ data }) => setData(data));
  }, []);

  if (!data) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat ringkasan kafe...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <UtensilsCrossed size={14} />
            <span>Operasional Kafe & Kitchen</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Kitchen & Barista HUD
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Ringkasan antrean pesanan aktif, saji, dan pemantauan stok bahan baku kafe hari ini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
        <StatCard
          icon={Clock}
          label="Pending Masuk"
          value={data.pending_count}
          badgeClass="bg-amber-100"
          iconColor="text-amber-900"
        />
        <StatCard
          icon={Flame}
          label="Sedang Diproses"
          value={data.processing_count}
          badgeClass="bg-orange-100"
          iconColor="text-orange-900"
        />
        <StatCard
          icon={PackageCheck}
          label="Siap Diantar"
          value={data.ready_count}
          badgeClass="bg-emerald-100"
          iconColor="text-emerald-900"
        />
        <StatCard
          icon={CheckCircle2}
          label="Selesai Hari Ini"
          value={data.completed_today}
          badgeClass="bg-zinc-100"
          iconColor="text-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <Link
          to="/admin/orders"
          className="group bg-white border border-zinc-950 rounded-2xl p-6 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#18181b] shadow-[3px_3px_0px_0px_#18181b] transition-all flex items-center justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-cust-red text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-2">
              <Flame size={12} /> Kitchen Pipeline
            </div>
            <h3 className="text-zinc-950 font-black text-lg font-display uppercase tracking-tight group-hover:text-cust-red transition">
              Buka Kitchen Dashboard
            </h3>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
              Proses antrean pesanan masuk dan update status persiapan makanan.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-950 flex items-center justify-center text-zinc-950 group-hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b] transition shrink-0 ml-4">
            <ArrowRight size={18} />
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="group bg-white border border-zinc-950 rounded-2xl p-6 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#18181b] shadow-[3px_3px_0px_0px_#18181b] transition-all flex items-center justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-cust-red text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-2">
              <PackageOpen size={12} /> Inventaris Kafe
            </div>
            <h3 className="text-zinc-950 font-black text-lg font-display uppercase tracking-tight group-hover:text-cust-red transition">
              Kelola Menu & Stok Produk
            </h3>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium">
              Atur harga jual, kategori menu makanan/minuman, serta restock barang.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-950 flex items-center justify-center text-zinc-950 group-hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b] transition shrink-0 ml-4">
            <ArrowRight size={18} />
          </div>
        </Link>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-white border border-zinc-950 rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0px_0px_#18181b]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 mb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100 border border-zinc-950 text-amber-900 shadow-[1px_1px_0px_0px_#18181b]">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                  Peringatan Stok Menipis
                </h3>
                <p className="text-zinc-600 text-xs mt-0.5 font-medium">
                  Produk berikut berada di bawah batas minimum stok dan perlu segera di-restock.
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-amber-800 hover:text-amber-950 font-bold uppercase tracking-wider underline underline-offset-4 self-start sm:self-auto"
            >
              Restock Sekarang
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.low_stock_products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-zinc-50 border border-zinc-950 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#18181b]"
              >
                <div>
                  <p className="text-zinc-950 text-xs font-bold">{p.name}</p>
                  <p className="text-zinc-500 text-[10px] font-mono-tech mt-0.5">Min: {p.minimum_stock || 5}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 border border-zinc-950 text-rose-800 text-xs font-mono-tech font-bold shadow-[1px_1px_0px_0px_#18181b]">
                  Sisa {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
