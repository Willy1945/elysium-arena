import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Search, CalendarCheck, Play, Check, X, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { bookingService } from '../../api/bookingService';
import { formatRupiah, BOOKING_STATUS_CONFIG } from '../../utils/format';
import { sessionService } from '../../api/sessionService';
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
      toast.success('Sesi stasiun berhasil dimulai.');
      navigate('/admin/sessions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memulai sesi stasiun.');
    } finally {
      setActingId(null);
    }
  };

  const filters = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];
  const FILTER_LABEL = {
    All: 'Semua',
    pending: 'Menunggu',
    confirmed: 'Terkonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  return (
    <DashboardLayout onSearch={setSearch}>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarCheck size={14} />
            <span>Manajemen Reservasi</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Daftar Booking Jadwal
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Verifikasi dan mulai sesi bermain stasiun langsung dari daftar booking pelanggan.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="overflow-x-auto max-w-full pb-1 scrollbar-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 inline-flex gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === f
                    ? 'bg-cust-red text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {FILTER_LABEL[f] || f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl px-4 py-3 mb-6">
          {successMessage}
        </div>
      )}

      {/* ── TABLE CARD CONTAINER ── */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400 uppercase tracking-wider font-mono-tech">
                <th className="px-5 py-4 font-semibold">Kode</th>
                <th className="px-5 py-4 font-semibold">Pelanggan</th>
                <th className="px-5 py-4 font-semibold">Stasiun</th>
                <th className="px-5 py-4 font-semibold">Tanggal</th>
                <th className="px-5 py-4 font-semibold">Waktu Sesi</th>
                <th className="px-5 py-4 font-semibold">Tarif</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500 uppercase tracking-wider">
                    Memuat data booking...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                    Tidak ada jadwal booking yang ditemukan.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'neutral' };
                  return (
                    <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                      <td className="px-5 py-4 font-mono-tech font-bold text-white">
                        {b.booking_code}
                      </td>
                      <td className="px-5 py-4 text-zinc-200 font-medium">
                        {b.user?.name}
                      </td>
                      <td className="px-5 py-4 text-white font-semibold">
                        {b.device?.code}
                      </td>
                      <td className="px-5 py-4 text-zinc-400">
                        {b.booking_date}
                      </td>
                      <td className="px-5 py-4 text-zinc-400 font-mono-tech">
                        {b.start_time} - {b.end_time}
                      </td>
                      <td className="px-5 py-4 text-white font-semibold">
                        {formatRupiah(b.total_price)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge colorVar={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === 'pending' && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStatusChange(b.id, 'confirmed')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold transition disabled:opacity-50 cursor-pointer"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStartFromBooking(b)}
                              className="px-3 py-1.5 rounded-lg bg-cust-red hover:bg-cust-red-dark text-white text-[11px] font-bold uppercase transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={11} fill="currentColor" />
                              <span>Mulai Sesi</span>
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStatusChange(b.id, 'completed')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition disabled:opacity-50 cursor-pointer"
                            >
                              Selesai
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStatusChange(b.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 text-zinc-400 hover:text-red-400 text-[11px] font-medium transition disabled:opacity-50 cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                          {['completed', 'cancelled'].includes(b.status) && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => setDeletingBooking(b)}
                              title="Hapus"
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/50 text-zinc-500 hover:text-red-400 border border-zinc-800 transition disabled:opacity-50 cursor-pointer"
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
      </div>

      <ConfirmDialog
        open={!!deletingBooking}
        title="Hapus Data Booking?"
        message={`Yakin ingin menghapus booking ${deletingBooking?.booking_code}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBooking(null)}
        loading={!!actingId}
      />
    </DashboardLayout>
  );
}