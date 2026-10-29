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
  PS5: 'bg-blue-50 text-blue-700 border-blue-300',
  PS4: 'bg-sky-50 text-sky-700 border-sky-300',
  PC: 'bg-emerald-50 text-emerald-800 border-emerald-300',
};

const STATUS_CONFIG = {
  available: {
    label: 'Ready to Play',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  occupied: {
    label: 'Sedang Main',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    dot: 'bg-red-500',
  },
  booked: {
    label: 'Dipesan',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
  },
  maintenance: {
    label: 'Maintenance',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300',
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
          <Joystick size={48} className="mx-auto text-zinc-300 mb-4" />
          <h2 className="font-display font-black text-zinc-950 text-3xl uppercase mb-2">Game Tidak Ditemukan</h2>
          <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6 font-medium">
            Data judul game dengan ID #{id} tidak tersedia di database arena.
          </p>
          <Link
            to="/browse-games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
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

      <div className="relative overflow-hidden bg-gradient-to-b from-white via-zinc-50/70 to-white text-zinc-950 border-b border-zinc-200">
        <div className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] bg-cust-red/[0.04] rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

          <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase text-zinc-900 transition shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Katalog</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-500 font-bold">
              <span>VAULT ID</span>
              <span className="text-zinc-300">/</span>
              <span className="text-cust-red font-black">#{game.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <div className="lg:col-span-4 flex flex-col gap-6">

              <div className="relative aspect-[3/4.2] rounded-3xl overflow-hidden border border-zinc-200/90 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] bg-zinc-100 group">
                {game.cover_image ? (
                  <img
                    src={resolveImageUrl(game.cover_image)}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-zinc-100">
                    <Joystick size={52} className="text-zinc-300" />
                    <span className="text-xs font-mono-tech text-zinc-400 uppercase font-bold">Elysium Vault Archive</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-4 right-4 flex flex-wrap gap-1.5 justify-end">
                  {game.platforms?.map((p) => (
                    <span
                      key={p}
                      className={`text-[10px] font-mono-tech font-black uppercase px-3 py-1 rounded-lg border backdrop-blur-md shadow-xs ${PLATFORM_BADGE[p] || 'bg-white/90 text-zinc-900 border-zinc-200'}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-white uppercase tracking-widest bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 font-bold">
                    Verified Release
                  </span>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-zinc-100">
                  <Layers size={14} className="text-cust-red" />
                  <p className="font-mono-tech text-xs font-black text-zinc-950 uppercase tracking-wider">
                    Distribusi Perangkat
                  </p>
                </div>

                <div className="space-y-3.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 font-medium">Total Station</span>
                    <span className="font-black text-zinc-950 text-sm">{game.devices?.length || 0} Unit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 font-medium">Station Ready</span>
                    <span className="font-extrabold text-emerald-800 text-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {availableCount} Unit Siap Main
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-600 font-medium">Dukungan Platform</span>
                    <span className="font-bold text-zinc-900">{game.platforms?.join(' · ') || '-'}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-8 flex flex-col gap-8">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-[11px] font-mono-tech font-bold uppercase tracking-wider mb-4 shadow-2xs">
                  <Sparkles size={12} />
                  <span>Katalog Game Unggulan</span>
                </div>

                <h1 className="font-display font-black text-zinc-950 text-4xl sm:text-6xl uppercase tracking-tight leading-none mb-4">
                  {game.name}
                </h1>

                <p className="font-mono-tech text-xs text-zinc-600 uppercase tracking-widest font-semibold">
                  Tersedia di {game.devices?.length || 0} Station Gaming · Siap Main Langsung
                </p>
              </div>

              {game.description && (
                <div className="bg-white border border-zinc-200 rounded-3xl p-7 shadow-sm">
                  <h3 className="font-display font-black text-zinc-950 text-lg uppercase mb-3 tracking-wide">
                    Sinopsis & Gameplay
                  </h3>
                  <p className="text-zinc-700 text-sm sm:text-base leading-relaxed font-medium">
                    {game.description}
                  </p>
                </div>
              )}

              <div className="bg-white border border-zinc-200 rounded-3xl p-7 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-zinc-100">
                  <div>
                    <h2 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cust-red" />
                      <span>Stasiun yang Menginstal Game Ini</span>
                    </h2>
                    <p className="text-zinc-600 text-xs font-mono-tech mt-1 font-medium">
                      Pilih stasiun di bawah untuk langsung memesan slot bermain.
                    </p>
                  </div>

                  <span className="text-xs font-mono-tech px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-extrabold self-start sm:self-auto shadow-2xs">
                    {availableCount} Unit Kosong Saat Ini
                  </span>
                </div>

                {(!game.devices || game.devices.length === 0) ? (
                  <div className="text-center py-12 border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50">
                    <p className="text-zinc-600 text-sm font-mono-tech font-medium">
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
                              ? 'bg-zinc-50/70 border-zinc-200 hover:bg-white hover:border-cust-red/40 shadow-xs hover:shadow-md'
                              : 'bg-zinc-100/50 border-zinc-200 opacity-80'
                          }`}
                        >

                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0 shadow-2xs">
                                <TypeIcon size={18} />
                              </div>
                              <div>
                                <h4 className="font-display font-black text-zinc-950 text-lg uppercase leading-none">
                                  {device.code}
                                </h4>
                                <span className="font-mono-tech text-[10px] text-zinc-500 uppercase font-bold">
                                  {device.device_type?.name} RIG
                                </span>
                              </div>
                            </div>

                            <span className={`flex items-center gap-1.5 text-[10px] font-mono-tech font-extrabold uppercase px-2.5 py-1 rounded-lg border shadow-2xs ${status.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              <span>{status.label}</span>
                            </span>
                          </div>

                          <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between">
                            {isOccupied && device.estimated_free_at ? (
                              <div>
                                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Estimasi Selesai</p>
                                <p className="text-xs font-mono-tech font-black text-cust-red">
                                  {formatTime(device.estimated_free_at)} WIB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Tarif Sewa</p>
                                <p className="font-display font-black text-zinc-950 text-lg">
                                  Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-xs text-zinc-500 font-sans font-normal">/jam</span>
                                </p>
                              </div>
                            )}

                            <Link
                              to="/browse-devices"
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all ${
                                isAvailable
                                  ? 'bg-cust-red hover:bg-cust-red-dark text-white shadow-xs hover:shadow-md'
                                  : 'bg-zinc-200 text-zinc-400 pointer-events-none'
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

          <div className="mt-14 bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-xs">
                <MessageCircle size={26} />
              </div>
              <div>
                <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide mb-1">
                  Ingin Game Ini Ditambahkan ke Stasiun Lain?
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                  Beri tahu kami station atau platform mana yang kamu inginkan untuk menginstal game ini.
                </p>
              </div>
            </div>

            <Link
              to="/feedback"
              className="shrink-0 relative z-10 px-7 py-3.5 bg-zinc-100 hover:bg-cust-red hover:text-white border border-zinc-200 hover:border-transparent text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech shadow-xs hover:shadow-md"
            >
              Kirim Request ke Admin
            </Link>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
