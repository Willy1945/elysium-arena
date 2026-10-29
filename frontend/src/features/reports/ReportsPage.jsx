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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <BarChart3 size={14} />
            <span>Laporan & Analitik Finansial</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Laporan Kinerja Bisnis
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Analisis tren pendapatan, utilisasi rig PC/PS5, produk F&B terlaris, dan status stok.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={!isDataMatchingTab || loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-950 text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Data CSV</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-6">
        {TAB_OPTIONS.map((t) => {
          const active = tab === t.value;
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer border border-zinc-950 ${
                active
                  ? 'bg-cust-red text-white shadow-[2px_2px_0px_0px_#18181b]'
                  : 'bg-white text-zinc-800 hover:bg-zinc-100 shadow-[1px_1px_0px_0px_#18181b]'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-zinc-950 rounded-xl w-full sm:w-fit mb-6 shadow-[2px_2px_0px_0px_#18181b]">
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-tech uppercase tracking-wider transition cursor-pointer ${
              period === p.value
                ? 'bg-zinc-950 text-white'
                : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pl-0 sm:pl-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-200 text-xs w-full sm:w-auto">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="bg-white border border-zinc-950 rounded-lg px-2.5 py-1 text-zinc-950 font-bold text-xs outline-none focus:border-cust-red"
            />
            <span className="text-zinc-500 font-bold">s/d</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="bg-white border border-zinc-950 rounded-lg px-2.5 py-1 text-zinc-950 font-bold text-xs outline-none focus:border-cust-red"
            />
          </div>
        )}
      </div>

      {loading || !isDataMatchingTab ? (
        <div className="py-24 text-center text-zinc-500 text-xs font-mono-tech uppercase tracking-wider flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border border-cust-red border-t-transparent rounded-full animate-spin" />
          <span>Mengkalkulasi Laporan...</span>
        </div>
      ) : (
        <>

          {tab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b]">
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Total Transaksi Selesai</p>
                  <p className="font-display font-black text-3xl text-zinc-950">
                    {data?.summary?.total_transactions ?? 0} <span className="text-xs text-zinc-500 font-sans font-normal">Transaksi</span>
                  </p>
                </div>
                <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b]">
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Pendapatan Gaming Rig</p>
                  <p className="font-display font-black text-3xl text-cust-red">
                    {formatRupiah(data?.summary?.gaming_total ?? 0)}
                  </p>
                </div>
                <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b]">
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider mb-1">Pendapatan Kafe F&B</p>
                  <p className="font-display font-black text-3xl text-emerald-700">
                    {formatRupiah(data?.summary?.food_total ?? 0)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-950 uppercase tracking-wider font-mono-tech font-black">
                        <th className="px-5 py-4">Kode Transaksi</th>
                        <th className="px-5 py-4">Pelanggan</th>
                        <th className="px-5 py-4">Gaming Rig</th>
                        <th className="px-5 py-4">Kafe F&B</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {(!data?.transactions || data.transactions.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-zinc-500 font-medium">
                            Tidak ada transaksi pada periode ini.
                          </td>
                        </tr>
                      ) : (
                        data.transactions.map((t) => (
                          <tr key={t.transaction_code} className="hover:bg-zinc-50 transition">
                            <td className="px-5 py-3.5 font-mono-tech font-bold text-zinc-950">
                              {t.transaction_code}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-900 font-medium">
                              {t.customer ?? 'Anonim'}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-700 font-mono-tech font-bold">
                              {formatRupiah(t.gaming_amount)}
                            </td>
                            <td className="px-5 py-3.5 text-zinc-700 font-mono-tech font-bold">
                              {formatRupiah(t.food_amount)}
                            </td>
                            <td className="px-5 py-3.5 font-display font-black text-base text-zinc-950">
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

          {tab === 'gaming' && (
            <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_#18181b]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-tight">
                    Distribusi Pendapatan per Stasiun
                  </h3>
                  <p className="text-zinc-600 text-xs font-medium">
                    Total Revenue Gaming: <strong className="text-zinc-950">{formatRupiah(data?.total_revenue ?? 0)}</strong>
                  </p>
                </div>
              </div>

              {(!data?.per_device || data.per_device.length === 0) ? (
                <div className="py-16 text-center text-zinc-500 text-xs font-medium">
                  Belum ada data sesi gaming yang selesai pada periode ini.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={data.per_device}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.8} />
                    <XAxis dataKey="device_code" stroke="#71717a" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(v) => formatRupiah(v)}
                      contentStyle={{ backgroundColor: '#ffffff', border: '2px solid #18181b', borderRadius: '0.75rem', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="total_revenue" name="Total Omzet" fill="#e31e24" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {tab === 'food' && (
            <div className="bg-white border border-zinc-950 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#18181b]">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-zinc-950 text-xl uppercase tracking-tight">
                    Menu Kafe Terlaris (Top Seller)
                  </h3>
                  <p className="text-zinc-600 text-xs font-medium">Peringkat menu berdasarkan kuantitas terjual.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold font-mono-tech">Total Omzet Kafe</span>
                  <span className="font-display font-black text-lg text-emerald-700">
                    {formatRupiah(data?.total_revenue ?? 0)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-950 uppercase tracking-wider font-mono-tech font-black">
                      <th className="px-5 py-4">Nama Produk</th>
                      <th className="px-5 py-4">Total Porsi Terjual</th>
                      <th className="px-5 py-4 text-right">Akumulasi Omzet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {(!data?.top_products || data.top_products.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-zinc-500 font-medium">
                          Belum ada penjualan menu kafe pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      data.top_products.map((p, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 transition">
                          <td className="px-5 py-4 text-zinc-950 font-bold">
                            {p.product_name}
                          </td>
                          <td className="px-5 py-4 text-zinc-700 font-mono-tech font-bold">
                            {p.total_qty}x Porsi
                          </td>
                          <td className="px-5 py-4 text-right font-display font-black text-base text-emerald-700 font-mono-tech">
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
