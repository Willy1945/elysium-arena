import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gift, Gamepad2, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { rewardService } from '../../api/rewardService';

export default function RewardsPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [choosing, setChoosing] = useState(null);

  const fetchData = () => {
    rewardService.getMyRewards().then(({ data }) => setData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChoose = async (rewardId, type) => {
    setChoosing(rewardId);
    try {
      await rewardService.chooseType(rewardId, type);
      toast.success('Reward berhasil dipilih!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memilih reward.');
    } finally {
      setChoosing(null);
    }
  };

  if (!data) {
    return <PublicLayout><div className="max-w-4xl mx-auto px-4 py-20"><p className="text-cust-text-secondary text-sm">Memuat...</p></div></PublicLayout>;
  }

  const pendingChoice = data.rewards.filter((r) => r.status === 'pending_choice');
  const available = data.rewards.filter((r) => r.status === 'available');
  const redeemed = data.rewards.filter((r) => r.status === 'redeemed');

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase mb-8 transition">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <div className="mb-10">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-1">Loyalty Program</p>
          <h1 className="text-cust-text-primary font-black text-3xl uppercase">Reward Saya</h1>
        </div>

        {/* Progress */}
        <div className="bg-cust-elevated border border-cust-border p-7 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-cust-text-primary font-bold text-sm">Menuju Reward Berikutnya</p>
            <p className="text-cust-red font-black text-sm">{data.progress_current} / {data.progress_target}</p>
          </div>
          <div className="bg-cust-bg h-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-cust-red rounded-full transition-all" style={{ width: `${(data.progress_current / data.progress_target) * 100}%` }} />
          </div>
          <p className="text-cust-text-secondary text-xs mt-3">
            Total {data.completed_sessions} sesi selesai. Setiap 10 sesi, dapatkan 1 reward: gratis 1 jam main atau gratis {data.reward_product_name || 'menu spesial'}.
          </p>
        </div>

        {/* Perlu Dipilih */}
        {pendingChoice.length > 0 && (
          <div className="mb-8">
            <h2 className="text-cust-text-primary font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Gift size={16} className="text-cust-red" /> Reward Baru — Pilih Hadiahmu
            </h2>
            <div className="flex flex-col gap-4">
              {pendingChoice.map((r) => (
                <div key={r.id} className="bg-cust-elevated border-2 border-cust-red p-6">
                  <p className="text-cust-text-secondary text-xs mb-4">Selamat! Kamu sudah main {r.milestone}x. Pilih 1 hadiah:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleChoose(r.id, 'free_hour')}
                      disabled={choosing === r.id}
                      className="flex items-center gap-3 bg-cust-bg border border-cust-border hover:border-cust-red p-4 text-left transition disabled:opacity-50"
                    >
                      <Gamepad2 size={22} className="text-cust-red shrink-0" />
                      <div>
                        <p className="text-cust-text-primary font-bold text-sm">Gratis 1 Jam Main</p>
                        <p className="text-cust-text-secondary text-xs">Dipakai otomatis saat booking</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleChoose(r.id, 'free_food')}
                      disabled={choosing === r.id}
                      className="flex items-center gap-3 bg-cust-bg border border-cust-border hover:border-cust-red p-4 text-left transition disabled:opacity-50"
                    >
                      <UtensilsCrossed size={22} className="text-cust-red shrink-0" />
                      <div>
                        <p className="text-cust-text-primary font-bold text-sm">Gratis {data.reward_product_name || 'Menu Spesial'}</p>
                        <p className="text-cust-text-secondary text-xs">Dipakai otomatis saat pesan makanan</p>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Siap Digunakan */}
        {available.length > 0 && (
          <div className="mb-8">
            <h2 className="text-cust-text-primary font-black uppercase text-sm mb-4">Siap Digunakan</h2>
            <div className="flex flex-col gap-3">
              {available.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-cust-elevated border border-green-500/30 p-4">
                  <div className="flex items-center gap-3">
                    {r.type === 'free_hour' ? <Gamepad2 size={18} className="text-green-400" /> : <UtensilsCrossed size={18} className="text-green-400" />}
                    <p className="text-cust-text-primary font-bold text-sm">
                      {r.type === 'free_hour' ? 'Gratis 1 Jam Main' : `Gratis ${data.reward_product_name || 'Menu Spesial'}`}
                    </p>
                  </div>
                  <span className="text-green-400 text-xs font-bold uppercase">Siap Pakai</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riwayat */}
        {redeemed.length > 0 && (
          <div>
            <h2 className="text-cust-text-primary font-black uppercase text-sm mb-4">Riwayat Reward</h2>
            <div className="flex flex-col gap-2">
              {redeemed.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-cust-bg border border-cust-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cust-text-secondary" />
                    <p className="text-cust-text-secondary text-sm">{r.type === 'free_hour' ? 'Gratis 1 Jam Main' : 'Gratis Menu Spesial'}</p>
                  </div>
                  <p className="text-cust-text-secondary text-xs">{new Date(r.redeemed_at).toLocaleDateString('id-ID')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.rewards.length === 0 && (
          <p className="text-cust-text-secondary text-sm">Belum ada reward. Terus main untuk kumpulkan sesi!</p>
        )}
      </div>
    </PublicLayout>
  );
}