import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Gamepad2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DeviceCard from './DeviceCard';
import DeviceFormModal from './DeviceFormModal';
import StartSessionModal from '../sessions/StartSessionModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { deviceService, deviceTypeService } from '../../api/deviceService';
import { gameService } from '../../api/gameService';
import { useToast } from '../../context/ToastContext';

export default function DevicesPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [games, setGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [deletingDevice, setDeletingDevice] = useState(null);
  const [walkInDevice, setWalkInDevice] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.type = activeFilter;
      if (search) params.search = search;
      const { data } = await deviceService.getAll(params);
      setDevices(data.data);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    deviceTypeService.getAll().then(({ data }) => setDeviceTypes(data.data));
    gameService.getAll().then(({ data }) => setGames(data.data));
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleOpenCreate = () => {
    setEditingDevice(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (device) => {
    setEditingDevice(device);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editingDevice) {
        await deviceService.update(editingDevice.id, formData);
        toast.success('Stasiun berhasil diperbarui.');
      } else {
        await deviceService.create(formData);
        toast.success('Stasiun baru berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan stasiun.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deviceService.remove(deletingDevice.id);
      toast.success('Stasiun berhasil dihapus.');
      setDeletingDevice(null);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus stasiun.');
    } finally {
      setSaving(false);
    }
  };

  const filters = ['All', ...deviceTypes.map((t) => t.name)];

  return (
    <DashboardLayout onSearch={setSearch}>
      {/* ── HEADER & CONTROLS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Gamepad2 size={14} />
            <span>Katalog Stasiun</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Gaming Rig & Stasiun
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Kelola inventaris PC turnamen, PlayStation 5, dan lounge PlayStation 4.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="overflow-x-auto max-w-full pb-1 scrollbar-none">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 inline-flex gap-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === f
                      ? 'bg-cust-red text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {f === 'All' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer w-full sm:w-auto"
          >
            <Plus size={15} />
            <span>Tambah Stasiun</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs uppercase tracking-wider">
          Memuat data stasiun...
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-[#121216]/50">
          <Gamepad2 size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-white font-bold text-sm mb-1">Belum Ada Stasiun</p>
          <p className="text-zinc-500 text-xs mb-4">Tambahkan stasiun gaming pertamamu ke dalam sistem.</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onEdit={handleOpenEdit}
              onDelete={setDeletingDevice}
              onViewDetail={(d) => navigate(`/admin/devices/${d.id}`)}
              onBooking={(d) => navigate(`/admin/bookings/new/${d.id}`)}
              onStartWalkIn={(d) => setWalkInDevice(d)}
            />
          ))}
        </div>
      )}

      {/* Modal Mulai Sesi Walk-In Langsung dari Kartu Stasiun */}
      <StartSessionModal
        open={!!walkInDevice}
        onClose={() => setWalkInDevice(null)}
        preselectedDevice={walkInDevice}
        onSuccess={() => {
          fetchDevices();
          navigate('/admin/sessions');
        }}
      />

      <DeviceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        deviceTypes={deviceTypes}
        games={games}
        initialData={editingDevice}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deletingDevice}
        title="Hapus Stasiun?"
        message={`Yakin ingin menghapus ${deletingDevice?.code}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDevice(null)}
        loading={saving}
      />
    </DashboardLayout>
  );
}