import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { bookingService } from '../../api/bookingService';
import { formatRupiah, BOOKING_STATUS_CONFIG } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../../api/sessionService';
import { Trash2, Search } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export default function BookingsListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [actingId, setActingId] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await bookingService.getAll(params);
      setBookings(data.data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleStatusChange = async (id, status) => {
    setActingId(id);
    try {
      await bookingService.updateStatus(id, status);
      toast.success('Status booking berhasil diperbarui.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status booking.');
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async () => {
    setActingId(deletingBooking.id);
    try {
      await bookingService.remove(deletingBooking.id);
      toast.success('Booking berhasil dihapus.');
      setDeletingBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus booking.');
    } finally {
      setActingId(null);
    }
  };

  const handleStartFromBooking = async (booking) => {
    setActingId(booking.id);
    try {
      await sessionService.start({
        device_id: booking.device.id,
        booking_id: booking.id,
        duration: booking.duration,
      });
      toast.success('Session berhasil dimulai.');
      navigate('/admin/sessions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memulai session.');
    } finally {
      setActingId(null);
    }
  };

  const filters = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Bookings</h2>
          <p className="text-text-secondary text-sm">Kelola jadwal booking gaming station.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Cari kode booking / nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-elevated border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent w-64"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${statusFilter === f
                  ? 'bg-accent text-accent-lighter'
                  : 'border border-border text-text-secondary hover:bg-surface-elevated'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-status-available/10 border border-status-available/20 text-status-available text-sm rounded-lg px-4 py-3 mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-secondary text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Device</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Waktu</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-text-secondary">Memuat data...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-text-secondary">Belum ada booking.</td></tr>
            ) : (
              bookings.map((b) => {
                const status = BOOKING_STATUS_CONFIG[b.status];
                return (
                  <tr key={b.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 text-text-primary font-medium">{b.booking_code}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.user?.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.device?.code}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.booking_date}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.start_time} - {b.end_time}</td>
                    <td className="px-4 py-3 text-text-primary">{formatRupiah(b.total_price)}</td>
                    <td className="px-4 py-3"><Badge colorVar={status.color}>{status.label}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {b.status === 'pending' && (
                          <button
                            disabled={actingId === b.id}
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                            className="text-xs px-2.5 py-1 rounded border border-status-available/30 text-status-available hover:bg-status-available/10 transition disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            disabled={actingId === b.id}
                            onClick={() => handleStartFromBooking(b)}
                            className="text-xs px-2.5 py-1 rounded border border-status-available/30 text-status-available hover:bg-status-available/10 transition disabled:opacity-50"
                          >
                            Start Session
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            disabled={actingId === b.id}
                            onClick={() => handleStatusChange(b.id, 'completed')}
                            className="text-xs px-2.5 py-1 rounded border border-accent/30 text-accent-light hover:bg-accent/10 transition disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(b.status) && (
                          <button
                            disabled={actingId === b.id}
                            onClick={() => handleStatusChange(b.id, 'cancelled')}
                            className="text-xs px-2.5 py-1 rounded border border-status-occupied/30 text-status-occupied hover:bg-status-occupied/10 transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                        {['completed', 'cancelled'].includes(b.status) && (
                          <button
                            disabled={actingId === b.id}
                            onClick={() => setDeletingBooking(b)}
                            title="Hapus"
                            className="text-xs px-2.5 py-1 rounded border border-border text-text-secondary hover:bg-status-occupied/10 hover:text-status-occupied hover:border-status-occupied/30 transition disabled:opacity-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={!!deletingBooking}
        title="Hapus Booking?"
        message={`Yakin ingin menghapus booking ${deletingBooking?.booking_code}? Data ini tidak bisa dikembalikan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBooking(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}