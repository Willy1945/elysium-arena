import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Monitor, Calendar, Lock, CheckCircle2, Layers, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { deviceService } from '../../api/deviceService';
import { bookingService } from '../../api/bookingService';
import { useToast } from '../../context/ToastContext';
import {
  formatRupiah, STATUS_CONFIG, resolveImageUrl,
  addHoursToTime, isSlotAvailable,
} from '../../utils/format';

const OPERATING_HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

function todayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default function BookingFormPage() {
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

  useEffect(() => {
    deviceService.getById(deviceId).then(({ data }) => {
      setDevice(data.data);
      setLoading(false);
    });
  }, [deviceId]);

  const fetchAvailability = useCallback(async () => {
    setCheckingSlots(true);
    setStartTime(null);
    try {
      const { data } = await bookingService.getAvailability(deviceId, date);
      setBookedSlots(data.booked_slots);
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

  const totalPrice = useMemo(
    () => (device ? durationHours * device.price_per_hour : 0),
    [device, durationHours]
  );

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
      });
      toast.success(`Booking ${data.data.booking_code} berhasil dibuat.`);
      navigate('/admin/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat booking. Coba pilih slot lain.');
      fetchAvailability();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat data stasiun...
        </div>
      </DashboardLayout>
    );
  }

  if (!device) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Stasiun tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isMaintenance = device.status === 'maintenance';

  return (
    <DashboardLayout>

      <div className="mb-6">
        <Link
          to="/admin/devices"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider mb-3 transition"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar Stasiun
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
              <Calendar size={14} />
              <span>Reservasi Jadwal Stasiun</span>
            </div>
            <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
              Booking Jadwal Stasiun — {device.code}
            </h1>
            <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
              Pilih tanggal, jam mulai sewa stasiun, dan durasi bermain.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-44 h-40 bg-zinc-100 border border-zinc-950 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0px_0px_#18181b]">
                {device.photo ? (
                  <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
                ) : (
                  <TypeIcon size={44} className="text-zinc-400" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono-tech text-zinc-500 font-bold uppercase tracking-wider block">
                        Tipe: {device.device_type?.name}
                      </span>
                      <h2 className="text-zinc-950 text-2xl font-black font-display uppercase tracking-tight">
                        {device.code}
                      </h2>
                    </div>
                    <Badge colorVar={status.color}>{status.label}</Badge>
                  </div>
                  {device.description && (
                    <p className="text-zinc-600 text-xs line-clamp-2 leading-relaxed">{device.description}</p>
                  )}
                </div>
                <div className="pt-3 border-t border-zinc-200 flex items-baseline gap-1.5">
                  <span className="text-zinc-950 font-black text-xl font-mono-tech">{formatRupiah(device.price_per_hour)}</span>
                  <span className="text-zinc-500 text-xs font-mono-tech font-bold">/ jam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-cust-red" />
                <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                  Game Terpasang di Rig Ini
                </h3>
              </div>
              <span className="font-mono-tech text-xs font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 border border-zinc-950 text-zinc-900 shadow-[1px_1px_0px_0px_#18181b]">
                {device.games?.length || 0} Titles
              </span>
            </div>

            {device.games?.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-6">Belum ada game terpasang di stasiun ini.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
                {device.games?.map((game) => (
                  <div
                    key={game.id}
                    className="bg-zinc-50 border border-zinc-950 rounded-xl p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_#18181b]"
                  >
                    <span className="text-zinc-950 text-xs sm:text-sm font-bold">{game.name}</span>
                    <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-zinc-900 border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]">
                      {game.platform || device.device_type?.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display pb-4 border-b border-zinc-100 mb-5 flex items-center gap-2">
              <Clock size={16} className="text-cust-red" />
              <span>Tentukan Jadwal Sewa</span>
            </h3>

            {isMaintenance ? (
              <div className="p-4 bg-rose-50 border border-zinc-950 rounded-xl text-rose-800 text-xs font-bold shadow-[2px_2px_0px_0px_#18181b]">
                Stasiun sedang dalam perbaikan (maintenance), tidak menerima pemesanan saat ini.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Tanggal Bermain</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="date"
                      min={todayDate()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-zinc-950 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 font-mono-tech font-bold shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Pilih Jam Mulai (Slot)</label>
                  {checkingSlots ? (
                    <p className="text-zinc-500 text-xs py-3 font-mono-tech">Mengecek slot stasiun...</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {OPERATING_HOURS.map((slot) => {
                        const available = isSlotAvailable(slot, durationHours, bookedSlots);
                        const selected = startTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!available}
                            onClick={() => setStartTime(slot)}
                            className={`flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold font-mono-tech border-2 uppercase tracking-wider transition ${
                              selected
                                ? 'bg-cust-red border-zinc-950 text-white shadow-[2px_2px_0px_0px_#18181b]'
                                : available
                                  ? 'bg-white border-zinc-950 text-zinc-900 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b]'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-400 cursor-not-allowed'
                            }`}
                          >
                            {!available && <Lock size={10} />}
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">Durasi Sewa</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 font-mono-tech font-bold shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
                  >
                    {DURATION_OPTIONS.map((h) => (
                      <option key={h} value={h} className="text-zinc-950">
                        {h} Jam ({h * 60} Menit)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {!isMaintenance && (
            <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
              <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display pb-3 border-b border-zinc-100 mb-4">
                Ringkasan Biaya Sewa
              </h3>

              <div className="flex flex-col gap-2.5 pb-4 border-b border-zinc-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-bold">Stasiun Rig</span>
                  <span className="text-zinc-950 font-bold">{device.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-bold">Waktu Main</span>
                  <span className="text-zinc-950 font-mono-tech font-bold">{startTime ? `${startTime} - ${endTime}` : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 font-bold">Total Durasi</span>
                  <span className="text-zinc-950 font-mono-tech font-bold">{durationHours} Jam</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mb-5">
                <span className="text-zinc-600 text-xs uppercase tracking-wider font-mono-tech font-bold">Total Biaya</span>
                <span className="text-zinc-950 font-black text-xl font-mono-tech">{formatRupiah(totalPrice)}</span>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-rose-50 border border-zinc-950 rounded-xl text-rose-800 text-xs font-bold shadow-[2px_2px_0px_0px_#18181b]">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!startTime || submitting}
                className="w-full flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                {!submitting && <CheckCircle2 size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
