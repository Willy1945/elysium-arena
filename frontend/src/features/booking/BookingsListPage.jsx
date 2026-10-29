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
  const FILTER_DOTS = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-sky-500',
    cancelled: 'bg-rose-500',
  };

  return (
    <DashboardLayout onSearch={setSearch}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <CalendarCheck size={14} />
            <span>Manajemen Reservasi</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Daftar Booking Jadwal
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Verifikasi dan mulai sesi bermain stasiun langsung dari daftar booking pelanggan.
          </p>
        </div>
      </div>

      <div className="mb-6 flex overflow-x-auto pb-1 scrollbar-none">
        <div className="bg-white border border-zinc-950 rounded-xl p-1 inline-flex gap-1 shadow-[2px_2px_0px_0px_#18181b]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                statusFilter === f
                  ? 'bg-zinc-950 text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {FILTER_DOTS[f] && (
                <span className={`w-2 h-2 rounded-full border border-zinc-950/40 shrink-0 ${FILTER_DOTS[f]}`} />
              )}
              <span>{FILTER_LABEL[f] || f}</span>
            </button>
          ))}
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-zinc-950 text-emerald-900 text-xs font-bold rounded-xl px-4 py-3 mb-6 shadow-[2px_2px_0px_0px_#18181b]">
          {successMessage}
        </div>
      )}

      <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-950 uppercase tracking-wider font-mono-tech">
                <th className="px-5 py-4 font-black">Kode</th>
                <th className="px-5 py-4 font-black">Pelanggan</th>
                <th className="px-5 py-4 font-black">Stasiun</th>
                <th className="px-5 py-4 font-black">Tanggal</th>
                <th className="px-5 py-4 font-black">Waktu Sesi</th>
                <th className="px-5 py-4 font-black">Tarif</th>
                <th className="px-5 py-4 font-black">Status</th>
                <th className="px-5 py-4 font-black text-right">Aksi Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500 font-mono-tech uppercase tracking-wider">
                    Memuat data booking...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500 font-medium">
                    Tidak ada jadwal booking yang ditemukan.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'neutral' };
                  return (
                    <tr key={b.id} className="hover:bg-zinc-50 transition">
                      <td className="px-5 py-4 font-mono-tech font-bold text-zinc-950">
                        {b.booking_code}
                      </td>
                      <td className="px-5 py-4 text-zinc-900 font-bold">
                        {b.user?.name}
                      </td>
                      <td className="px-5 py-4 text-zinc-950 font-black">
                        {b.device?.code}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 font-medium font-mono-tech">
                        {b.booking_date}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 font-mono-tech font-bold">
                        {b.start_time} - {b.end_time}
                      </td>
                      <td className="px-5 py-4 text-zinc-950 font-black font-mono-tech">
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
                              className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-zinc-950 text-emerald-950 text-[11px] font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] disabled:opacity-50 cursor-pointer"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStartFromBooking(b)}
                              className="px-3 py-1.5 rounded-lg bg-cust-red hover:bg-cust-red-dark text-white text-[11px] font-bold uppercase tracking-wider border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Play size={11} fill="currentColor" />
                              <span>Mulai Sesi</span>
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStatusChange(b.id, 'completed')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-950 text-zinc-900 text-[11px] font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] disabled:opacity-50 cursor-pointer"
                            >
                              Selesai
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => handleStatusChange(b.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-700 hover:text-zinc-950 text-[11px] font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] disabled:opacity-50 cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                          {['completed', 'cancelled'].includes(b.status) && (
                            <button
                              disabled={actingId === b.id}
                              onClick={() => setDeletingBooking(b)}
                              title="Hapus"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-zinc-950 transition shadow-[1px_1px_0px_0px_#18181b] disabled:opacity-50 cursor-pointer"
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
