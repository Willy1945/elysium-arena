import { useState, useEffect, useCallback } from 'react';
import { Plus, Power, Users, Shield, UserCheck, UserX } from 'lucide-react';
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
                toast.success('Data staff berhasil diperbarui.');
            } else {
                await staffService.create(payload);
                toast.success('Staff baru berhasil ditambahkan.');
            }
            setModalOpen(false);
            fetchStaff();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan data staff.');
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
                        <Users size={14} />
                        <span>Manajemen Akun Internal</span>
                    </div>
                    <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
                        Kelola Staff & Operator
                    </h1>
                    <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
                        Kelola akun hak akses Admin dan Staff Cafe untuk operasional arena.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition shrink-0 w-full sm:w-auto cursor-pointer"
                >
                    <Plus size={16} /> Tambah Staff
                </button>
            </div>

            <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[650px]">
                        <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-950 uppercase tracking-wider font-mono-tech font-black">
                                <th className="px-5 py-4">Nama Staff</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">No. HP</th>
                                <th className="px-5 py-4">Role Hak Akses</th>
                                <th className="px-5 py-4">Status Akun</th>
                                <th className="px-5 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 font-mono-tech uppercase tracking-wider">
                                        Memuat data staff...
                                    </td>
                                </tr>
                            ) : staff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 font-medium">
                                        Belum ada akun staff terdaftar. Silakan tambahkan staff baru.
                                    </td>
                                </tr>
                            ) : (
                                staff.map((s) => (
                                    <tr key={s.id} className="hover:bg-zinc-50 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-950 flex items-center justify-center text-zinc-950 font-black text-xs uppercase shadow-[1px_1px_0px_0px_#18181b]">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <span className="text-zinc-950 font-bold text-sm">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-zinc-600 font-mono-tech font-medium">{s.email}</td>
                                        <td className="px-5 py-4 text-zinc-600 font-medium">{s.phone || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                                s.role === 'ADMIN'
                                                    ? 'bg-amber-100 border-zinc-950 text-amber-950 shadow-[1px_1px_0px_0px_#18181b]'
                                                    : 'bg-cyan-100 border-zinc-950 text-cyan-950 shadow-[1px_1px_0px_0px_#18181b]'
                                            }`}>
                                                <Shield size={12} />
                                                {ROLE_LABEL[s.role] || s.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                                                s.is_active
                                                    ? 'bg-emerald-100 border-zinc-950 text-emerald-950 shadow-[1px_1px_0px_0px_#18181b]'
                                                    : 'bg-zinc-100 border-zinc-950 text-zinc-700 shadow-[1px_1px_0px_0px_#18181b]'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-emerald-600' : 'bg-zinc-500'}`} />
                                                {s.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(s)}
                                                    className="px-3 py-1.5 rounded-lg border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setTogglingStaff(s)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-950 text-xs font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer ${
                                                        s.is_active
                                                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                                    }`}
                                                >
                                                    <Power size={12} />
                                                    {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <StaffFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingStaff}
                loading={saving}
            />

            <ConfirmDialog
                open={!!togglingStaff}
                title={togglingStaff?.is_active ? 'Nonaktifkan Staff?' : 'Aktifkan Staff?'}
                message={
                    togglingStaff?.is_active
                        ? `${togglingStaff?.name} tidak akan bisa login ke dashboard operasional setelah dinonaktifkan.`
                        : `${togglingStaff?.name} akan diizinkan login kembali ke sistem.`
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
