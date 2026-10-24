import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Monitor, CheckCircle2, Gamepad2, Wrench, CalendarCheck,
  TrendingUp, ArrowRight, DollarSign, Activity, UtensilsCrossed
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardService } from '../../api/dashboardService';
import { formatRupiah } from '../../utils/format';

function MetricCard({ icon: Icon, label, value, sublabel, badgeBg, iconColor, dotColor }) {
  return (
    <div className="bg-white border border-zinc-950 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#18181b] flex items-start justify-between">
      <div>
        <span className="text-zinc-600 text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-wider block font-bold mb-1">
          {label}
        </span>
        <p className="text-2xl sm:text-3xl font-mono-tech font-black text-zinc-950 uppercase tracking-tight">
          {value}
        </p>
        {sublabel && (
          <p className="text-[11px] text-zinc-600 mt-1.5 flex items-center gap-1.5 font-bold">
            {dotColor && <span className={`w-2 h-2 rounded-full border border-zinc-950 ${dotColor}`} />}
            <span>{sublabel}</span>
          </p>
        )}
      </div>
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-zinc-950 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#18181b] ${badgeBg || 'bg-zinc-100'} ${iconColor}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-950 rounded-xl p-3.5 text-xs shadow-[3px_3px_0px_0px_#18181b] text-zinc-900">
      <p className="text-zinc-950 font-mono-tech font-black mb-2 pb-1.5 border-b border-zinc-200">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5 font-bold">
          <span className="flex items-center gap-1.5 text-zinc-700">
            <span className="w-2.5 h-2.5 rounded-full border border-zinc-950" style={{ backgroundColor: p.color }} />
            {p.name}:
          </span>
          <span className="font-mono-tech font-black text-zinc-950">{formatRupiah(p.value)}</span>
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
        <div className="py-24 text-center text-zinc-600 font-mono-tech text-xs uppercase tracking-wider font-bold">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-950 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-[1px_1px_0px_0px_#18181b]">
            <Activity size={14} />
            <span>Executive Dashboard</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl uppercase tracking-tight">
            Ringkasan Operasional Arena
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm mt-0.5">
            Laporan ketersediaan perangkat stasiun dan performa pendapatan bisnis secara realtime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/sessions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider border border-zinc-950 shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition cursor-pointer"
          >
            <span>Pantau Sesi Aktif</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── 4 STAT METRIC CARDS: STATUS STASIUN ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Monitor}
          label="Total Stasiun"
          value={`${summary.devices.total} Unit`}
          sublabel="Semua platform rig"
          badgeBg="bg-zinc-100"
          iconColor="text-zinc-950"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Station Siap (Ready)"
          value={`${summary.devices.available} Unit`}
          sublabel="Siap ditempati customer"
          badgeBg="bg-emerald-100"
          iconColor="text-emerald-950"
          dotColor="bg-emerald-500"
        />
        <MetricCard
          icon={Gamepad2}
          label="Sedang Digunakan"
          value={`${summary.devices.occupied} Unit`}
          sublabel="Sesi bermain aktif"
          badgeBg="bg-rose-100"
          iconColor="text-cust-red"
          dotColor="bg-cust-red"
        />
        <MetricCard
          icon={Wrench}
          label="Maintenance / Servis"
          value={`${summary.devices.maintenance} Unit`}
          sublabel="Dalam perbaikan perangkat"
          badgeBg="bg-amber-100"
          iconColor="text-amber-950"
          dotColor="bg-amber-500"
        />
      </div>

      {/* ── 3 REVENUE METRIC CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Card 1: Booking Hari Ini */}
        <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-wider font-bold text-zinc-600">
                Reservasi Hari Ini
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-100 border border-zinc-950 flex items-center justify-center text-cust-red shadow-[2px_2px_0px_0px_#18181b]">
                <CalendarCheck size={18} />
              </div>
            </div>
            <p className="font-mono-tech font-black text-3xl sm:text-4xl text-zinc-950">
              {summary.bookings_today} <span className="text-xs font-mono-tech font-bold text-zinc-600">Booking</span>
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-950 text-zinc-950 text-xs font-bold uppercase tracking-wider shadow-[1px_1px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] transition w-fit mt-4"
          >
            <span>Buka Jadwal Booking</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Card 2: Pendapatan Hari Ini */}
        <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-wider font-bold text-zinc-600">
                Pendapatan Hari Ini
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-zinc-950 flex items-center justify-center text-emerald-800 shadow-[2px_2px_0px_0px_#18181b]">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="font-mono-tech font-black text-3xl sm:text-4xl text-emerald-700 mb-3">
              {formatRupiah(summary.revenue_today.total)}
            </p>
          </div>
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono-tech font-bold text-zinc-700">
            <span>Rig: <strong className="text-zinc-950 font-black">{formatRupiah(summary.revenue_today.gaming)}</strong></span>
            <span>Kafe: <strong className="text-zinc-950 font-black">{formatRupiah(summary.revenue_today.food)}</strong></span>
          </div>
        </div>

        {/* Card 3: Pendapatan Bulan Ini */}
        <div className="bg-white border border-zinc-950 rounded-2xl p-5 shadow-[3px_3px_0px_0px_#18181b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono-tech uppercase tracking-wider font-bold text-zinc-600">
                Akumulasi Bulan Ini
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-zinc-950 flex items-center justify-center text-amber-800 shadow-[2px_2px_0px_0px_#18181b]">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="font-mono-tech font-black text-3xl sm:text-4xl text-zinc-950">
              {formatRupiah(summary.revenue_month)}
            </p>
          </div>
          <p className="text-[11px] text-zinc-600 mt-4 font-bold font-mono-tech">
            Total gabungan transaksi sewa stasiun & penjualan kafe.
          </p>
        </div>

      </div>

      {/* ── 7-DAY REVENUE RECHARTS LINE CHART ── */}
      <div className="bg-white border border-zinc-950 rounded-2xl p-5 sm:p-7 shadow-[3px_3px_0px_0px_#18181b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
              Tren Pendapatan 7 Hari Terakhir
            </h3>
            <p className="text-zinc-600 text-xs font-medium mt-0.5">
              Perbandingan pendapatan dari persewaan stasiun gaming dan kafe F&B.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-tech">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] font-bold text-zinc-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e31e24] border border-zinc-950" /> Persewaan Gaming
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b] font-bold text-zinc-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-zinc-950" /> Kafe F&B
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summary.daily_chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.9} />
            <XAxis dataKey="date" stroke="#18181b" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#18181b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="gaming"
              name="Gaming Rig"
              stroke="#e31e24"
              strokeWidth={3}
              dot={{ r: 4, fill: '#e31e24', stroke: '#18181b', strokeWidth: 1.5 }}
              activeDot={{ r: 6, stroke: '#18181b', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="food"
              name="Food & Beverage"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: '#22c55e', stroke: '#18181b', strokeWidth: 1.5 }}
              activeDot={{ r: 6, stroke: '#18181b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
