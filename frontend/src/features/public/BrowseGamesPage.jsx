import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Joystick, Search, ArrowRight, Gamepad2, Monitor, MessageCircle, Cpu } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_STYLE = {
  PS5: '#00439c',
  PS4: '#7c8794',
  PC: '#16a34a',
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
    g.platforms?.forEach((p) => { if (typeCounts[p] !== undefined) typeCounts[p]++; });
  });

  const filters = ['All', 'PS5', 'PS4', 'PC'];

  return (
    <PublicLayout>
      {/* ── HEADER (tetap seperti sebelumnya) ── */}
      <section
        className="relative overflow-hidden min-h-[420px] flex items-center"
        style={{ backgroundImage: "url('/images/gamee.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-cust-bg/60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-cust-elevated border border-cust-border px-4 py-2 mb-6 text-xs font-bold uppercase">
            <Link to="/" className="text-cust-text-secondary hover:text-cust-text-primary transition">Beranda</Link>
            <span className="text-cust-text-secondary">›</span>
            <span className="text-cust-red">Game</span>
          </div>

          <h1 className="text-cust-text-primary font-black text-3xl sm:text-5xl uppercase leading-tight mb-2">
            Katalog <span className="text-cust-red">Game</span>
          </h1>
          <div className="w-16 h-1 bg-cust-red mx-auto mb-6" />
          <p className="text-cust-text-secondary text-base max-w-xl mx-auto">
            Ratusan judul tersedia di PS5, PS4, dan PC. Cari game favoritmu sebelum booking.
          </p>
        </div>
      </section>

      {/* ── TELEMETRY STRIP — data asli ── */}
      <section className="border-b border-cust-border bg-cust-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-cust-border">
          <div className="pr-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2">Total Koleksi</p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{games.length}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Judul Game</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Gamepad2 size={11} /> PlayStation 5
            </p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{typeCounts.PS5}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Games</p>
          </div>
          <div className="px-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Gamepad2 size={11} /> PlayStation 4
            </p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{typeCounts.PS4}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Games</p>
          </div>
          <div className="pl-5">
            <p className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu size={11} /> PC Gaming
            </p>
            <p className="font-display font-black text-cust-text-primary text-3xl">{typeCounts.PC}</p>
            <p className="font-mono-tech text-cust-text-secondary text-[10px] mt-1">Games</p>
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
              const count = f === 'All' ? games.length : typeCounts[f];
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
                  {f === 'All' ? 'Semua Game' : f}
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
                placeholder="Cari judul game..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-cust-elevated border border-cust-border text-cust-text-primary text-sm pl-10 pr-4 py-2.5 outline-none focus:border-cust-red transition"
              />
            </div>
            <span className="hidden lg:block font-mono-tech text-cust-text-secondary text-[10px] uppercase whitespace-nowrap">
              {filteredGames.length} judul ditemukan
            </span>
          </div>
        </div>
      </section>

      {/* ── GRID GAME ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-cust-border">
            <p className="text-cust-text-secondary text-sm">Tidak ada game yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                to={`/browse-games/${game.id}`}
                className="group bg-cust-elevated border border-cust-border overflow-hidden hover:border-cust-red transition"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {game.cover_image ? (
                    <img
                      src={resolveImageUrl(game.cover_image)}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-cust-bg flex items-center justify-center">
                      <Joystick size={32} className="text-cust-text-secondary opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  {game.platforms?.length > 0 && (
                    <div className="absolute top-2.5 right-2.5 flex gap-1">
                      {game.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[9px] font-bold text-white px-1.5 py-0.5"
                          style={{ backgroundColor: PLATFORM_STYLE[p] || '#666' }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                    <Gamepad2 size={10} className="text-cust-text-secondary" />
                    <span className="font-mono-tech text-cust-text-secondary text-[9px]">{game.devices_count} Device</span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-cust-text-primary font-black uppercase text-xs leading-tight line-clamp-2 mb-2">{game.name}</h3>
                  <span className="text-cust-red text-[10px] font-bold uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat Detail <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
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
              <p className="text-cust-text-primary font-black uppercase text-base mb-1">Game Favoritmu Belum Ada?</p>
              <p className="text-cust-text-secondary text-sm">Kirim request judul game lewat WhatsApp, kami usahakan tambahkan.</p>
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