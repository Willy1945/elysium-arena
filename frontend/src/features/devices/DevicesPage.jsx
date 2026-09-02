import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DeviceCard from './DeviceCard';
import DeviceFormModal from './DeviceFormModal';
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

  // ── Create & Edit Device ──
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
        toast.success('Device berhasil diperbarui.');
      } else {
        await deviceService.create(formData);
        toast.success('Device berhasil ditambahkan.');
      }
      setModalOpen(false);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan device.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deviceService.remove(deletingDevice.id);
      toast.success('Device berhasil dihapus.');
      setDeletingDevice(null);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus device.');
    } finally {
      setSaving(false);
    }
  };

  const filters = ['All', ...deviceTypes.map((t) => t.name)];

  return (
    <DashboardLayout onSearch={setSearch}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Device Catalog</h2>
          <p className="text-text-secondary text-sm">Manage and monitor all gaming stations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${activeFilter === f
                    ? 'bg-accent text-accent-lighter'
                    : 'border border-border text-text-secondary hover:bg-surface-elevated'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} /> Tambah Device
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : devices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-text-secondary text-sm">Belum ada device. Tambahkan device pertama kamu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onEdit={handleOpenEdit}
              onDelete={setDeletingDevice}
              onViewDetail={(d) => navigate(`/admin/devices/${d.id}`)}
              onBooking={(d) => navigate(`/admin/bookings/new/${d.id}`)}
            />
          ))}
        </div>
      )}

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
        title="Hapus Device?"
        message={`Yakin ingin menghapus ${deletingDevice?.code}? Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDevice(null)}
        loading={saving}
      />

    </DashboardLayout>
  );
}