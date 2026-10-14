import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Gamepad2, UtensilsCrossed, Receipt, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { transactionService } from '../../api/transactionService';
import { formatRupiah, TRANSACTION_STATUS_CONFIG, PAYMENT_METHOD_LABEL } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const PAYMENT_METHODS = ['cash', 'qris', 'transfer'];

export default function InvoicePage() {
  const { id } = useParams();
  const toast = useToast();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('cash');

  const fetchTransaction = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await transactionService.getById(id);
      setTransaction(data.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTransaction(); }, [fetchTransaction]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await transactionService.pay(id, selectedMethod);
      toast.success('Pembayaran transaksi kasir berhasil diselesaikan.');
      fetchTransaction();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Memuat rincian invoice...
        </div>
      </DashboardLayout>
    );
  }

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-zinc-500 font-mono-tech text-xs uppercase tracking-wider">
          Transaksi tidak ditemukan.
        </div>
      </DashboardLayout>
    );
  }

  const status = TRANSACTION_STATUS_CONFIG[transaction.status] || { label: transaction.status, color: 'neutral' };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Link
          to="/admin/transactions"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition print:hidden"
        >
          <ArrowLeft size={14} /> Kembali ke Kasir & Transaksi
        </Link>

        {/* Invoice Card */}
        <div id="invoice-print" className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center border-b border-zinc-800/80 pb-6 mb-6">
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold block mb-1">
              OFFICIAL BILLING RECEIPT
            </span>
            <h1 className="text-white text-2xl font-black font-display tracking-wider uppercase">
              ELYSIUM ARENA
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5 font-mono-tech">Gaming Center & Executive Lounge Cafe</p>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6 text-xs">
            <div>
              <p className="text-zinc-500 text-[10px] font-mono-tech uppercase tracking-wider mb-0.5">Kode Transaksi</p>
              <p className="text-white font-mono-tech font-bold text-sm tracking-wide">{transaction.transaction_code}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-[10px] font-mono-tech uppercase tracking-wider mb-0.5">Pelanggan</p>
              <p className="text-white font-semibold text-sm">{transaction.user?.name || 'Walk-in Guest'}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {transaction.gaming_amount > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 font-mono-tech">
                  <Gamepad2 size={13} className="text-cust-red" /> Biaya Bermain Stasiun
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-white font-medium">{transaction.session?.device_code} ({transaction.session?.duration / 60} Jam)</span>
                  <span className="text-white font-mono-tech font-bold">{formatRupiah(transaction.gaming_amount)}</span>
                </div>
              </div>
            )}

            {transaction.food_amount > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2 font-mono-tech">
                  <UtensilsCrossed size={13} className="text-cust-red" /> Pesanan Kafe & Kitchen
                </div>
                <div className="flex flex-col gap-2">
                  {transaction.orders?.flatMap((order) => order.items).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-zinc-300">
                        {item.product.name} <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
                      </span>
                      <span className="text-white font-mono-tech font-semibold">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800/80 pt-4 flex items-center justify-between mb-6">
            <span className="text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono-tech">Total Tagihan</span>
            <span className="text-white font-black text-2xl font-mono-tech">{formatRupiah(transaction.total_amount)}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
            <div>
              <span className="text-zinc-500 text-[10px] font-mono-tech uppercase tracking-wider block">Status Billing</span>
              {transaction.payments?.length > 0 && (
                <p className="text-zinc-400 text-xs mt-0.5">
                  Lunas via <span className="text-white font-medium capitalize">{PAYMENT_METHOD_LABEL[transaction.payments[0].method]}</span>
                </p>
              )}
            </div>
            <Badge colorVar={status.color}>{status.label}</Badge>
          </div>
        </div>

        {/* Payment Action */}
        {transaction.status === 'pending' ? (
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 mt-5 shadow-2xl print:hidden">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider font-display mb-3 flex items-center gap-2">
              <CreditCard size={15} className="text-cust-red" />
              <span>Pilih Metode Pembayaran Kasir</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMethod(m)}
                  className={`py-3 rounded-2xl text-xs font-bold font-mono-tech uppercase tracking-wide border transition ${
                    selectedMethod === m
                      ? 'border-cust-red bg-cust-red/20 text-white shadow-md shadow-cust-red/10'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {PAYMENT_METHOD_LABEL[m]}
                </button>
              ))}
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-cust-red/20 text-xs sm:text-sm"
            >
              {paying ? 'Memproses Transaksi...' : `Pelunasan Kasir — ${formatRupiah(transaction.total_amount)}`}
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold py-3.5 rounded-2xl mt-5 transition shadow-lg print:hidden text-xs sm:text-sm"
          >
            <Printer size={16} /> Cetak Struk Bukti Pembayaran
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}