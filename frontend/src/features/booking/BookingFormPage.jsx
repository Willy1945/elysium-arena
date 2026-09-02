import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Monitor, Calendar, Lock, CheckCircle2, Layers } from 'lucide-react';
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
      fetchAvailability(); // refresh slot kalau ternyata sudah kepakai orang lain
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-text-secondary text-sm">Memuat data...</p>
      </DashboardLayout>
    );
  }

  if (!device) {
    return (
      <DashboardLayout>
        <p className="text-text-secondary text-sm">Device tidak ditemukan.</p>
      </DashboardLayout>
    );
  }

  const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
  const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
  const isMaintenance = device.status === 'maintenance';

  return (
    <DashboardLayout>
      <Link to="/admin/devices" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 transition">
        <ArrowLeft size={16} /> Back to Devices
      </Link>
      <h1 className="text-text-primary text-2xl font-semibold mb-6">Book Device</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri — Device Info & Catalog */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative bg-surface-elevated border border-border rounded-xl p-6 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-light/10 blur-3xl rounded-full" />
            <div className="relative flex gap-6">
              <div className="w-48 h-40 bg-surface-inset border border-border rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {device.photo ? (
                  <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
                ) : (
                  <TypeIcon size={40} className="text-text-secondary opacity-30" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-text-primary text-xl font-semibold">{device.code}</h2>
                    <Badge colorVar={status.color}>{status.label}</Badge>
                  </div>
                  <p className="text-text-secondary text-sm">{device.device_type?.name}</p>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-text-primary text-lg font-semibold">{formatRupiah(device.price_per_hour)}</span>
                  <span className="text-text-secondary text-sm">/ hr</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-text-secondary" />
                <h3 className="text-text-primary font-semibold">Installed Catalog</h3>
              </div>
              <span className="bg-surface-inset text-text-secondary text-xs px-2 py-1 rounded">
                {device.games?.length || 0} Titles
              </span>
            </div>

            {device.games?.length === 0 ? (
              <p className="text-text-secondary text-sm">Belum ada game terpasang di device ini.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                {device.games?.map((game) => (
                  <div key={game.id} className="bg-surface-inset border border-border/50 rounded p-3 flex items-center justify-between">
                    <span className="text-text-primary text-sm">{game.name}</span>
                    <span className="border border-border text-text-secondary text-xs px-2 py-0.5 rounded">
                      {game.platform}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan — Schedule Session */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h3 className="text-text-primary font-semibold border-b border-border/60 pb-4 mb-4">Schedule Session</h3>

            {isMaintenance ? (
              <p className="text-status-occupied text-sm">Device sedang maintenance, tidak bisa dibooking.</p>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-text-secondary text-xs uppercase tracking-wide mb-2">Select Date</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="date"
                      min={todayDate()}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-surface-inset border border-border rounded pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-xs uppercase tracking-wide mb-2">Start Time</label>
                  {checkingSlots ? (
                    <p className="text-text-secondary text-xs">Mengecek ketersediaan...</p>
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
                            className={`flex items-center justify-center gap-1 py-2 rounded text-xs font-medium border transition ${
                              selected
                                ? 'bg-accent-light/10 border-accent text-accent-light'
                                : available
                                  ? 'bg-surface-inset border-border/60 text-text-primary hover:border-accent/50'
                                  : 'bg-surface-inset border-border/60 text-text-secondary/40 cursor-not-allowed'
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
                  <label className="block text-text-secondary text-xs uppercase tracking-wide mb-2">Duration</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
                  >
                    {DURATION_OPTIONS.map((h) => (
                      <option key={h} value={h}>{h} {h === 1 ? 'Hour' : 'Hours'}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {!isMaintenance && (
            <div className="relative bg-surface-elevated rounded-xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
              <p className="text-text-secondary text-xs uppercase tracking-wide mb-4">Transaction Summary</p>

              <div className="flex flex-col gap-3 pb-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <span className="text-text-secondary text-sm">Device</span>
                  <span className="text-text-primary text-sm font-semibold">{device.code}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <span className="text-text-secondary text-sm">Time</span>
                  <span className="text-text-primary text-sm">{startTime ? `${startTime} - ${endTime}` : '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Duration</span>
                  <span className="text-text-primary text-sm">{durationHours} {durationHours === 1 ? 'hour' : 'hours'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-text-primary font-semibold">Total Due</span>
                <span className="text-accent-light font-semibold text-xl">{formatRupiah(totalPrice)}</span>
              </div>

              {error && <p className="text-status-occupied text-xs mt-3">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!startTime || submitting}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-accent hover:opacity-90 text-accent-lighter font-semibold py-3 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Memproses...' : 'Confirm Booking'}
                {!submitting && <CheckCircle2 size={17} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}