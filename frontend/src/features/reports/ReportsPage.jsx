import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, BarChart3, TrendingUp, Gamepad2, UtensilsCrossed } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { reportService } from '../../api/reportService';
import { formatRupiah } from '../../utils/format';

const PERIOD_OPTIONS = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'custom', label: 'Kustom' },
];

const TAB_OPTIONS = [
  { value: 'revenue', label: 'Pendapatan Kasir', icon: TrendingUp },
  { value: 'gaming', label: 'Performa Stasiun Gaming', icon: Gamepad2 },
  { value: 'food', label: 'Penjualan Kafe F&B', icon: UtensilsCrossed },
];

function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${r[h] ?? ''}"`).join(','))].join('\n');
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

  const handleTabChange = (newTab) => {
    if (newTab !== tab) {
      setData(null);
      setLoading(true);
      setTab(newTab);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod !== period) {
      setData(null);
      setLoading(true);
      setPeriod(newPeriod);
    }
  };

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
      else response = await reportService.getFood(params);

      setData(response?.data ?? null);
    } catch (err) {
      console.error('Gagal mengambil laporan:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tab, period, customFrom, customTo]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const isDataMatchingTab = useMemo(() => {
    if (!data) return false;
    if (tab === 'revenue') return Boolean(data.summary && Array.isArray(data.transactions));
    if (tab === 'gaming') return Array.isArray(data.per_device);
    if (tab === 'food') return Array.isArray(data.top_products);
    return false;
  }, [data, tab]);

  const handleExport = () => {
    if (!data) return;
    if (tab === 'revenue' && data.transactions) exportToCsv(`laporan-pendapatan-${period}.csv`, data.transactions);
    else if (tab === 'gaming' && data.per_device) exportToCsv(`laporan-gaming-${period}.csv`, data.per_device);
    else if (tab === 'food' && data.top_products) exportToCsv(`laporan-food-${period}.csv`, data.top_products);
  };

  return (
    <DashboardLayout>
      {/* ── HEADER & EXPORT ACTION ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 size={14} />
            <span>Laporan & Analitik Finansial</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Laporan Kinerja Bisnis
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Analisis tren pendapatan, utilisasi rig PC/PS5, produk F&B terlaris, dan status stok.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={!isDataMatchingTab || loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition disabled:opacity-40 cursor-pointer self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Data CSV</span>
        </button>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-6">
        {TAB_OPTIONS.map((t) => {
          const active = tab === t.value;
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-cust-red text-white shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── PERIOD SELECTOR ── */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl w-full sm:w-fit mb-6">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                period === p.value
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
          {period === 'custom' && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pl-0 sm:pl-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-800 text-xs w-full sm:w-auto">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-cust-red"
              />
              <span className="text-zinc-500">s/d</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-cust-red"
              />
            </div>
          )}
        </div>

      {/* ── CONTENT BODY ── */}
      {loading || !isDataMatchingTab ? (
        <div className="py-24 text-center text-zinc-500 text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-cust-red border-t-transparent rounded-full animate-spin" />
          <span>Mengkalkulasi Laporan...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: REVENUE REPORT */}
          {tab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <p className="text-zinc-400 text-xs font-medium mb-1">Total Transaksi Selesai</p>
                  <p className="font-display font-black text-3xl text-white">
                    {data?.summary?.total_transactions ?? 0} <span className="text-xs text-zinc-500 font-sans font-normal">Transaksi</span>
                  </p>
                </div>
                <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <p className="text-zinc-400 text-xs font-medium mb-1">Pendapatan Gaming Rig</p>
                  <p className="font-display font-black text-3xl text-cust-red">
                    {formatRupiah(data?.summary?.gaming_total ?? 0)}
                  </p>
                </div>
                <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg">
                  <p className="text-zinc-400 text-xs font-medium mb-1">Pendapatan Kafe F&B</p>
                  <p className="font-display font-black text-3xl text-emerald-400">
                    {formatRupiah(data?.summary?.food_total ?? 0)}
                  </p>
                </div>
              </div>

              <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400 uppercase tracking-wider font-mono-tech">
                        <th className="px-5 py-4 font-semibold">Kode Transaksi</th>
                        <th className="px-5 py-4 font-semibold">Pelanggan</th>
                        <th className="px-5 py-4 font-semibold">Gaming Rig</th>
                        <th className="px-5 py-4 font-semibold">Kafe F&B</th>
                        <th className="px-5 py-4 font-semibold">Total</th>
                        <th className="px-5 py-4 font-semibold">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {(!data?.transactions || data.transactions.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-zinc-500">
                            Tidak ada transaksi pada periode ini.
                          </td>
                        </tr>
                      ) : (
                        data.transactions.map((t) => (
                          <tr key={t.transaction_code} className="hover:bg-zinc-900/40 transition">
                            <td className="px-5 py-3.5 font-mono-tech font-bold text-white">
                              {t.transaction_code}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-300">
                              {t.customer ?? 'Anonim'}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-300 font-mono-tech">
                              {formatRupiah(t.gaming_amount)}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-300 font-mono-tech">
                              {formatRupiah(t.food_amount)}
                            </td>
                            <td className="px-5 py-3.5 font-display font-bold text-base text-white">
                              {formatRupiah(t.total_amount)}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-500 font-mono-tech">
                              {t.date}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GAMING RIG REPORT */}
          {tab === 'gaming' && (
            <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    Distribusi Pendapatan per Stasiun
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    Total Revenue Gaming: <strong className="text-white">{formatRupiah(data?.total_revenue ?? 0)}</strong>
                  </p>
                </div>
              </div>

              {(!data?.per_device || data.per_device.length === 0) ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  Belum ada data sesi gaming yang selesai pada periode ini.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={data.per_device}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
                    <XAxis dataKey="device_code" stroke="#71717a" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(v) => formatRupiah(v)}
                      contentStyle={{ backgroundColor: '#121216', border: '1px solid #27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                    />
                    <Bar dataKey="total_revenue" name="Total Omzet" fill="#e31e24" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* TAB 3: FOOD & BEVERAGE REPORT */}
          {tab === 'food' && (
            <div className="bg-[#121216] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-white text-xl uppercase tracking-wide">
                    Menu Kafe Terlaris (Top Seller)
                  </h3>
                  <p className="text-zinc-500 text-xs">Peringkat menu berdasarkan kuantitas terjual.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total Omzet Kafe</span>
                  <span className="font-display font-black text-lg text-emerald-400">
                    {formatRupiah(data?.total_revenue ?? 0)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400 uppercase tracking-wider font-mono-tech">
                      <th className="px-5 py-4 font-semibold">Nama Produk</th>
                      <th className="px-5 py-4 font-semibold">Total Porsi Terjual</th>
                      <th className="px-5 py-4 font-semibold text-right">Akumulasi Omzet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {(!data?.top_products || data.top_products.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-zinc-500">
                          Belum ada penjualan menu kafe pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      data.top_products.map((p, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/40 transition">
                          <td className="px-5 py-4 text-white font-semibold">
                            {p.product_name}
                          </td>
                          <td className="px-5 py-4 text-zinc-300 font-mono-tech">
                            {p.total_qty}x Porsi
                          </td>
                          <td className="px-5 py-4 text-right font-display font-bold text-base text-emerald-400 font-mono-tech">
                            {formatRupiah(p.total_revenue)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}