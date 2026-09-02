import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Gamepad2, UtensilsCrossed, Plus, X, Archive, ArchiveRestore } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { transactionService } from '../../api/transactionService';
import { formatRupiah, TRANSACTION_STATUS_CONFIG } from '../../utils/format';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

function CheckoutModal({ open, onClose, onDone }) {
    const toast = useToast();
    const [checkoutable, setCheckoutable] = useState({ sessions: [], orders: [] });
    const [tab, setTab] = useState('session');
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        if (open) {
            transactionService.getCheckoutable().then(({ data }) => setCheckoutable(data));
            setSelectedOrderIds([]);
        }
    }, [open]);

    if (!open) return null;

    const handleCheckoutSession = async (sessionId) => {
        setLoading(true);
        try {
            const { data } = await transactionService.checkoutSession(sessionId);
            onDone(data.data.id);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal checkout session.');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrder = (order) => {
        setSelectedOrderIds((prev) =>
            prev.includes(order.id) ? prev.filter((id) => id !== order.id) : [...prev, order.id]
        );
    };

    const handleCheckoutOrders = async () => {
        if (selectedOrderIds.length === 0) return;
        const firstOrder = checkoutable.orders.find((o) => o.id === selectedOrderIds[0]);
        setLoading(true);
        try {
            const { data } = await transactionService.checkoutOrders({
                user_id: firstOrder.user.id,
                order_ids: selectedOrderIds,
            });
            onDone(data.data.id);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal checkout order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-elevated border border-border rounded-lg p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary font-semibold text-lg">Buat Transaksi Baru</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={20} /></button>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setTab('session')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === 'session' ? 'bg-accent text-white' : 'bg-surface-inset text-text-secondary'}`}
                    >
                        Dari Session
                    </button>
                    <button
                        onClick={() => setTab('orders')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === 'orders' ? 'bg-accent text-white' : 'bg-surface-inset text-text-secondary'}`}
                    >
                        Take-away
                    </button>
                </div>

                {tab === 'session' ? (
                    <div className="flex flex-col gap-2">
                        {checkoutable.sessions.length === 0 ? (
                            <p className="text-text-secondary text-sm text-center py-6">Tidak ada session yang siap di-checkout.</p>
                        ) : (
                            checkoutable.sessions.map((s) => (
                                <button
                                    key={s.id}
                                    disabled={loading}
                                    onClick={() => handleCheckoutSession(s.id)}
                                    className="flex items-center justify-between bg-surface-inset border border-border rounded-lg p-3 hover:border-accent/40 transition text-left"
                                >
                                    <div>
                                        <p className="text-text-primary text-sm font-medium">{s.device?.code} — {s.user?.name}</p>
                                        <p className="text-text-secondary text-xs">{s.duration / 60} jam</p>
                                    </div>
                                    <span className="text-accent-light text-sm font-semibold">{formatRupiah(s.price)}</span>
                                </button>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {checkoutable.orders.length === 0 ? (
                            <p className="text-text-secondary text-sm text-center py-6">Tidak ada order take-away yang siap di-checkout.</p>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                    {checkoutable.orders.map((o) => (
                                        <label key={o.id} className="flex items-center justify-between bg-surface-inset border border-border rounded-lg p-3 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" checked={selectedOrderIds.includes(o.id)} onChange={() => toggleOrder(o)} />
                                                <div>
                                                    <p className="text-text-primary text-sm font-medium">{o.order_code} — {o.user?.name}</p>
                                                    <p className="text-text-secondary text-xs">{o.items.length} item</p>
                                                </div>
                                            </div>
                                            <span className="text-text-primary text-sm">{formatRupiah(o.total_price)}</span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={handleCheckoutOrders}
                                    disabled={selectedOrderIds.length === 0 || loading}
                                    className="w-full bg-accent hover:opacity-90 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {loading ? 'Memproses...' : `Checkout ${selectedOrderIds.length} Order`}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TransactionsPage() {
    const navigate = useNavigate();
    const toast = useToast();

    const [transactions, setTransactions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [showArchived, setShowArchived] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = { archived: showArchived };
            if (statusFilter !== 'All') params.status = statusFilter;
            const { data } = await transactionService.getAll(params);
            setTransactions(data.data);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, showArchived]);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    const handleCheckoutDone = (transactionId) => {
        setCheckoutOpen(false);
        navigate(`/admin/transactions/${transactionId}`);
    };

    const handleArchive = async () => {
        setDeleting(true);
        try {
            await transactionService.archive(deletingTransaction.id);
            toast.success('Transaksi berhasil diarsipkan.');
            setDeletingTransaction(null);
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal mengarsipkan transaksi.');
        } finally {
            setDeleting(false);
        }
    };

    const handleUnarchive = async (transaction) => {
        try {
            await transactionService.unarchive(transaction.id);
            toast.success('Transaksi dikembalikan dari arsip.');
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal mengembalikan transaksi.');
        }
    };

    const filters = ['All', 'pending', 'paid', 'cancelled'];

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-text-primary text-2xl font-semibold">Transactions</h2>
                    <p className="text-text-secondary text-sm">Gabungan billing gaming & food, dan pembayaran.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${statusFilter === f ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowArchived((prev) => !prev)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium transition ${showArchived ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
                            }`}
                    >
                        <Archive size={13} /> {showArchived ? 'Arsip' : 'Lihat Arsip'}
                    </button>
                    <button
                        onClick={() => setCheckoutOpen(true)}
                        className="flex items-center gap-1 bg-accent hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={16} /> Transaksi Baru
                    </button>
                </div>
            </div>

            <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-text-secondary text-xs uppercase tracking-wide">
                            <th className="px-4 py-3 font-medium">Kode</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Gaming</th>
                            <th className="px-4 py-3 font-medium">Food</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-6 text-center text-text-secondary">Memuat data...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-6 text-center text-text-secondary">Belum ada transaksi.</td></tr>
                        ) : (
                            transactions.map((t) => {
                                const status = TRANSACTION_STATUS_CONFIG[t.status];
                                return (
                                    <tr key={t.id} className="border-b border-border/50 last:border-0">
                                        <td className="px-4 py-3 text-text-primary font-medium">{t.transaction_code}</td>
                                        <td className="px-4 py-3 text-text-secondary">{t.user?.name}</td>
                                        <td className="px-4 py-3 text-text-secondary">
                                            {t.gaming_amount > 0 ? (
                                                <span className="flex items-center gap-1"><Gamepad2 size={12} /> {formatRupiah(t.gaming_amount)}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-text-secondary">
                                            {t.food_amount > 0 ? (
                                                <span className="flex items-center gap-1"><UtensilsCrossed size={12} /> {formatRupiah(t.food_amount)}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-text-primary font-semibold">{formatRupiah(t.total_amount)}</td>
                                        <td className="px-4 py-3"><Badge colorVar={status.color}>{status.label}</Badge></td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/transactions/${t.id}`)}
                                                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-border text-text-secondary hover:bg-surface-inset transition"
                                                >
                                                    <Receipt size={12} /> Detail
                                                </button>
                                                {t.status === 'paid' && !t.is_archived && (
                                                    <button
                                                        onClick={() => setDeletingTransaction(t)}
                                                        title="Arsipkan"
                                                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-border text-text-secondary hover:bg-surface-inset transition"
                                                    >
                                                        <Archive size={12} />
                                                    </button>
                                                )}
                                                {t.is_archived && (
                                                    <button
                                                        onClick={() => handleUnarchive(t)}
                                                        title="Kembalikan dari Arsip"
                                                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-border text-accent-light hover:bg-accent/10 transition"
                                                    >
                                                        <ArchiveRestore size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onDone={handleCheckoutDone} />
            <ConfirmDialog
                open={!!deletingTransaction}
                title="Arsipkan Transaksi?"
                message={`${deletingTransaction?.transaction_code} akan disembunyikan dari daftar utama, tapi tetap tercatat penuh di laporan pendapatan. Kamu bisa mengembalikannya kapan saja lewat "Lihat Arsip".`}
                onConfirm={handleArchive}
                onCancel={() => setDeletingTransaction(null)}
                loading={deleting}
            />
        </DashboardLayout>
    );
}