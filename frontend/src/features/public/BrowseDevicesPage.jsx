import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gamepad2, Monitor, ArrowRight, Search, Joystick, ChevronDown,
  Activity, CheckCircle2, Layers, Zap, Lock, Radio, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';
import Skeleton from '../../components/common/Skeleton';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/format';

const STATUS_CONFIG = {
  available: {
    label: 'Ready to Play',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
    glowColor: '',
    borderColor: 'border-zinc-200 hover:border-cust-red/60',
  },
  occupied: {
    label: 'Sedang Main',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    dot: 'bg-red-500',
    glowColor: '',
    borderColor: 'border-zinc-200',
  },
  booked: {
    label: 'Telah Dibooking',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
    glowColor: '',
    borderColor: 'border-zinc-200',
  },
  maintenance: {
    label: 'Maintenance',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    dot: 'bg-zinc-500',
    glowColor: '',
    borderColor: 'border-zinc-200',
  },
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

  const filters = ['All', 'PS5', 'PC', 'PS4'];
  const typeCounts = { PS5: 0, PS4: 0, PC: 0 };
  devices.forEach((d) => {
    if (typeCounts[d.device_type?.name] !== undefined) typeCounts[d.device_type?.name]++;
  });

  const availableCount = devices.filter((d) => d.status === 'available').length;
  const occupiedCount = devices.filter((d) => d.status === 'occupied').length;
  const occupancyPct = devices.length ? Math.round((occupiedCount / devices.length) * 100) : 0;
  const cheapestPrice = devices.length ? Math.min(...devices.map((d) => Number(d.price_per_hour))) : 0;

  return (
    <PublicLayout>
      {/* ── HEADER BANNER (CINEMATIC DARK THEME) ── */}
      <section className="relative bg-black text-white overflow-hidden border-b border-zinc-800 -mt-[72px] sm:-mt-[80px] pt-36 sm:pt-44 pb-20 sm:pb-24">
        {/* Full-bleed Background Image with Dark Tint */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-100 pointer-events-none"
          style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
        />
        {/* Gradient scrim for depth and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 pointer-events-none" />
        <div className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] bg-cust-red/15 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 w-[400px] h-[400px] bg-cust-red/10 rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6 shadow-md text-white">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase tracking-widest font-bold text-white/90">
              Katalog Gaming Lounge · Sumedang Arena
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-300 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              {availableCount} Unit Kosong
            </span>
          </div>

          <h1 className="font-display font-black text-white text-4xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none drop-shadow-md">
            PILIH GAMING <span className="text-cust-red">STATION</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Jelajahi rig PlayStation 5 & PC Gaming spek tinggi. Pilih tempat duduk favoritmu dan booking jadwal bermain secara online.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP WITH ELEVATED CARDS ── */}
      <section className="border-b border-zinc-200 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <Layers size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Total Stasiun</p>
                <p className="font-display font-black text-zinc-950 text-xl sm:text-2xl truncate">{devices.length} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-600 font-semibold truncate">PS5 · PC · PS4</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Siap Digunakan</p>
                <p className="font-display font-black text-emerald-800 text-xl sm:text-2xl truncate">{availableCount} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-emerald-700 font-bold truncate">Ready to Play</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-red-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0">
                <Activity size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Sedang Digunakan</p>
                <p className="font-display font-black text-red-700 text-xl sm:text-2xl truncate">{occupiedCount} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-red-600 font-bold truncate">{occupancyPct}% Terisi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Zap size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Tarif Sewa</p>
                <p className="font-display font-black text-zinc-950 text-xl sm:text-2xl truncate">
                  Rp{cheapestPrice ? Math.round(cheapestPrice / 1000) : 0}K<span className="text-xs text-zinc-500 font-sans font-normal">/jam</span>
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-600 font-semibold truncate">Tarif Pasti Tanpa Biaya Lain</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH DOCK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
            {filters.map((f) => {
              const active = activeFilter === f;
              const Icon = f === 'PC' ? Monitor : f === 'All' ? Joystick : Gamepad2;
              const count = f === 'All' ? devices.length : typeCounts[f];
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? 'bg-cust-red text-white shadow-md'
                      : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <Icon size={14} />
                  <span>{f === 'All' ? 'Semua Platform' : f}</span>
                  <span className={`font-mono-tech text-[10px] px-1.5 py-0.5 rounded font-extrabold ${active ? 'bg-black/20 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72 p-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari kode unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-mono-tech font-medium shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* ── IMMERSIVE GRID (CLEAN WHITE CARDS WITH SHADOWS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[480px] rounded-3xl bg-zinc-100 animate-pulse p-6 flex flex-col justify-between border border-zinc-200">
                <div className="flex justify-between"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-28" /></div>
                <div className="space-y-3"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              </div>
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-24 bg-white border border-dashed border-zinc-300 rounded-3xl shadow-sm">
            <Gamepad2 size={48} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="font-display font-black text-zinc-950 text-2xl uppercase mb-2">Tidak Ada Stasiun Ditemukan</h3>
            <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6 font-medium">
              Tidak ada perangkat yang cocok dengan kueri "{search}".
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearch(''); }}
              className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase rounded-xl transition font-mono-tech shadow-2xs"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => {
              const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
              const isAvailable = device.status === 'available';
              const isOccupied = device.status === 'occupied';
              const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
              const isExpanded = expandedId === device.id;
              const hasGames = device.games?.length > 0;

              return (
                <div
                  key={device.id}
                  className={`bg-white border ${status.borderColor} rounded-3xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(227,30,36,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div>
                    {/* Visual Banner Preview */}
                    <div className="relative h-56 overflow-hidden bg-zinc-950 border-b border-zinc-200/80">
                      {device.photo ? (
                        <img
                          src={resolveImageUrl(device.photo)}
                          alt={device.code}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <TypeIcon size={64} className="text-zinc-600" />
                        </div>
                      )}

                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-zinc-200 px-3.5 py-1 rounded-2xl shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-cust-red" />
                          <span className="font-display font-black text-zinc-950 text-sm tracking-wider uppercase">
                            {device.code}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl border backdrop-blur-md shadow-sm ${status.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase tracking-wider">
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-tight">
                          {device.code}
                        </h3>
                        <span className="text-xs font-mono-tech uppercase font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">
                          {device.device_type?.name}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 mb-4">
                        <p className="text-zinc-700 text-xs font-medium leading-relaxed line-clamp-2">
                          {device.description || 'Stasiun standar spesifikasi gaming arena.'}
                        </p>
                      </div>

                      {/* Active Session Warning */}
                      {isOccupied && device.estimated_free_at && (
                        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-red-700 text-xs">
                            <Activity size={14} className="text-cust-red animate-pulse" />
                            <span className="font-mono-tech font-bold uppercase text-[11px]">Sedang Bermain</span>
                          </div>
                          <span className="font-mono-tech text-red-900 font-extrabold text-xs">
                            Selesai: {formatTime(device.estimated_free_at)} WIB
                          </span>
                        </div>
                      )}

                      {/* Game Catalog Drawer */}
                      <div className="mb-2">
                        <button
                          onClick={() => hasGames && toggleExpand(device.id)}
                          disabled={!hasGames}
                          className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition text-xs disabled:opacity-50 font-bold"
                        >
                          <span className="font-mono-tech text-zinc-800 flex items-center gap-2">
                            <Joystick size={14} className="text-cust-red" />
                            <span>{hasGames ? `${device.games.length} Game Terpasang` : 'Belum Ada Game'}</span>
                          </span>
                          {hasGames && (
                            <ChevronDown
                              size={14}
                              className={`text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-cust-red' : ''}`}
                            />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && hasGames && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 mt-2 rounded-2xl bg-zinc-50 border border-zinc-200 max-h-36 overflow-y-auto space-y-1.5 shadow-inner">
                                {device.games.map((g) => (
                                  <div key={g.id} className="flex items-center gap-2 text-[11px] text-zinc-800 font-mono-tech font-semibold">
                                    <span className="w-1.5 h-1.5 bg-cust-red rounded-full shrink-0" />
                                    <span className="truncate">{g.name}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="p-6 pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 bg-zinc-50/60">
                    <div>
                      <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Tarif Sewa</p>
                      <p className={`font-display font-black text-2xl ${isAvailable ? 'text-zinc-950' : 'text-zinc-400 line-through'}`}>
                        Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-xs text-zinc-500 font-sans font-normal">/jam</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleBooking(device)}
                      disabled={!isAvailable}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all font-mono-tech ${
                        isAvailable
                          ? 'bg-cust-red hover:bg-cust-red-dark text-white shadow-[0_4px_16px_rgba(227,30,36,0.35)] hover:shadow-[0_6px_22px_rgba(227,30,36,0.5)] hover:-translate-y-0.5'
                          : 'bg-zinc-200 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <span>Booking Slot</span>
                          <ArrowRight size={13} />
                        </>
                      ) : (
                        <>
                          <Lock size={12} />
                          <span>Sedang Main</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BANNER BANTUAN / GRUP BOOKING ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] bg-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-xs">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide mb-1">
                Reservasi Khusus Turnamen atau Sesi Tim?
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                Booking seluruh baris station untuk latihan tim esports, mini turnamen, atau acara komunitas dengan diskon grup.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-zinc-100 hover:bg-cust-red hover:text-white border border-zinc-200 hover:border-transparent text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech shadow-xs hover:shadow-md"
          >
            Hubungi Pengelola Arena
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
