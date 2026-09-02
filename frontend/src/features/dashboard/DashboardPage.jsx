import { useState, useEffect } from 'react';
import { Monitor, CheckCircle2, Gamepad2, Wrench, CalendarCheck, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { dashboardService } from '../../api/dashboardService';
import { formatRupiah } from '../../utils/format';

function StatCard({ icon: Icon, label, value, colorVar = 'accent-light' }) {
  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, var(--color-${colorVar}) 12%, transparent)` }}
      >
        <Icon size={18} style={{ color: `var(--color-${colorVar})` }} />
      </div>
      <div>
        <p className="text-text-secondary text-xs">{label}</p>
        <p className="text-text-primary font-bold text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-elevated border border-border rounded-lg p-3 text-xs">
      <p className="text-text-primary font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatRupiah(p.value)}</p>
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
    return <DashboardLayout><p className="text-text-secondary text-sm">Memuat data...</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-text-primary text-2xl font-semibold">Dashboard</h2>
        <p className="text-text-secondary text-sm">Ringkasan operasional Elysium Arena hari ini.</p>
      </div>

      {/* Device Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Monitor} label="Total Device" value={summary.devices.total} colorVar="accent-light" />
        <StatCard icon={CheckCircle2} label="Available" value={summary.devices.available} colorVar="status-available" />
        <StatCard icon={Gamepad2} label="Occupied" value={summary.devices.occupied} colorVar="status-occupied" />
        <StatCard icon={Wrench} label="Maintenance" value={summary.devices.maintenance} colorVar="status-maintenance" />
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-elevated border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck size={15} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Booking Hari Ini</p>
          </div>
          <p className="text-text-primary font-bold text-2xl">{summary.bookings_today}</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Pendapatan Hari Ini</p>
          </div>
          <p className="text-text-primary font-bold text-2xl mb-2">{formatRupiah(summary.revenue_today.total)}</p>
          <div className="flex gap-3 text-xs text-text-secondary">
            <span>Gaming: <span className="text-text-primary">{formatRupiah(summary.revenue_today.gaming)}</span></span>
            <span>Food: <span className="text-text-primary">{formatRupiah(summary.revenue_today.food)}</span></span>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={15} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Pendapatan Bulan Ini</p>
          </div>
          <p className="text-text-primary font-bold text-2xl">{formatRupiah(summary.revenue_month)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface-elevated border border-border rounded-xl p-5">
        <h3 className="text-text-primary font-semibold mb-4">Pendapatan 7 Hari Terakhir</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={summary.daily_chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a4455" opacity={0.3} />
            <XAxis dataKey="date" stroke="#ccc3d8" fontSize={12} />
            <YAxis stroke="#ccc3d8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="gaming" name="Gaming" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="food" name="Food & Beverage" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}