import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Joystick, Gamepad2, Monitor, ArrowRight, MessageCircle,
  Layers, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';
import Skeleton from '../../components/common/Skeleton';
import { publicService } from '../../api/publicService';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_BADGE = {
  PS5: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  PS4: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  PC: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

const STATUS_CONFIG = {
  available: {
    label: 'Ready to Play',
    badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  occupied: {
    label: 'Sedang Main',
    badgeClass: 'bg-red-950/40 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
  },
  booked: {
    label: 'Dipesan',
    badgeClass: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  maintenance: {
    label: 'Maintenance',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
    dot: 'bg-zinc-500',
  },
};

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicService.getGameById(id).then(({ data }) => {
      setGame(data.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Skeleton className="h-10 w-44 rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <Skeleton className="aspect-[3/4.2] w-full rounded-3xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-14 w-3/4 rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!game) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center">
          <Joystick size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="font-display font-black text-white text-3xl uppercase mb-2">Game Tidak Ditemukan</h2>
          <p className="text-cust-text-secondary text-sm max-w-sm mx-auto mb-6">
            Data judul game dengan ID #{id} tidak tersedia di database arena.
          </p>
          <Link
            to="/browse-games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const availableCount = game.devices?.filter((d) => d.status === 'available').length || 0;

  return (
    <PublicLayout>
      {/* ── CINEMATIC AMBIENT WRAPPER ── */}
      <div className="relative overflow-hidden bg-[#070709] border-b border-white/[0.06]">
        
        {/* Ambient Glow dari Poster Game */}
        {game.cover_image && (
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] pointer-events-none opacity-20 blur-[140px] overflow-hidden -z-0">
            <img
              src={resolveImageUrl(game.cover_image)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/50 via-[#070709]/90 to-[#070709]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          
          {/* Top Breadcrumb Nav */}
          <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 bg-[#0c0c0f] hover:bg-white/[0.08] border border-white/[0.1] px-4 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase text-white/90 transition shadow-lg"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Katalog</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-white/40">
              <span>VAULT ID</span>
              <span className="text-white/20">/</span>
              <span className="text-cust-red font-bold">#{game.id}</span>
            </div>
          </div>

          {/* Main Grid: Poster Left & Overview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Game Poster & Telemetry Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Poster Frame */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[3/4.2] rounded-3xl overflow-hidden border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#121216] group"
              >
                {game.cover_image ? (
                  <img
                    src={resolveImageUrl(game.cover_image)}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#111116]">
                    <Joystick size={52} className="text-white/20" />
                    <span className="text-xs font-mono-tech text-white/40 uppercase">Elysium Vault Archive</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Floating Platform Pills Top Right */}
                <div className="absolute top-4 right-4 flex flex-wrap gap-1.5 justify-end">
                  {game.platforms?.map((p) => (
                    <span
                      key={p}
                      className={`text-[10px] font-mono-tech font-bold uppercase px-3 py-1 rounded-lg border backdrop-blur-md shadow-md ${PLATFORM_BADGE[p] || 'bg-white/10 text-white border-white/20'}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Bottom Watermark Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-white/70 uppercase tracking-widest bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                    Verified Release
                  </span>
                </div>
              </motion.div>

              {/* Quick Telemetry Box */}
              <div className="bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/[0.06]">
                  <Layers size={14} className="text-cust-red" />
                  <p className="font-mono-tech text-xs font-bold text-white uppercase tracking-wider">
                    Distribusi Perangkat
                  </p>
                </div>

                <div className="space-y-3.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Total Station</span>
                    <span className="font-bold text-white text-sm">{game.devices?.length || 0} Unit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Station Ready</span>
                    <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {availableCount} Unit Siap Main
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Dukungan Platform</span>
                    <span className="font-bold text-white">{game.platforms?.join(' · ') || '-'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Title, Overview & Available Stations */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Game Title Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cust-red/10 border border-cust-red/25 text-cust-red text-[11px] font-mono-tech font-bold uppercase tracking-wider mb-4">
                  <Sparkles size={12} />
                  <span>Katalog Game Unggulan</span>
                </div>

                <h1 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight leading-none mb-4">
                  {game.name}
                </h1>

                <p className="font-mono-tech text-xs text-white/50 uppercase tracking-widest">
                  Tersedia di {game.devices?.length || 0} Station Gaming · Siap Main Langsung
                </p>
              </div>

              {/* Game Description */}
              {game.description && (
                <div className="bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-7 shadow-xl">
                  <h3 className="font-display font-bold text-white text-lg uppercase mb-3 tracking-wide">
                    Sinopsis & Gameplay
                  </h3>
                  <p className="text-cust-text-secondary text-sm sm:text-base leading-relaxed font-normal">
                    {game.description}
                  </p>
                </div>
              )}

              {/* Available Station Deployment List */}
              <div className="bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-7 shadow-xl">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-white/[0.06]">
                  <div>
                    <h2 className="font-display font-black text-white text-2xl uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cust-red" />
                      <span>Stasiun yang Menginstal Game Ini</span>
                    </h2>
                    <p className="text-white/40 text-xs font-mono-tech mt-1">
                      Pilih stasiun di bawah untuk langsung memesan slot bermain.
                    </p>
                  </div>

                  <span className="text-xs font-mono-tech px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-emerald-400 font-bold self-start sm:self-auto">
                    {availableCount} Unit Kosong Saat Ini
                  </span>
                </div>

                {/* Stations Grid */}
                {(!game.devices || game.devices.length === 0) ? (
                  <div className="text-center py-12 border border-dashed border-white/[0.1] rounded-2xl">
                    <p className="text-cust-text-secondary text-sm font-mono-tech">
                      Game ini sedang belum terpasang di station aktif.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {game.devices.map((device) => {
                      const status = STATUS_CONFIG[device.status] || STATUS_CONFIG.available;
                      const isAvailable = device.status === 'available';
                      const isOccupied = device.status === 'occupied';
                      const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;

                      return (
                        <div
                          key={device.id}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                            isAvailable
                              ? 'bg-black/50 border-white/[0.08] hover:border-cust-red/40 hover:shadow-[0_4px_20px_rgba(227,30,36,0.15)]'
                              : 'bg-black/30 border-white/[0.04] opacity-80'
                          }`}
                        >
                          {/* Station Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/70 shrink-0">
                                <TypeIcon size={18} />
                              </div>
                              <div>
                                <h4 className="font-display font-black text-white text-lg uppercase leading-none">
                                  {device.code}
                                </h4>
                                <span className="font-mono-tech text-[10px] text-white/50 uppercase">
                                  {device.device_type?.name} RIG
                                </span>
                              </div>
                            </div>

                            <span className={`flex items-center gap-1.5 text-[10px] font-mono-tech font-bold uppercase px-2.5 py-1 rounded-lg border ${status.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              <span>{status.label}</span>
                            </span>
                          </div>

                          {/* Occupancy or Price */}
                          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                            {isOccupied && device.estimated_free_at ? (
                              <div>
                                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Estimasi Selesai</p>
                                <p className="text-xs font-mono-tech font-bold text-cust-red">
                                  {formatTime(device.estimated_free_at)} WIB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Tarif Sewa</p>
                                <p className="font-display font-black text-white text-lg">
                                  Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-xs text-white/50 font-sans font-normal">/jam</span>
                                </p>
                              </div>
                            )}

                            <Link
                              to="/browse-devices"
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all ${
                                isAvailable
                                  ? 'bg-cust-red hover:bg-cust-red-dark text-white shadow-[0_0_15px_rgba(227,30,36,0.3)]'
                                  : 'bg-white/[0.04] text-white/30 pointer-events-none'
                              }`}
                            >
                              <span>{isAvailable ? 'Pilih Unit' : 'In-Use'}</span>
                              {isAvailable && <ArrowRight size={12} />}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* ── BANNER REQUEST GAME ── */}
          <div className="mt-14 bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cust-red/10 border border-cust-red/25 flex items-center justify-center text-cust-red shrink-0 shadow-[0_0_20px_rgba(227,30,36,0.2)]">
                <MessageCircle size={26} />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-1">
                  Ingin Game Ini Ditambahkan ke Stasiun Lain?
                </h3>
                <p className="text-cust-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl font-mono-tech">
                  Beri tahu kami station atau platform mana yang kamu inginkan untuk menginstal game ini.
                </p>
              </div>
            </div>

            <Link
              to="/feedback"
              className="shrink-0 relative z-10 px-7 py-3.5 bg-white/[0.04] hover:bg-cust-red border border-white/[0.1] hover:border-transparent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech"
            >
              Kirim Request ke Admin
            </Link>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}