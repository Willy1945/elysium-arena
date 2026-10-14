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
    badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
    glowColor: '',
    borderColor: 'border-zinc-800 hover:border-zinc-700',
  },
  occupied: {
    label: 'Sedang Main',
    badgeClass: 'bg-red-950/40 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
    glowColor: '',
    borderColor: 'border-zinc-800/80',
  },
  booked: {
    label: 'Telah Dibooking',
    badgeClass: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
    glowColor: '',
    borderColor: 'border-zinc-800/80',
  },
  maintenance: {
    label: 'Maintenance',
    badgeClass: 'bg-zinc-900 text-zinc-500 border-zinc-700/40',
    dot: 'bg-zinc-500',
    glowColor: '',
    borderColor: 'border-zinc-800/60',
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
      {/* ── HEADER BANNER ── */}
      <section className="relative overflow-hidden py-24 sm:py-28 border-b border-white/[0.06] bg-[#070709]">
        {/* Background Image dengan Cinematic Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/70 via-transparent to-[#070709] pointer-events-none" />

        {/* Atmosphere Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-15%,rgba(227,30,36,0.25),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech text-white/90 uppercase tracking-widest font-semibold">
              Katalog Gaming Lounge · Sumedang Arena
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase">
              {availableCount} Unit Kosong
            </span>
          </div>

          <h1 className="font-display font-black text-white text-4xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none">
            PILIH GAMING <span className="text-cust-red">STATION</span>
          </h1>

          <p className="text-cust-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Jelajahi rig PlayStation 5 & PC Gaming spek tinggi. Pilih tempat duduk favoritmu dan booking jadwal bermain secara online.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP ── */}
      <section className="border-b border-white/[0.06] bg-[#0c0c0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Layers size={20} className="sm:hidden" />
                <Layers size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Total Stasiun</p>
                <p className="font-display font-black text-white text-xl sm:text-2xl truncate">{devices.length} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-white/60 truncate">PS5 · PC · PS4</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={20} className="sm:hidden" />
                <CheckCircle2 size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Siap Digunakan</p>
                <p className="font-display font-black text-emerald-400 text-xl sm:text-2xl truncate">{availableCount} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-emerald-500/80 truncate">Ready to Play</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-red-950/20 border border-red-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cust-red/10 border border-cust-red/30 flex items-center justify-center text-cust-red shrink-0">
                <Activity size={20} className="sm:hidden" />
                <Activity size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Sedang Digunakan</p>
                <p className="font-display font-black text-cust-red text-xl sm:text-2xl truncate">{occupiedCount} Unit</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-cust-red/80 truncate">{occupancyPct}% Terisi</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap size={20} className="sm:hidden" />
                <Zap size={22} className="hidden sm:block" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Tarif Sewa</p>
                <p className="font-display font-black text-white text-xl sm:text-2xl truncate">
                  Rp{cheapestPrice ? Math.round(cheapestPrice / 1000) : 0}K<span className="text-xs text-white/50 font-sans">/jam</span>
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-white/60 truncate">Tarif Pasti Tanpa Biaya Lain</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH DOCK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#0c0c0f] border border-white/[0.08] rounded-2xl">

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
            {filters.map((f) => {
              const active = activeFilter === f;
              const Icon = f === 'PC' ? Monitor : f === 'All' ? Joystick : Gamepad2;
              const count = f === 'All' ? devices.length : typeCounts[f];
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${active
                    ? 'bg-cust-red text-white shadow-sm'
                    : 'text-cust-text-secondary hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  <Icon size={14} />
                  <span>{f === 'All' ? 'Semua Platform' : f}</span>
                  <span className={`font-mono-tech text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72 p-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Cari kode unit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131317] border border-white/[0.08] rounded-xl text-white text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red transition placeholder:text-white/30 font-mono-tech"
            />
          </div>

        </div>
      </section>

      {/* ── FULL-BLEED IMMERSIVE GRID (CLEAN & MINIMALIST) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[480px] rounded-3xl bg-white/[0.03] animate-pulse p-6 flex flex-col justify-between">
                <div className="flex justify-between"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-28" /></div>
                <div className="space-y-3"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              </div>
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-24 bg-[#0c0c0f] border border-dashed border-white/[0.1] rounded-3xl">
            <Gamepad2 size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="font-display font-black text-white text-2xl uppercase mb-2">Tidak Ada Stasiun Ditemukan</h3>
            <p className="text-cust-text-secondary text-sm max-w-sm mx-auto mb-6">
              Tidak ada perangkat yang cocok dengan kueri "{search}".
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearch(''); }}
              className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold uppercase rounded-xl transition font-mono-tech"
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
                <motion.div
                  key={device.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={`relative min-h-[480px] rounded-3xl overflow-hidden border ${status.borderColor} ${status.glowColor} transition-all duration-500 shadow-2xl flex flex-col justify-between group bg-[#09090c]`}
                >
                  {/* FULL-BLEED BACKGROUND IMAGE WITH SLOW ZOOM */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {device.photo ? (
                      <img
                        src={resolveImageUrl(device.photo)}
                        alt={device.code}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#121217] via-[#09090c] to-black flex items-center justify-center">
                        <TypeIcon size={80} className="text-white/10" />
                      </div>
                    )}

                    {/* VIGNETTE GRADIENTS (Menjamin keterbacaan teks 100%) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/90 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent h-40" />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  {/* ── TOP FLOATING HEADER ── */}
                  <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">

                    {/* Unit Code Pill */}
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/15 px-3 sm:px-3.5 py-1.5 rounded-2xl shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-cust-red" />
                      <span className="font-display font-black text-white text-sm sm:text-base tracking-wider uppercase">
                        {device.code}
                      </span>
                    </div>

                    {/* Glowing Status Pill */}
                    <div className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl border backdrop-blur-xl ${status.badgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                      <span className="text-[10px] sm:text-[11px] font-mono-tech font-bold uppercase tracking-wider">
                        {status.label}
                      </span>
                    </div>

                  </div>

                  {/* ── BOTTOM FROSTED GLASS DOSSIER ── */}
                  <div className="relative z-10 p-4 sm:p-6 pt-0">

                    {/* Title & Platform Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-display font-black text-white text-3xl uppercase tracking-tight leading-none drop-shadow-md">
                          {device.code}
                        </h3>
                        <span className="text-[11px] font-mono-tech uppercase font-bold text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          {device.device_type?.name}
                        </span>
                      </div>
                    </div>

                    {/* Description Glass Box */}
                    <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.08] mb-3.5">
                      <p className="text-white/80 text-xs font-mono-tech leading-relaxed line-clamp-2">
                        {device.description || 'Stasiun standar spesifikasi gaming arena.'}
                      </p>
                    </div>

                    {/* Occupancy Timer: Hanya muncul jika stasiun sedang dipakai */}
                    {isOccupied && device.estimated_free_at && (
                      <div className="p-3 rounded-2xl bg-cust-red/20 backdrop-blur-xl border border-cust-red/40 flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2 text-red-300 text-xs">
                          <Activity size={14} className="text-cust-red animate-pulse" />
                          <span className="font-mono-tech font-bold uppercase text-[11px]">Sedang Bermain</span>
                        </div>
                        <span className="font-mono-tech text-white font-bold text-xs">
                          Selesai: {formatTime(device.estimated_free_at)} WIB
                        </span>
                      </div>
                    )}

                    {/* Expandable Game Catalog Drawer */}
                    <div className="mb-4">
                      <button
                        onClick={() => hasGames && toggleExpand(device.id)}
                        disabled={!hasGames}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/[0.08] transition text-xs disabled:opacity-50"
                      >
                        <span className="font-mono-tech text-white/80 flex items-center gap-2">
                          <Joystick size={14} className="text-cust-red" />
                          <span>{hasGames ? `${device.games.length} Game Terpasang` : 'Belum Ada Game'}</span>
                        </span>
                        {hasGames && (
                          <ChevronDown
                            size={14}
                            className={`text-white/60 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-cust-red' : ''}`}
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
                            <div className="p-3 mt-2 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/10 max-h-36 overflow-y-auto space-y-1.5">
                              {device.games.map((g) => (
                                <div key={g.id} className="flex items-center gap-2 text-[11px] text-white/80 font-mono-tech">
                                  <span className="w-1.5 h-1.5 bg-cust-red rounded-full shrink-0" />
                                  <span className="truncate">{g.name}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Pricing & Booking Action */}
                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono-tech text-white/40 uppercase">Tarif Sewa</p>
                        <p className={`font-display font-black text-2xl ${isAvailable ? 'text-white' : 'text-white/40 line-through'}`}>
                          Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-xs text-white/50 font-sans">/jam</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleBooking(device)}
                        disabled={!isAvailable}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all font-mono-tech ${isAvailable
                          ? 'bg-cust-red hover:bg-cust-red-dark text-white shadow-[0_0_25px_rgba(227,30,36,0.45)] hover:shadow-[0_0_35px_rgba(227,30,36,0.65)] hover:scale-[1.02]'
                          : 'bg-white/[0.05] text-white/30 border border-white/[0.08] cursor-not-allowed'
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

                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BANNER BANTUAN / GRUP BOOKING ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-[#0c0c0f]">
          {/* Background Image Device Room */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
            style={{ backgroundImage: "url('/images/device-room.jpeg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0f] via-[#0c0c0f]/90 to-[#0c0c0f]/80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-cust-red/10 border border-cust-red/25 flex items-center justify-center text-cust-red shrink-0 shadow-[0_0_20px_rgba(227,30,36,0.2)]">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-1">
                Reservasi Khusus Turnamen atau Sesi Tim?
              </h3>
              <p className="text-cust-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
                Booking seluruh baris station untuk latihan tim esports, mini turnamen, atau acara komunitas dengan diskon grup.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-white/[0.04] hover:bg-cust-red border border-white/[0.1] hover:border-transparent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech cursor-pointer"
          >
            Hubungi Pengelola Arena
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}