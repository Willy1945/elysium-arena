import { useState, useEffect, useCallback } from 'react';
import { Plus, Power } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StaffFormModal from './StaffFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { staffService } from '../../api/staffService';
import { useToast } from '../../context/ToastContext';

const ROLE_LABEL = { ADMIN: 'Admin', STAFF_CAFE: 'Staff Cafe' };

export default function StaffPage() {
    const toast = useToast();

    const [staff, setStaff] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [togglingStaff, setTogglingStaff] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            const { data } = await staffService.getAll(params);
            setStaff(data.data);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleOpenCreate = () => {
        setEditingStaff(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (s) => {
        setEditingStaff(s);
        setModalOpen(true);
    };

    const handleSubmit = async (payload) => {
        setSaving(true);
        try {
            if (editingStaff) {
                await staffService.update(editingStaff.id, payload);
                toast.success('Staff berhasil diperbarui.');
            } else {
                await staffService.create(payload);
                toast.success('Staff berhasil ditambahkan.');
            }
            setModalOpen(false);
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan staff.');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async () => {
        setSaving(true);
        try {
            await staffService.toggleStatus(togglingStaff.id);
            toast.success(togglingStaff.is_active ? 'Staff berhasil dinonaktifkan.' : 'Staff berhasil diaktifkan kembali.');
            setTogglingStaff(null);
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal mengubah status staff.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout onSearch={setSearch}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-text-primary text-2xl font-semibold">Kelola Staff</h2>
                    <p className="text-text-secondary text-sm">Kelola akun Admin dan Staff Cafe.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                    <Plus size={16} /> Tambah Staff
                </button>
            </div>

            {loading ? (
                <p className="text-text-secondary text-sm">Memuat data...</p>
            ) : staff.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-lg">
                    <p className="text-text-secondary text-sm">Belum ada akun staff. Tambahkan yang pertama.</p>
                </div>
            ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-elevated">
                            <tr className="text-left text-text-secondary text-xs uppercase">
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">No. HP</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((s) => (
                                <tr key={s.id} className="border-t border-border">
                                    <td className="px-4 py-3 text-text-primary font-medium">{s.name}</td>
                                    <td className="px-4 py-3 text-text-secondary">{s.email}</td>
                                    <td className="px-4 py-3 text-text-secondary">{s.phone || '-'}</td>
                                    <td className="px-4 py-3 text-text-secondary">{ROLE_LABEL[s.role] || s.role}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                            {s.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => handleOpenEdit(s)} className="text-accent-light text-xs font-medium hover:underline">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setTogglingStaff(s)}
                                                className={`flex items-center gap-1 text-xs font-medium hover:underline ${s.is_active ? 'text-red-400' : 'text-green-400'}`}
                                            >
                                                <Power size={12} /> {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <StaffFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={editingStaff} loading={saving} />

            <ConfirmDialog
                open={!!togglingStaff}
                title={togglingStaff?.is_active ? 'Nonaktifkan Staff?' : 'Aktifkan Staff?'}
                message={
                    togglingStaff?.is_active
                        ? `${togglingStaff?.name} tidak akan bisa login setelah dinonaktifkan. Riwayat kerjanya tetap aman.`
                        : `${togglingStaff?.name} akan bisa login kembali.`
                }
                onConfirm={handleToggleStatus}
                onCancel={() => setTogglingStaff(null)}
                loading={saving}
                confirmLabel={togglingStaff?.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                confirmingLabel={togglingStaff?.is_active ? 'Menonaktifkan...' : 'Mengaktifkan...'}
                danger={!!togglingStaff?.is_active}
            />
        </DashboardLayout>
    );
}