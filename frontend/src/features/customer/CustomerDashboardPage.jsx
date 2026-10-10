import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  CalendarCheck,
  ShoppingBag,
  Receipt,
  ArrowRight,
  Clock,
  Plus,
  Star,
  Activity,
  Zap,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { customerDashboardService } from '../../api/customerDashboardService';
import { ratingService } from '../../api/ratingService';
import { useToast } from '../../context/ToastContext';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import RatingFormModal from './RatingFormModal';
import { formatRupiah, BOOKING_STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

const ORDER_STEPS = ['pending', 'processing', 'ready'];
const ORDER_STEP_LABEL = {
  pending: 'Diterima Kasir',
  processing: 'Sedang Disiapkan',
  ready: 'Siap Diantar ke Meja',
};

// ── KARTU SESI AKTIF (TACTICAL BATTLE HUD) ──
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
    <div className="relative rounded-3xl overflow-hidden border border-cust-red/40 bg-gradient-to-b from-[#15151c] to-[#0c0c10] shadow-[0_0_40px_rgba(227,30,36,0.2)]">
      {/* Background Ambient Glow & Scanline */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cust-red/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Header Bar HUD */}
      <div className="relative z-10 px-6 py-4 bg-black/40 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cust-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cust-red" />
          </span>
          <span className="font-mono-tech text-xs font-bold text-cust-red uppercase tracking-widest">
            LIVE SESSION ACTIVE
          </span>
        </div>
        <span className="font-mono-tech text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white font-semibold">
          STATION: {session.device?.code}
        </span>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-mono-tech text-neutral-400 uppercase tracking-wider">
              {session.device?.device_type?.name} RIG
            </p>
            <h2 className="font-display font-black text-white text-3xl sm:text-4xl uppercase tracking-tight mt-0.5">
              {session.device?.code}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono-tech text-neutral-400 uppercase">Status Smart Lock</p>
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-emerald-400 font-bold mt-0.5">
              <CheckCircle2 size={13} /> UNLOCKED & RUNNING
            </span>
          </div>
        </div>

        {/* Big Live Countdown Display */}
        <div className="p-6 rounded-2xl bg-[#09090c]/90 border border-white/10 text-center mb-6 shadow-inner relative overflow-hidden">
          <p className="font-mono-tech text-[11px] text-neutral-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Clock size={13} className="text-cust-red" />
            SISA WAKTU BERMAIN
          </p>

          <p
            className={`font-display font-black text-5xl sm:text-6xl tracking-tight tabular-nums ${
              isExpired ? 'text-cust-red animate-pulse' : 'text-white'
            }`}
          >
            {formatted}
          </p>

          {/* Progress Bar Meter */}
          <div className="mt-5 max-w-md mx-auto">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-neutral-500 mb-1.5">
              <span>WAKTU BERJALAN</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-cust-red to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Session Fee Strip */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6">
          <span className="text-xs font-mono-tech text-neutral-400 uppercase">Tarif Sesi Ini</span>
          <span className="font-display font-black text-xl text-white">
            {formatRupiah(session.price)}
          </span>
        </div>

        {/* Quick Order F&B CTA */}
        <Link
          to="/menu"
          className="w-full group flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-cust-red to-[#b8151a] hover:from-[#f02830] hover:to-cust-red text-white font-display font-black uppercase text-sm tracking-wider shadow-[0_0_25px_rgba(227,30,36,0.35)] hover:shadow-[0_0_35px_rgba(227,30,36,0.55)] transition-all cursor-pointer active:scale-[0.98]"
        >
          <Coffee size={17} className="text-amber-300" />
          <span>PESAN MAKANAN / KOPI KE MEJA INI</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
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
      // Reload summary agar widget rating hilang setelah dinilai
      const updated = await customerDashboardService.getSummary();
      setData(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading || !data) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center font-mono-tech text-neutral-400">
          <Activity className="animate-spin text-cust-red mx-auto mb-3" size={32} />
          <p className="text-xs uppercase tracking-widest">MEMUAT DOSSIER CUSTOMER...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* ── PLAYER DOSSIER HEADER ── */}
      <section className="relative overflow-hidden border-b border-[#1f1f26] bg-[#09090c]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/3 w-96 h-40 bg-cust-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Player Info Left */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cust-red/50 shadow-[0_0_20px_rgba(227,30,36,0.3)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a22] to-[#0c0c10] border border-white/10 flex items-center justify-center text-white font-display font-black text-2xl shadow-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#09090c]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono-tech text-[10px] font-bold text-cust-red tracking-[0.2em] uppercase">
                    PLAYER DOSSIER
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono-tech font-bold">
                    MEMBER
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-neutral-400 text-xs font-mono-tech mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Quick Actions Right */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/browse-devices"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-display font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(227,30,36,0.35)] transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Pesan Station Baru</span>
              </Link>

              <Link
                to="/menu"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#14141a] hover:bg-[#1c1c24] border border-[#272733] text-neutral-200 hover:text-white font-display font-bold uppercase tracking-wider text-xs transition-all active:scale-95"
              >
                <ShoppingBag size={15} className="text-amber-400" />
                <span>Beli Makanan / Minuman</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── LEFT COLUMN (Active Session & Rating) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {data.active_session ? (
              <ActiveSessionCard session={data.active_session} />
            ) : (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-500 mx-auto mb-4">
                  <Gamepad2 size={32} />
                </div>
                <h3 className="font-display font-black text-white text-2xl uppercase mb-1">
                  TIDAK ADA SESI AKTIF
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                  Stasiun siap ditempati. Pilih PlayStation 5 atau PC Gaming spek tinggi untuk mulai bermain.
                </p>
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-display font-black uppercase text-xs tracking-wider shadow-[0_0_20px_rgba(227,30,36,0.35)] transition-all"
                >
                  <span>PILIH & BOOKING STATION</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Widget Beri Rating Arena */}
            {data.can_rate_arena && (
              <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#14120f] to-[#0c0c10] p-6 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-2.5 mb-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <h3 className="font-display font-black text-white text-lg uppercase tracking-wide">
                    ULASAN ELYSIUM ARENA
                  </h3>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed mb-5">
                  Bagikan kepuasanmu bermain di sini untuk membantu kami menjaga kualitas perangkat & layanan.
                </p>
                <button
                  onClick={() => setRatingTarget(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Star size={14} />
                  <span>BERI RATING SEKARANG</span>
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (Pending, Bookings, Orders, Transactions) ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Tagihan Menunggu Pembayaran */}
            {data.pending_transactions.length > 0 && (
              <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#181308] to-[#0d0d0a] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle size={18} className="text-amber-400 animate-pulse" />
                    <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                      TAGIHAN MENUNGGU PEMBAYARAN
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono-tech text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                    {data.pending_transactions.length} PENDING
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {data.pending_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-black/50 border border-white/10 rounded-2xl p-4"
                    >
                      <div>
                        <p className="font-mono-tech text-neutral-400 text-[10px] uppercase">
                          {t.transaction_code}
                        </p>
                        <p className="text-white font-bold text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B Take-away'}
                        </p>
                        <p className="text-[11px] font-mono-tech text-amber-400/90 mt-0.5">
                          Selesaikan pembayaran di kasir
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
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <CalendarCheck size={18} className="text-cust-red" />
                  <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    BOOKING MENDATANG
                  </h2>
                </div>
                <Link
                  to="/browse-devices"
                  className="text-cust-red hover:text-white font-mono-tech text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                >
                  <span>JADWALKAN BARU</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {data.upcoming_bookings.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-neutral-400 text-xs font-mono-tech">
                    TIDAK ADA JADWAL BOOKING MENDATANG
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {data.upcoming_bookings.map((b) => {
                    const status = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'neutral' };
                    return (
                      <div
                        key={b.id}
                        className="bg-black/40 border border-white/10 rounded-2xl p-4.5 flex flex-col justify-between hover:border-cust-red/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono-tech text-neutral-400 text-[10px] uppercase">
                            {b.booking_code}
                          </span>
                          <span className="text-[10px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {status.label}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-display font-black text-xl uppercase mb-1">
                            {b.device?.code}
                          </p>
                          <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono-tech">
                            <Clock size={12} className="text-cust-red" />
                            <span>
                              {b.booking_date} · {b.start_time} - {b.end_time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Status Pesanan F&B Aktif */}
            {data.active_orders.length > 0 && (
              <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-6 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2.5 mb-5">
                  <ShoppingBag size={18} className="text-amber-400" />
                  <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    STATUS RUNNER F&B
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {data.active_orders.map((o) => {
                    const currentIdx = ORDER_STEPS.indexOf(o.status);
                    return (
                      <div
                        key={o.id}
                        className="bg-black/40 border border-white/10 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono-tech text-amber-400 text-xs font-bold uppercase">
                            ORDER: {o.order_code}
                          </span>
                          <span className="text-xs font-mono-tech text-neutral-400">
                            {formatRupiah(o.total_price)}
                          </span>
                        </div>

                        <p className="text-neutral-300 text-xs mb-4">
                          {o.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
                        </p>

                        {/* Tracker Steps */}
                        <div className="flex gap-2">
                          {ORDER_STEPS.map((step, idx) => (
                            <div key={step} className="flex-1 flex flex-col gap-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  idx <= currentIdx
                                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                    : 'bg-white/10'
                                }`}
                              />
                              <span
                                className={`text-[10px] font-mono-tech uppercase ${
                                  idx <= currentIdx ? 'text-amber-400 font-bold' : 'text-neutral-500'
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

            {/* 4. Riwayat Transaksi Terakhir */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-6 sm:p-7 shadow-xl">
              <div className="flex items-center gap-2.5 mb-5">
                <Receipt size={18} className="text-neutral-400" />
                <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">
                  RIWAYAT LOG TRANSAKSI
                </h2>
              </div>

              {data.recent_transactions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-neutral-400 text-xs font-mono-tech">
                    BELUM ADA TRANSAKSI TERCATAT
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {data.recent_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between bg-black/40 border border-white/5 hover:border-white/15 rounded-xl px-4 py-3 transition-colors"
                    >
                      <div>
                        <p className="font-mono-tech text-neutral-400 text-[10px] uppercase">
                          {t.transaction_code}
                        </p>
                        <p className="text-white font-medium text-xs sm:text-sm mt-0.5">
                          {t.session?.device_code ? `Sesi ${t.session.device_code}` : 'Pesanan F&B'}
                        </p>
                      </div>
                      <p className="font-display font-bold text-white text-base">
                        {formatRupiah(t.total_amount)}
                      </p>
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
    </PublicLayout>
  );
}