import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, CalendarCheck, ShoppingBag, Receipt, ArrowRight, Clock, MapPin, Plus, Star, MessageCircle } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { customerDashboardService } from '../../api/customerDashboardService';
import { ratingService } from '../../api/ratingService';
import { useToast } from '../../context/ToastContext';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import RatingFormModal from './RatingFormModal';
import { formatRupiah, BOOKING_STATUS_CONFIG, ORDER_STATUS_CONFIG } from '../../utils/format';

const ORDER_STEPS = ['pending', 'processing', 'ready'];
const ORDER_STEP_LABEL = { pending: 'Diterima', processing: 'Diproses', ready: 'Siap Diantar' };

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
    <div className="bg-cust-bg border border-cust-border overflow-hidden">
      <div className="bg-cust-elevated flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cust-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cust-red" />
          </span>
          <span className="text-cust-red font-bold text-[10px] uppercase tracking-widest">Sedang Bermain</span>
        </div>
        <span className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">{session.device?.code}</span>
      </div>

      <div className="p-6">
        <p className="font-display font-black text-cust-text-primary text-xl uppercase mb-1">{session.device?.code}</p>
        <p className="text-cust-text-secondary text-sm mb-5">{session.device?.device_type?.name}</p>

        <div className="bg-cust-elevated p-5 text-center mb-4">
          <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase tracking-widest mb-2">Sisa Waktu Sesi</p>
          <p className={`font-display font-black text-4xl tabular-nums ${isExpired ? 'text-cust-red' : 'text-cust-text-primary'}`}>
            {formatted}
          </p>
          <div className="mt-4">
            <div className="bg-cust-bg h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-cust-red rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-cust-elevated px-4 py-3 mb-5">
          <div>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">Biaya Sesi Berjalan</p>
            <p className="font-display font-black text-cust-text-primary text-lg">{formatRupiah(session.price)}</p>
          </div>
        </div>

        <Link
          to="/menu"
          className="w-full flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-3.5 transition"
        >
          Pesan Makanan/Minuman <ArrowRight size={15} />
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
    customerDashboardService.getSummary().then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  const handleRatingSubmit = async (payload) => {
    setSubmittingRating(true);
    try {
      await ratingService.submit(payload);
      toast.success('Terima kasih atas rating-nya!');
      setRatingTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading || !data) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Header ringkas */}
      <div className="border-b border-cust-border bg-cust-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-cust-red flex items-center justify-center text-white font-black text-lg shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-cust-text-primary font-display font-black text-xl uppercase">Halo, {user?.name?.split(' ')[0]}</p>
              {data.active_session && (
                <span className="inline-flex items-center gap-1.5 text-cust-red text-xs font-bold uppercase mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cust-red animate-pulse" />
                  Sedang Bermain di {data.active_session.device?.code}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/browse-devices" className="flex items-center gap-1.5 bg-cust-elevated border border-cust-border hover:border-cust-red text-cust-text-primary text-xs font-bold uppercase px-4 py-2.5 transition">
              <Plus size={13} /> Pesan Station Baru
            </Link>
            <Link to="/menu" className="flex items-center gap-1.5 bg-cust-elevated border border-cust-border hover:border-cust-red text-cust-text-primary text-xs font-bold uppercase px-4 py-2.5 transition">
              <ShoppingBag size={13} /> Menu F&B
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {data.active_session ? (
              <ActiveSessionCard session={data.active_session} />
            ) : (
              <div className="bg-cust-elevated border border-cust-border p-8 text-center">
                <Gamepad2 size={32} className="text-cust-text-secondary opacity-40 mx-auto mb-4" />
                <p className="text-cust-text-secondary text-sm mb-5">Belum ada sesi bermain aktif.</p>
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm px-6 py-3 transition"
                >
                  Booking Sekarang <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Widget Rating */}
            {data.can_rate_arena && (
              <div className="bg-cust-elevated border border-cust-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-cust-red" />
                  <h3 className="text-cust-text-primary font-black uppercase text-sm">Beri Rating Elysium Arena</h3>
                </div>
                <p className="text-cust-text-secondary text-xs mb-4">Rating cuma bisa dikirim sekali, jadi pastikan sesuai pengalaman kamu main di sini.</p>
                <button
                  onClick={() => setRatingTarget(true)}
                  className="w-full flex items-center justify-center gap-2 bg-cust-bg border border-cust-border hover:border-cust-red text-cust-text-primary font-bold uppercase text-xs py-3 transition"
                >
                  Beri Rating Sekarang
                </button>
              </div>
            )}
          </div>

          {/* Kolom Kanan */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tagihan Menunggu Bayar */}
            {data.pending_transactions.length > 0 && (
              <div className="bg-cust-elevated border-2 border-cust-red p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={16} className="text-cust-red" />
                  <h2 className="text-cust-text-primary font-black uppercase text-sm">Tagihan Menunggu Pembayaran</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {data.pending_transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-cust-bg border border-cust-border p-4">
                      <div>
                        <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase mb-1">{t.transaction_code}</p>
                        <p className="text-cust-text-primary font-bold text-sm">{t.session?.device_code || 'Take-away'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-cust-red text-xl">{formatRupiah(t.total_amount)}</p>
                        <p className="text-cust-text-secondary text-[10px]">Bayar di Kasir</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Mendatang */}
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} className="text-cust-red" />
                  <h2 className="text-cust-text-primary font-black uppercase text-sm">Booking Mendatang</h2>
                </div>
                <Link to="/browse-devices" className="text-cust-red text-[10px] font-bold uppercase flex items-center gap-1 hover:gap-1.5 transition-all">
                  Jadwalkan Baru <ArrowRight size={10} />
                </Link>
              </div>

              {data.upcoming_bookings.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Belum ada booking mendatang.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.upcoming_bookings.map((b) => {
                    const status = BOOKING_STATUS_CONFIG[b.status];
                    return (
                      <div key={b.id} className="bg-cust-bg border border-cust-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">{b.booking_code}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-1 border" style={{ borderColor: `var(--color-${status.color})`, color: `var(--color-${status.color})` }}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-cust-text-primary font-black uppercase text-sm mb-2">{b.device?.code}</p>
                        <div className="flex items-center gap-1.5 text-cust-text-secondary text-xs mb-1">
                          <Clock size={11} /> {b.booking_date} · {b.start_time} - {b.end_time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order F&B Aktif */}
            {data.active_orders.length > 0 && (
              <div className="bg-cust-elevated border border-cust-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingBag size={16} className="text-cust-red" />
                  <h2 className="text-cust-text-primary font-black uppercase text-sm">Status Pesanan F&B</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {data.active_orders.map((o) => {
                    const currentIdx = ORDER_STEPS.indexOf(o.status);
                    return (
                      <div key={o.id} className="bg-cust-bg border border-cust-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">{o.order_code}</span>
                          <span className="text-cust-text-secondary text-xs">
                            {o.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {ORDER_STEPS.map((step, idx) => (
                            <div key={step} className="flex-1 flex flex-col gap-1.5">
                              <div className={`h-1.5 rounded-full ${idx <= currentIdx ? 'bg-cust-red' : 'bg-cust-elevated'}`} />
                              <span className={`text-[9px] uppercase font-mono-tech ${idx <= currentIdx ? 'text-cust-red' : 'text-cust-text-secondary'}`}>
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

            {/* Riwayat Transaksi */}
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Receipt size={16} className="text-cust-red" />
                <h2 className="text-cust-text-primary font-black uppercase text-sm">Riwayat Transaksi</h2>
              </div>

              {data.recent_transactions.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Belum ada riwayat transaksi.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.recent_transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-cust-bg border border-cust-border px-4 py-3">
                      <div>
                        <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase mb-0.5">{t.transaction_code}</p>
                        <p className="text-cust-text-primary text-sm">{t.session?.device_code || 'Take-away'}</p>
                      </div>
                      <p className="text-cust-text-primary font-bold text-sm">{formatRupiah(t.total_amount)}</p>
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
    </PublicLayout>
  );
}