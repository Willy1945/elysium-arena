import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Gamepad2, Monitor, Calendar, Lock,
  CheckCircle2, Joystick, Clock, Shield, Zap,
  Activity, AlertCircle, Award
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
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
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

  const [availableGamingRewards, setAvailableGamingRewards] = useState([]);
  const [selectedRewardId, setSelectedRewardId] = useState('');

  useEffect(() => {
    rewardService
      .getMyRewards()
      .then(({ data }) => {
        const gamingRewards = (data.rewards || []).filter(
          (r) => r.status === 'available' && (r.type === 'free_hour' || r.type === 'free_2_hours')
        );
        setAvailableGamingRewards(gamingRewards);
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

  const selectedReward = useMemo(() => {
    if (!selectedRewardId) return null;
    return availableGamingRewards.find((r) => r.id === Number(selectedRewardId)) || null;
  }, [selectedRewardId, availableGamingRewards]);

  const freeHours = useMemo(() => {
    if (!selectedReward) return 0;
    return selectedReward.type === 'free_2_hours' ? 2 : 1;
  }, [selectedReward]);

  const endTime = useMemo(
    () => (startTime ? addHoursToTime(startTime, durationHours) : null),
    [startTime, durationHours]
  );

  const totalPrice = useMemo(() => {
    if (!device) return 0;
    const billableHours = Math.max(0, durationHours - freeHours);
    return billableHours * device.price_per_hour;
  }, [device, durationHours, freeHours]);

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
        reward_id: selectedReward ? selectedReward.id : null,
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center text-zinc-500">
          <Activity className="animate-spin text-cust-red mx-auto mb-3" size={32} />
          <p className="text-xs uppercase tracking-wider">Memuat Data Rig Stasiun...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!device) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center">
          <p className="text-zinc-400 text-sm mb-4">Stasiun perangkat tidak ditemukan.</p>
          <Link
            to="/browse-devices"
            className="px-6 py-3 rounded-xl bg-cust-red text-white text-xs font-bold uppercase transition"
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
      {/* ── BREADCRUMB STRIP ── */}
      <div className="border-b border-zinc-200/80 bg-zinc-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/browse-devices"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-semibold uppercase tracking-wider transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog Station</span>
          </Link>
          <span className="text-xs text-zinc-500 font-mono-tech uppercase font-semibold">
            Station: {device.code}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Title Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield size={14} />
            <span>Reservasi Online</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-zinc-950 leading-tight">
            Booking Station <span className="text-cust-red">{device.code}</span>
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed font-medium">
            Tentukan tanggal bermain, pilih slot jam mulai, dan atur durasi sesi bermain kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN (Rig Photo & Installed Games) ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Rig Showcase Card */}
            <div className="rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
              {/* Photo Banner */}
              <div className="relative h-64 sm:h-72 bg-zinc-100 overflow-hidden">
                {device.photo ? (
                  <img
                    src={resolveImageUrl(device.photo)}
                    alt={device.code}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                    <TypeIcon size={64} className="text-zinc-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                {/* Floating Pills */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 text-zinc-900 shadow-sm">
                    {device.device_type?.name} Rig
                  </span>

                  <span
                    className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border shadow-xs ${
                      device.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : device.status === 'occupied'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : device.status === 'booked'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                    }`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-6 z-10">
                  <p className="text-[10px] text-zinc-300 uppercase tracking-wider font-semibold">Tarif Sewa Reguler</p>
                  <p className="font-display font-black text-3xl text-white">
                    {formatRupiah(device.price_per_hour)}
                    <span className="text-xs font-normal text-zinc-300 font-sans"> / jam</span>
                  </p>
                </div>
              </div>

              {/* Rig Description */}
              <div className="p-6 sm:p-7">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">
                  Spesifikasi & Fasilitas Rig
                </h3>
                <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {device.description ||
                    'Stasiun gaming turnamen dengan display high-refresh, periferal mekanikal kabel anti-delay, dan pendingin ruangan full AC.'}
                </p>
              </div>
            </div>

            {/* Installed Games List */}
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Joystick size={18} className="text-cust-red" />
                  <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide">
                    Game Terpasang di Rig Ini
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold">
                  {device.games?.length || 0} Judul
                </span>
              </div>

              {device.games?.length === 0 ? (
                <p className="text-zinc-500 text-xs font-medium">
                  Belum ada game terpasang di stasiun ini.
                </p>
              ) : (
                <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                  {device.games?.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-3 bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 px-4 py-2.5 rounded-xl transition shadow-xs"
                    >
                      <Joystick size={14} className="text-cust-red shrink-0" />
                      <span className="text-zinc-900 text-xs sm:text-sm font-semibold flex-1">
                        {game.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (Scheduler & Checkout) ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-6">
                <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-wide flex items-center gap-2">
                  <Clock size={18} className="text-cust-red" />
                  Konfigurasi Jadwal
                </h3>
                <span className="text-xs text-zinc-500 font-medium">
                  Operasional: 10:00 - 22:00 WIB
                </span>
              </div>

              {isMaintenance ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs text-center font-medium">
                  Stasiun sedang tahap servis / maintenance dan tidak dapat dibooking saat ini.
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Step 1: Pilih Tanggal */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 font-bold mb-2">
                      1. Pilih Tanggal Bermain
                    </label>
                    <div className="relative">
                      <Calendar
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                      />
                      <input
                        type="date"
                        min={todayDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-zinc-300 text-zinc-900 text-sm pl-11 pr-4 py-3 rounded-xl outline-none focus:border-cust-red transition shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Step 2: Durasi Bermain */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-700 font-bold mb-2">
                      2. Durasi Sesi Bermain
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {DURATION_OPTIONS.map((h) => {
                        const active = durationHours === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setDurationHours(h)}
                            className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              active
                                ? 'bg-cust-red text-white shadow-sm'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200/70 hover:text-zinc-950'
                            }`}
                          >
                            {h} Jam
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Pilih Jam Mulai */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs uppercase tracking-wider text-zinc-700 font-bold">
                        3. Pilih Jam Mulai Main
                      </label>
                      {checkingSlots && (
                        <span className="text-[11px] text-amber-700 font-medium">
                          Memeriksa slot...
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {OPERATING_HOURS.map((slot) => {
                        const available = isSlotAvailable(slot, durationHours, bookedSlots);
                        const selected = startTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!available}
                            onClick={() => setStartTime(slot)}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs transition cursor-pointer ${
                              selected
                                ? 'bg-cust-red text-white font-bold border border-cust-red shadow-sm'
                                : available
                                ? 'bg-zinc-50 text-zinc-800 border border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-xs font-medium'
                                : 'bg-zinc-100 text-zinc-400 border border-zinc-200/60 cursor-not-allowed opacity-50 line-through'
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
              <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cust-red mb-4">
                  Ringkasan Booking
                </h4>

                <div className="space-y-3 pb-4 border-b border-zinc-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Stasiun Rig</span>
                    <span className="font-display font-bold text-zinc-950 uppercase text-base">
                      {device.code} ({device.device_type?.name})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Jadwal Sesi</span>
                    <span className="text-zinc-900 font-semibold">
                      {startTime ? `${date} · ${startTime} - ${endTime} WIB` : 'Belum memilih jam'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Total Durasi</span>
                    <span className="text-zinc-900 font-semibold">{durationHours} Jam</span>
                  </div>
                </div>

                {/* Voucher Loyalty Reward */}
                {availableGamingRewards.length > 0 && (
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase mb-2">
                      <span className="flex items-center gap-1.5">
                        <Award size={14} className="text-emerald-600" /> Gunakan Voucher Hadiah
                      </span>
                      {selectedReward && (
                        <button
                          type="button"
                          onClick={() => setSelectedRewardId('')}
                          className="text-[10px] text-zinc-600 hover:text-zinc-950 underline cursor-pointer font-medium"
                        >
                          Lepas Voucher
                        </button>
                      )}
                    </div>

                    <select
                      value={selectedRewardId}
                      onChange={(e) => setSelectedRewardId(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
                    >
                      <option value="">-- Pilih Voucher / Tidak Pakai --</option>
                      {availableGamingRewards.map((r) => {
                        const hrs = r.type === 'free_2_hours' ? 2 : 1;
                        return (
                          <option key={r.id} value={r.id}>
                            {r.title || (r.type === 'free_2_hours' ? 'Gratis 2 Jam Bermain' : 'Gratis 1 Jam Bermain')} (Hemat {hrs} Jam)
                          </option>
                        );
                      })}
                    </select>

                    {selectedReward ? (
                      <p className="text-[11px] text-emerald-800 font-medium mt-2">
                        Voucher diterapkan: Hemat {freeHours} jam dari total tagihan!
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-600 mt-1.5 font-medium">
                        Kamu memiliki {availableGamingRewards.length} voucher aktif yang bisa digunakan.
                      </p>
                    )}
                  </div>
                )}

                {/* Total Price Display */}
                <div className="flex items-center justify-between pt-5 mb-6">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Total Biaya Sewa
                    </p>
                    <p className="font-display font-black text-3xl sm:text-4xl text-zinc-950 mt-0.5">
                      {formatRupiah(totalPrice)}
                    </p>
                  </div>
                  {selectedReward && (
                    <span className="text-xs text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                      Hemat {freeHours} Jam
                    </span>
                  )}
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4 font-medium">
                    <AlertCircle size={15} className="text-cust-red shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Confirm Action Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!startTime || submitting}
                  className="w-full py-4 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Activity className="animate-spin" size={18} />
                      <span>Memproses Reservasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Konfirmasi & Amankan Slot</span>
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