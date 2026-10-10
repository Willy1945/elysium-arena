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
  PS5: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  PS4: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  PC: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
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
      {/* ── HEADER BANNER ── */}
      <section className="relative overflow-hidden py-24 sm:py-28 border-b border-white/[0.06] bg-[#070709]">
        {/* Background Image Poster Game Vault dengan Cinematic Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/gamee.jpeg')" }}
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
              Elysium Vault Archive · Judul Game Terpasang
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase">
              {games.length} Koleksi Aktif
            </span>
          </div>

          <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none">
            KATALOG <span className="text-transparent bg-clip-text bg-gradient-to-r from-cust-red via-red-500 to-amber-500">GAME</span>
          </h1>

          <p className="text-cust-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Koleksi game terpopuler dan terupdate di PlayStation 5, PC Gaming, dan PlayStation 4. Cek ketersediaan judul game favoritmu sebelum melakukan booking stasiun.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP ── */}
      <section className="border-b border-white/[0.06] bg-[#0c0c0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

            <div className="flex items-center gap-4 pt-2 lg:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/60 shrink-0">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">Total Koleksi</p>
                <p className="font-display font-black text-white text-2xl">{games.length} Judul</p>
                <p className="text-[11px] font-mono-tech text-white/60">Semua Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Gamepad2 size={22} />
              </div>
              <div>
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">PlayStation 5</p>
                <p className="font-display font-black text-blue-400 text-2xl">{typeCounts.PS5} Game</p>
                <p className="text-[11px] font-mono-tech text-blue-400/80">Next-Gen AAA Titles</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Cpu size={22} />
              </div>
              <div>
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">PC Gaming</p>
                <p className="font-display font-black text-emerald-400 text-2xl">{typeCounts.PC} Game</p>
                <p className="text-[11px] font-mono-tech text-emerald-500/80">Esports & Competitives</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Gamepad2 size={22} />
              </div>
              <div>
                <p className="text-[10px] font-mono-tech text-white/40 uppercase">PlayStation 4</p>
                <p className="font-display font-black text-sky-400 text-2xl">{typeCounts.PS4} Game</p>
                <p className="text-[11px] font-mono-tech text-sky-400/80">Co-Op & Klasik Lengkap</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH DOCK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#0c0c0f] border border-white/[0.08] rounded-2xl">

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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${active
                    ? 'bg-cust-red text-white shadow-[0_0_20px_rgba(227,30,36,0.35)]'
                    : 'text-cust-text-secondary hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  <Icon size={14} />
                  <span>{f === 'All' ? 'Semua Platform' : `${f}`}</span>
                  <span className={`font-mono-tech text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 p-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Cari judul game..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131317] border border-white/[0.08] rounded-xl text-white text-xs pl-10 pr-4 py-2.5 outline-none focus:border-cust-red transition placeholder:text-white/30 font-mono-tech"
            />
          </div>

        </div>
      </section>

      {/* ── GAME VAULT POSTER GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="rounded-2xl bg-[#0c0c0f] border border-white/[0.06] p-3 space-y-3">
                <Skeleton className="aspect-[3/4.2] w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-24 bg-[#0c0c0f] border border-dashed border-white/[0.1] rounded-3xl">
            <Joystick size={48} className="mx-auto text-white/20 mb-4" />
            <h3 className="font-display font-black text-white text-2xl uppercase mb-2">Game Tidak Ditemukan</h3>
            <p className="text-cust-text-secondary text-sm max-w-sm mx-auto mb-6">
              Tidak ada judul game yang cocok dengan pencarian "{search}".
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearch(''); }}
              className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold uppercase rounded-xl transition font-mono-tech"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to={`/browse-games/${game.id}`}
                  className="group relative flex flex-col h-full bg-[#0c0c0f] border border-white/[0.08] hover:border-cust-red/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(227,30,36,0.2)]"
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[3/4.2] overflow-hidden bg-[#141418]">
                    {game.cover_image ? (
                      <img
                        src={resolveImageUrl(game.cover_image)}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#101014]">
                        <Joystick size={36} className="text-white/20" />
                        <span className="text-[10px] font-mono-tech text-white/30 uppercase">Vault Game</span>
                      </div>
                    )}

                    {/* Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-black/40" />

                    {/* Top Platform Badges */}
                    {game.platforms?.length > 0 && (
                      <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1 justify-end max-w-[85%]">
                        {game.platforms.map((p) => (
                          <span
                            key={p}
                            className={`text-[9px] font-mono-tech font-bold uppercase px-2 py-0.5 rounded-md border backdrop-blur-md ${PLATFORM_BADGE[p] || 'bg-white/10 text-white/80 border-white/20'}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Station Availability Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono-tech font-medium px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
                        <span>{game.devices_count || 0} Station</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <h3 className="font-display font-bold text-white text-base leading-tight uppercase line-clamp-2 group-hover:text-cust-red transition-colors">
                      {game.name}
                    </h3>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono-tech font-bold uppercase tracking-wider text-cust-red">
                      <span className="group-hover:translate-x-0.5 transition-transform">Info & Device</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── BANNER REQUEST GAME ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-[#0c0c0f]">
          {/* Background Image Ruangan Arena */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 pointer-events-none"
            style={{ backgroundImage: "url('/images/hero-gaming-room.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0f] via-[#0c0c0f]/90 to-[#0c0c0f]/80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-cust-red/10 border border-cust-red/25 flex items-center justify-center text-cust-red shrink-0 shadow-[0_0_20px_rgba(227,30,36,0.2)]">
              <MessageCircle size={26} />
            </div>
            <div>
              <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-1">
                Game Favoritmu Belum Tersedia di Arena?
              </h3>
              <p className="text-cust-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl font-mono-tech">
                Kirimkan saran judul game impianmu kepada staf admin. Tim teknis kami akan mengecek dan menginstalnya ke stasiun pilihanmu.
              </p>
            </div>
          </div>

          <Link
            to="/feedback"
            className="shrink-0 relative z-10 px-7 py-3.5 bg-white/[0.04] hover:bg-cust-red border border-white/[0.1] hover:border-transparent text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all font-mono-tech cursor-pointer"
          >
            Request Judul Game
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}