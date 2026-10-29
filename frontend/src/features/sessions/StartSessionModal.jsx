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

  const [customerType, setCustomerType] = useState('guest');
  const [guestName, setGuestName] = useState('');

  const [searchMember, setSearchMember] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [duration, setDuration] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const activeDevice = useMemo(() => {
    if (preselectedDevice) return preselectedDevice;
    return availableDevices.find((d) => String(d.id) === String(selectedDeviceId)) || null;
  }, [preselectedDevice, availableDevices, selectedDeviceId]);

  const totalPrice = useMemo(() => {
    if (!activeDevice) return 0;
    return duration * activeDevice.price_per_hour;
  }, [activeDevice, duration]);

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
        duration: duration * 60,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-[4px_4px_0px_0px_#18181b] relative max-h-[92vh] overflow-y-auto">

        <div className="flex items-start justify-between pb-4 border-b border-zinc-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-zinc-950 flex items-center justify-center text-cust-red shrink-0 shadow-[2px_2px_0px_0px_#18181b]">
              <Zap size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span>Direct Rental</span>
                <span>•</span>
                <span className="text-emerald-700">Smart Lock Sync</span>
              </span>
              <h3 className="text-zinc-950 font-black text-xl font-display uppercase tracking-tight">
                Mulai Sesi Walk-In
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-zinc-950 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_#18181b]">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Monitor size={14} className="text-cust-red" />
                Pilih Stasiun Gaming
              </span>
              {activeDevice && (
                <span className="text-zinc-600 font-mono-tech text-[11px] font-bold">
                  Tarif: <strong className="text-zinc-950">{formatRupiah(activeDevice.price_per_hour)}</strong>/jam
                </span>
              )}
            </label>

            {preselectedDevice ? (
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-950 flex items-center justify-between shadow-[2px_2px_0px_0px_#18181b]">
                <div className="flex items-center gap-2.5">
                  <DeviceIcon size={16} className="text-cust-red" />
                  <span className="text-zinc-950 font-black text-sm uppercase">
                    {preselectedDevice.code} ({preselectedDevice.device_type?.name})
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-zinc-950 text-emerald-900 text-[10px] font-mono-tech font-bold uppercase shadow-[1px_1px_0px_0px_#18181b]">
                  Ready
                </span>
              </div>
            ) : loadingDevices ? (
              <div className="py-3 text-center text-zinc-500 font-mono-tech text-xs">Memeriksa stasiun kosong...</div>
            ) : availableDevices.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-center text-zinc-600 text-xs font-medium">
                Tidak ada stasiun yang kosong saat ini. Semua sedang terpakai atau maintenance.
              </div>
            ) : (
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                required
                className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 shadow-[2px_2px_0px_0px_#18181b] outline-none focus:border-cust-red transition cursor-pointer font-bold"
              >
                {availableDevices.map((d) => (
                  <option key={d.id} value={d.id} className="text-zinc-950">
                    {d.code} • {d.device_type?.name} ({formatRupiah(d.price_per_hour)}/jam)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User size={14} className="text-cust-red" />
              Tipe Pelanggan
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-100 border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b]">
              <button
                type="button"
                onClick={() => setCustomerType('guest')}
                className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                  customerType === 'guest'
                    ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                    : 'text-zinc-700 hover:text-zinc-950'
                }`}
              >
                <UserX size={14} />
                <span>Tamu (Tanpa Akun)</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('member')}
                className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                  customerType === 'member'
                    ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                    : 'text-zinc-700 hover:text-zinc-950'
                }`}
              >
                <UserCheck size={14} />
                <span>Member Terdaftar</span>
              </button>
            </div>
          </div>

          {customerType === 'guest' ? (
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] space-y-2">
              <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider">
                Nama Panggilan Tamu (Opsional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Contoh: Rian / Mas Fajar (atau biarkan kosong)"
                className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[1px_1px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
              />
              <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                Pelanggan langsung bermain tanpa perlu registrasi website. Sesi tamu tidak mengumpulkan Koin Loyalitas.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] space-y-2.5">
              <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Cari Akun Member</span>
                <span className="text-amber-800 text-[10px] flex items-center gap-1 font-mono-tech font-bold">
                  <Coins size={11} /> +100 Koin/Jam
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Ketik nama / email / no HP member..."
                  className="w-full bg-white border border-zinc-950 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-zinc-950 placeholder-zinc-400 shadow-[1px_1px_0px_0px_#18181b] outline-none focus:border-cust-red transition"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
              </div>

              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required={customerType === 'member'}
                className="w-full bg-white border border-zinc-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-950 shadow-[1px_1px_0px_0px_#18181b] outline-none focus:border-cust-red transition cursor-pointer font-bold"
              >
                <option value="" className="text-zinc-400">
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

          <div>
            <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-cust-red" />
              Durasi Sewa Bermain
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDuration(h)}
                  className={`py-2 rounded-xl text-xs font-mono-tech font-bold border-2 uppercase tracking-wider transition cursor-pointer ${
                    duration === h
                      ? 'bg-cust-red border-zinc-950 text-white shadow-[2px_2px_0px_0px_#18181b]'
                      : 'bg-white border-zinc-950 text-zinc-800 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b]'
                  }`}
                >
                  {h} Jam
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-950 space-y-2.5 font-mono-tech text-xs shadow-[2px_2px_0px_0px_#18181b]">
            <div className="flex items-center justify-between text-zinc-600">
              <span className="font-bold">Waktu Mulai:</span>
              <span className="text-zinc-950 font-bold">{startTimeStr} WIB (Detik ini)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span className="font-bold">Estimasi Selesai:</span>
              <span className="text-emerald-700 font-bold">{endTimeStr} WIB ({duration * 60} Menit)</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-sm">
              <span className="text-zinc-800 font-bold uppercase tracking-wider">Total Biaya Sewa:</span>
              <span className="font-display font-black text-lg text-zinc-950">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || !activeDevice || (customerType === 'member' && !selectedUserId)}
              className="flex-1 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
