import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, CalendarCheck, ShoppingBag, Receipt, ArrowRight, Clock } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { customerDashboardService } from '../../api/customerDashboardService';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { formatRupiah, BOOKING_STATUS_CONFIG, ORDER_STATUS_CONFIG } from '../../utils/format';
import { Star } from 'lucide-react';
import RatingFormModal from './RatingFormModal';
import { ratingService } from '../../api/ratingService';
import { useToast } from '../../context/ToastContext';

function ActiveSessionCard({ session }) {
  const { formatted, isExpired } = useSessionTimer(session.end_time, session.status);

  return (
    <div className="bg-cust-elevated border-2 border-cust-red overflow-hidden">
      <div className="bg-cust-red px-6 py-3 flex items-center gap-2">
        <Gamepad2 size={18} className="text-white" />
        <span className="text-white font-bold uppercase text-sm">Sedang Bermain</span>
      </div>
      <div className="p-6">
        <p className="text-cust-text-primary font-black text-2xl uppercase mb-1">{session.device?.code}</p>
        <p className="text-cust-text-secondary text-sm mb-6">{session.device?.device_type?.name}</p>

        <div className={`text-center py-6 mb-4 ${isExpired ? 'bg-cust-red/10' : 'bg-cust-bg'}`}>
          <p className={`text-4xl font-black tabular-nums ${isExpired ? 'text-cust-red' : 'text-cust-text-primary'}`}>
            {formatted}
          </p>
          <p className="text-cust-text-secondary text-xs uppercase mt-2 flex items-center justify-center gap-1">
            <Clock size={12} /> Sisa Waktu
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-cust-text-secondary">Total Sementara</span>
          <span className="text-cust-text-primary font-bold">{formatRupiah(session.price)}</span>
        </div>
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

  if (loading || !data) {
    return (
      <PublicLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        </div>
      </PublicLayout>
    );
  }

  const handleRatingSubmit = async (payload) => {
    setSubmittingRating(true);
    try {
      await ratingService.submit(ratingTarget.deviceId, payload);
      toast.success('Terima kasih atas rating-nya!');
      setRatingTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Dashboard Saya</p>
        <h1 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase mb-10">
          Halo, {user?.name?.split(' ')[0]} 👋
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri — Session Aktif / CTA */}
          <div className="lg:col-span-1">
            {data.active_session ? (
              <ActiveSessionCard session={data.active_session} />
            ) : (
              <div className="bg-cust-elevated border border-cust-border p-8 text-center">
                <Gamepad2 size={36} className="text-cust-text-secondary opacity-40 mx-auto mb-4" />
                <p className="text-cust-text-secondary text-sm mb-5">Belum ada sesi bermain aktif.</p>
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm px-6 py-3 transition"
                >
                  Booking Sekarang <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Kolom Kanan — Booking, Order, Transaksi */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Booking Mendatang */}
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <CalendarCheck size={18} className="text-cust-red" />
                <h2 className="text-cust-text-primary font-black uppercase text-base">Booking Mendatang</h2>
              </div>

              {data.upcoming_bookings.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Belum ada booking mendatang.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.upcoming_bookings.map((b) => {
                    const status = BOOKING_STATUS_CONFIG[b.status];
                    return (
                      <div key={b.id} className="flex items-center justify-between bg-cust-bg border border-cust-border p-4">
                        <div>
                          <p className="text-cust-text-primary font-bold text-sm">{b.device?.code}</p>
                          <p className="text-cust-text-secondary text-xs mt-0.5">{b.booking_date} · {b.start_time} - {b.end_time}</p>
                        </div>
                        <span className={`text-xs font-bold uppercase px-2.5 py-1 border`} style={{ borderColor: `var(--color-${status.color})`, color: `var(--color-${status.color})` }}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Aktif */}
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={18} className="text-cust-red" />
                <h2 className="text-cust-text-primary font-black uppercase text-base">Order Aktif</h2>
              </div>

              {data.active_orders.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Tidak ada order yang sedang diproses.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.active_orders.map((o) => {
                    const status = ORDER_STATUS_CONFIG[o.status];
                    return (
                      <div key={o.id} className="bg-cust-bg border border-cust-border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-cust-text-primary font-bold text-sm">{o.order_code}</p>
                          <span className="text-xs font-bold uppercase px-2.5 py-1" style={{ backgroundColor: `var(--color-${status.color})`, color: '#fff' }}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-cust-text-secondary text-xs">
                          {o.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Transaksi Belum Dibayar */}
            {data.pending_transactions.length > 0 && (
              <div className="bg-cust-elevated border-2 border-cust-red p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Receipt size={18} className="text-cust-red" />
                  <h2 className="text-cust-text-primary font-black uppercase text-base">Perlu Dibayar</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {data.pending_transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-cust-bg border border-cust-border p-4">
                      <div>
                        <p className="text-cust-text-primary font-bold text-sm">{t.transaction_code}</p>
                        <p className="text-cust-text-secondary text-xs mt-0.5">{t.session?.device_code || 'Take-away'}</p>
                      </div>
                      <p className="text-cust-red font-black text-lg">{formatRupiah(t.total_amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Riwayat Transaksi */}
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <Receipt size={18} className="text-cust-red" />
                <h2 className="text-cust-text-primary font-black uppercase text-base">Riwayat Transaksi</h2>
              </div>

              {data.recent_transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-cust-bg border border-cust-border p-4">
                  <div>
                    <p className="text-cust-text-primary font-bold text-sm">{t.transaction_code}</p>
                    <p className="text-cust-text-secondary text-xs mt-0.5">{t.session?.device_code || 'Take-away'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-cust-text-primary font-bold text-sm">{formatRupiah(t.total_amount)}</p>
                    {t.session?.device_id && (
                      <button
                        onClick={() => setRatingTarget({ deviceId: t.session.device_id, deviceCode: t.session.device_code })}
                        className="flex items-center gap-1 text-cust-red text-xs font-bold uppercase border border-cust-red/30 px-2.5 py-1.5 hover:bg-cust-red/10 transition"
                      >
                        <Star size={11} /> Rating
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RatingFormModal
        open={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        onSubmit={handleRatingSubmit}
        deviceCode={ratingTarget?.deviceCode}
        loading={submittingRating}
      />
    </PublicLayout>
  );
}