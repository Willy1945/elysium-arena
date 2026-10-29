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
        toast.success(`Stasiun ${editingDevice.code} berhasil diperbarui.`);
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
    if (!deletingDevice) return;
    setSaving(true);
    try {
      await deviceService.remove(deletingDevice.id);
      toast.success(`Stasiun ${deletingDevice.code} berhasil dihapus.`);
      setDeletingDevice(null);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus stasiun.');
    } finally {
      setSaving(false);
    }
  };

  const filters = ['All', 'PS5', 'PC', 'PS4'];

  return (
    <DashboardLayout onSearch={setSearch}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <Gamepad2 size={14} />
            <span>Katalog Hardware Arena</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-2xl sm:text-3xl uppercase tracking-tight">
            Katalog Stasiun Rig
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Kelola data perangkat PlayStation dan PC gaming di arena.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-zinc-950 p-1.5 rounded-xl overflow-x-auto no-scrollbar shadow-[1px_1px_0px_0px_#18181b]">
            <div className="flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider transition cursor-pointer ${
                    activeFilter === f
                      ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  {f === 'All' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer w-full sm:w-auto"
          >
            <Plus size={15} />
            <span>Tambah Stasiun</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-zinc-600 font-mono-tech text-xs uppercase tracking-wider font-bold">
          Memuat data stasiun...
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-950 rounded-2xl bg-white shadow-[2px_2px_0px_0px_#18181b]">
          <Gamepad2 size={40} className="mx-auto text-zinc-400 mb-3" />
          <p className="text-zinc-950 font-bold text-sm mb-1">Belum Ada Stasiun</p>
          <p className="text-zinc-600 text-xs mb-4 font-medium">Tambahkan stasiun gaming pertamamu ke dalam sistem.</p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] transition cursor-pointer"
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
