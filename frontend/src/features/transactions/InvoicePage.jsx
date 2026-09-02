import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Gamepad2, UtensilsCrossed } from 'lucide-react';
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
      toast.success('Pembayaran berhasil diproses.');
      fetchTransaction();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <DashboardLayout><p className="text-text-secondary text-sm">Memuat data...</p></DashboardLayout>;
  }

  if (!transaction) {
    return <DashboardLayout><p className="text-text-secondary text-sm">Transaksi tidak ditemukan.</p></DashboardLayout>;
  }

  const status = TRANSACTION_STATUS_CONFIG[transaction.status];

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <Link to="/admin/transactions" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 transition print:hidden">
          <ArrowLeft size={16} /> Kembali ke Transactions
        </Link>

        {/* Invoice Card */}
        <div id="invoice-print" className="bg-surface-elevated border border-border rounded-xl p-8">
          <div className="text-center border-b border-dashed border-border pb-6 mb-6">
            <h1 className="text-text-primary text-xl font-bold tracking-wide">ELYSIUM ARENA</h1>
            <p className="text-text-secondary text-xs mt-1">Gaming Center & Cafe</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-secondary text-xs">Invoice</p>
              <p className="text-text-primary font-semibold">{transaction.transaction_code}</p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary text-xs">Customer</p>
              <p className="text-text-primary font-semibold">{transaction.user?.name}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {transaction.gaming_amount > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1.5">
                  <Gamepad2 size={12} /> GAMING
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{transaction.session?.device_code} — {transaction.session?.duration / 60} Jam</span>
                  <span className="text-text-primary">{formatRupiah(transaction.gaming_amount)}</span>
                </div>
              </div>
            )}

            {transaction.food_amount > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1.5 mt-2">
                  <UtensilsCrossed size={12} /> FOOD & BEVERAGE
                </div>
                {transaction.orders?.flatMap((order) => order.items).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{item.product.name} ×{item.quantity}</span>
                    <span className="text-text-primary">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-border pt-4 flex items-center justify-between mb-6">
            <span className="text-text-primary font-bold">TOTAL</span>
            <span className="text-accent-light font-bold text-xl">{formatRupiah(transaction.total_amount)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Status</span>
            <Badge colorVar={status.color}>{status.label}</Badge>
          </div>

          {transaction.payments?.length > 0 && (
            <p className="text-text-secondary text-xs mt-2">
              Dibayar via {PAYMENT_METHOD_LABEL[transaction.payments[0].method]}
            </p>
          )}
        </div>

        {/* Payment Action */}
        {transaction.status === 'pending' ? (
          <div className="bg-surface-elevated border border-border rounded-xl p-6 mt-4 print:hidden">
            <h3 className="text-text-primary font-semibold mb-3">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`py-2 rounded-lg text-sm border transition ${selectedMethod === m ? 'border-accent bg-accent/10 text-accent-light' : 'border-border text-text-secondary'
                    }`}
                >
                  {PAYMENT_METHOD_LABEL[m]}
                </button>
              ))}
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-accent hover:opacity-90 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {paying ? 'Memproses...' : `Bayar ${formatRupiah(transaction.total_amount)}`}
            </button>
          </div>
        ) : (
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 border border-border text-text-secondary py-3 rounded-lg mt-4 hover:bg-surface-elevated transition print:hidden"
          >
            <Printer size={16} /> Cetak Invoice
          </button>
        )}
      </div>
    </DashboardLayout>
  );
}