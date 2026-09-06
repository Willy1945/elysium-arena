import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, CheckCircle2, PackageCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { cafeDashboardService } from '../../api/cafeDashboardService';

function StatCard({ icon: Icon, label, value, colorVar }) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, var(--color-${colorVar}) 12%, transparent)` }}
      >
        <Icon size={22} style={{ color: `var(--color-${colorVar})` }} />
      </div>
      <div>
        <p className="text-text-secondary text-xs">{label}</p>
        <p className="text-text-primary font-bold text-2xl leading-tight">{value}</p>
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
    return <DashboardLayout><p className="text-text-secondary text-sm">Memuat data...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-text-primary text-2xl font-semibold">Cafe Dashboard</h2>
        <p className="text-text-secondary text-sm">Ringkasan order dan stok hari ini.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock} label="Pending" value={data.pending_count} colorVar="status-booked" />
        <StatCard icon={Flame} label="Processing" value={data.processing_count} colorVar="status-occupied" />
        <StatCard icon={PackageCheck} label="Ready" value={data.ready_count} colorVar="status-available" />
        <StatCard icon={CheckCircle2} label="Selesai Hari Ini" value={data.completed_today} colorVar="status-maintenance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link
          to="/admin/orders"
          className="bg-surface-elevated border border-border rounded-xl p-6 hover:border-accent/40 transition flex items-center justify-between"
        >
          <div>
            <h3 className="text-text-primary font-semibold mb-1">Kelola Order</h3>
            <p className="text-text-secondary text-sm">Proses pesanan masuk di Kitchen Dashboard.</p>
          </div>
          <ArrowRight size={20} className="text-text-secondary" />
        </Link>

        <Link
          to="/admin/products"
          className="bg-surface-elevated border border-border rounded-xl p-6 hover:border-accent/40 transition flex items-center justify-between"
        >
          <div>
            <h3 className="text-text-primary font-semibold mb-1">Kelola Produk</h3>
            <p className="text-text-secondary text-sm">Atur menu, harga, dan stok F&B.</p>
          </div>
          <ArrowRight size={20} className="text-text-secondary" />
        </Link>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-surface-elevated border border-accent/30 rounded-xl p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-accent-light" />
            <h3 className="text-text-primary font-semibold">Stok Menipis</h3>
          </div>
          <div className="flex flex-col gap-2">
            {data.low_stock_products.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-surface-inset rounded-lg p-3">
                <span className="text-text-primary text-sm">{p.name}</span>
                <span className="text-accent-light text-sm font-medium">Sisa {p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}