import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Gamepad2, UtensilsCrossed, Receipt, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import { transactionService } from '../../api/transactionService';
import { formatRupiah, TRANSACTION_STATUS_CONFIG, PAYMENT_METHOD_LABEL } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

const PAYMENT_METHODS = ['cash', 'qris'];

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
      <div className="max-w-2xl mx-auto print:max-w-none print:m-0 print:p-0">
        <Link
          to="/admin/transactions"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider mb-6 transition print:hidden"
        >
          <ArrowLeft size={14} /> Kembali ke Kasir & Transaksi
        </Link>

        {/* Invoice Card */}
        <div
          id="invoice-print"
          className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#18181b] print:border print:border-dashed print:border-zinc-800 print:rounded-none print:p-5 print:shadow-none print:max-w-[360px] print:mx-auto"
        >
          <div className="text-center border-b border-zinc-200 print:border-zinc-800 pb-5 mb-5">
            <span className="text-[10px] font-mono-tech text-cust-red print:text-zinc-900 uppercase tracking-widest font-bold block mb-1">
              OFFICIAL BILLING RECEIPT
            </span>
            <h1 className="text-zinc-950 text-2xl font-black font-display tracking-wider uppercase">
              ELYSIUM ARENA
            </h1>
            <p className="text-zinc-500 print:text-zinc-800 text-xs mt-0.5 font-mono-tech font-bold">
              Gaming Center & Executive Lounge Cafe
            </p>
            <p className="text-zinc-400 print:text-zinc-700 text-[10px] font-mono-tech mt-1">
              Jl. Babarsari No. 88, Sleman, DIY • WA: 0838-6900-2070
            </p>
          </div>

          <div className="flex items-start justify-between pb-4 border-b border-zinc-200 print:border-zinc-800 mb-5 text-xs">
            <div>
              <p className="text-zinc-500 print:text-zinc-600 text-[10px] font-mono-tech uppercase tracking-wider font-bold mb-0.5">Kode Transaksi</p>
              <p className="text-zinc-950 font-mono-tech font-bold text-sm tracking-wide">{transaction.transaction_code}</p>
              {transaction.created_at && (
                <p className="text-zinc-500 print:text-zinc-700 text-[10px] font-mono-tech mt-0.5 font-medium">
                  {new Date(transaction.created_at).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} WIB
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-zinc-500 print:text-zinc-600 text-[10px] font-mono-tech uppercase tracking-wider font-bold mb-0.5">Pelanggan</p>
              <p className="text-zinc-950 font-bold text-sm">{transaction.user?.name || 'Walk-in Guest'}</p>
              <p className="text-zinc-500 print:text-zinc-700 text-[10px] font-mono-tech mt-0.5 font-semibold">
                Kasir: Elysium POS
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 mb-5">
            {transaction.gaming_amount > 0 && (
              <div className="bg-zinc-50 print:bg-white border border-zinc-950 print:border-zinc-300 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#18181b] print:shadow-none">
                <div className="flex items-center gap-1.5 text-zinc-950 text-xs font-bold uppercase tracking-wider mb-1.5 font-mono-tech">
                  <Gamepad2 size={13} className="text-cust-red print:text-zinc-900" /> Biaya Bermain Stasiun
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-zinc-800 font-bold">{transaction.session?.device_code} ({transaction.session?.duration / 60} Jam)</span>
                  <span className="text-zinc-950 font-mono-tech font-black">{formatRupiah(transaction.gaming_amount)}</span>
                </div>
              </div>
            )}

            {transaction.food_amount > 0 && (
              <div className="bg-zinc-50 print:bg-white border border-zinc-950 print:border-zinc-300 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#18181b] print:shadow-none">
                <div className="flex items-center gap-1.5 text-zinc-950 text-xs font-bold uppercase tracking-wider mb-1.5 font-mono-tech">
                  <UtensilsCrossed size={13} className="text-cust-red print:text-zinc-900" /> Pesanan Kafe & Kitchen
                </div>
                <div className="flex flex-col gap-2">
                  {transaction.orders?.flatMap((order) => order.items).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-zinc-800 font-bold">
                        {item.product.name} <span className="text-zinc-500 font-mono-tech font-bold">×{item.quantity}</span>
                      </span>
                      <span className="text-zinc-950 font-mono-tech font-bold">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 print:border-zinc-800 pt-3.5 flex items-center justify-between mb-4">
            <span className="text-zinc-700 print:text-zinc-900 text-xs sm:text-sm font-bold uppercase tracking-wider font-mono-tech">Total Tagihan</span>
            <span className="text-zinc-950 font-black text-2xl font-mono-tech">{formatRupiah(transaction.total_amount)}</span>
          </div>

          <div className="flex items-center justify-between pt-3.5 border-t border-zinc-200 print:border-zinc-800">
            <div>
              <span className="text-zinc-500 print:text-zinc-600 text-[10px] font-mono-tech uppercase tracking-wider block font-bold">Status Billing</span>
              {transaction.payments?.length > 0 && (
                <p className="text-zinc-700 print:text-zinc-900 text-xs mt-0.5 font-bold">
                  Lunas via <span className="text-zinc-950 font-black capitalize">{PAYMENT_METHOD_LABEL[transaction.payments[0].method]}</span>
                </p>
              )}
            </div>
            <Badge colorVar={status.color}>{status.label}</Badge>
          </div>

          {/* Struk Footer Khusus Print */}
          <div className="hidden print:block text-center border-t border-dashed border-zinc-800 pt-4 mt-5">
            <p className="text-xs font-bold text-zinc-950 font-mono-tech">Terima kasih atas kunjungan Anda!</p>
            <p className="text-[10px] text-zinc-600 font-mono-tech mt-0.5">
              Simpan struk ini sebagai bukti pembayaran yang sah.
            </p>
          </div>
        </div>

        {/* Payment Action */}
        {transaction.status === 'pending' ? (
          <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 mt-5 shadow-[4px_4px_0px_0px_#18181b] print:hidden">
            <h3 className="text-zinc-950 font-black text-sm uppercase tracking-wider font-display mb-3 flex items-center gap-2">
              <CreditCard size={15} className="text-cust-red" />
              <span>Pilih Metode Pembayaran Kasir</span>
            </h3>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMethod(m)}
                  className={`py-3 rounded-xl text-xs font-bold font-mono-tech uppercase tracking-wider border-2 transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                    selectedMethod === m
                      ? 'border-zinc-950 bg-cust-red text-white'
                      : 'border-zinc-950 bg-white text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {PAYMENT_METHOD_LABEL[m]}
                </button>
              ))}
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
            >
              {paying ? 'Memproses Transaksi...' : `Pelunasan Kasir — ${formatRupiah(transaction.total_amount)}`}
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 font-bold uppercase tracking-wider py-3.5 rounded-xl mt-5 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition print:hidden text-xs sm:text-sm cursor-pointer"
          >
            <Printer size={16} /> Cetak Struk Bukti Pembayaran
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}
