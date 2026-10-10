import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Gamepad2,
  Monitor,
  Calendar,
  Lock,
  CheckCircle2,
  Joystick,
  Clock,
  Sparkles,
  Shield,
  Zap,
  Activity,
  AlertCircle,
  Award,
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { deviceService } from '../../api/deviceService';
import { bookingService } from '../../api/bookingService';
import { rewardService } from '../../api/rewardService';
import {
  formatRupiah,
  resolveImageUrl,
  addHoursToTime,
  isSlotAvailable,
} from '../../utils/format';

const OPERATING_HOURS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

const STATUS_LABEL = {
  available: { label: 'Ready to Play', color: 'emerald' },
  occupied: { label: 'Sedang Main', color: 'red' },
  booked: { label: 'Telah Dibooking', color: 'amber' },
  maintenance: { label: 'Maintenance', color: 'zinc' },
};

function todayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function CustomerBookingPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  const [date, setDate] = useState(todayDate());
  const [startTime, setStartTime] = useState(null);
  const [durationHours, setDurationHours] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [availableHourReward, setAvailableHourReward] = useState(null);
  const [useReward, setUseReward] = useState(false);

  useEffect(() => {
    rewardService
      .getMyRewards()
      .then(({ data }) => {
        const reward = data.rewards.find(
          (r) => r.status === 'available' && r.type === 'free_hour'
        );
        setAvailableHourReward(reward || null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    deviceService
      .getById(deviceId)
      .then(({ data }) => {
        setDevice(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [deviceId]);

  const fetchAvailability = useCallback(async () => {
    setCheckingSlots(true);
    setStartTime(null);
    try {
      const { data } = await bookingService.getAvailability(deviceId, date);
      setBookedSlots(data.booked_slots || []);
    } finally {
      setCheckingSlots(false);
    }
  }, [deviceId, date]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const endTime = useMemo(
    () => (startTime ? addHoursToTime(startTime, durationHours) : null),
    [startTime, durationHours]
  );

  const totalPrice = useMemo(() => {
    if (!device) return 0;
    // Jika reward dipakai, gratis 1 jam
    const billableHours = useReward ? Math.max(0, durationHours - 1) : durationHours;
    return billableHours * device.price_per_hour;
  }, [device, durationHours, useReward]);

  const handleSubmit = async () => {
    if (!startTime) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await bookingService.create({
        device_id: Number(deviceId),
        booking_date: date,
        start_time: startTime,
        duration: durationHours * 60,
        reward_id: useReward && availableHourReward ? availableHourReward.id : null,
      });
      toast.success(`Booking ${data.data.booking_code} berhasil diamankan!`);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal membuat booking. Coba pilih slot waktu lain.';
      setError(message);
      toast.error(message);
      fetchAvailability();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center font-mono-tech text-neutral-400">
          <Activity className="animate-spin text-cust-red mx-auto mb-3" size={32} />
          <p className="text-xs uppercase tracking-widest">MEMUAT STASIUN RIG...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!device) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center">
          <p className="text-neutral-400 text-sm mb-4">Stasiun perangkat tidak ditemukan.</p>
          <Link
            to="/browse-devices"
            className="px-6 py-3 rounded-xl bg-cust-red text-white font-mono-tech text-xs uppercase"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isMaintenance = device.status === 'maintenance';

  return (
    <PublicLayout>
      {/* ── TOP BREADCRUMB STRIP ── */}
      <div className="border-b border-[#1f1f26] bg-[#070709]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/browse-devices"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-xs font-mono-tech uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>KEMBALI KE KATALOG STASIUN</span>
          </Link>
          <span className="font-mono-tech text-[10px] text-neutral-500 uppercase">
            STATION ID: {device.code}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Title Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cust-red/10 border border-cust-red/25 mb-3">
            <Shield size={13} className="text-cust-red" />
            <span className="font-mono-tech text-[11px] uppercase tracking-widest text-cust-red font-bold">
              BATTLESTATION RESERVATION PORTAL
            </span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
            BOOKING STASIUN{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cust-red via-red-500 to-amber-500">
              {device.code}
            </span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mt-2 leading-relaxed">
            Konfigurasi tanggal bermain, tentukan slot jam, dan pilih durasi sesi. Sesi akan otomatis terhubung dengan sistem Smart Lock.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN (Rig Hardware Dossier & Games Vault) ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Rig Showcase Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] overflow-hidden shadow-2xl relative">
              {/* Photo Hero with Cinematic Overlay */}
              <div className="relative h-64 sm:h-72 bg-[#09090c] overflow-hidden">
                {device.photo ? (
                  <img
                    src={resolveImageUrl(device.photo)}
                    alt={device.code}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#13131a] to-black">
                    <TypeIcon size={64} className="text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/60" />

                {/* Floating Top Pills */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="font-mono-tech text-xs font-bold uppercase px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white">
                    {device.device_type?.name} RIG
                  </span>

                  <span
                    className={`font-mono-tech text-[11px] font-bold uppercase px-3 py-1 rounded-full border backdrop-blur-md ${
                      device.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-black/80 text-neutral-400 border-white/10'
                    }`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Price Tag Bottom Left */}
                <div className="absolute bottom-4 left-6 z-10">
                  <p className="font-mono-tech text-[10px] text-neutral-400 uppercase">Tarif Sewa Reguler</p>
                  <p className="font-display font-black text-3xl text-white">
                    {formatRupiah(device.price_per_hour)}
                    <span className="text-xs font-normal text-neutral-400 font-sans"> / jam</span>
                  </p>
                </div>
              </div>

              {/* Rig Description */}
              <div className="p-6 sm:p-7">
                <h3 className="font-mono-tech text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">
                  SPESIFIKASI & FASILITAS
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {device.description ||
                    'Stasiun gaming turnamen dengan display high-refresh, periferal mekanikal kabel anti-delay, dan pendingin ruangan full AC.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono-tech text-neutral-300 flex items-center gap-2">
                    <Zap size={14} className="text-cust-red" />
                    <span>Dedicated 1 Gbps LAN</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono-tech text-neutral-300 flex items-center gap-2">
                    <Shield size={14} className="text-emerald-400" />
                    <span>PC Smart Lock Protected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Installed Games List */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Joystick size={18} className="text-cust-red" />
                  <h3 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    GAME TERPASANG DI RIG INI
                  </h3>
                </div>
                <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300">
                  {device.games?.length || 0} Judul
                </span>
              </div>

              {device.games?.length === 0 ? (
                <p className="text-neutral-500 text-xs font-mono-tech">
                  Belum ada game terpasang di stasiun ini.
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2">
                  {device.games?.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-3 bg-black/40 border border-white/5 hover:border-white/15 px-4 py-3 rounded-xl transition-colors"
                    >
                      <Joystick size={14} className="text-cust-red shrink-0" />
                      <span className="text-white text-xs sm:text-sm font-medium flex-1">
                        {game.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (Scheduler & Deployment Checkout) ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c0c10] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="font-display font-black text-white text-xl uppercase tracking-wide flex items-center gap-2">
                  <Clock size={18} className="text-cust-red" />
                  KONFIGURASI JADWAL
                </h3>
                <span className="font-mono-tech text-[10px] text-neutral-400">
                  OPERASIONAL: 10:00 - 22:00
                </span>
              </div>

              {isMaintenance ? (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono-tech text-center">
                  STASIUN SEDANG MAINTENANCE DAN TIDAK DAPAT DIBOOKING SAAT INI.
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Step 1: Pilih Tanggal */}
                  <div>
                    <label className="block font-mono-tech text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                      1. Pilih Tanggal Bermain
                    </label>
                    <div className="relative">
                      <Calendar
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                      />
                      <input
                        type="date"
                        min={todayDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black/60 border border-[#272733] text-white text-sm pl-11 pr-4 py-3 rounded-xl outline-none focus:border-cust-red focus:ring-1 focus:ring-cust-red/40 transition font-mono-tech"
                      />
                    </div>
                  </div>

                  {/* Step 2: Durasi Bermain (Pill Selector) */}
                  <div>
                    <label className="block font-mono-tech text-xs uppercase tracking-wider text-neutral-300 font-bold mb-2">
                      2. Durasi Sesi Bermain
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {DURATION_OPTIONS.map((h) => {
                        const active = durationHours === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setDurationHours(h)}
                            className={`py-2.5 rounded-xl text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-cust-red text-white shadow-[0_0_15px_rgba(227,30,36,0.5)] border border-cust-red'
                                : 'bg-black/50 text-neutral-300 border border-white/10 hover:border-white/30'
                            }`}
                          >
                            {h} Jam
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Pilih Jam Mulai (Tactical Grid) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block font-mono-tech text-xs uppercase tracking-wider text-neutral-300 font-bold">
                        3. Pilih Jam Mulai Main
                      </label>
                      {checkingSlots && (
                        <span className="font-mono-tech text-[10px] text-amber-400">
                          Mengecek slot...
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {OPERATING_HOURS.map((slot) => {
                        const available = isSlotAvailable(slot, durationHours, bookedSlots);
                        const selected = startTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!available}
                            onClick={() => setStartTime(slot)}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-xl font-mono-tech text-xs transition-all cursor-pointer ${
                              selected
                                ? 'bg-gradient-to-r from-cust-red to-[#b8151a] text-white font-bold border border-cust-red shadow-[0_0_20px_rgba(227,30,36,0.45)] scale-105 z-10'
                                : available
                                ? 'bg-black/50 text-neutral-200 border border-white/10 hover:border-cust-red/60 hover:text-white'
                                : 'bg-white/[0.02] text-neutral-600 border border-white/[0.04] cursor-not-allowed opacity-40 line-through'
                            }`}
                          >
                            <span>{slot}</span>
                            {!available && <Lock size={10} className="mt-0.5 opacity-60" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* ── CHECKOUT SUMMARY CARD ── */}
            {!isMaintenance && (
              <div className="rounded-3xl border border-cust-red/40 bg-gradient-to-b from-[#161214] to-[#0d0a0c] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <h4 className="font-mono-tech text-xs font-bold uppercase tracking-widest text-cust-red mb-4">
                  RINGKASAN BOOKING // CHECKOUT
                </h4>

                <div className="space-y-3 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-400">Stasiun Rig</span>
                    <span className="font-display font-bold text-white uppercase text-base">
                      {device.code} ({device.device_type?.name})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-400">Jadwal Sesi</span>
                    <span className="font-mono-tech text-white">
                      {startTime ? `${date} · ${startTime} - ${endTime}` : 'Belum memilih jam'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-400">Total Durasi</span>
                    <span className="font-mono-tech text-white">{durationHours} Jam</span>
                  </div>
                </div>

                {/* Voucher Loyalty Reward (Jika Ada) */}
                {availableHourReward && (
                  <label className="mt-4 flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useReward}
                      onChange={(e) => setUseReward(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-emerald-400 font-mono-tech text-xs font-bold uppercase flex items-center gap-1.5">
                        <Award size={14} /> Pakai Reward: Gratis 1 Jam Bermain
                      </p>
                      <p className="text-neutral-400 text-[11px] mt-0.5">
                        Potongan 1 jam otomatis dikurangkan dari tagihan Anda.
                      </p>
                    </div>
                  </label>
                )}

                {/* Total Price Display */}
                <div className="flex items-center justify-between pt-5 mb-6">
                  <div>
                    <p className="text-[10px] font-mono-tech text-neutral-400 uppercase">
                      Total Biaya Sewa
                    </p>
                    <p className="font-display font-black text-3xl sm:text-4xl text-cust-red mt-0.5">
                      {formatRupiah(totalPrice)}
                    </p>
                  </div>
                  {useReward && (
                    <span className="font-mono-tech text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                      HEMAT 1 JAM
                    </span>
                  )}
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-cust-red/10 border border-cust-red/30 text-red-300 text-xs flex items-center gap-2 mb-4">
                    <AlertCircle size={15} className="text-cust-red shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!startTime || submitting}
                  className="w-full group py-4 rounded-xl bg-gradient-to-r from-cust-red to-[#b8151a] hover:from-[#f02830] hover:to-cust-red text-white font-display font-black uppercase text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(227,30,36,0.35)] hover:shadow-[0_0_35px_rgba(227,30,36,0.55)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <Activity className="animate-spin" size={18} />
                      <span>MENYIAPKAN SMART LOCK...</span>
                    </>
                  ) : (
                    <>
                      <span>KONFIRMASI & AMANKAN SLOT</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </PublicLayout>
  );
}