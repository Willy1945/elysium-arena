import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor, CheckCircle2, Gamepad2, Wrench, CalendarCheck,
  TrendingUp, ArrowRight, DollarSign, Activity, UtensilsCrossed
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardService } from '../../api/dashboardService';
import { formatRupiah } from '../../utils/format';

function MetricCard({ icon: Icon, label, value, sublabel, iconColor, dotColor }) {
  return (
    <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg flex items-start justify-between">
      <div>
        <p className="text-xs text-zinc-400 font-medium">{label}</p>
        <p className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
          {value}
        </p>
        {sublabel && (
          <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
            {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
            <span>{sublabel}</span>
          </p>
        )}
      </div>
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121216] border border-zinc-700/80 rounded-xl p-3.5 text-xs shadow-2xl">
      <p className="text-white font-bold mb-2 pb-1 border-b border-zinc-800">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}:
          </span>
          <span className="font-semibold text-white font-mono-tech">{formatRupiah(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getSummary().then(({ data }) => {
      setSummary(data);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center text-zinc-500 text-xs uppercase tracking-wider">
          Memuat ringkasan eksekutif...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ── HEADER TITLE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity size={14} />
            <span>Executive Dashboard</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Ringkasan Operasional Arena
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Laporan ketersediaan perangkat stasiun dan performa pendapatan bisnis secara realtime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/sessions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
          >
            <span>Pantau Sesi Aktif</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── 4 STAT METRIC CARDS: STATUS STASIUN ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <MetricCard
          icon={Monitor}
          label="Total Stasiun"
          value={`${summary.devices.total} Unit`}
          sublabel="Semua platform rig"
          iconColor="text-zinc-300"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Station Siap (Ready)"
          value={`${summary.devices.available} Unit`}
          sublabel="Siap ditempati customer"
          iconColor="text-emerald-400"
          dotColor="bg-emerald-400"
        />
        <MetricCard
          icon={Gamepad2}
          label="Sedang Digunakan"
          value={`${summary.devices.occupied} Unit`}
          sublabel="Sesi bermain aktif"
          iconColor="text-cust-red"
          dotColor="bg-cust-red"
        />
        <MetricCard
          icon={Wrench}
          label="Maintenance / Servis"
          value={`${summary.devices.maintenance} Unit`}
          sublabel="Dalam perbaikan perangkat"
          iconColor="text-zinc-500"
          dotColor="bg-zinc-600"
        />
      </div>

      {/* ── 3 REVENUE METRIC CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Card 1: Booking Hari Ini */}
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">Reservasi Hari Ini</span>
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red">
                <CalendarCheck size={16} />
              </div>
            </div>
            <p className="font-display font-black text-3xl text-white">
              {summary.bookings_today} <span className="text-xs text-zinc-400 font-sans font-normal">Booking</span>
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-cust-red hover:underline mt-4 inline-flex items-center gap-1"
          >
            <span>Buka Jadwal Booking</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Card 2: Pendapatan Hari Ini */}
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">Pendapatan Hari Ini</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="font-display font-black text-3xl text-white mb-3">
              {formatRupiah(summary.revenue_today.total)}
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Rig: <strong className="text-white">{formatRupiah(summary.revenue_today.gaming)}</strong></span>
            <span>Kafe: <strong className="text-white">{formatRupiah(summary.revenue_today.food)}</strong></span>
          </div>
        </div>

        {/* Card 3: Pendapatan Bulan Ini */}
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400 font-medium">Akumulasi Bulan Ini</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="font-display font-black text-3xl text-white">
              {formatRupiah(summary.revenue_month)}
            </p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-4">
            Total gabungan transaksi sewa stasiun & penjualan kafe.
          </p>
        </div>

      </div>

      {/* ── 7-DAY REVENUE RECHARTS LINE CHART ── */}
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-4 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display font-black text-white text-lg sm:text-xl uppercase tracking-wide">
              Tren Pendapatan 7 Hari Terakhir
            </h3>
            <p className="text-zinc-500 text-xs">
              Perbandingan pendapatan dari persewaan stasiun gaming dan kafe F&B.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono-tech">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e31e24]" /> Persewaan Gaming
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Kafe F&B
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summary.daily_chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
            <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="gaming"
              name="Gaming Rig"
              stroke="#e31e24"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#e31e24' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="food"
              name="Food & Beverage"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#22c55e' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}