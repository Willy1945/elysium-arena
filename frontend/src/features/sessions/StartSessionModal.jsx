import { useState, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  Clock,
  User,
  Search,
  Zap,
  Monitor,
  Gamepad2,
  CheckCircle2,
  UserCheck,
  UserX,
  Coins,
} from 'lucide-react';
import { userService } from '../../api/userService';
import { deviceService } from '../../api/deviceService';
import { sessionService } from '../../api/sessionService';
import { formatRupiah } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 8];

export default function StartSessionModal({
  open,
  onClose,
  onSuccess,
  preselectedDevice = null,
}) {
  const toast = useToast();

  const [availableDevices, setAvailableDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Customer Type: 'guest' (Tamu / Non-member) or 'member' (Terdaftar)
  const [customerType, setCustomerType] = useState('guest');
  const [guestName, setGuestName] = useState('');

  // Member Search
  const [searchMember, setSearchMember] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [duration, setDuration] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch available devices if none pre-selected
  useEffect(() => {
    if (!open) return;

    if (preselectedDevice) {
      setSelectedDeviceId(String(preselectedDevice.id));
    } else {
      setLoadingDevices(true);
      deviceService
        .getAll({ status: 'available' })
        .then(({ data }) => {
          setAvailableDevices(data.data || []);
          if (data.data?.length > 0) {
            setSelectedDeviceId(String(data.data[0].id));
          }
        })
        .catch(() => {
          toast.error('Gagal memuat stasiun yang tersedia.');
        })
        .finally(() => {
          setLoadingDevices(false);
        });
    }
  }, [open, preselectedDevice, toast]);

  // Fetch registered members when member tab is active
  useEffect(() => {
    if (!open || customerType !== 'member') return;

    setLoadingMembers(true);
    const timer = setTimeout(() => {
      userService
        .search({ role: 'CUSTOMER', search: searchMember })
        .then(({ data }) => {
          setCustomers(data.data || []);
        })
        .catch(() => {})
        .finally(() => {
          setLoadingMembers(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [open, customerType, searchMember]);

  // Reset states when closed
  useEffect(() => {
    if (!open) {
      setCustomerType('guest');
      setGuestName('');
      setSearchMember('');
      setSelectedUserId('');
      setDuration(1);
      setError('');
    }
  }, [open]);

  // Determine active selected device
  const activeDevice = useMemo(() => {
    if (preselectedDevice) return preselectedDevice;
    return availableDevices.find((d) => String(d.id) === String(selectedDeviceId)) || null;
  }, [preselectedDevice, availableDevices, selectedDeviceId]);

  // Live pricing
  const totalPrice = useMemo(() => {
    if (!activeDevice) return 0;
    return duration * activeDevice.price_per_hour;
  }, [activeDevice, duration]);

  // Live Estimated Time
  const { startTimeStr, endTimeStr } = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getTime() + duration * 60 * 60 * 1000);
    const formatTime = (d) =>
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return {
      startTimeStr: formatTime(now),
      endTimeStr: formatTime(end),
    };
  }, [duration]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!activeDevice) {
      setError('Silakan pilih stasiun yang ingin diaktifkan.');
      return;
    }

    if (customerType === 'member' && !selectedUserId) {
      setError('Silakan pilih salah satu akun member.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        device_id: activeDevice.id,
        duration: duration * 60, // menit
        user_id: customerType === 'member' ? Number(selectedUserId) : null,
        guest_name:
          customerType === 'guest'
            ? guestName.trim() || 'Tamu Walk-In'
            : null,
      };

      await sessionService.start(payload);

      const targetName =
        customerType === 'member'
          ? customers.find((c) => String(c.id) === String(selectedUserId))?.name || 'Member'
          : guestName.trim() || 'Tamu Walk-In';

      toast.success(
        `Sesi ${activeDevice.code} untuk ${targetName} berhasil dimulai! Smart Lock terbuka.`
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      const errors = err.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0]?.[0] : null;
      const errMsg =
        firstError ||
        err.response?.data?.message ||
        'Gagal memulai sesi walk-in. Pastikan stasiun tidak sedang terpakai.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const DeviceIcon = activeDevice?.device_type?.name === 'PC' ? Monitor : Gamepad2;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cust-red/10 border border-cust-red/30 flex items-center justify-center text-cust-red shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span>Direct Rental</span>
                <span>•</span>
                <span className="text-emerald-400">Smart Lock Sync</span>
              </span>
              <h3 className="text-white font-black text-xl font-display uppercase tracking-tight">
                Mulai Sesi Walk-In
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Pilih Stasiun Gaming */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Monitor size={14} className="text-cust-red" />
                Pilih Stasiun Gaming
              </span>
              {activeDevice && (
                <span className="text-zinc-400 font-mono text-[11px]">
                  Tarif: <strong className="text-white">{formatRupiah(activeDevice.price_per_hour)}</strong>/jam
                </span>
              )}
            </label>

            {preselectedDevice ? (
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DeviceIcon size={16} className="text-cust-red" />
                  <span className="text-white font-bold text-sm uppercase">
                    {preselectedDevice.code} ({preselectedDevice.device_type?.name})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  Ready
                </span>
              </div>
            ) : loadingDevices ? (
              <div className="py-3 text-center text-zinc-500 text-xs">Memeriksa stasiun kosong...</div>
            ) : availableDevices.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-dashed border-zinc-800 text-center text-zinc-400 text-xs">
                Tidak ada stasiun yang kosong saat ini. Semua sedang terpakai atau maintenance.
              </div>
            ) : (
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                required
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red transition cursor-pointer font-medium"
              >
                {availableDevices.map((d) => (
                  <option key={d.id} value={d.id} className="bg-zinc-900 text-white py-1">
                    {d.code} • {d.device_type?.name} ({formatRupiah(d.price_per_hour)}/jam)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Tipe Pelanggan (Tamu vs Member) */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
              <User size={14} className="text-cust-red" />
              Tipe Pelanggan
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => setCustomerType('guest')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  customerType === 'guest'
                    ? 'bg-cust-red text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserX size={14} />
                <span>Tamu (Tanpa Akun)</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('member')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  customerType === 'member'
                    ? 'bg-cust-red text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserCheck size={14} />
                <span>Member Terdaftar</span>
              </button>
            </div>
          </div>

          {/* Input Sesuai Tipe Pelanggan */}
          {customerType === 'guest' ? (
            <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-2">
              <label className="block text-zinc-400 text-[11px] font-medium">
                Nama Panggilan Tamu (Opsional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Rian / Mas Fajar (atau biarkan kosong)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
              />
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                💡 Pelanggan langsung bermain tanpa perlu registrasi website. Sesi tamu tidak mengumpulkan Koin Loyalitas.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-2.5">
              <label className="block text-zinc-400 text-[11px] font-medium flex items-center justify-between">
                <span>Cari Akun Member</span>
                <span className="text-amber-400 text-[10px] flex items-center gap-1 font-mono">
                  <Coins size={11} /> +100 Koin/Jam
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Ketik nama / email / no HP member..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-cust-red transition"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              </div>

              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required={customerType === 'member'}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red transition cursor-pointer"
              >
                <option value="" className="text-zinc-500">
                  {loadingMembers ? 'Mencari member...' : '-- Pilih Akun Member --'}
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email || c.phone || 'Member'}) • {c.loyalty_points || 0} Koin
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Durasi Sewa */}
          <div>
            <label className="block text-zinc-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-cust-red" />
              Durasi Sewa Bermain
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDuration(h)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                    duration === h
                      ? 'bg-cust-red border-cust-red text-white shadow-md'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {h} Jam
                </button>
              ))}
            </div>
          </div>

          {/* 4. Live Telemetry & Summary Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Waktu Mulai:</span>
              <span className="text-white font-semibold">{startTimeStr} WIB (Detik ini)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Estimasi Selesai:</span>
              <span className="text-emerald-400 font-semibold">{endTimeStr} WIB ({duration * 60} Menit)</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm">
              <span className="text-zinc-300 font-sans font-bold">Total Biaya Sewa:</span>
              <span className="font-display font-black text-lg text-white">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !activeDevice || (customerType === 'member' && !selectedUserId)}
              className="flex-1 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cust-red/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={14} />
              <span>{submitting ? 'Mengaktifkan...' : 'Nyalakan Stasiun'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}