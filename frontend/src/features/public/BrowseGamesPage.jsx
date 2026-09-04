import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Joystick, Search, ArrowRight, Gamepad2, Monitor } from 'lucide-react';
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

    const filters = ['All', 'PS5', 'PS4', 'PC'];

    return (
        <PublicLayout>
            {/* ── HEADER ── */}
            <section
                className="relative overflow-hidden min-h-[420px] flex items-center"
                style={{ backgroundImage: "url('/images/gamee.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-cust-bg/75" />
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
                                    className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase transition ${active
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
                            placeholder="Cari judul game..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm pl-10 pr-4 py-3 outline-none focus:border-cust-red transition"
                        />
                    </div>
                </div>
            </section>

            {/* ── GRID GAME ── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                {loading ? (
                    <p className="text-cust-text-secondary text-sm">Memuat data...</p>
                ) : filteredGames.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-cust-border">
                        <p className="text-cust-text-secondary text-sm">Tidak ada game yang cocok dengan pencarian.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                        {filteredGames.map((game) => (
                            <Link
                                key={game.id}
                                to={`/browse-games/${game.id}`}
                                className="group relative aspect-[3/4] bg-cust-elevated border border-cust-border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cust-red hover:shadow-2xl hover:shadow-cust-red/20"
                            >
                                {game.cover_image ? (
                                    <img
                                        src={resolveImageUrl(game.cover_image)}
                                        alt={game.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Joystick size={36} className="text-cust-text-secondary opacity-30" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:via-black/70 transition-all" />

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

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-black uppercase text-sm leading-tight mb-2 line-clamp-2">{game.name}</h3>
                                    <span className="flex items-center gap-1 text-cust-red text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        Lihat Detail <ArrowRight size={11} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}