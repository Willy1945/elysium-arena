import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { reportService } from '../../api/reportService';
import { formatRupiah } from '../../utils/format';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'custom', label: 'Custom' },
];

const TAB_OPTIONS = [
  { value: 'revenue', label: 'Pendapatan' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'inventory', label: 'Inventory' },
];

function exportToCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [tab, setTab] = useState('revenue');
  const [period, setPeriod] = useState('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = { period };
      if (period === 'custom') {
        params.from = customFrom;
        params.to = customTo;
      }

      let response;
      if (tab === 'revenue') response = await reportService.getRevenue(params);
      else if (tab === 'gaming') response = await reportService.getGaming(params);
      else if (tab === 'food') response = await reportService.getFood(params);
      else response = await reportService.getInventory();

      setData(response.data);
    } finally {
      setLoading(false);
    }
  }, [tab, period, customFrom, customTo]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const handleExport = () => {
    if (tab === 'revenue') exportToCsv(`laporan-pendapatan-${period}.csv`, data.transactions);
    else if (tab === 'gaming') exportToCsv(`laporan-gaming-${period}.csv`, data.per_device);
    else if (tab === 'food') exportToCsv(`laporan-food-${period}.csv`, data.top_products);
    else exportToCsv('laporan-inventory.csv', data.low_stock_products);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Reports</h2>
          <p className="text-text-secondary text-sm">Laporan pendapatan, gaming, F&B, dan inventory.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={!data || loading}
          className="flex items-center gap-1.5 border border-border text-text-secondary text-sm px-4 py-2 rounded-lg hover:bg-surface-elevated transition disabled:opacity-40"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {TAB_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              tab === t.value ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'inventory' && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 rounded text-xs border transition ${
                period === p.value ? 'border-accent text-accent-light bg-accent/10' : 'border-border text-text-secondary'
              }`}
            >
              {p.label}
            </button>
          ))}
          {period === 'custom' && (
            <>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="bg-surface-inset border border-border rounded px-2 py-1 text-xs text-text-primary" />
              <span className="text-text-secondary text-xs">s/d</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="bg-surface-inset border border-border rounded px-2 py-1 text-xs text-text-primary" />
            </>
          )}
        </div>
      )}

      {loading || !data ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : (
        <>
          {tab === 'revenue' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-elevated border border-border rounded-xl p-4">
                  <p className="text-text-secondary text-xs mb-1">Total Transaksi</p>
                  <p className="text-text-primary font-bold text-xl">{data.summary.total_transactions}</p>
                </div>
                <div className="bg-surface-elevated border border-border rounded-xl p-4">
                  <p className="text-text-secondary text-xs mb-1">Gaming</p>
                  <p className="text-text-primary font-bold text-xl">{formatRupiah(data.summary.gaming_total)}</p>
                </div>
                <div className="bg-surface-elevated border border-border rounded-xl p-4">
                  <p className="text-text-secondary text-xs mb-1">Food & Beverage</p>
                  <p className="text-text-primary font-bold text-xl">{formatRupiah(data.summary.food_total)}</p>
                </div>
              </div>

              <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary text-xs uppercase">
                      <th className="px-4 py-3">Kode</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Gaming</th>
                      <th className="px-4 py-3">Food</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-6 text-center text-text-secondary">Tidak ada data.</td></tr>
                    ) : data.transactions.map((t) => (
                      <tr key={t.transaction_code} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3 text-text-primary font-medium">{t.transaction_code}</td>
                        <td className="px-4 py-3 text-text-secondary">{t.customer}</td>
                        <td className="px-4 py-3 text-text-secondary">{formatRupiah(t.gaming_amount)}</td>
                        <td className="px-4 py-3 text-text-secondary">{formatRupiah(t.food_amount)}</td>
                        <td className="px-4 py-3 text-text-primary font-semibold">{formatRupiah(t.total_amount)}</td>
                        <td className="px-4 py-3 text-text-secondary">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'gaming' && (
            <div className="bg-surface-elevated border border-border rounded-xl p-5">
              <h3 className="text-text-primary font-semibold mb-4">Pendapatan per Device — Total: {formatRupiah(data.total_revenue)}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.per_device}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a4455" opacity={0.3} />
                  <XAxis dataKey="device_code" stroke="#ccc3d8" fontSize={12} />
                  <YAxis stroke="#ccc3d8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ backgroundColor: '#1d1a24', border: '1px solid #4a4455', fontSize: 12 }} />
                  <Bar dataKey="total_revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tab === 'food' && (
            <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-secondary text-xs uppercase">
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Terjual</th>
                    <th className="px-4 py-3">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_products.length === 0 ? (
                    <tr><td colSpan={3} className="px-4 py-6 text-center text-text-secondary">Tidak ada data.</td></tr>
                  ) : data.top_products.map((p, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 text-text-primary font-medium">{p.product_name}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.total_qty}x</td>
                      <td className="px-4 py-3 text-text-primary font-semibold">{formatRupiah(p.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'inventory' && (
            <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-secondary text-xs uppercase">
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-4 py-3">Min. Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {data.low_stock_products.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Semua stok aman.</td></tr>
                  ) : data.low_stock_products.map((p, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 text-text-primary font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                      <td className="px-4 py-3 text-status-occupied font-semibold">{p.stock}</td>
                      <td className="px-4 py-3 text-text-secondary">{p.minimum_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}