import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Monitor, DollarSign, ThumbsUp, ShieldCheck, ArrowRight, Cpu, ChevronLeft, ChevronRight, UserPlus, CalendarCheck, Joystick, MapPin, Phone, Clock, Quote, Radio, Check } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import StarRating from '../../components/common/StarRating';
import CountUp from '../../components/common/CountUp';
import Reveal from '../../components/common/Reveal';
import { publicService } from '../../api/publicService';
import { resolveImageUrl, timeAgo } from '../../utils/format';

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Dipakai', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

const CATEGORY_META = {
  PS5: {
    photo: '/images/ps5-category.jpg',
    title: 'PlayStation 5',
    desc: 'Grafis next-gen, loading super cepat, DualSense haptic feedback. Pengalaman imersif di layar 4K HDR 120Hz.',
  },
  PS4: {
    photo: '/images/ps4-category.jpg',
    title: 'PlayStation 4',
    desc: 'Koleksi game klasik lengkap, harga lebih hemat per jam. Ideal untuk sesi santai multiplayer co-op.',
  },
  PC: {
    photo: '/images/pc-category.jpg',
    title: 'PC Gaming',
    desc: 'Spek tinggi untuk game kompetitif dan open-world berat, monitor refresh rate tinggi, periferal terawat.',
  },
};

export default function HomePage() {
  const gameScrollRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState({ overall_average: 0, overall_count: 0, reviews: [] });
  const [occupancy, setOccupancy] = useState(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicService.getDevices(),
      publicService.getGames(),
      publicService.getRecentReviews(9),
      publicService.getOccupancyStats(),
    ])
      .then(([devicesRes, gamesRes, reviewsRes, occupancyRes]) => {
        setDevices(devicesRes.data.data);
        setGames(gamesRes.data.data);
        setReviews(reviewsRes.data);
        setOccupancy(occupancyRes.data);
      })
      .catch((err) => console.error('Gagal memuat data publik:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollGames = (direction) => {
    gameScrollRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  const availableCount = devices.filter((d) => d.status === 'available').length;
  const cheapestPrice = devices.length > 0 ? Math.min(...devices.map((d) => Number(d.price_per_hour))) : 0;

  const categories = ['PS5', 'PS4', 'PC']
    .map((type) => {
      const list = devices.filter((d) => d.device_type?.name === type);
      if (list.length === 0) return null;
      const minPrice = Math.min(...list.map((d) => Number(d.price_per_hour)));
      return { type, ...CATEGORY_META[type], minPrice, count: list.length };
    })
    .filter(Boolean);

  const statusCounts = {
    available: devices.filter((d) => d.status === 'available').length,
    occupied: devices.filter((d) => d.status === 'occupied').length,
    booked: devices.filter((d) => d.status === 'booked').length,
    maintenance: devices.filter((d) => d.status === 'maintenance').length,
  };

  const typeCounts = { PS5: 0, PS4: 0, PC: 0 };
  devices.forEach((d) => {
    if (typeCounts[d.device_type?.name] !== undefined) typeCounts[d.device_type?.name]++;
  });

  const groupedByType = ['PC', 'PS5', 'PS4']
    .map((type) => ({ type, list: devices.filter((d) => d.device_type?.name === type) }))
    .filter((g) => g.list.length > 0 && (activeTypeFilter === 'Semua' || activeTypeFilter === g.type));

  const STATUS_PILL = {
    available: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/35', dot: 'bg-green-400' },
    occupied: { text: 'text-cust-red', bg: 'bg-cust-red/10', border: 'border-cust-red/30', dot: 'bg-cust-red' },
    booked: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
    maintenance: { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', dot: 'bg-gray-400' },
  };

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[600px] flex flex-col">
        <img
          src="/images/hero-gaming-room.jpg"
          alt="Gaming Setup Elysium Arena"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cust-bg via-cust-bg/60 to-cust-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-cust-bg via-transparent to-transparent" />

        <div className="relative flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-cust-elevated/80 backdrop-blur-sm border border-cust-border px-4 py-2 mb-6 w-fit">
            <Radio size={13} className="text-cust-red" />
            <span className="text-cust-text-secondary text-xs font-bold uppercase tracking-wide">
              Gaming Center Sumedang — Booking Online 24 Jam
            </span>
          </div>

          <h1 className="font-display font-black text-cust-text-primary text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6 max-w-3xl">
            Solusi Gaming <span className="text-cust-red">Tanpa Antri</span>
          </h1>

          <p className="text-cust-text-secondary text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            PS5, PS4, dan PC gaming spek tinggi. Booking slot waktu dari HP, cek ketersediaan real-time, datang langsung main.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/browse-devices"
              className="flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-sm px-7 py-4 transition"
            >
              Booking Sekarang <ArrowRight size={16} />
            </Link>
            <Link
              to="/browse-games"
              className="flex items-center gap-2 border border-white/20 text-cust-text-primary font-bold text-sm px-7 py-4 hover:border-cust-red transition"
            >
              Lihat Katalog Game
            </Link>
          </div>
        </div>

        {/* Telemetry Strip — data asli, bukan dekorasi */}
        <div className="relative border-t border-white/10 bg-cust-bg/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            <div className="pr-6">
              <p className="text-cust-text-secondary text-xs font-bold uppercase tracking-wider mb-2.5">Station Aktif</p>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <span className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">
                  <CountUp value={availableCount} /> / <CountUp value={devices.length} />
                </span>
              </div>
            </div>
            <div className="px-6">
              <p className="text-cust-text-secondary text-xs font-bold uppercase tracking-wider mb-2.5">Game Tersedia</p>
              <span className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">
                <CountUp value={games.length} suffix="+" />
              </span>
            </div>
            <div className="px-6">
              <p className="text-cust-text-secondary text-xs font-bold uppercase tracking-wider mb-2.5">Mulai Dari</p>
              <span className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">
                Rp{cheapestPrice ? Math.round(cheapestPrice / 1000) : 0}K
              </span>
            </div>
            <div className="pl-6">
              <p className="text-cust-text-secondary text-xs font-bold uppercase tracking-wider mb-2.5">Jam Operasional</p>
              <span className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">10.00-22.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FITUR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-2">Kenapa Memilih Kami</p>
            <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">Dibangun untuk para Gamer</h2>
          </div>
          <p className="text-cust-text-secondary text-sm max-w-sm">
            Tiga hal yang paling menentukan pengalaman main kamu di gaming center manapun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: DollarSign, title: 'Harga Transparan', desc: 'Tarif per jam jelas, dihitung otomatis, tidak ada biaya tersembunyi. Main tenang tanpa kejutan di struk pembayaran.', tag: 'Tanpa biaya tersembunyi' },
            { icon: ThumbsUp, title: 'Booking Online', desc: 'Pilih slot waktu dari HP, cek ketersediaan real-time sebelum datang, tanpa antre di tempat.', tag: 'Booking dari mana saja' },
            { icon: Monitor, title: 'Device Berkualitas', desc: 'PS5, PS4, dan PC gaming spek tinggi, terawat dan siap main. Kontroler selalu dicek rutin.', tag: 'Terawat & siap pakai' },
          ].map((f, idx) => (
            <Reveal key={f.title} delay={idx * 100}>
              <div className="bg-cust-elevated border border-cust-border p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-cust-text-secondary text-xs font-bold">0{idx + 1}</span>
                  <div className="w-10 h-10 bg-cust-red/15 flex items-center justify-center">
                    <f.icon size={18} className="text-cust-red" />
                  </div>
                </div>
                <h3 className="text-cust-text-primary font-black uppercase text-lg mb-3">{f.title}</h3>
                <p className="text-cust-text-secondary text-sm leading-relaxed mb-6 flex-1">{f.desc}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-cust-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-cust-red" />
                  <span className="text-cust-text-secondary text-xs font-medium">{f.tag}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── KATEGORI DEVICE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-2">Pilih Sesuai Selera</p>
            <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl">Kategori Gaming Station</h2>
          </div>
          <Link to="/browse-devices" className="hidden sm:flex text-cust-red font-bold text-sm items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <Reveal key={cat.type} delay={idx * 100}>
              <div className="bg-cust-elevated border border-cust-border overflow-hidden group h-full flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img src={cat.photo} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1.5">
                    {cat.count} Unit Tersedia
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-cust-text-primary font-black uppercase text-lg mb-2">{cat.title}</h3>
                  <p className="text-cust-text-secondary text-sm leading-relaxed mb-5 flex-1">{cat.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-cust-border">
                    <div>
                      <p className="text-cust-text-secondary text-[10px] uppercase">Mulai</p>
                      <p className="text-cust-red font-black text-base">Rp{Math.round(cat.minPrice / 1000)}K<span className="text-cust-text-secondary text-xs font-normal">/jam</span></p>
                    </div>
                    <Link to="/browse-devices" className="text-cust-text-primary text-xs font-bold uppercase flex items-center gap-1 hover:text-cust-red hover:gap-2 transition-all">
                      Pilih Station <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── LIVE MONITORING (GAMING STATION) ── */}
      <section className="bg-cust-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-cust-red" />
                <span className="font-mono-tech text-cust-red text-xs font-bold tracking-widest uppercase">Status Real time</span>
              </div>
              <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl leading-tight mb-3">
                Lihat Apa yang Kosong<br />Sebelum Kamu Berangkat
              </h2>
              <p className="text-cust-text-secondary text-sm max-w-md">
                Station hijau bisa langsung kamu booking untuk slot berikutnya.
              </p>
            </div>

            <div className="bg-cust-bg border border-cust-border rounded-md p-1 flex gap-1 w-fit">
              {['Semua', 'PS5', 'PS4', 'PC'].map((f) => {
                const count = f === 'Semua' ? devices.length : typeCounts[f];
                const active = activeTypeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveTypeFilter(f)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition ${active ? 'bg-cust-text-primary text-cust-bg' : 'text-cust-text-secondary hover:text-cust-text-primary'
                      }`}
                  >
                    {f}
                    <span className={`font-mono-tech text-[10px] ${active ? 'text-cust-bg/60' : 'text-cust-text-secondary/60'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <p className="text-cust-text-secondary text-sm">Memuat data...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Panel Kiri — Peta Status */}
              <div className="lg:col-span-3 bg-cust-bg border border-cust-border rounded-lg p-5">
                <div className="flex flex-wrap items-center gap-4 pb-4 mb-5 border-b border-cust-border">
                  <p className="font-display font-bold text-lg">
                    <span className="text-green-400">{statusCounts.available}</span>
                    <span className="text-cust-text-secondary"> / {devices.length} </span>
                    <span className="text-cust-text-primary">siap dipakai</span>
                  </p>
                  <span className="w-px h-4 bg-cust-border hidden sm:block" />
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: 'Tersedia', color: 'bg-green-400' },
                      { label: 'Dipakai', color: 'bg-cust-red' },
                      { label: 'Dibooking', color: 'bg-amber-400' },
                      { label: 'Perawatan', color: 'bg-gray-400' },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
                        <span className="font-mono-tech text-cust-text-secondary text-[10px] tracking-wide">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {groupedByType.map((group) => (
                    <div key={group.type}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono-tech text-cust-text-secondary text-[10px] font-bold tracking-widest uppercase">{group.type}</span>
                        <span className="flex-1 h-px bg-cust-border" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.list.map((device) => {
                          const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                          return (
                            <Link
                              key={device.id}
                              to="/browse-devices"
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border ${pill.bg} ${pill.border} hover:brightness-125 transition`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />
                              <span className={`font-mono-tech text-xs font-bold ${pill.text}`}>{device.code}</span>
                              {device.status === 'available' && <Check size={12} className={pill.text} />}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel Kanan — Jam Ramai */}
              <div className="lg:col-span-2 bg-cust-bg border border-cust-border rounded-lg p-5 flex flex-col">
                <h3 className="text-cust-text-primary font-bold text-base mb-1">Kapan Sebaiknya Datang</h3>
                <p className="text-cust-text-secondary text-xs mb-6">Rata-rata keterisian per jam, 7 hari terakhir.</p>

                {!occupancy?.has_data ? (
                  <p className="text-cust-text-secondary text-xs">Belum ada cukup data sesi untuk ditampilkan.</p>
                ) : (
                  <>
                    <div className="flex items-end gap-1.5 h-32 mb-2">
                      {occupancy.hourly.map((h) => {
                        const isBusiest = h.hour === occupancy.busiest?.hour;
                        const isQuietest = h.hour === occupancy.quietest?.hour;
                        return (
                          <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5">
                            <div
                              className={`w-full rounded-sm transition-all ${isBusiest ? 'bg-cust-red' : isQuietest ? 'bg-cust-elevated' : 'bg-amber-500/60'
                                }`}
                              style={{ height: `${Math.max(h.bar_pct, 4)}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-1.5 mb-6">
                      {occupancy.hourly.map((h) => (
                        <span key={h.hour} className="flex-1 text-center font-mono-tech text-cust-text-secondary/60 text-[9px]">{h.hour}</span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-cust-border">
                      <div className="flex items-center justify-between">
                        <span className="text-cust-text-secondary text-xs">Paling lengang</span>
                        <span className="font-mono-tech text-green-400 text-xs font-bold">{occupancy.quietest?.hour}:00 · {occupancy.quietest?.occupancy_pct}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-cust-text-secondary text-xs">Paling penuh</span>
                        <span className="font-mono-tech text-cust-red text-xs font-bold">{occupancy.busiest?.hour}:00 · {occupancy.busiest?.occupancy_pct}%</span>
                      </div>
                    </div>

                    <div className="mt-5 pl-3 border-l-2 border-cust-red">
                      <p className="text-cust-text-secondary text-xs leading-relaxed">
                        Datang jam {occupancy.busiest?.hour}:00? Booking dulu — station cenderung penuh di jam itu.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── KATALOG GAME ── */}
      <section
        className="relative overflow-hidden bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
      >
        <div className="absolute inset-0 bg-cust-bg/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-2">Katalog Game</p>
              <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl mb-2">Koleksi Game Terlengkap</h2>
              <p className="text-cust-text-secondary text-sm max-w-md">Berbagai judul game tersedia di PS5, PS4, dan PC. Cek daftar lengkap sebelum booking.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scrollGames(-1)} className="w-10 h-10 border border-cust-border hover:border-cust-red flex items-center justify-center transition">
                <ChevronLeft size={18} className="text-cust-text-primary" />
              </button>
              <button onClick={() => scrollGames(1)} className="w-10 h-10 border border-cust-border hover:border-cust-red flex items-center justify-center transition">
                <ChevronRight size={18} className="text-cust-text-primary" />
              </button>
            </div>
          </div>

          {games.length > 0 && (
            <div ref={gameScrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2">
              {games.slice(0, 12).map((game) => (
                <Link
                  key={game.id}
                  to={`/browse-games/${game.id}`}
                  className="group relative shrink-0 w-48 h-72 overflow-hidden border border-cust-border hover:border-cust-red transition"
                >
                  {game.cover_image ? (
                    <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-cust-elevated flex items-center justify-center">
                      <Gamepad2 size={32} className="text-cust-text-secondary opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-xs leading-tight line-clamp-2">{game.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/browse-games" className="inline-flex items-center gap-2 border border-cust-border text-cust-text-primary font-bold text-sm px-7 py-3.5 hover:border-cust-red transition">
              Lihat Semua Game <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CARA KERJA (centered, connected steps) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-2">Prosesnya Gampang</p>
        <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl mb-3">Empat Langkah Sampai Main</h2>
        <p className="text-cust-text-secondary text-sm max-w-xl mx-auto mb-14">
          Dari daftar akun sampai duduk di depan layar, semuanya bisa selesai dalam hitungan menit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cust-border text-left">
          {[
            { icon: UserPlus, step: '01', title: 'Daftar Akun', desc: 'Nama, email, password. Kurang dari 2 menit.' },
            { icon: Gamepad2, step: '02', title: 'Pilih Device', desc: 'Cek PS5/PS4/PC dan status ketersediaannya.' },
            { icon: CalendarCheck, step: '03', title: 'Booking Slot Waktu', desc: 'Pilih tanggal, jam, durasi. Harga otomatis terhitung.' },
            { icon: Joystick, step: '04', title: 'Datang & Main', desc: 'Sesuai jadwal, langsung main tanpa antre.' },
          ].map((item) => (
            <div key={item.step} className="bg-cust-bg p-7">
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-black text-cust-text-secondary text-2xl">{item.step}</span>
                <div className="w-9 h-9 bg-cust-red/15 flex items-center justify-center">
                  <item.icon size={16} className="text-cust-red" />
                </div>
              </div>
              <h3 className="text-cust-text-primary font-black uppercase text-sm mb-2">{item.title}</h3>
              <p className="text-cust-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOKASI & KONTAK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-2">Kunjungi Kami</p>
        <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl mb-10">Lokasi & Kontak</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-cust-elevated border border-cust-border p-8 flex flex-col">
            <div className="flex items-start gap-4 pb-7 border-b border-cust-border mb-7">
              <div className="w-10 h-10 bg-cust-red/15 flex items-center justify-center shrink-0">
                <MapPin size={17} className="text-cust-red" />
              </div>
              <div>
                <p className="text-cust-text-primary font-bold text-sm mb-1">Alamat</p>
                <p className="text-cust-text-secondary text-sm leading-relaxed">
                  Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara,<br />Kabupaten Sumedang, Jawa Barat 45323
                </p>
                <p className="text-cust-text-secondary text-xs mt-2">Patokan: Dekat pusat kota Sumedang, area parkir aman.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-7 border-b border-cust-border mb-7">
              <div className="w-10 h-10 bg-cust-red/15 flex items-center justify-center shrink-0">
                <Clock size={17} className="text-cust-red" />
              </div>
              <div>
                <p className="text-cust-text-primary font-bold text-sm mb-1">Jam Operasional</p>
                <p className="text-cust-text-secondary text-sm">Setiap Hari, 10:00 - 22:00 WIB</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-cust-red/15 flex items-center justify-center shrink-0">
                <Phone size={17} className="text-cust-red" />
              </div>
              <div>
                <p className="text-cust-text-primary font-bold text-sm mb-1">Kontak Langsung</p>
                <p className="text-cust-text-secondary text-sm">+62 812-3456-7890 (WhatsApp)</p>
              </div>
            </div>
          </div>

          <div className="bg-cust-elevated border border-cust-border overflow-hidden min-h-[300px]">
            <iframe
              title="Lokasi Elysium Arena"
              src="https://www.google.com/maps?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323&output=embed"
              className="w-full h-full min-h-[300px] border-0 grayscale invert-[0.9] contrast-[0.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── ULASAN PEMAIN ── */}
      {reviews.reviews.length > 0 && (
        <section className="bg-black border-t border-cust-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

            {/* HEADER */}
            <Reveal>
              <div className="max-w-2xl mb-10 lg:mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-px bg-cust-red" />
                  <p className="text-cust-red text-[11px] font-bold uppercase tracking-widest">
                    Ulasan pemain
                  </p>
                </div>

                <h2 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.05] tracking-tight">
                  {reviews.overall_average} dari 5, dari{' '}
                  {reviews.overall_count} ulasan terverifikasi
                </h2>

                <p className="text-cust-text-secondary text-sm sm:text-[15px] leading-relaxed mt-4">
                  Hanya pemain yang sesi nya sudah selesai dan dibayar yang bisa
                  memberi rating.
                </p>
              </div>
            </Reveal>

            {/* REVIEW GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">

              {/* FEATURED REVIEW */}
              {reviews.reviews[0] && (
                <Reveal>
                  <div className="h-full min-h-[460px] lg:min-h-[500px] bg-[#0d0d0f] border border-cust-border rounded-md p-7 sm:p-9 lg:p-10 flex flex-col">

                    {/* QUOTE ICON */}
                    <div className="mb-7">
                      <Quote
                        size={38}
                        className="text-cust-red"
                        strokeWidth={2}
                      />
                    </div>

                    {/* COMMENT */}
                    <div className="flex-1">
                      {reviews.reviews[0].comment && (
                        <p className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-[27px] leading-[1.35] tracking-tight max-w-2xl">
                          “{reviews.reviews[0].comment}”
                        </p>
                      )}
                    </div>

                    {/* BOTTOM */}
                    <div className="border-t border-cust-border pt-6 mt-10">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                        {/* USER */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-cust-red/10 border border-cust-red/40 text-cust-red flex items-center justify-center text-xs font-bold shrink-0">
                            {reviews.reviews[0].user_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-white text-xs font-bold">
                              {reviews.reviews[0].user_name}
                            </p>

                            <p className="text-cust-text-secondary text-[10px] mt-1 uppercase tracking-wider">
                              {reviews.reviews[0].device_code || 'DEVICE'}{' '}
                              •{' '}
                              {timeAgo(reviews.reviews[0].created_at)}
                            </p>
                          </div>
                        </div>

                        {/* RATING */}
                        <div className="shrink-0">
                          <StarRating
                            value={reviews.reviews[0].rating}
                            size={15}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* SMALL REVIEWS */}
              <div className="grid grid-rows-3 gap-4">
                {reviews.reviews.slice(1, 4).map((r, idx) => (
                  <Reveal key={r.id} delay={(idx + 1) * 80}>
                    <div className="h-full bg-[#0d0d0f] border border-cust-border rounded-md p-5 sm:p-6 flex flex-col justify-between">

                      {/* CONTENT */}
                      <div>
                        {/* RATING */}
                        <div className="mb-3">
                          <StarRating
                            value={r.rating}
                            size={14}
                          />
                        </div>

                        {/* COMMENT */}
                        {r.comment && (
                          <p className="text-cust-text-secondary text-sm leading-relaxed">
                            {r.comment}
                          </p>
                        )}
                      </div>

                      {/* USER */}
                      <div className="border-t border-cust-border mt-4 pt-4">
                        <div className="flex items-center justify-between gap-4">

                          <p className="text-white text-xs font-bold">
                            {r.user_name}
                          </p>

                          <span className="text-[9px] text-cust-text-secondary uppercase tracking-wider shrink-0">
                            {r.device_code || 'DEVICE'}
                          </span>

                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── CTA AKHIR ── */}
      <section
        className="relative overflow-hidden bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
      >
        <div className="absolute inset-0 bg-cust-bg/60" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <p className="text-cust-red font-bold text-xs uppercase tracking-widest mb-4">Jangan Tunggu Lama</p>
          <h2 className="font-display font-black text-cust-text-primary text-3xl sm:text-5xl leading-tight mb-5">
            Siap Main Sekarang?
          </h2>
          <p className="text-cust-text-secondary text-base mb-10">
            Daftar akun, booking slot waktu, dan datang langsung main. Prosesnya cepat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-sm px-8 py-4 transition btn-press"
            >
              Daftar & Booking <ArrowRight size={16} />
            </Link>
            <Link
              to="/browse-devices"
              className="flex items-center gap-2 border border-cust-border text-cust-text-primary font-bold text-sm px-8 py-4 hover:border-cust-red transition"
            >
              Lihat Device Dulu
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cust-red" />
            <p className="text-cust-text-secondary text-xs">Cukup daftar dengan email</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}