import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, UtensilsCrossed, Clock, Flame, PackageCheck, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OrderCard from './OrderCard';
import { orderService } from '../../api/orderService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { status: 'pending', title: 'Pending', icon: Clock, badgeClass: 'bg-amber-100 border-zinc-950 text-amber-900' },
  { status: 'processing', title: 'Diproses', icon: Flame, badgeClass: 'bg-orange-100 border-zinc-950 text-orange-950' },
  { status: 'ready', title: 'Siap Antar', icon: PackageCheck, badgeClass: 'bg-emerald-100 border-zinc-950 text-emerald-950' },
  { status: 'delivered', title: 'Selesai', icon: CheckCircle2, badgeClass: 'bg-zinc-100 border-zinc-950 text-zinc-900' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [mobileColumnFilter, setMobileColumnFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await orderService.getAll();
      setOrders(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAdvance = async (order, nextStatus) => {
    setActingId(order.id);
    try {
      await orderService.updateStatus(order.id, nextStatus);
      toast.success('Status antrean pesanan berhasil diupdate.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update status pesanan.');
    } finally {
      setActingId(null);
    }
  };

  const handleCancelClick = (order) => {
    setCancelTarget(order);
  };

  const handleCancelConfirm = async () => {
    setActingId(cancelTarget.id);
    try {
      await orderService.updateStatus(cancelTarget.id, 'cancelled');
      toast.success('Pesanan berhasil dibatalkan, inventaris stok dikembalikan.');
      setCancelTarget(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <UtensilsCrossed size={14} />
            <span>Kitchen & Cafe Pipeline</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Antrean Pesanan Dapur
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Monitor dan proses pesanan makanan & minuman pelanggan secara real-time.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/orders/new')}
          className="inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Buat Order Baru
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-zinc-950 text-emerald-950 text-xs font-bold rounded-xl px-4 py-3 mb-6 shadow-[2px_2px_0px_0px_#18181b]">
          {successMessage}
        </div>
      )}

      <div className="md:hidden mb-6 overflow-x-auto pb-1 scrollbar-none">
        <div className="bg-white border border-zinc-950 rounded-xl p-1 inline-flex gap-1 shadow-[2px_2px_0px_0px_#18181b]">
          <button
            onClick={() => setMobileColumnFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition ${
              mobileColumnFilter === 'all'
                ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Semua ({orders.length})
          </button>
          {COLUMNS.map((col) => {
            const count = orders.filter((o) => o.status === col.status).length;
            const active = mobileColumnFilter === col.status;
            return (
              <button
                key={col.status}
                onClick={() => setMobileColumnFilter(col.status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition ${
                  active
                    ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                {col.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat antrean dapur...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {COLUMNS.filter((col) => mobileColumnFilter === 'all' || col.status === mobileColumnFilter).map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);
            const Icon = col.icon;
            return (
              <div
                key={col.status}
                className="bg-white border border-zinc-950 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#18181b] flex flex-col gap-4"
              >

                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] ${col.badgeClass}`}>
                      <Icon size={14} />
                    </span>
                    <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wide font-display">
                      {col.title}
                    </h3>
                  </div>
                  <span className="font-mono-tech text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-950 text-zinc-950 shadow-[1px_1px_0px_0px_#18181b]">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[160px]">
                  {columnOrders.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded-xl text-center p-4">
                      <p className="text-zinc-500 text-xs font-medium">Tidak ada pesanan</p>
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAdvance={handleAdvance}
                        onCancel={handleCancelClick}
                        acting={actingId === order.id}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title="Batalkan Pesanan?"
        message={`Batalkan pesanan ${cancelTarget?.order_code}? Stok produk pesanan ini akan otomatis dikembalikan ke inventaris.`}
        confirmLabel="Batalkan Pesanan"
        confirmingLabel="Membatalkan..."
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}
