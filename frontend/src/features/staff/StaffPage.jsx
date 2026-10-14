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
            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
                        <Users size={14} />
                        <span>Manajemen Akun Internal</span>
                    </div>
                    <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
                        Kelola Staff & Operator
                    </h1>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
                        Kelola akun hak akses Admin dan Staff Cafe untuk operasional arena.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cust-red/10 shrink-0 w-full sm:w-auto"
                >
                    <Plus size={16} /> Tambah Staff
                </button>
            </div>

            {/* ── TABLE CARD CONTAINER ── */}
            <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-[650px]">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400 uppercase tracking-wider font-mono-tech">
                                <th className="px-5 py-4 font-semibold">Nama Staff</th>
                                <th className="px-5 py-4 font-semibold">Email</th>
                                <th className="px-5 py-4 font-semibold">No. HP</th>
                                <th className="px-5 py-4 font-semibold">Role Hak Akses</th>
                                <th className="px-5 py-4 font-semibold">Status Akun</th>
                                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 uppercase tracking-wider">
                                        Memuat data staff...
                                    </td>
                                </tr>
                            ) : staff.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-500">
                                        Belum ada akun staff terdaftar. Silakan tambahkan staff baru.
                                    </td>
                                </tr>
                            ) : (
                                staff.map((s) => (
                                    <tr key={s.id} className="hover:bg-zinc-900/40 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <span className="text-white font-semibold text-sm">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-zinc-400 font-mono-tech">{s.email}</td>
                                        <td className="px-5 py-4 text-zinc-400">{s.phone || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                s.role === 'ADMIN'
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                            }`}>
                                                <Shield size={12} />
                                                {ROLE_LABEL[s.role] || s.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                                                s.is_active
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                                                {s.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(s)}
                                                    className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-300 text-xs font-semibold transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setTogglingStaff(s)}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                                                        s.is_active
                                                            ? 'border-rose-900/40 text-rose-400 hover:bg-rose-950/40'
                                                            : 'border-emerald-900/40 text-emerald-400 hover:bg-emerald-950/40'
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