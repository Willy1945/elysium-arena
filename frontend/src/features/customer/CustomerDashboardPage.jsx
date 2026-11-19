import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2, CalendarCheck, ShoppingBag, Receipt, ArrowRight,
  Clock, Plus, Star, Coffee, CheckCircle2,
  AlertTriangle, Award, Gift, MessageSquarePlus, User, ChevronRight, Activity, Coins,
  Trash2, Flame, PackageCheck, UtensilsCrossed
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
import UserAvatar from '../../components/common/UserAvatar';
import { formatRupiah, BOOKING_STATUS_CONFIG } from '../../utils/format';

const STATUS_BADGE_STYLE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  completed: 'bg-sky-50 text-sky-700 border-sky-200',
};

const ORDER_STEPS = ['pending', 'processing', 'ready', 'delivered'];
const ORDER_STEP_LABEL = {
  pending: 'Diterima Kasir',
  processing: 'Sedang Disiapkan',
  ready: 'Siap Diantar',
  delivered: 'Tiba di Meja',
};

function getOrderStepIndex(status) {
  if (status === 'completed' || status === 'delivered') return 3;
  if (status === 'ready') return 2;
  if (status === 'processing') return 1;
  return 0;
}

function ActiveSessionCard({ session }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);

  const progressPct = useMemo(() => {
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const now = Date.now();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  }, [session]);

  const activeSessionOrders = useMemo(() => {
    return (session.orders || []).filter((o) => ['pending', 'processing', 'ready'].includes(o.status));
  }, [session.orders]);

  const deliveredSessionOrders = useMemo(() => {
    return (session.orders || []).filter((o) => ['delivered', 'completed'].includes(o.status));
  }, [session.orders]);

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] relative overflow-hidden">

      <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200/80">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Sesi Sedang Berjalan
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700">
          Station {session.device?.code}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-zinc-500 font-medium">
            {session.device?.device_type?.name} Rig
          </p>
          <h2 className="font-display font-black text-zinc-950 text-3xl sm:text-4xl uppercase tracking-tight mt-0.5">
            {session.device?.code}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-zinc-500 uppercase font-semibold">Smart Lock Terminal</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-0.5">
            <CheckCircle2 size={13} /> Terbuka & Aktif
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-center mb-6 shadow-inner">
        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5 font-semibold">
          <Clock size={14} className="text-cust-red" />
          Sisa Waktu Bermain
        </p>

        <p
          className={`font-display font-black text-5xl sm:text-6xl tracking-tight tabular-nums ${
            isExpired ? 'text-cust-red animate-pulse' : 'text-zinc-950'
          }`}
        >
          {formatted}
        </p>

        <div className="mt-4 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5 font-medium">
            <span>Durasi Berjalan</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-300/80">
            <div
              className="h-full bg-cust-red rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 mb-5">
        <span className="text-xs text-zinc-600 font-medium">Tarif Sesi Ini</span>
        <span className="font-display font-black text-xl text-zinc-950">
          {formatRupiah(session.price)}
        </span>
      </div>

      {activeSessionOrders.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-4 text-amber-900 text-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-semibold">
            {activeSessionOrders.length} Pesanan F&B sedang disiapkan dapur ke stasiun ini...
          </span>
        </div>
      )}

      {deliveredSessionOrders.length > 0 && activeSessionOrders.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-4 text-emerald-950 text-xs">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold">Pesanan Kafe Selesai Diantar ke Meja</span>
            <p className="text-[11px] text-emerald-800 truncate mt-0.5">
              {deliveredSessionOrders[0]?.items?.map((i) => `${i.product?.name || 'Item'} ×${i.quantity}`).join(', ')}
            </p>
          </div>
        </div>
      )}

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

    // Auto-refresh summary data setiap 12 detik agar progres pesanan dapur & status sesi selalu mutakhir
    const interval = setInterval(() => {
      customerDashboardService
        .getSummary()
        .then(({ data }) => {
          setData(data);
        })
        .catch(() => {});
    }, 12000);

    return () => clearInterval(interval);
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

      <section className="bg-gradient-to-b from-zinc-50 via-white to-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="relative shrink-0">
                <UserAvatar
                  src={user?.avatar}
                  name={user?.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-zinc-200 shadow-md"
                  fallbackClassName="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-display font-black text-xl sm:text-2xl shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-cust-red uppercase tracking-wider">
                    Member Elysium
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold">
                    Aktif
                  </span>
                  <Link
                    to="/rewards"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-[10px] sm:text-[11px] font-bold font-mono transition shadow-xs"
                    title="Klik untuk membuka katalog reward loyalitas"
                  >
                    <Coins size={11} className="text-amber-600" />
                    <span>{new Intl.NumberFormat('id-ID').format(data?.loyalty_points ?? 0)} PTS</span>
                  </Link>
                </div>
                <h1 className="font-display font-black text-xl sm:text-3xl text-zinc-950 uppercase tracking-tight truncate">
                  {user?.name}
                </h1>
                <p className="text-zinc-500 text-xs mt-0.5 truncate font-medium">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                to="/rewards"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold uppercase tracking-wider text-xs transition shadow-sm"
              >
                <Coins size={14} className="text-amber-600" />
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
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-semibold uppercase tracking-wider text-xs transition shadow-sm"
              >
                <ShoppingBag size={14} className="text-amber-600" />
                <span>Order Kafe</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-zinc-50/80 border-b border-zinc-200/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-xs">
            <Link
              to="/rewards"
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-bold transition whitespace-nowrap py-1"
            >
              <Coins size={14} className="text-amber-600" />
              <span>Reward Loyalitas ({new Intl.NumberFormat('id-ID').format(data?.loyalty_points ?? 0)} Koin)</span>
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-semibold transition whitespace-nowrap py-1"
            >
              <MessageSquarePlus size={14} className="text-cust-red" />
              <span>Kirim Masukan & Request Game</span>
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 font-semibold transition whitespace-nowrap py-1"
            >
              <User size={14} className="text-emerald-600" />
              <span>Edit Profil & Password</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-5 flex flex-col gap-6">
            {data.active_session ? (
              <ActiveSessionCard session={data.active_session} />
            ) : (
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-10 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mx-auto mb-4">
                  <Gamepad2 size={28} />
                </div>
                <h3 className="font-display font-black text-zinc-950 text-2xl uppercase mb-1">
                  Tidak Ada Sesi Aktif
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-xs mx-auto mb-6 leading-relaxed font-medium">
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

            {data.my_rating && (
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200/80">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    <h3 className="font-display font-bold text-zinc-950 text-base uppercase tracking-wide">
                      Ulasan Kamu
                    </h3>
                  </div>
                  <button
                    onClick={() => setDeletingRating(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-600 hover:text-red-600 bg-zinc-100 hover:bg-red-50 border border-zinc-200 hover:border-red-200 text-xs font-semibold transition cursor-pointer"
                    title="Hapus Ulasan Ini"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={
                          s <= data.my_rating.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-zinc-300'
                        }
                      />
                    ))}
                    <span className="text-amber-600 text-xs font-bold font-mono ml-1.5">
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

                {data.my_rating.comment ? (
                  <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed italic bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                    "{data.my_rating.comment}"
                  </p>
                ) : (
                  <p className="text-zinc-500 text-xs italic">Tanpa ulasan teks tambahan.</p>
                )}
              </div>
            )}

            {data.can_rate_arena && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <h3 className="font-display font-black text-zinc-950 text-lg uppercase tracking-wide">
                    Ulasan Elysium Arena
                  </h3>
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed mb-4 font-medium">
                  Bagikan kepuasanmu bermain di sini untuk membantu kami menjaga kualitas perangkat & layanan.
                </p>
                <button
                  onClick={() => setRatingTarget(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
                >
                  <Star size={14} />
                  <span>Beri Rating Sekarang</span>
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">

            {data.pending_transactions.length > 0 && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/30 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-600" />
                    <h2 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                      Tagihan Menunggu Pembayaran
                    </h2>
                  </div>
                  <span className="text-[11px] text-amber-700 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                    {data.pending_transactions.length} Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {data.pending_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs"
                    >
                      <div>
                        <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-semibold">
                          {t.transaction_code}
                        </p>
                        <p className="text-zinc-950 font-bold text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B'}
                        </p>
                        <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
                          Selesaikan pembayaran di kasir atau scan QRIS
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-amber-600 text-2xl">
                          {formatRupiah(t.total_amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck size={18} className="text-cust-red" />
                  <h2 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                    Jadwal Booking Mendatang
                  </h2>
                </div>
                <Link
                  to="/browse-devices"
                  className="text-cust-red hover:text-cust-red-dark text-xs font-bold uppercase flex items-center gap-1 transition"
                >
                  <span>Pesan Baru</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {data.upcoming_bookings.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <p className="text-zinc-500 text-xs font-medium">
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
                        className="bg-zinc-50/70 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-300 hover:bg-zinc-50 transition shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-zinc-500 font-mono-tech text-[10px] uppercase font-semibold">
                              {b.booking_code}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${STATUS_BADGE_STYLE[b.status] || 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-zinc-950 font-display font-black text-xl uppercase mb-1">
                            {b.device?.code}
                          </p>
                          <div className="flex items-center gap-1.5 text-zinc-600 text-xs mb-3 font-medium">
                            <Clock size={12} className="text-cust-red" />
                            <span>
                              {b.booking_date} · {b.start_time} - {b.end_time}
                            </span>
                          </div>
                        </div>
                        {['pending', 'confirmed'].includes(b.status) && (
                          <div className="pt-2 border-t border-zinc-200 flex justify-end">
                            {b.can_cancel !== false ? (
                              <button
                                type="button"
                                onClick={() => setCancellingBookingId(b.id)}
                                className="text-[11px] text-zinc-500 hover:text-red-600 font-medium transition cursor-pointer"
                              >
                                Batalkan Jadwal
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-bold font-mono-tech">
                                Sesi Sedang Berjalan
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {data.booking_history?.length > 0 && (
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck size={18} className="text-zinc-500" />
                    <h2 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                      Riwayat Booking Lampau
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAllBookings(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-zinc-200 hover:border-red-200 transition cursor-pointer font-medium"
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
                        className="group flex items-center justify-between bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 transition shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-mono-tech text-[10px] uppercase font-semibold">
                              {b.booking_code}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${isCompleted ? STATUS_BADGE_STYLE.completed : STATUS_BADGE_STYLE.cancelled}`}>
                              {isCompleted ? 'Selesai' : 'Dibatalkan'}
                            </span>
                          </div>
                          <p className="text-zinc-950 font-bold text-xs mt-1">
                            {b.device?.code} · {b.booking_date} ({b.start_time} - {b.end_time})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeletingBookingId(b.id)}
                          className="opacity-60 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
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

            {(data.active_orders?.length > 0 || data.completed_orders?.length > 0) && (
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={18} className="text-amber-600" />
                    <div>
                      <h2 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                        Pesanan Kafe & F&B
                      </h2>
                      <p className="text-[11px] text-zinc-500 font-medium">
                        Status antrean dapur dan catatan pesanan makanan ke meja Anda
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/menu"
                    className="text-amber-700 hover:text-amber-800 text-xs font-bold uppercase flex items-center gap-1 transition"
                  >
                    <span>Pesan Menu Baru</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Sub-bagian 1: Pesanan Sedang Diproses */}
                {data.active_orders?.length > 0 && (
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono-tech">
                        Sedang Diproses Dapur ({data.active_orders.length})
                      </h3>
                    </div>

                    {data.active_orders.map((o) => {
                      const currentIdx = getOrderStepIndex(o.status);
                      const isDelivered = o.status === 'delivered';

                      return (
                        <div
                          key={o.id}
                          className="bg-zinc-50/80 border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-900 text-xs font-bold font-mono-tech uppercase">
                                #{o.order_code}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                                {o.session?.device_code ? `Meja ${o.session.device_code}` : 'Take-away'}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-zinc-950 font-mono-tech">
                              {formatRupiah(o.total_price)}
                            </span>
                          </div>

                          {/* Rincian Menu */}
                          <div className="bg-white border border-zinc-200/90 rounded-xl p-3 my-3 divide-y divide-zinc-100">
                            <p className="text-[10px] font-mono-tech uppercase font-bold text-zinc-400 mb-1.5 tracking-wider">
                              Rincian Menu ({o.items?.length || 0} Item):
                            </p>
                            {o.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-1 text-xs first:pt-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-zinc-800">{item.product?.name || 'Item Kafe'}</span>
                                  <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
                                </div>
                                <span className="font-mono-tech font-bold text-zinc-700">{formatRupiah(item.subtotal)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Stepper Progres */}
                          <div className="flex gap-2 my-3">
                            {ORDER_STEPS.map((step, idx) => {
                              const isStepDone = idx <= currentIdx;
                              return (
                                <div key={step} className="flex-1 flex flex-col gap-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      isStepDone
                                        ? isDelivered ? 'bg-emerald-500' : 'bg-amber-500'
                                        : 'bg-zinc-200'
                                    }`}
                                  />
                                  <span
                                    className={`text-[9px] sm:text-[10px] uppercase font-mono-tech ${
                                      isStepDone
                                        ? isDelivered ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'
                                        : 'text-zinc-400'
                                    }`}
                                  >
                                    {ORDER_STEP_LABEL[step]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Status Box Info */}
                          {isDelivered ? (
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mt-2">
                              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                              <span>Pesanan telah tiba di meja Anda! Selamat menikmati hidangan.</span>
                            </div>
                          ) : o.status === 'ready' ? (
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mt-2">
                              <PackageCheck size={15} className="text-emerald-600 shrink-0" />
                              <span>Pesanan sudah siap dan staf sedang berjalan mengantarkan ke meja Anda.</span>
                            </div>
                          ) : o.status === 'processing' ? (
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mt-2">
                              <Flame size={15} className="text-amber-600 shrink-0" />
                              <span>Dapur/Barista sedang menyiapkan hidangan & minuman Anda.</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium mt-2">
                              <Clock size={15} className="text-zinc-500 shrink-0" />
                              <span>Pesanan diterima kasir dan masuk antrean pembuatan.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Sub-bagian 2: Catatan Pesanan Selesai Diantar */}
                {data.completed_orders?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono-tech">
                        Pesanan Selesai Diantar ({data.completed_orders.filter((co) => !data.active_orders?.some((ao) => ao.id === co.id)).length})
                      </h3>
                    </div>

                    {data.completed_orders
                      .filter((co) => !data.active_orders?.some((ao) => ao.id === co.id))
                      .map((co) => (
                        <div
                          key={co.id}
                          className="bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 rounded-2xl p-4 sm:p-5 transition shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-600 font-mono-tech text-xs uppercase font-bold">
                                #{co.order_code}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                Selesai Diantar
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {co.created_at
                                ? new Date(co.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB · ' + new Date(co.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                : ''}
                            </span>
                          </div>

                          {/* Rincian Menu Selesai */}
                          <div className="bg-white border border-zinc-200 rounded-xl p-3 mb-3 divide-y divide-zinc-100">
                            <p className="text-[10px] font-mono-tech uppercase font-bold text-zinc-400 mb-1 tracking-wider">
                              Rincian Menu ({co.items?.length || 0} Item):
                            </p>
                            {co.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-1 text-xs first:pt-0 last:pb-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-zinc-900">{item.product?.name || 'Item Kafe'}</span>
                                  <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
                                </div>
                                <span className="font-mono-tech font-bold text-zinc-700">{formatRupiah(item.subtotal)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-zinc-500 font-medium">
                              {co.session?.device_code ? `Diantar ke: Stasiun ${co.session.device_code}` : 'Pesanan Take-away'}
                            </span>
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-400 uppercase font-mono-tech mr-1.5">Total Tagihan:</span>
                              <span className="font-display font-black text-sm text-zinc-950">{formatRupiah(co.total_price)}</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-zinc-200/80 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            <span>Pesanan telah disajikan ke meja Anda. Selamat menikmati makanan & minumannya!</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Receipt size={18} className="text-zinc-500" />
                  <h2 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                    Riwayat Transaksi Terakhir
                  </h2>
                </div>
                {data.recent_transactions.length > 0 && (
                  <button
                    onClick={() => setConfirmClearAllTrx(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-zinc-200 hover:border-red-200 transition cursor-pointer font-medium"
                    title="Bersihkan semua riwayat transaksi dari akun Anda"
                  >
                    <Trash2 size={13} />
                    <span>Bersihkan Semua</span>
                  </button>
                )}
              </div>

              {data.recent_transactions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                  <p className="text-zinc-500 text-xs font-medium">
                    Belum ada catatan riwayat transaksi.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.recent_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="group flex items-center justify-between bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 transition shadow-xs"
                    >
                      <div>
                        <p className="text-zinc-500 font-mono-tech text-[10px] uppercase font-semibold">
                          {t.transaction_code}
                        </p>
                        <p className="text-zinc-900 font-semibold text-xs sm:text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-display font-bold text-zinc-950 text-base">
                          {formatRupiah(t.total_amount)}
                        </p>
                        <button
                          onClick={() => setDeletingTrxId(t.id)}
                          title="Hapus transaksi ini dari riwayat"
                          className="opacity-70 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
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

      <RatingFormModal
        open={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        onSubmit={handleRatingSubmit}
        loading={submittingRating}
      />

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