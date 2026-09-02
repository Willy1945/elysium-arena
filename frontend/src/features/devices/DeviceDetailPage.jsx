import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Monitor, Pencil, Trash2, Joystick, History } from 'lucide-react';
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
      toast.success('Perubahan berhasil disimpan.');
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
      toast.success('Device berhasil dihapus.');
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

  return (
    <DashboardLayout>
      <Link to="/admin/devices" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 transition">
        <ArrowLeft size={16} /> Kembali ke Devices
      </Link>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Kolom Kiri: fixed width ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
            <div className="h-44 bg-surface-inset">
              {device.photo ? (
                <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TypeIcon size={40} className="text-text-secondary opacity-30" />
                </div>
              )}
            </div>
            <div className="p-3 flex gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 border border-border rounded-lg py-2 text-xs text-text-secondary hover:bg-surface-inset transition"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 border border-status-occupied/30 rounded-lg py-2 text-xs text-status-occupied hover:bg-status-occupied/10 transition"
              >
                <Trash2 size={13} /> Hapus
              </button>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <p className="text-text-secondary text-xs mb-2.5">Ubah Status Cepat</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key)}
                  disabled={device.status === key}
                  className={`text-xs py-2 rounded-lg border transition ${device.status === key
                    ? 'border-accent bg-accent/10 text-accent-light cursor-default'
                    : 'border-border text-text-secondary hover:bg-surface-inset'
                    }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: mengisi sisa ruang, responsif ── */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-text-primary text-2xl font-bold">{device.code}</h1>
                <p className="text-text-secondary text-sm">{device.device_type?.name}</p>
              </div>
              <Badge colorVar={status.color}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-surface-inset rounded-lg p-3">
                <p className="text-text-secondary text-xs mb-1">Harga per Jam</p>
                <p className="text-text-primary font-bold text-lg">{formatRupiah(device.price_per_hour)}</p>
              </div>
              <div className="bg-surface-inset rounded-lg p-3">
                <p className="text-text-secondary text-xs mb-1">Total Game</p>
                <p className="text-text-primary font-bold text-lg">{device.games?.length || 0} Game</p>
              </div>
              <div className="bg-surface-inset rounded-lg p-3">
                <p className="text-text-secondary text-xs mb-1">Booking Hari Ini</p>
                <p className="text-text-primary font-bold text-lg">{device.today_bookings_count || 0}</p>
              </div>
              <div className="bg-surface-inset rounded-lg p-3">
                <p className="text-text-secondary text-xs mb-1">Total Riwayat</p>
                <p className="text-text-primary font-bold text-lg">{recentBookings.length}</p>
              </div>
            </div>

            {device.description && (
              <div>
                <p className="text-text-secondary text-xs mb-1">Deskripsi</p>
                <p className="text-text-primary text-sm">{device.description}</p>
              </div>
            )}
          </div>


          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary font-semibold">Game Tersedia</h2>
              <span className="bg-surface-inset text-text-secondary text-xs px-2 py-1 rounded">
                {device.games?.length || 0} Titles
              </span>
            </div>

            {device.games?.length === 0 ? (
              <p className="text-text-secondary text-sm">Belum ada game yang ditambahkan ke device ini.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {device.games?.map((game) => (
                  <Link key={game.id} to={`/admin/games/${game.id}`} className="group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-inset group-hover:ring-2 group-hover:ring-accent/50 group-hover:-translate-y-1 transition-all">
                      {game.cover_image ? (
                        <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Joystick size={24} className="text-text-secondary opacity-30" />
                        </div>
                      )}
                    </div>
                    <p className="text-text-primary text-xs mt-1.5 line-clamp-1">{game.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <History size={18} className="text-text-secondary" />
              <h2 className="text-text-primary font-semibold">Riwayat Booking Terakhir</h2>
            </div>

            {recentBookings.length === 0 ? (
              <p className="text-text-secondary text-sm">Belum ada riwayat booking untuk device ini.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {recentBookings.map((b) => {
                  const bStatus = BOOKING_STATUS_CONFIG[b.status] || { label: b.status, color: 'status-maintenance' };
                  return (
                    <div key={b.id} className="flex items-center justify-between bg-surface-inset border border-border/50 rounded-lg p-3">
                      <div>
                        <p className="text-text-primary text-sm font-medium">{b.user?.name}</p>
                        <p className="text-text-secondary text-xs">{b.booking_date} · {b.start_time} - {b.end_time}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-primary text-sm font-medium">{formatRupiah(b.total_price)}</span>
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
        title="Hapus Device?"
        message={`Yakin ingin menghapus ${device.code}? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={saving}
      />
    </DashboardLayout>
  );
}