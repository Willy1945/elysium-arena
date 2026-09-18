import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Monitor, ArrowRight, Search, Joystick, ChevronDown, Star, MessageCircle } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/format';

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Digunakan', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

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
  const typeCounts = { PS5: 0, PS4: 0, PC: 0 };
  devices.forEach((d) => { if (typeCounts[d.device_type?.name] !== undefined) typeCounts[d.device_type?.name]++; });

  const availableCount = devices.filter((d) => d.status === 'available').length;
  const occupiedCount = devices.filter((d) => d.status === 'occupied').length;
  const occupancyPct = devices.length ? Math.round((occupiedCount / devices.length) * 100) : 0;
  const cheapestPrice = devices.length ? Math.min(...devices.map((d) => Number(d.price_per_hour))) : 0;
  const typesAvailable = Object.values(typeCounts).filter((c) => c > 0).length;

  return (
    <PublicLayout>
      {/* ── HEADER (tetap seperti sebelumnya) ── */}
      <section
        className="relative overflow-hidden min-h-[420px] flex items-center"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-cust-bg/60" />
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

      {/* ── TELEMETRY STRIP — data asli ── */}
      <section className="border-b border-cust-border bg-cust-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-cust-border">
          <div className="pr-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Total Stasiun</p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{devices.length}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">{typesAvailable} Tipe Device</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Status Ready</p>
            <p className="font-display font-black text-green-400 text-3xl">{availableCount}</p>
            <p className="font-mono-tech text-green-400/70 text-[10px] mt-1">Okupansi {occupancyPct}%</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Sesi Aktif</p>
            <p className="font-display font-black text-cust-red text-3xl">{occupiedCount}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Update real-time</p>
          </div>
          <div className="pl-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Harga Mulai</p>
            <p className="font-display font-black text-cust-text-primary text-3xl">Rp{Math.round(cheapestPrice / 1000)}K</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Per Jam</p>
          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-cust-border">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => {
              const active = activeFilter === f;
              const Icon = f === 'PC' ? Monitor : f === 'All' ? Joystick : Gamepad2;
              const count = f === 'All' ? devices.length : typeCounts[f];
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase transition ${
                    active
                      ? 'bg-cust-red text-white shadow-lg shadow-cust-red/20'
                      : 'bg-cust-elevated border border-cust-border text-cust-text-secondary hover:border-cust-red hover:text-cust-text-primary'
                  }`}
                >
                  <Icon size={14} />
                  {f === 'All' ? 'Semua Device' : f}
                  <span className={`font-mono-tech text-[10px] ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cust-text-secondary" />
              <input
                type="text"
                placeholder="Cari kode device..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-cust-elevated border border-cust-border text-cust-text-primary text-sm pl-10 pr-4 py-2.5 outline-none focus:border-cust-red transition"
              />
            </div>
            <span className="hidden lg:block font-mono-tech text-cust-text-secondary text-[10px] uppercase whitespace-nowrap">
              Menampilkan {devices.length} station
            </span>
          </div>
        </div>
      </section>

      {/* ── GRID DEVICE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        ) : devices.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-cust-border">
            <p className="text-cust-text-secondary text-sm">Tidak ada device yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {devices.map((device) => {
              const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
              const isAvailable = device.status === 'available';
              const isOccupied = device.status === 'occupied';
              const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
              const isExpanded = expandedId === device.id;
              const hasGames = device.games?.length > 0;
              const hasRating = device.ratings_count > 0;

              return (
                <div
                  key={device.id}
                  className={`bg-cust-elevated border overflow-hidden transition ${
                    isAvailable ? 'border-cust-border hover:border-cust-red' : 'border-cust-border opacity-80'
                  }`}
                >
                  {/* Foto */}
                  <div className={`relative h-48 bg-cust-bg overflow-hidden ${!isAvailable ? 'grayscale' : ''}`}>
                    {device.photo ? (
                      <img src={resolveImageUrl(device.photo)} alt={device.code} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon size={40} className="text-cust-text-secondary opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-mono-tech bg-black/80 backdrop-blur-sm text-cust-text-primary text-[10px] font-bold px-2.5 py-1">{device.code}</span>
                      <span className={`flex items-center gap-1.5 backdrop-blur-sm text-[10px] font-bold uppercase px-2.5 py-1 ${
                        isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-black/80 text-cust-text-secondary'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="bg-cust-elevated/90 backdrop-blur-sm text-cust-text-primary text-xs font-bold uppercase px-2.5 py-1">
                        {device.device_type?.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Spek / Deskripsi (data asli dari admin) */}
                    <div className="bg-cust-bg border border-cust-border p-3 mb-3">
                      <p className="font-mono-tech text-cust-text-secondary text-xs leading-relaxed">
                        {device.description || 'Deskripsi belum ditambahkan admin.'}
                      </p>
                    </div>

                    {/* Rating asli ATAU Estimasi Selesai (kalau occupied) */}
                    {isOccupied && device.estimated_free_at ? (
                      <div className="bg-cust-red/10 border border-cust-red/25 px-3 py-2 mb-3 flex items-center justify-between">
                        <span className="text-cust-text-secondary text-xs">Estimasi Selesai</span>
                        <span className="font-mono-tech text-cust-red text-xs font-bold">{formatTime(device.estimated_free_at)} WIB</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-3">
                        {hasRating ? (
                          <div className="flex items-center gap-1.5">
                            <Star size={13} className="text-cust-red" fill="currentColor" />
                            <span className="text-cust-text-primary text-sm font-bold">{device.rating_avg}</span>
                            <span className="text-cust-text-secondary text-xs">({device.ratings_count} ulasan)</span>
                          </div>
                        ) : (
                          <span className="text-cust-text-secondary text-xs flex items-center gap-1.5">
                            <MessageCircle size={12} /> Belum ada ulasan
                          </span>
                        )}
                      </div>
                    )}

                    {/* Toggle Game List */}
                    <button
                      onClick={() => hasGames && toggleExpand(device.id)}
                      disabled={!hasGames}
                      className="w-full flex items-center justify-between bg-cust-bg border border-cust-border px-3 py-2.5 mb-4 disabled:cursor-default"
                    >
                      <span className="text-cust-text-secondary text-xs font-medium">{hasGames ? `${device.games.length} Game Terpasang` : 'Belum ada game terpasang'}</span>
                      {hasGames && <ChevronDown size={14} className={`text-cust-text-secondary transition-transform ${isExpanded ? 'rotate-180 text-cust-red' : ''}`} />}
                    </button>

                    {isExpanded && hasGames && (
                      <div className="bg-cust-bg border border-cust-border p-3 mb-4 max-h-36 overflow-y-auto flex flex-col gap-1.5">
                        {device.games.map((game) => (
                          <div key={game.id} className="flex items-center gap-2 text-xs text-cust-text-secondary">
                            <Joystick size={11} className="text-cust-red shrink-0" />
                            {game.name}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Harga + Tombol */}
                    <div className="flex items-center justify-between pt-4 border-t border-cust-border">
                      <div>
                        <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">Tarif Sewa</p>
                        <p className={`font-display font-black text-lg ${isAvailable ? 'text-cust-text-primary' : 'text-cust-text-secondary line-through'}`}>
                          Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-cust-text-secondary text-xs font-normal">/jam</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleBooking(device)}
                        disabled={!isAvailable}
                        className="flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark disabled:bg-cust-border disabled:text-cust-text-secondary disabled:cursor-not-allowed text-white font-bold uppercase text-xs px-5 py-3 transition"
                      >
                        {isAvailable ? (<>Pilih Device <ArrowRight size={13} /></>) : 'Tidak Tersedia'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BANNER BANTUAN ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-cust-elevated border border-cust-border p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cust-red/15 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-cust-red" />
            </div>
            <div>
              <p className="text-cust-text-primary font-black uppercase text-base mb-1">Butuh Reservasi Khusus / Grup?</p>
              <p className="text-cust-text-secondary text-sm">Hubungi operator kami via WhatsApp untuk booking grup atau kebutuhan lainnya.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-cust-bg border border-cust-border hover:border-cust-red text-cust-text-primary font-bold text-sm px-6 py-3.5 transition whitespace-nowrap"
          >
            WhatsApp Admin: +62 812-3456-7890
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}