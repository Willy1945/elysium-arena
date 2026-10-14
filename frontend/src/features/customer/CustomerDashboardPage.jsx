import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2, CalendarCheck, ShoppingBag, Receipt, ArrowRight,
  Clock, Plus, Star, Coffee, CheckCircle2,
  AlertTriangle, Award, Gift, MessageSquarePlus, User, ChevronRight, Activity, Coins,
  Trash2
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { customerDashboardService } from '../../api/customerDashboardService';
import { ratingService } from '../../api/ratingService';
import { transactionService } from '../../api/transactionService';
import { bookingService } from '../../api/bookingService';
import { useToast } from '../../context/ToastContext';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import RatingFormModal from './RatingFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatRupiah, BOOKING_STATUS_CONFIG } from '../../utils/format';

const ORDER_STEPS = ['pending', 'processing', 'ready'];
const ORDER_STEP_LABEL = {
  pending: 'Diterima Kasir',
  processing: 'Sedang Disiapkan',
  ready: 'Siap Diantar ke Meja',
};

// ── KARTU SESI AKTIF (MINIMALIST PREMIUM HUD) ──
function ActiveSessionCard({ session }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);

  const progressPct = useMemo(() => {
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const now = Date.now();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  }, [session]);

  return (
    <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Sesi Sedang Berjalan
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
          Station {session.device?.code}
        </span>
      </div>

      {/* Device Info */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-zinc-400">
            {session.device?.device_type?.name} Rig
          </p>
          <h2 className="font-display font-black text-white text-3xl sm:text-4xl uppercase tracking-tight mt-0.5">
            {session.device?.code}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-zinc-500 uppercase">Smart Lock Terminal</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-0.5">
            <CheckCircle2 size={13} /> Terbuka & Aktif
          </span>
        </div>
      </div>

      {/* Countdown Timer Display */}
      <div className="p-6 rounded-2xl bg-[#09090c] border border-zinc-800 text-center mb-6">
        <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
          <Clock size={14} className="text-cust-red" />
          Sisa Waktu Bermain
        </p>

        <p
          className={`font-display font-black text-5xl sm:text-6xl tracking-tight tabular-nums ${
            isExpired ? 'text-cust-red animate-pulse' : 'text-white'
          }`}
        >
          {formatted}
        </p>

        {/* Meter Bar */}
        <div className="mt-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
            <span>Durasi Berjalan</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-cust-red rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Price & Order CTA */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mb-5">
        <span className="text-xs text-zinc-400">Tarif Sesi Ini</span>
        <span className="font-display font-black text-xl text-white">
          {formatRupiah(session.price)}
        </span>
      </div>

      <Link
        to="/menu"
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
      >
        <Coffee size={15} />
        <span>Pesan Makanan / Kopi ke Meja Ini</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [deletingRating, setDeletingRating] = useState(false);
  const [deletingTrxId, setDeletingTrxId] = useState(null);
  const [confirmClearAllTrx, setConfirmClearAllTrx] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [confirmClearAllBookings, setConfirmClearAllBookings] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const reloadDashboard = async () => {
    try {
      const { data: updated } = await customerDashboardService.getSummary();
      setData(updated);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    customerDashboardService
      .getSummary()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleRatingSubmit = async (payload) => {
    setSubmittingRating(true);
    try {
      await ratingService.submit(payload);
      toast.success('Terima kasih atas rating & ulasanmu!');
      setRatingTarget(null);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleDeleteRating = async () => {
    setActionLoading(true);
    try {
      await ratingService.deleteMyRating();
      toast.success('Ulasan kamu berhasil dihapus.');
      setDeletingRating(false);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus ulasan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTrxId) return;
    setActionLoading(true);
    try {
      await transactionService.hideFromCustomer(deletingTrxId);
      toast.success('Transaksi dihapus dari riwayat.');
      setDeletingTrxId(null);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus riwayat transaksi.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAllTransactions = async () => {
    setActionLoading(true);
    try {
      await transactionService.clearCustomerHistory();
      toast.success('Semua riwayat transaksi berhasil dibersihkan.');
      setConfirmClearAllTrx(false);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membersihkan riwayat transaksi.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellingBookingId) return;
    setActionLoading(true);
    try {
      await bookingService.updateStatus(cancellingBookingId, 'cancelled');
      toast.success('Jadwal booking berhasil dibatalkan.');
      setCancellingBookingId(null);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deletingBookingId) return;
    setActionLoading(true);
    try {
      await bookingService.remove(deletingBookingId);
      toast.success('Riwayat booking berhasil dihapus.');
      setDeletingBookingId(null);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus riwayat booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAllBookings = async () => {
    setActionLoading(true);
    try {
      await bookingService.clearHistory();
      toast.success('Semua riwayat booking berhasil dibersihkan.');
      setConfirmClearAllBookings(false);
      reloadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membersihkan riwayat booking.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center text-zinc-500">
          <Activity className="animate-spin text-cust-red mx-auto mb-3" size={32} />
          <p className="text-xs uppercase tracking-wider">Memuat Dashboard Pelanggan...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* ── PLAYER HEADER BANNER ── */}
      <section className="bg-[#09090b] border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Profile Info */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-zinc-700 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-display font-black text-xl sm:text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#09090b]" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-cust-red uppercase tracking-wider">
                    Member Elysium
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Aktif
                  </span>
                  <Link
                    to="/rewards"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[10px] sm:text-[11px] font-bold font-mono transition"
                    title="Klik untuk membuka katalog reward loyalitas"
                  >
                    <Coins size={11} className="text-amber-400" />
                    <span>{new Intl.NumberFormat('id-ID').format(data?.loyalty_points ?? 0)} PTS</span>
                  </Link>
                </div>
                <h1 className="font-display font-black text-xl sm:text-3xl text-white uppercase tracking-tight truncate">
                  {user?.name}
                </h1>
                <p className="text-zinc-400 text-xs mt-0.5 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                to="/rewards"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider text-xs transition shadow-sm"
              >
                <Coins size={14} className="text-amber-400" />
                <span>{new Intl.NumberFormat('id-ID').format(data?.loyalty_points ?? 0)} Koin</span>
              </Link>

              <Link
                to="/browse-devices"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider text-xs shadow-sm transition"
              >
                <Plus size={14} />
                <span>Pesan Station</span>
              </Link>

              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold uppercase tracking-wider text-xs transition"
              >
                <ShoppingBag size={14} className="text-amber-400" />
                <span>Order Kafe</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── QUICK NAVIGATION STRIP ── */}
      <section className="bg-[#0c0c10] border-b border-zinc-800/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs">
            <Link
              to="/rewards"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition whitespace-nowrap py-1"
            >
              <Coins size={14} />
              <span>Reward Loyalitas ({new Intl.NumberFormat('id-ID').format(data?.loyalty_points ?? 0)} Koin)</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition whitespace-nowrap py-1"
            >
              <MessageSquarePlus size={14} className="text-amber-400" />
              <span>Kirim Masukan & Request Game</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition whitespace-nowrap py-1"
            >
              <User size={14} className="text-emerald-400" />
              <span>Edit Profil & Password</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN DASHBOARD CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── LEFT COLUMN: Sesi Aktif & Rating ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {data.active_session ? (
              <ActiveSessionCard session={data.active_session} />
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-8 sm:p-10 text-center shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-4">
                  <Gamepad2 size={28} />
                </div>
                <h3 className="font-display font-black text-white text-2xl uppercase mb-1">
                  Tidak Ada Sesi Aktif
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                  Stasiun siap ditempati. Pilih PlayStation 5 atau PC Gaming spek tinggi untuk mulai bermain.
                </p>
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-xs tracking-wider transition shadow-sm"
                >
                  <span>Pilih & Booking Station</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* 1. Ulasan yang Pernah Dikirim Customer (Bisa Dihapus) */}
            {data.my_rating && (
              <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <h3 className="font-display font-bold text-white text-base uppercase tracking-wide">
                      Ulasan Kamu
                    </h3>
                  </div>
                  <button
                    onClick={() => setDeletingRating(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-red-400 bg-zinc-900/80 hover:bg-red-950/30 border border-zinc-800 hover:border-red-500/40 text-xs font-semibold transition cursor-pointer"
                    title="Hapus Ulasan Ini"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={
                          s <= data.my_rating.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700'
                        }
                      />
                    ))}
                    <span className="text-amber-400 text-xs font-bold font-mono ml-1.5">
                      {data.my_rating.rating}.0
                    </span>
                  </div>
                  {data.my_rating.created_at && (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {new Date(data.my_rating.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                {data.my_rating.comment ? (
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/70">
                    "{data.my_rating.comment}"
                  </p>
                ) : (
                  <p className="text-zinc-500 text-xs italic">Tanpa ulasan teks tambahan.</p>
                )}
              </div>
            )}

            {/* 2. Beri Rating Arena Baru (Muncul jika belum ada ulasan & sudah main) */}
            {data.can_rate_arena && (
              <div className="rounded-3xl border border-amber-500/30 bg-[#121216] p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <h3 className="font-display font-black text-white text-lg uppercase tracking-wide">
                    Ulasan Elysium Arena
                  </h3>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  Bagikan kepuasanmu bermain di sini untuk membantu kami menjaga kualitas perangkat & layanan.
                </p>
                <button
                  onClick={() => setRatingTarget(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <Star size={14} />
                  <span>Beri Rating Sekarang</span>
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Tagihan, Booking, F&B, Transaksi ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Tagihan Menunggu Pembayaran */}
            {data.pending_transactions.length > 0 && (
              <div className="rounded-3xl border border-amber-500/40 bg-[#14120f] p-6 sm:p-7 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-400" />
                    <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                      Tagihan Menunggu Pembayaran
                    </h2>
                  </div>
                  <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    {data.pending_transactions.length} Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {data.pending_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4"
                    >
                      <div>
                        <p className="text-zinc-500 text-[10px] font-mono-tech uppercase">
                          {t.transaction_code}
                        </p>
                        <p className="text-white font-bold text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B'}
                        </p>
                        <p className="text-[11px] text-amber-400 mt-0.5">
                          Selesaikan pembayaran di kasir atau scan QRIS
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-amber-400 text-2xl">
                          {formatRupiah(t.total_amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Booking Mendatang */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-7 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck size={18} className="text-cust-red" />
                  <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    Jadwal Booking Mendatang
                  </h2>
                </div>
                <Link
                  to="/browse-devices"
                  className="text-cust-red hover:text-white text-xs font-bold uppercase flex items-center gap-1 transition"
                >
                  <span>Pesan Baru</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {data.upcoming_bookings.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-xs">
                    Belum ada jadwal booking yang akan datang.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {data.upcoming_bookings.map((b) => {
                    const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'neutral' };
                    return (
                      <div
                        key={b.id}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-zinc-500 font-mono-tech text-[10px] uppercase">
                              {b.booking_code}
                            </span>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                              {status.label}
                            </span>
                          </div>
                          <p className="text-white font-display font-black text-xl uppercase mb-1">
                            {b.device?.code}
                          </p>
                          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
                            <Clock size={12} className="text-cust-red" />
                            <span>
                              {b.booking_date} · {b.start_time} - {b.end_time}
                            </span>
                          </div>
                        </div>
                        {['pending', 'confirmed'].includes(b.status) && (
                          <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setCancellingBookingId(b.id)}
                              className="text-[11px] text-zinc-500 hover:text-red-400 transition cursor-pointer"
                            >
                              Batalkan Jadwal
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2b. Riwayat Booking Lampau (Selesai & Dibatalkan) */}
            {data.booking_history?.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-7 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck size={18} className="text-zinc-500" />
                    <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                      Riwayat Booking Lampau
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAllBookings(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-950/20 px-3 py-1.5 rounded-xl border border-transparent hover:border-red-500/30 transition cursor-pointer"
                    title="Bersihkan semua riwayat booking yang telah selesai atau dibatalkan"
                  >
                    <Trash2 size={13} />
                    <span>Bersihkan Semua</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {data.booking_history.map((b) => {
                    const isCompleted = b.status === 'completed';
                    return (
                      <div
                        key={b.id}
                        className="group flex items-center justify-between bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-mono-tech text-[10px] uppercase">
                              {b.booking_code}
                            </span>
                            <span
                              className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border ${
                                isCompleted
                                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {isCompleted ? 'Selesai' : 'Dibatalkan'}
                            </span>
                          </div>
                          <p className="text-white font-bold text-xs mt-1">
                            {b.device?.code} · {b.booking_date} ({b.start_time} - {b.end_time})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeletingBookingId(b.id)}
                          className="opacity-60 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                          title="Hapus riwayat booking ini"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Status Pesanan F&B Aktif */}
            {data.active_orders.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-7 shadow-lg">
                <div className="flex items-center gap-2.5 mb-5">
                  <ShoppingBag size={18} className="text-amber-400" />
                  <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    Pesanan Kafe Sedang Berjalan
                  </h2>
                </div>

                <div className="space-y-4">
                  {data.active_orders.map((o) => {
                    const currentIdx = ORDER_STEPS.indexOf(o.status);
                    return (
                      <div
                        key={o.id}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-amber-400 text-xs font-bold uppercase">
                            Order #{o.order_code}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {formatRupiah(o.total_price)}
                          </span>
                        </div>

                        <p className="text-zinc-300 text-xs mb-4">
                          {o.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
                        </p>

                        {/* Tracker Steps */}
                        <div className="flex gap-2">
                          {ORDER_STEPS.map((step, idx) => (
                            <div key={step} className="flex-1 flex flex-col gap-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  idx <= currentIdx
                                    ? 'bg-amber-400'
                                    : 'bg-zinc-800'
                                }`}
                              />
                              <span
                                className={`text-[10px] uppercase ${
                                  idx <= currentIdx ? 'text-amber-400 font-bold' : 'text-zinc-600'
                                }`}
                              >
                                {ORDER_STEP_LABEL[step]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Riwayat Transaksi */}
            <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-7 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Receipt size={18} className="text-zinc-400" />
                  <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    Riwayat Transaksi Terakhir
                  </h2>
                </div>
                {data.recent_transactions.length > 0 && (
                  <button
                    onClick={() => setConfirmClearAllTrx(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-950/20 px-3 py-1.5 rounded-xl border border-transparent hover:border-red-500/30 transition cursor-pointer"
                    title="Bersihkan semua riwayat transaksi dari akun Anda"
                  >
                    <Trash2 size={13} />
                    <span>Bersihkan Semua</span>
                  </button>
                )}
              </div>

              {data.recent_transactions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-xs">
                    Belum ada catatan riwayat transaksi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.recent_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="group flex items-center justify-between bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-3 transition"
                    >
                      <div>
                        <p className="text-zinc-500 font-mono-tech text-[10px] uppercase">
                          {t.transaction_code}
                        </p>
                        <p className="text-white font-medium text-xs sm:text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-display font-bold text-white text-base">
                          {formatRupiah(t.total_amount)}
                        </p>
                        <button
                          onClick={() => setDeletingTrxId(t.id)}
                          title="Hapus transaksi ini dari riwayat"
                          className="opacity-70 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Modal Rating */}
      <RatingFormModal
        open={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        onSubmit={handleRatingSubmit}
        loading={submittingRating}
      />

      {/* Dialog Konfirmasi Hapus Ulasan */}
      <ConfirmDialog
        open={deletingRating}
        title="Hapus Ulasan Anda?"
        message="Yakin ingin menghapus ulasan Elysium Arena yang pernah Anda kirim? Anda dapat memberikan ulasan baru kapan saja setelah ini."
        confirmText="Ya, Hapus Ulasan"
        cancelText="Batal"
        onConfirm={handleDeleteRating}
        onCancel={() => setDeletingRating(false)}
        loading={actionLoading}
      />

      {/* Dialog Konfirmasi Hapus Satu Transaksi */}
      <ConfirmDialog
        open={!!deletingTrxId}
        title="Hapus Riwayat Transaksi?"
        message="Item transaksi ini akan dihapus dari riwayat akun Anda agar tidak menumpuk."
        confirmText="Hapus dari Riwayat"
        cancelText="Batal"
        onConfirm={handleDeleteTransaction}
        onCancel={() => setDeletingTrxId(null)}
        loading={actionLoading}
      />

      {/* Dialog Konfirmasi Bersihkan Semua Riwayat Transaksi */}
      <ConfirmDialog
        open={confirmClearAllTrx}
        title="Bersihkan Semua Riwayat Transaksi?"
        message="Yakin ingin membersihkan seluruh daftar riwayat transaksi dari akun Anda? Riwayat yang dibersihkan tidak akan ditampilkan lagi di dashboard."
        confirmText="Ya, Bersihkan Semua"
        cancelText="Batal"
        onConfirm={handleClearAllTransactions}
        onCancel={() => setConfirmClearAllTrx(false)}
        loading={actionLoading}
      />

      {/* Dialog Konfirmasi Batalkan Jadwal Booking */}
      <ConfirmDialog
        open={!!cancellingBookingId}
        title="Batalkan Jadwal Booking?"
        message="Apakah Anda yakin ingin membatalkan jadwal sewa station ini? Slot waktu akan dibuka kembali untuk pemain lain."
        confirmText="Ya, Batalkan Jadwal"
        cancelText="Kembali"
        onConfirm={handleCancelBooking}
        onCancel={() => setCancellingBookingId(null)}
        loading={actionLoading}
      />

      {/* Dialog Konfirmasi Hapus Satu Riwayat Booking */}
      <ConfirmDialog
        open={!!deletingBookingId}
        title="Hapus Riwayat Booking?"
        message="Riwayat booking ini akan dihapus dari daftar akun Anda."
        confirmText="Hapus dari Riwayat"
        cancelText="Batal"
        onConfirm={handleDeleteBooking}
        onCancel={() => setDeletingBookingId(null)}
        loading={actionLoading}
      />

      {/* Dialog Konfirmasi Bersihkan Semua Riwayat Booking */}
      <ConfirmDialog
        open={confirmClearAllBookings}
        title="Bersihkan Semua Riwayat Booking?"
        message="Yakin ingin membersihkan semua riwayat booking lampau yang telah selesai atau dibatalkan dari akun Anda?"
        confirmText="Ya, Bersihkan Semua"
        cancelText="Batal"
        onConfirm={handleClearAllBookings}
        onCancel={() => setConfirmClearAllBookings(false)}
        loading={actionLoading}
      />
    </PublicLayout>
  );
}