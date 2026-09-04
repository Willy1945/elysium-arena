import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Monitor, ArrowRight, Search, Joystick, ChevronDown } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/format';

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Dipakai', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

export default function BrowseDevicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.type = activeFilter;
      if (search) params.search = search;
      const { data } = await publicService.getDevices(params);
      setDevices(data.data);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleBooking = (device) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/dashboard/booking/${device.id}`);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filters = ['All', 'PS5', 'PS4', 'PC'];

  return (
    <PublicLayout>
      {/* ── HEADER ── */}
      <section
        className="relative overflow-hidden min-h-[420px] flex items-center"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-cust-bg/75" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-cust-elevated border border-cust-border px-4 py-2 mb-6 text-xs font-bold uppercase">
            <Link to="/" className="text-cust-text-secondary hover:text-cust-text-primary transition">Beranda</Link>
            <span className="text-cust-text-secondary">›</span>
            <span className="text-cust-red">Device</span>
          </div>

          <h1 className="text-cust-text-primary font-black text-3xl sm:text-5xl uppercase leading-tight mb-2">
            Semua Gaming <span className="text-cust-red">Station</span>
          </h1>
          <div className="w-16 h-1 bg-cust-red mx-auto mb-6" />
          <p className="text-cust-text-secondary text-base max-w-xl mx-auto">
            Cek ketersediaan real-time, pilih device, dan booking slot waktu sebelum datang.
          </p>
        </div>
      </section>

      {/* ── FILTER & SEARCH ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-cust-border">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => {
              const active = activeFilter === f;
              const Icon = f === 'PC' ? Monitor : f === 'All' ? Joystick : Gamepad2;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase transition ${
                    active
                      ? 'bg-cust-red text-white shadow-lg shadow-cust-red/20'
                      : 'bg-cust-bg border border-cust-border text-cust-text-secondary hover:border-cust-red hover:text-cust-text-primary'
                  }`}
                >
                  <Icon size={15} />
                  {f}
                </button>
              );
            })}
          </div>

          <div className="relative sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cust-text-secondary" />
            <input
              type="text"
              placeholder="Cari kode device..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm pl-10 pr-4 py-3 outline-none focus:border-cust-red transition"
            />
          </div>
        </div>
      </section>

      {/* ── GRID DEVICE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {loading ? (
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        ) : devices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-cust-border">
            <p className="text-cust-text-secondary text-sm">Tidak ada device yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => {
              const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
              const isAvailable = device.status === 'available';
              const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
              const isExpanded = expandedId === device.id;
              const hasGames = device.games?.length > 0;

              return (
                <div
                  key={device.id}
                  className={`bg-cust-elevated border overflow-hidden transition-all duration-300 ${
                    isAvailable ? 'border-cust-border hover:border-cust-red' : 'border-cust-border opacity-70'
                  }`}
                >
                  {/* Foto */}
                  <div className="h-44 bg-cust-bg relative overflow-hidden">
                    {device.photo ? (
                      <img
                        src={resolveImageUrl(device.photo)}
                        alt={device.code}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon size={40} className="text-cust-text-secondary opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase text-white bg-black/70 backdrop-blur-sm px-2.5 py-1">
                      {device.device_type?.name}
                    </span>
                    <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 ${
                      isAvailable ? 'bg-green-500/20 text-green-400 backdrop-blur-sm' : 'bg-black/70 text-cust-text-secondary backdrop-blur-sm'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-cust-text-primary font-black uppercase text-lg mb-3">{device.code}</h3>

                    {/* Toggle Game List */}
                    <button
                      onClick={() => hasGames && toggleExpand(device.id)}
                      disabled={!hasGames}
                      className="w-full flex items-center justify-between text-cust-text-secondary text-xs mb-4 disabled:cursor-default"
                    >
                      <span>{hasGames ? `${device.games.length} game tersedia` : 'Belum ada game terpasang'}</span>
                      {hasGames && (
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180 text-cust-red' : ''}`} />
                      )}
                    </button>

                    {isExpanded && hasGames && (
                      <div className="bg-cust-bg border border-cust-border p-3 mb-4 max-h-40 overflow-y-auto flex flex-col gap-1.5">
                        {device.games.map((game) => (
                          <div key={game.id} className="flex items-center gap-2 text-xs text-cust-text-secondary">
                            <Joystick size={11} className="text-cust-red shrink-0" />
                            {game.name}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-cust-border">
                      <div>
                        <p className="text-cust-text-secondary text-[10px] uppercase">Tarif</p>
                        <p className={`font-black text-lg ${isAvailable ? 'text-cust-red' : 'text-cust-text-secondary line-through'}`}>
                          Rp {Number(device.price_per_hour).toLocaleString('id-ID')}
                          <span className="text-cust-text-secondary text-xs font-normal">/jam</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleBooking(device)}
                        disabled={!isAvailable}
                        className="flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark disabled:bg-cust-border disabled:text-cust-text-secondary disabled:cursor-not-allowed text-white font-bold uppercase text-xs px-5 py-3 transition"
                      >
                        {isAvailable ? (
                          <>Pilih <ArrowRight size={13} /></>
                        ) : (
                          'Tidak Tersedia'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}