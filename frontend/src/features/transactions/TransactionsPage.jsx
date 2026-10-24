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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[4px_4px_0px_0px_#18181b]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-100">
          <h3 className="text-zinc-950 font-display font-black text-xl uppercase tracking-tight">
            Buat Transaksi Kasir Baru
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-zinc-100 border border-zinc-950 rounded-xl p-1 flex gap-1 mb-5 shadow-[2px_2px_0px_0px_#18181b]">
          <button
            onClick={() => setTab('session')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              tab === 'session' ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]' : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            Dari Sesi Bermain
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              tab === 'orders' ? 'bg-cust-red text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]' : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            Take-away Kafe F&B
          </button>
        </div>

        {tab === 'session' ? (
          <div className="space-y-2.5">
            {checkoutable.sessions.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8 font-medium">
                Tidak ada sesi stasiun yang siap di-checkout saat ini.
              </p>
            ) : (
              checkoutable.sessions.map((s) => (
                <button
                  key={s.id}
                  disabled={loading}
                  onClick={() => handleCheckoutSession(s.id)}
                  className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-950 hover:bg-zinc-100 rounded-xl p-4 text-left transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                >
                  <div>
                    <p className="text-zinc-950 text-sm font-bold">{s.device?.code} — {s.user?.name}</p>
                    <p className="text-zinc-500 text-xs font-mono-tech mt-0.5">Durasi: {s.duration / 60} jam</p>
                  </div>
                  <span className="font-display font-black text-base text-zinc-950">{formatRupiah(s.price)}</span>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {checkoutable.orders.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-8 font-medium">
                Tidak ada pesanan take-away yang menunggu checkout.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {checkoutable.orders.map((o) => (
                    <label
                      key={o.id}
                      className="flex items-center justify-between bg-zinc-50 border border-zinc-950 p-3.5 rounded-xl cursor-pointer hover:bg-zinc-100 transition shadow-[2px_2px_0px_0px_#18181b]"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(o.id)}
                          onChange={() => toggleOrder(o)}
                          className="accent-cust-red w-4 h-4 rounded border border-zinc-950"
                        />
                        <div>
                          <p className="text-zinc-950 text-xs font-bold">Order #{o.order_code}</p>
                          <p className="text-zinc-600 text-[11px] font-medium">{o.user?.name}</p>
                        </div>
                      </div>
                      <span className="text-zinc-950 font-black text-xs font-mono-tech">{formatRupiah(o.total_price)}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleCheckoutOrders}
                  disabled={selectedOrderIds.length === 0 || loading}
                  className="w-full py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-40"
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
  const FILTER_DOTS = {
    pending: 'bg-amber-500',
    paid: 'bg-emerald-500',
    cancelled: 'bg-rose-500',
  };

  return (
    <DashboardLayout>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <Receipt size={14} />
            <span>Billing Kasir</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Log Transaksi Arena
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Rekap invoice gabungan persewaan gaming rig dan pesanan kafe F&B.
          </p>
        </div>

        {/* Action Buttons on Header Right */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowArchived((prev) => !prev)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-950 transition cursor-pointer shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              showArchived
                ? 'bg-zinc-950 text-white'
                : 'bg-white text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Archive size={14} />
            <span>{showArchived ? 'Daftar Utama' : 'Arsip'}</span>
          </button>

          <button
            onClick={() => setCheckoutOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* ── FILTER STATUS BAR (Baris tersendiri di atas tabel) ── */}
      <div className="mb-6 flex overflow-x-auto pb-1 scrollbar-none">
        <div className="bg-white border border-zinc-950 rounded-xl p-1 inline-flex gap-1 shadow-[2px_2px_0px_0px_#18181b]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                statusFilter === f
                  ? 'bg-zinc-950 text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {FILTER_DOTS[f] && (
                <span className={`w-2 h-2 rounded-full border border-zinc-950/40 shrink-0 ${FILTER_DOTS[f]}`} />
              )}
              <span>{FILTER_LABEL[f] || f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLE CONTAINER ── */}
      <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-950 uppercase tracking-wider font-mono-tech">
                <th className="px-5 py-4 font-black">Kode Transaksi</th>
                <th className="px-5 py-4 font-black">Pelanggan</th>
                <th className="px-5 py-4 font-black">Gaming Rig</th>
                <th className="px-5 py-4 font-black">Kafe F&B</th>
                <th className="px-5 py-4 font-black">Total Tagihan</th>
                <th className="px-5 py-4 font-black">Status</th>
                <th className="px-5 py-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500 font-mono-tech uppercase tracking-wider">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500 font-medium">
                    Belum ada riwayat transaksi yang tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const status = TRANSACTION_STATUS_CONFIG[t.status] || { label: t.status, color: 'neutral' };
                  return (
                    <tr key={t.id} className="hover:bg-zinc-50 transition">
                      <td className="px-5 py-4 font-mono-tech font-bold text-zinc-950">
                        {t.transaction_code}
                      </td>
                      <td className="px-5 py-4 text-zinc-900 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span>{t.user?.name || t.guest_name || 'Tamu (Walk-In)'}</span>
                          {t.is_guest && (
                            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-950 font-bold">
                              Tamu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-700">
                        {t.gaming_amount > 0 ? (
                          <span className="flex items-center gap-1.5 font-mono-tech font-bold">
                            <Gamepad2 size={13} className="text-cust-red" />
                            {formatRupiah(t.gaming_amount)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 text-zinc-700">
                        {t.food_amount > 0 ? (
                          <span className="flex items-center gap-1.5 font-mono-tech font-bold">
                            <UtensilsCrossed size={13} className="text-amber-700" />
                            {formatRupiah(t.food_amount)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 font-display font-black text-base text-zinc-950">
                        {formatRupiah(t.total_amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge colorVar={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/admin/transactions/${t.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 text-[11px] font-bold uppercase tracking-wider transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
                          >
                            <Receipt size={12} />
                            <span>Detail</span>
                          </button>
                          {t.status === 'paid' && !t.is_archived && (
                            <button
                              onClick={() => setDeletingTransaction(t)}
                              title="Arsipkan Transaksi"
                              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-950 transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
                            >
                              <Archive size={13} />
                            </button>
                          )}
                          {t.is_archived && (
                            <>
                              <button
                                onClick={() => handleUnarchive(t)}
                                title="Kembalikan dari Arsip"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-zinc-950 transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
                              >
                                <ArchiveRestore size={13} />
                              </button>
                              <button
                                onClick={() => setHidingTransaction(t)}
                                title="Hapus dari Tampilan"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-zinc-950 transition shadow-[1px_1px_0px_0px_#18181b] cursor-pointer"
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
