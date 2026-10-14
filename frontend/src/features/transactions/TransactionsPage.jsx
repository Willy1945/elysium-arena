import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Gamepad2, UtensilsCrossed, Plus, X, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { transactionService } from '../../api/transactionService';
import { formatRupiah, TRANSACTION_STATUS_CONFIG } from '../../utils/format';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

function CheckoutModal({ open, onClose, onDone }) {
  const toast = useToast();
  const [checkoutable, setCheckoutable] = useState({ sessions: [], orders: [] });
  const [tab, setTab] = useState('session');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
          <h3 className="text-white font-display font-black text-xl uppercase tracking-wide">
            Buat Transaksi Kasir Baru
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1 mb-5">
          <button
            onClick={() => setTab('session')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              tab === 'session' ? 'bg-cust-red text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Dari Sesi Bermain
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              tab === 'orders' ? 'bg-cust-red text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Take-away Kafe F&B
          </button>
        </div>

        {tab === 'session' ? (
          <div className="space-y-2.5">
            {checkoutable.sessions.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8">
                Tidak ada sesi stasiun yang siap di-checkout saat ini.
              </p>
            ) : (
              checkoutable.sessions.map((s) => (
                <button
                  key={s.id}
                  disabled={loading}
                  onClick={() => handleCheckoutSession(s.id)}
                  className="w-full flex items-center justify-between bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 text-left transition cursor-pointer"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">{s.device?.code} — {s.user?.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Durasi: {s.duration / 60} jam</p>
                  </div>
                  <span className="font-display font-bold text-base text-white">{formatRupiah(s.price)}</span>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {checkoutable.orders.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8">
                Tidak ada pesanan take-away yang menunggu checkout.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {checkoutable.orders.map((o) => (
                    <label
                      key={o.id}
                      className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl cursor-pointer hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(o.id)}
                          onChange={() => toggleOrder(o)}
                          className="accent-red-600 w-4 h-4 rounded"
                        />
                        <div>
                          <p className="text-white text-xs font-semibold">Order #{o.order_code}</p>
                          <p className="text-zinc-500 text-[11px]">{o.user?.name}</p>
                        </div>
                      </div>
                      <span className="text-white font-semibold text-xs">{formatRupiah(o.total_price)}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleCheckoutOrders}
                  disabled={selectedOrderIds.length === 0 || loading}
                  className="w-full py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-40"
                >
                  Proses Tagihan ({selectedOrderIds.length} Pesanan)
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
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [hidingTransaction, setHidingTransaction] = useState(null);
  const [hiding, setHiding] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (showArchived) params.archived = 'true';
      const { data } = await transactionService.getAll(params);
      setTransactions(data.data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showArchived]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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

  const handleHide = async () => {
    setHiding(true);
    try {
      await transactionService.hide(hidingTransaction.id);
      toast.success('Transaksi berhasil disembunyikan dari tampilan.');
      setHidingTransaction(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyembunyikan transaksi.');
    } finally {
      setHiding(false);
    }
  };

  const filters = ['All', 'pending', 'paid', 'cancelled'];
  const FILTER_LABEL = {
    All: 'Semua',
    pending: 'Pending',
    paid: 'Lunas',
    cancelled: 'Batal',
  };

  return (
    <DashboardLayout>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Receipt size={14} />
            <span>Billing Kasir</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Log Transaksi Arena
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Rekap invoice gabungan persewaan gaming rig dan pesanan kafe F&B.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Filter Status */}
          <div className="overflow-x-auto max-w-full pb-1 scrollbar-none">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 inline-flex gap-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === f
                      ? 'bg-cust-red text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {FILTER_LABEL[f] || f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowArchived((prev) => !prev)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showArchived
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Archive size={14} />
              <span>{showArchived ? 'Daftar Utama' : 'Arsip'}</span>
            </button>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Transaksi Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLE CONTAINER ── */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400 uppercase tracking-wider font-mono-tech">
                <th className="px-5 py-4 font-semibold">Kode Transaksi</th>
                <th className="px-5 py-4 font-semibold">Pelanggan</th>
                <th className="px-5 py-4 font-semibold">Gaming Rig</th>
                <th className="px-5 py-4 font-semibold">Kafe F&B</th>
                <th className="px-5 py-4 font-semibold">Total Tagihan</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500 uppercase tracking-wider">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    Belum ada riwayat transaksi yang tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const status = TRANSACTION_STATUS_CONFIG[t.status] || { label: t.status, color: 'neutral' };
                  return (
                    <tr key={t.id} className="hover:bg-zinc-900/40 transition">
                      <td className="px-5 py-4 font-mono-tech font-bold text-white">
                        {t.transaction_code}
                      </td>
                      <td className="px-5 py-4 text-zinc-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{t.user?.name || t.guest_name || 'Tamu (Walk-In)'}</span>
                          {t.is_guest && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                              Tamu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-300">
                        {t.gaming_amount > 0 ? (
                          <span className="flex items-center gap-1.5 font-mono-tech">
                            <Gamepad2 size={13} className="text-cust-red" />
                            {formatRupiah(t.gaming_amount)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 text-zinc-300">
                        {t.food_amount > 0 ? (
                          <span className="flex items-center gap-1.5 font-mono-tech">
                            <UtensilsCrossed size={13} className="text-amber-400" />
                            {formatRupiah(t.food_amount)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 font-display font-bold text-base text-white">
                        {formatRupiah(t.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge colorVar={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/transactions/${t.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
                          >
                            <Receipt size={12} />
                            <span>Detail</span>
                          </button>
                          {t.status === 'paid' && !t.is_archived && (
                            <button
                              onClick={() => setDeletingTransaction(t)}
                              title="Arsipkan Transaksi"
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer"
                            >
                              <Archive size={13} />
                            </button>
                          )}
                          {t.is_archived && (
                            <>
                              <button
                                onClick={() => handleUnarchive(t)}
                                title="Kembalikan dari Arsip"
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-emerald-950/40 text-emerald-400 border border-zinc-800 transition cursor-pointer"
                              >
                                <ArchiveRestore size={13} />
                              </button>
                              <button
                                onClick={() => setHidingTransaction(t)}
                                title="Hapus dari Tampilan"
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
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
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onDone={handleCheckoutDone}
      />

      <ConfirmDialog
        open={!!deletingTransaction}
        title="Arsipkan Transaksi?"
        message={`${deletingTransaction?.transaction_code} akan disembunyikan dari daftar utama, namun tetap tersimpan penuh di laporan keuangan.`}
        confirmLabel="Arsipkan Transaksi"
        confirmingLabel="Mengarsipkan..."
        onConfirm={handleArchive}
        onCancel={() => setDeletingTransaction(null)}
        loading={deleting}
      />

      <ConfirmDialog
        open={!!hidingTransaction}
        title="Hapus dari Tampilan Arsip?"
        message={`${hidingTransaction?.transaction_code} akan disembunyikan dari daftar arsip. Data tetap aman di database.`}
        onConfirm={handleHide}
        onCancel={() => setHidingTransaction(null)}
        loading={hiding}
        confirmLabel="Hapus Tampilan"
      />
    </DashboardLayout>
  );
}