import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Gift,
  Gamepad2,
  UtensilsCrossed,
  CheckCircle2,
  Award,
  Clock,
  Coins,
  Sparkles,
  Coffee,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Check,
  X,
  History,
  Ticket,
  Trash2
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { rewardService } from '../../api/rewardService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function RewardsPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [activeTab, setActiveTab] = useState('vouchers');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [choosingLegacy, setChoosingLegacy] = useState(null);
  const [deletingRewardId, setDeletingRewardId] = useState(null);
  const [confirmClearAllRedeemed, setConfirmClearAllRedeemed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await rewardService.getMyRewards();
      setData(res.data);
    } catch (err) {
      toast.error('Gagal memuat program loyalitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async () => {
    if (!confirmModal) return;
    setRedeeming(true);
    try {
      const res = await rewardService.redeemReward(confirmModal.id);
      toast.success(res.data.message || 'Reward berhasil ditukarkan!');
      setConfirmModal(null);
      await fetchData();
      setActiveTab('vouchers');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.catalog_id?.[0] || 'Gagal menukarkan reward.');
    } finally {
      setRedeeming(false);
    }
  };

  const handleChooseLegacy = async (rewardId, type) => {
    setChoosingLegacy(rewardId);
    try {
      await rewardService.chooseType(rewardId, type);
      toast.success('Reward milestone berhasil dipilih!');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memilih reward.');
    } finally {
      setChoosingLegacy(null);
    }
  };

  const handleDeleteReward = async () => {
    if (!deletingRewardId) return;
    setActionLoading(true);
    try {
      await rewardService.deleteReward(deletingRewardId);
      toast.success('Riwayat voucher berhasil dihapus.');
      setDeletingRewardId(null);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus riwayat voucher.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAllRedeemed = async () => {
    setActionLoading(true);
    try {
      await rewardService.clearRedeemed();
      toast.success('Semua riwayat voucher terpakai berhasil dibersihkan.');
      setConfirmClearAllRedeemed(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membersihkan riwayat voucher.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !data) {
    return (
      <PublicLayout>
        <div className="max-w-5xl mx-auto px-4 py-28 text-center text-zinc-500">
          <div className="w-8 h-8 border-2 border-cust-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-wider font-mono">Memuat Program Loyalitas & Saldo Koin...</p>
        </div>
      </PublicLayout>
    );
  }

  const userPoints = data?.loyalty_points ?? 0;
  const catalog = data?.catalog || [];
  const rewards = data?.rewards || [];
  const transactions = data?.transactions || [];

  const pendingChoice = rewards.filter((r) => r.status === 'pending_choice');
  const availableVouchers = rewards.filter((r) => r.status === 'available');
  const usedVouchers = rewards.filter((r) => r.status === 'redeemed');

  const filteredCatalog = catalog.filter((item) => {
    if (catalogCategory === 'gaming') return item.reward_type === 'free_hour' || item.reward_type === 'free_2_hours';
    if (catalogCategory === 'food') return item.reward_type === 'free_food';
    return true;
  });

  const getRewardIcon = (iconType, type) => {
    if (iconType === 'coffee') return <Coffee size={20} className="text-amber-400" />;
    if (iconType === 'utensils' || type === 'free_food') return <UtensilsCrossed size={20} className="text-amber-400" />;
    return <Gamepad2 size={20} className="text-cust-red" />;
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-semibold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Coins size={14} className="text-amber-600" />
            <span>Sistem Koin Loyalitas Elysium</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl sm:text-4xl uppercase tracking-tight">
            Koleksi & Penukaran Koin
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
            Main game di Elysium Arena dan kumpulkan koin reward secara otomatis. Tukarkan koinmu dengan berbagai voucher jam main gratis atau menu kafe favoritmu kapan saja.
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-white to-zinc-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] mb-10">

          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cust-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-amber-200/60">

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-600" />
                Saldo Koin Aktif Anda
              </span>
              <div className="flex items-baseline gap-3 mt-1.5">
                <span className="font-display font-black text-4xl sm:text-5xl text-amber-600 tracking-tight">
                  {formatNumber(userPoints)}
                </span>
                <span className="font-display font-bold text-zinc-500 text-base sm:text-lg tracking-wider">
                  KOIN PTS
                </span>
              </div>
              <p className="text-zinc-500 text-xs mt-1 font-medium">
                Koin dapat ditukarkan langsung di katalog hadiah di bawah tanpa batasan kuota.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Jam</p>
                <p className="font-display font-bold text-base sm:text-xl text-zinc-950 mt-1">
                  {data?.total_hours_played ?? 0} <span className="text-xs text-zinc-500 font-normal">Jam</span>
                </p>
              </div>
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Sesi Selesai</p>
                <p className="font-display font-bold text-base sm:text-xl text-zinc-950 mt-1">
                  {data?.completed_sessions ?? 0}
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                <p className="text-[10px] text-emerald-700 uppercase tracking-wider font-semibold">Voucher Aktif</p>
                <p className="font-display font-bold text-base sm:text-xl text-emerald-700 mt-1">
                  {availableVouchers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-600 gap-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                <strong>Aturan Poin:</strong> Main 1 Jam = <strong>+100 Koin</strong> | Main 2 Jam = <strong>+200 Koin</strong>
              </span>
            </div>
            <span className="text-zinc-500 text-[11px]">
              Koin otomatis ditambahkan ke akun setiap sesi gaming diselesaikan.
            </span>
          </div>
        </div>

        {pendingChoice.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display font-black text-zinc-950 uppercase text-xl mb-4 flex items-center gap-2">
              <Gift size={18} className="text-cust-red" />
              Reward Milestone Tersedia
            </h2>
            <div className="space-y-4">
              {pendingChoice.map((r) => (
                <div key={r.id} className="bg-white border border-red-200 rounded-3xl p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]">
                  <p className="text-zinc-700 text-xs mb-4 font-medium">
                    Selamat! Kamu telah mencapai milestone <strong>{r.milestone} sesi bermain</strong>. Silakan pilih hadiah bonus:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleChooseLegacy(r.id, 'free_hour')}
                      disabled={choosingLegacy === r.id}
                      className="flex items-center gap-3.5 bg-zinc-50 border border-zinc-200 hover:border-cust-red hover:bg-white p-4 rounded-2xl text-left transition disabled:opacity-50 group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-cust-red shrink-0 group-hover:scale-105 transition">
                        <Gamepad2 size={20} />
                      </div>
                      <div>
                        <p className="text-zinc-950 font-bold text-sm">Gratis 1 Jam Main</p>
                        <p className="text-zinc-500 text-xs mt-0.5">Potongan otomatis saat booking rig</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleChooseLegacy(r.id, 'free_food')}
                      disabled={choosingLegacy === r.id}
                      className="flex items-center gap-3.5 bg-zinc-50 border border-zinc-200 hover:border-cust-red hover:bg-white p-4 rounded-2xl text-left transition disabled:opacity-50 group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition">
                        <UtensilsCrossed size={20} />
                      </div>
                      <div>
                        <p className="text-zinc-950 font-bold text-sm">Gratis {data.reward_product_name || 'Menu Spesial Kafe'}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">Potongan otomatis saat order makanan</p>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-cust-red font-semibold uppercase tracking-wider mb-1">
                <Gift size={14} />
                <span>Katalog Pilihan</span>
              </div>
              <h2 className="font-display font-black text-zinc-950 uppercase text-2xl tracking-tight">
                Tukarkan Koin Hadiah
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm mt-0.5 font-medium">
                Pilih reward yang kamu inginkan. Voucher akan langsung aktif setelah ditukarkan.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-100 border border-zinc-200 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setCatalogCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  catalogCategory === 'all'
                    ? 'bg-white text-zinc-950 shadow-xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setCatalogCategory('gaming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  catalogCategory === 'gaming'
                    ? 'bg-white text-zinc-950 shadow-xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Jam Main
              </button>
              <button
                onClick={() => setCatalogCategory('food')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  catalogCategory === 'food'
                    ? 'bg-white text-zinc-950 shadow-xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                Kafe & F&B
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredCatalog.map((item) => {
              const canAfford = userPoints >= item.points_required;
              const pointsNeeded = item.points_required - userPoints;

              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between bg-white border rounded-3xl p-6 transition-all duration-300 ${
                    canAfford
                      ? 'border-zinc-200/90 hover:border-amber-400 hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.08),0_10px_15px_-5px_rgba(217,119,6,0.08)] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]'
                      : 'border-zinc-200/60 opacity-90 shadow-xs'
                  }`}
                >
                  <div>

                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                        {getRewardIcon(item.icon, item.reward_type)}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-display font-bold text-xs">
                        <Coins size={14} className="text-amber-600" />
                        <span>{formatNumber(item.points_required)} Poin</span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-zinc-950 text-base sm:text-lg mb-1.5 group-hover:text-amber-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-200">
                    {canAfford ? (
                      <button
                        onClick={() => setConfirmModal(item)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>Tukar Sekarang</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle size={13} className="text-zinc-400" />
                          <span>Poin belum cukup</span>
                        </span>
                        <span className="font-mono text-zinc-600 font-semibold">
                          Kurang {formatNumber(pointsNeeded)} poin
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">

          <div className="flex items-center gap-2 sm:gap-4 border-b border-zinc-200 pb-4 mb-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === 'vouchers'
                  ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Ticket size={16} className={activeTab === 'vouchers' ? 'text-emerald-600' : ''} />
              <span>Voucher Aktif Saya ({availableVouchers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <History size={16} className={activeTab === 'history' ? 'text-amber-600' : ''} />
              <span>Riwayat Poin ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('used')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === 'used'
                  ? 'bg-zinc-100 text-zinc-950 border border-zinc-300 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <CheckCircle2 size={16} className={activeTab === 'used' ? 'text-zinc-400' : ''} />
              <span>Riwayat Terpakai ({usedVouchers.length})</span>
            </button>
          </div>

          {activeTab === 'vouchers' && (
            <div>
              {availableVouchers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableVouchers.map((v) => {
                    const isGaming = v.type === 'free_hour' || v.type === 'free_2_hours';
                    return (
                      <div
                        key={v.id}
                        className="relative overflow-hidden bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                              <CheckCircle2 size={12} />
                              Siap Digunakan
                            </span>
                            <span className="text-zinc-500 text-[11px] font-mono">
                              Didapat: {formatDate(v.created_at)}
                            </span>
                          </div>

                          <div className="flex items-start gap-3.5 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                              {isGaming ? <Gamepad2 size={18} /> : <UtensilsCrossed size={18} />}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-zinc-950 text-base">
                                {v.title || (v.type === 'free_hour' ? 'Gratis 1 Jam Sewa Station' : v.type === 'free_2_hours' ? 'Gratis 2 Jam Sewa Station' : 'Gratis Menu Kafe')}
                              </h4>
                              <p className="text-zinc-600 text-xs mt-0.5 font-medium">
                                {isGaming
                                  ? 'Otomatis dapat dicentang saat melakukan pemesanan station.'
                                  : 'Otomatis dapat dicentang saat memesan makanan di kafe.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-500 font-medium">
                            Potongan langsung saat checkout
                          </span>
                          <Link
                            to={isGaming ? '/booking' : '/food'}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-bold transition"
                          >
                            <span>{isGaming ? 'Booking Rig' : 'Menu Kafe'}</span>
                            <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                    <Ticket size={24} />
                  </div>
                  <h4 className="text-zinc-950 font-bold text-sm mb-1">Belum Ada Voucher Aktif</h4>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto mb-5 font-medium">
                    Kumpulkan koin dari sesi bermainmu dan tukarkan hadiah pilihanmu di katalog di atas.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Waktu</th>
                        <th className="pb-3 font-semibold">Aktivitas / Keterangan</th>
                        <th className="pb-3 font-semibold text-right">Perubahan Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {transactions.map((t) => {
                        const isPositive = t.amount > 0;
                        return (
                          <tr key={t.id} className="hover:bg-zinc-50 transition">
                            <td className="py-3.5 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                              {formatDate(t.created_at)}
                            </td>
                            <td className="py-3.5 pr-4">
                              <p className="text-zinc-900 font-semibold">{t.description}</p>
                              <span className="text-[10px] text-zinc-500 font-mono uppercase">
                                {t.type === 'earn_session' ? '🎮 Sesi Gaming' : t.type === 'redeem_reward' ? '🎁 Penukaran Reward' : '⭐ Bonus / Sistem'}
                              </span>
                            </td>
                            <td className="py-3.5 text-right whitespace-nowrap">
                              <span
                                className={`font-display font-bold text-sm inline-flex items-center gap-1 ${
                                  isPositive ? 'text-emerald-700' : 'text-zinc-600'
                                }`}
                              >
                                {isPositive ? '+' : ''}{formatNumber(t.amount)} PTS
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                    <History size={24} />
                  </div>
                  <h4 className="text-zinc-950 font-bold text-sm mb-1">Belum Ada Riwayat Transaksi</h4>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto font-medium">
                    Setiap kamu selesai bermain atau menukarkan reward, mutasi koin akan tercatat di sini.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'used' && (
            <div>
              {usedVouchers.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-1 border-b border-zinc-200">
                    <p className="text-zinc-600 text-xs font-medium">
                      Daftar voucher koin yang telah selesai digunakan untuk sesi gaming atau kafe.
                    </p>
                    <button
                      type="button"
                      onClick={() => setConfirmClearAllRedeemed(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                      title="Bersihkan semua riwayat voucher terpakai"
                    >
                      <Trash2 size={13} />
                      <span>Bersihkan Semua</span>
                    </button>
                  </div>
                  {usedVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="group flex items-center justify-between bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 rounded-2xl p-4 transition shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <p className="text-zinc-900 font-semibold text-xs sm:text-sm">
                            {v.title || (v.type === 'free_hour' ? 'Gratis 1 Jam Main' : v.type === 'free_2_hours' ? 'Gratis 2 Jam Main' : 'Gratis Menu Spesial Kafe')}
                          </p>
                          <p className="text-zinc-500 text-[11px]">
                            Digunakan pada: {formatDate(v.redeemed_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-semibold">
                          Sudah Terpakai
                        </span>
                        <button
                          type="button"
                          onClick={() => setDeletingRewardId(v.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus riwayat voucher ini"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <p className="text-zinc-500 text-xs font-medium">Belum ada voucher yang terpakai.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-zinc-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
              <button
                onClick={() => setConfirmModal(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 transition p-1 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
                <Coins size={24} />
              </div>

              <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-tight mb-2">
                Konfirmasi Penukaran
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed mb-6 font-medium">
                Apakah kamu yakin ingin menukarkan koin untuk reward ini?
              </p>

              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-zinc-950 font-bold text-sm">{confirmModal.title}</span>
                  <span className="text-amber-700 font-display font-bold text-xs shrink-0">
                    -{formatNumber(confirmModal.points_required)} PTS
                  </span>
                </div>
                <p className="text-zinc-600 text-xs mb-3 font-medium">{confirmModal.description}</p>
                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-600">Sisa Koin Setelah Penukaran:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {formatNumber(userPoints - confirmModal.points_required)} PTS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  disabled={redeeming}
                  className="py-3 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {redeeming ? (
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Ya, Tukarkan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={!!deletingRewardId}
          title="Hapus Riwayat Voucher"
          message="Apakah kamu yakin ingin menghapus riwayat voucher terpakai ini dari daftar akunmu?"
          confirmLabel={actionLoading ? 'Menghapus...' : 'Ya, Hapus'}
          variant="danger"
          onConfirm={handleDeleteReward}
          onCancel={() => !actionLoading && setDeletingRewardId(null)}
        />

        <ConfirmDialog
          isOpen={confirmClearAllRedeemed}
          title="Bersihkan Semua Riwayat Voucher"
          message="Apakah kamu yakin ingin membersihkan semua riwayat voucher yang sudah terpakai dari akunmu?"
          confirmLabel={actionLoading ? 'Membersihkan...' : 'Ya, Bersihkan Semua'}
          variant="danger"
          onConfirm={handleClearAllRedeemed}
          onCancel={() => !actionLoading && setConfirmClearAllRedeemed(false)}
        />
      </div>
    </PublicLayout>
  );
}