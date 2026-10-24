import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Joystick, Search, ArrowRight, Gamepad2, Monitor, MessageCircle,
  Cpu, Layers, Radio
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

export default function BrowseGamesPage() {
  const [games, setGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.platform = activeFilter;
      const { data } = await publicService.getGames(params);
      setGames(data.data);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filteredGames = search
    ? games.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : games;

  const typeCounts = { PS5: 0, PS4: 0, PC: 0 };
  games.forEach((g) => {
    g.platforms?.forEach((p) => {
      if (typeCounts[p] !== undefined) typeCounts[p]++;
    });
  });

  const filters = ['All', 'PS5', 'PC', 'PS4'];

  return (
    <PublicLayout>
      {/* ── HEADER BANNER (CINEMATIC DARK THEME) ── */}
      <section className="relative bg-black text-white overflow-hidden border-b border-zinc-800 -mt-[72px] sm:-mt-[80px] pt-36 sm:pt-44 pb-20 sm:pb-24">
        {/* Full-bleed Background Image with Dark Tint */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-100 pointer-events-none"
          style={{ backgroundImage: "url('/images/gamee.jpeg')" }}
        />
        {/* Gradient scrim for depth and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 pointer-events-none" />
        <div className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] bg-cust-red/15 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 w-[400px] h-[400px] bg-cust-red/10 rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6 shadow-md text-white">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase tracking-widest font-bold text-white/90">
              Elysium Vault Archive · Judul Game Terpasang
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-300 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              {games.length} Koleksi Aktif
            </span>
          </div>

          <h1 className="font-display font-black text-white text-4xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none drop-shadow-md">
            KATALOG <span className="text-cust-red">GAME</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Koleksi game terpopuler dan terupdate di PlayStation 5, PC Gaming, dan PlayStation 4. Cek ketersediaan judul game favoritmu sebelum melakukan booking stasiun.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP ── */}
      <section className="border-b border-zinc-200 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <Layers size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">Total Koleksi</p>
                <p className="font-display font-black text-zinc-950 text-xl sm:text-2xl truncate">{games.length} Judul</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-600 font-semibold truncate">Semua Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-blue-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Gamepad2 size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">PlayStation 5</p>
                <p className="font-display font-black text-blue-700 text-xl sm:text-2xl truncate">{typeCounts.PS5} Game</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-blue-600 font-semibold truncate">Next-Gen AAA</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Cpu size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">PC Gaming</p>
                <p className="font-display font-black text-emerald-800 text-xl sm:text-2xl truncate">{typeCounts.PC} Game</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-emerald-700 font-bold truncate">Esports & High-FPS</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white border border-sky-200 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <Gamepad2 size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold">PlayStation 4</p>
                <p className="font-display font-black text-sky-700 text-xl sm:text-2xl truncate">{typeCounts.PS4} Game</p>
                <p className="text-[10px] sm:text-[11px] font-mono-tech text-sky-600 font-semibold truncate">Co-Op & Klasik</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH DOCK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1">
            {filters.map((f) => {
              const active = activeFilter === f;
              const Icon = f === 'PC' ? Monitor : f === 'All' ? Joystick : Gamepad2;
              const count = f === 'All' ? games.length : typeCounts[f];
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
                  <span>{f === 'All' ? 'Semua Platform' : `${f}`}</span>
                  <span className={`font-mono-tech text-[10px] px-1.5 py-0.5 rounded font-extrabold ${active ? 'bg-black/20 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 p-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari judul game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red focus:bg-white transition placeholder:text-zinc-400 font-mono-tech font-medium shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* ── GAME VAULT POSTER GRID (CLEAN WHITE CARDS WITH SHADOWS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="rounded-2xl bg-white border border-zinc-200 p-2.5 sm:p-3 space-y-3 shadow-xs">
                <Skeleton className="aspect-[3/4.2] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24 bg-white border border-dashed border-zinc-300 rounded-3xl shadow-sm">
            <Joystick size={48} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="font-display font-black text-zinc-950 text-2xl uppercase mb-2">Game Tidak Ditemukan</h3>
            <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6 font-medium">
              Tidak ada judul game yang cocok dengan pencarian "{search}".
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearch(''); }}
              className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase rounded-xl transition font-mono-tech shadow-2xs"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {filteredGames.map((game) => (
              <div key={game.id}>
                <Link
                  to={`/browse-games/${game.id}`}
                  className="group relative flex flex-col h-full bg-white border border-zinc-200/90 hover:border-cust-red/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_6px_18px_-3px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_30px_-5px_rgba(0,0,0,0.1),0_8px_16px_rgba(227,30,36,0.08)] hover:-translate-y-1.5"
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[3/4.2] overflow-hidden bg-zinc-100">
                    {game.cover_image ? (
                      <img
                        src={resolveImageUrl(game.cover_image)}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-100">
                        <Joystick size={36} className="text-zinc-300" />
                        <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold">Vault Game</span>
                      </div>
                    )}

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                    {/* Top Platform Badges */}
                    {game.platforms?.length > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1 justify-end max-w-[85%]">
                        {game.platforms.map((p) => (
                          <span
                            key={p}
                            className={`text-[9px] font-mono-tech font-black uppercase px-2 py-0.5 rounded-md border backdrop-blur-md shadow-xs ${PLATFORM_BADGE[p] || 'bg-white/90 text-zinc-900 border-zinc-200'}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Station Availability Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono-tech font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
                        <span>{game.devices_count || 0} Station</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                    <h3 className="font-display font-black text-zinc-950 text-base leading-tight uppercase line-clamp-2 group-hover:text-cust-red transition-colors">
                      {game.name}
                    </h3>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono-tech font-black uppercase tracking-wider text-cust-red">
                      <span className="group-hover:translate-x-0.5 transition-transform">Info & Device</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── BANNER REQUEST GAME ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.06)] bg-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-xs">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide mb-1">
                Game Favoritmu Belum Tersedia di Arena?
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                Kirimkan saran judul game impianmu kepada staf admin. Tim teknis kami akan mengecek dan menginstalnya ke stasiun pilihanmu.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-zinc-100 hover:bg-cust-red hover:text-white border border-zinc-200 hover:border-transparent text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech shadow-xs hover:shadow-md"
          >
            Request Judul Game
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
