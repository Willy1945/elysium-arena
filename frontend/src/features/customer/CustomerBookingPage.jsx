import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Monitor, Calendar, Lock, CheckCircle2, Joystick } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { deviceService } from '../../api/deviceService';
import { bookingService } from '../../api/bookingService';
import { formatRupiah, resolveImageUrl, addHoursToTime, isSlotAvailable } from '../../utils/format';

const OPERATING_HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Dipakai', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
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
      toast.success(`Booking ${data.data.booking_code} berhasil dibuat!`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membuat booking. Coba pilih slot lain.';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!device) {
    return (
      <PublicLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Device tidak ditemukan.</p>
        </div>
      </PublicLayout>
    );
  }

  const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isMaintenance = device.status === 'maintenance';

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/browse-devices" className="inline-flex items-center gap-1.5 text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase mb-8 transition">
          <ArrowLeft size={16} /> Kembali ke Device
        </Link>

        <h1 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase mb-8">
          Pesan <span className="text-cust-red">Station</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri — Info Device & Katalog Game */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex gap-5">
                <div className="w-40 h-32 bg-cust-bg border border-cust-border overflow-hidden shrink-0">
                  {device.photo ? (
                    <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TypeIcon size={32} className="text-cust-text-secondary opacity-30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-cust-text-primary font-black text-xl uppercase">{device.code}</h2>
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 border ${
                        device.status === 'available' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-cust-border text-cust-text-secondary bg-cust-bg'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-cust-text-secondary text-sm">{device.device_type?.name}</p>
                  </div>
                  <p className="text-cust-red font-black text-xl">
                    {formatRupiah(device.price_per_hour)}
                    <span className="text-cust-text-secondary text-sm font-normal">/jam</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cust-elevated border border-cust-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-cust-text-primary font-black uppercase text-base">Game Tersedia</h3>
                <span className="bg-cust-bg text-cust-text-secondary text-xs px-2.5 py-1 border border-cust-border">
                  {device.games?.length || 0} Judul
                </span>
              </div>

              {device.games?.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Belum ada game terpasang di device ini.</p>
              ) : (
                <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                  {device.games?.map((game) => (
                    <div key={game.id} className="flex items-center gap-3 bg-cust-bg border border-cust-border p-3">
                      <Joystick size={14} className="text-cust-red shrink-0" />
                      <span className="text-cust-text-primary text-sm flex-1">{game.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan — Jadwal & Ringkasan */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-cust-elevated border border-cust-border p-6">
              <h3 className="text-cust-text-primary font-black uppercase text-base border-b border-cust-border pb-4 mb-5">Jadwal Booking</h3>

              {isMaintenance ? (
                <p className="text-cust-red text-sm">Device sedang maintenance, tidak bisa dibooking.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Pilih Tanggal</label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cust-text-secondary" />
                      <input
                        type="date"
                        min={todayDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm pl-10 pr-3 py-3 outline-none focus:border-cust-red transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Jam Mulai</label>
                    {checkingSlots ? (
                      <p className="text-cust-text-secondary text-xs">Mengecek ketersediaan...</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {OPERATING_HOURS.map((slot) => {
                          const available = isSlotAvailable(slot, durationHours, bookedSlots);
                          const selected = startTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={!available}
                              onClick={() => setStartTime(slot)}
                              className={`flex items-center justify-center gap-1 py-2.5 text-xs font-bold border transition ${
                                selected
                                  ? 'bg-cust-red border-cust-red text-white'
                                  : available
                                    ? 'bg-cust-bg border-cust-border text-cust-text-primary hover:border-cust-red'
                                    : 'bg-cust-bg border-cust-border text-cust-text-secondary/40 cursor-not-allowed'
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
                    <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Durasi</label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-3 py-3 outline-none focus:border-cust-red transition"
                    >
                      {DURATION_OPTIONS.map((h) => (
                        <option key={h} value={h}>{h} {h === 1 ? 'Jam' : 'Jam'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {!isMaintenance && (
              <div className="bg-cust-elevated border-2 border-cust-red p-6">
                <p className="text-cust-text-secondary text-xs font-bold uppercase mb-5">Ringkasan Transaksi</p>

                <div className="flex flex-col gap-3 pb-3">
                  <div className="flex items-center justify-between border-b border-cust-border pb-3">
                    <span className="text-cust-text-secondary text-sm">Device</span>
                    <span className="text-cust-text-primary font-bold text-sm">{device.code}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-cust-border pb-3">
                    <span className="text-cust-text-secondary text-sm">Waktu</span>
                    <span className="text-cust-text-primary text-sm">{startTime ? `${startTime} - ${endTime}` : '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cust-text-secondary text-sm">Durasi</span>
                    <span className="text-cust-text-primary text-sm">{durationHours} jam</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mb-5">
                  <span className="text-cust-text-primary font-black uppercase">Total</span>
                  <span className="text-cust-red font-black text-2xl">{formatRupiah(totalPrice)}</span>
                </div>

                {error && <p className="text-cust-red text-xs mb-4">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={!startTime || submitting}
                  className="w-full flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm py-4 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                  {!submitting && <CheckCircle2 size={17} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}