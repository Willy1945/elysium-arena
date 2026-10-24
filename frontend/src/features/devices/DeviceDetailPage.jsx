import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Monitor, Pencil, Trash2, Joystick, History, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DeviceFormModal from './DeviceFormModal';
import { deviceService, deviceTypeService } from '../../api/deviceService';
import { gameService } from '../../api/gameService';
import { bookingService } from '../../api/bookingService';
import { useToast } from '../../context/ToastContext';
import { formatRupiah, STATUS_CONFIG, BOOKING_STATUS_CONFIG, resolveImageUrl } from '../../utils/format';

export default function DeviceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [device, setDevice] = useState(null);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [games, setGames] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDevice = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await deviceService.getById(id);
      setDevice(data.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDevice();
    deviceTypeService.getAll().then(({ data }) => setDeviceTypes(data.data));
    gameService.getAll().then(({ data }) => setGames(data.data));
    bookingService.getAll({ device_id: id }).then(({ data }) => setRecentBookings(data.data.slice(0, 5)));
  }, [fetchDevice, id]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await deviceService.update(id, formData);
      toast.success('Perubahan stasiun berhasil disimpan.');
      setEditOpen(false);
      fetchDevice();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deviceService.remove(id);
      toast.success('Stasiun berhasil dihapus.');
      navigate('/admin/devices');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus device.');
      setSaving(false);
    }
  };

  const handleStatusChange = async (status) => {
    await deviceService.updateStatus(id, status);
    fetchDevice();
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

  return (
    <DashboardLayout>
      {/* ── TOP NAV LINK ── */}
      <div className="mb-6">
        <Link
          to="/admin/devices"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider transition"
        >
          <ArrowLeft size={14} /> Kembali ke Manajemen Stasiun
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Kolom Kiri: Sidebar Stasiun ── */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
          <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
            <div className="relative h-48 bg-zinc-100 overflow-hidden">
              {device.photo ? (
                <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                  <TypeIcon size={44} className="text-zinc-400" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-white text-[10px] text-zinc-950 border border-zinc-950 font-mono-tech font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_0px_#18181b]">
                {device.device_type?.name}
              </div>
            </div>
            <div className="p-4 flex gap-2.5 bg-white">
              <button
                onClick={() => setEditOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
              >
                <Pencil size={13} /> Edit Rig
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-zinc-950 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b]">
            <h3 className="text-zinc-950 text-xs font-bold uppercase tracking-wider mb-3 font-mono-tech">
              Ubah Status Cepat
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  disabled={device.status === key}
                  className={`text-xs py-2.5 px-3 rounded-xl border-2 font-bold uppercase tracking-wider transition ${
                    device.status === key
                      ? 'border-zinc-950 bg-cust-red text-white shadow-[2px_2px_0px_0px_#18181b] cursor-default'
                      : 'border-zinc-950 bg-white text-zinc-800 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b]'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Detail & Metrik ── */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-[11px] font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
                  <TypeIcon size={13} />
                  <span>{device.device_type?.name} RIG STATION</span>
                </div>
                <h1 className="text-zinc-950 text-3xl font-black font-display uppercase tracking-tight">
                  {device.code}
                </h1>
              </div>
              <Badge colorVar={status.color}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
              <div className="bg-zinc-50 border border-zinc-950 rounded-xl p-4 shadow-[2px_2px_0px_0px_#18181b]">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1">Tarif Sewa</p>
                <p className="text-zinc-950 font-black text-lg font-mono-tech">{formatRupiah(device.price_per_hour)}/jam</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-950 rounded-xl p-4 shadow-[2px_2px_0px_0px_#18181b]">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1">Game Terinstal</p>
                <p className="text-zinc-950 font-black text-lg font-mono-tech">{device.games?.length || 0} Judul</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-950 rounded-xl p-4 shadow-[2px_2px_0px_0px_#18181b]">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1">Booking Hari Ini</p>
                <p className="text-zinc-950 font-black text-lg font-mono-tech">{device.today_bookings_count || 0} Sesi</p>
              </div>
              <div className="bg-zinc-50 border border-zinc-950 rounded-xl p-4 shadow-[2px_2px_0px_0px_#18181b]">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1">Total Riwayat</p>
                <p className="text-zinc-950 font-black text-lg font-mono-tech">{recentBookings.length} Log</p>
              </div>
            </div>

            {device.description && (
              <div className="pt-4 border-t border-zinc-200">
                <p className="text-zinc-500 text-[10px] font-mono-tech uppercase font-bold tracking-wider mb-1">Spesifikasi & Keterangan</p>
                <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed">{device.description}</p>
              </div>
            )}
          </div>

          {/* Installed Games Section */}
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div className="flex items-center gap-2">
                <Joystick size={16} className="text-cust-red" />
                <h2 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                  Game Terinstal di Stasiun
                </h2>
              </div>
              <span className="font-mono-tech text-xs font-bold px-2.5 py-0.5 rounded-lg bg-zinc-100 border border-zinc-950 text-zinc-900 shadow-[1px_1px_0px_0px_#18181b]">
                {device.games?.length || 0} Judul
              </span>
            </div>

            {device.games?.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8">Belum ada game yang ditautkan ke stasiun ini.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {device.games?.map((game) => (
                  <Link key={game.id} to={`/admin/games/${game.id}`} className="group flex flex-col">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] group-hover:-translate-y-0.5 transition duration-200">
                      {game.cover_image ? (
                        <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                          <Joystick size={22} className="text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-zinc-900 text-[11px] mt-1.5 font-bold line-clamp-1 group-hover:text-cust-red transition">
                      {game.name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Booking History */}
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 mb-5">
              <History size={16} className="text-cust-red" />
              <h2 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display">
                Riwayat Booking Terakhir
              </h2>
            </div>

            {recentBookings.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8">Belum ada catatan reservasi untuk stasiun ini.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {recentBookings.map((b) => {
                  const bStatus = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'neutral' };
                  return (
                    <div key={b.id} className="flex items-center justify-between bg-zinc-50 border border-zinc-950 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#18181b]">
                      <div>
                        <p className="text-zinc-950 text-xs font-bold">{b.user?.name}</p>
                        <p className="text-zinc-600 text-[11px] font-mono-tech mt-0.5">{b.booking_date} · {b.start_time} - {b.end_time}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-950 text-xs font-black font-mono-tech">{formatRupiah(b.total_price)}</span>
                        <Badge colorVar={bStatus.color}>{bStatus.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeviceFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        deviceTypes={deviceTypes}
        games={games}
        initialData={device}
        loading={saving}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Stasiun?"
        message={`Yakin ingin menghapus ${device.code}? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={saving}
      />
    </DashboardLayout>
  );
}
