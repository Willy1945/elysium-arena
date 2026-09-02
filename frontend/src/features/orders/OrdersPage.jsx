import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import OrderCard from './OrderCard';
import { orderService } from '../../api/orderService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const COLUMNS = [
  { status: 'pending', title: 'Pending' },
  { status: 'processing', title: 'Processing' },
  { status: 'ready', title: 'Ready' },
  { status: 'delivered', title: 'Delivered' },
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
      toast.success('Status order berhasil diperbarui.');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update status order.');
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
      toast.success('Order berhasil dibatalkan, stok dikembalikan.');
      setCancelTarget(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan order.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Kitchen Dashboard</h2>
          <p className="text-text-secondary text-sm">Kelola pesanan makanan & minuman.</p>
        </div>
        <button
          onClick={() => navigate('/admin/orders/new')}
          className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} /> Order Baru
        </button>
      </div>

      {successMessage && (
        <div className="bg-status-available/10 border border-status-available/20 text-status-available text-sm rounded-lg px-4 py-3 mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnOrders = orders.filter((o) => o.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary font-semibold text-sm">{col.title}</h3>
                  <span className="bg-surface-inset text-text-secondary text-xs px-2 py-0.5 rounded-full">{columnOrders.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {columnOrders.length === 0 ? (
                    <p className="text-text-secondary text-xs border border-dashed border-border rounded-lg p-4 text-center">Kosong</p>
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
        title="Batalkan Order?"
        message={`Batalkan order ${cancelTarget?.order_code}? Stok produk akan otomatis dikembalikan.`}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}