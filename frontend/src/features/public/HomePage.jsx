import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Monitor, DollarSign, ThumbsUp, ShieldCheck, ArrowRight, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { resolveImageUrl } from '../../utils/format';

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Dipakai', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

export default function HomePage() {
  const gameScrollRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([publicService.getDevices(), publicService.getGames()])
      .then(([devicesRes, gamesRes]) => {
        setDevices(devicesRes.data.data);
        setGames(gamesRes.data.data);
      })
      .catch((err) => {
        console.error('Gagal memuat data publik:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const scrollGames = (direction) => {
    gameScrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  const stats = [
    { icon: Gamepad2, value: `${devices.length}+`, label: 'Total Device' },
    { icon: Cpu, value: `${games.length}+`, label: 'Game Tersedia' },
    { icon: DollarSign, value: '10K', label: 'Mulai Rp/Jam' },
    { icon: ShieldCheck, value: '24/7', label: 'Booking Online' },
  ];

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <img
          src="/images/hero-gaming-room.jpg"
          alt="Gaming Setup Elysium Arena"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cust-bg via-cust-bg/85 to-cust-bg/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-cust-bg via-transparent to-transparent z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <p className="text-cust-red font-bold text-base uppercase tracking-widest mb-5">Selamat Datang di Elysium Arena</p>
          <h1 className="text-cust-text-primary font-black text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.95] mb-8">
            Solusi Gaming <br /><span className="text-cust-red">Tanpa Antre</span>
          </h1>
          <p className="text-cust-text-secondary text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            PS5, PS4, dan PC gaming spek tinggi. Booking slot waktu online, datang, langsung main. Cek ketersediaan device secara real-time sebelum berangkat.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/browse-devices"
              className="flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-base px-9 py-5 transition"
            >
              Booking Sekarang <ArrowRight size={18} />
            </Link>
            <Link
              to="/browse-games"
              className="flex items-center gap-2 border-2 border-cust-border text-cust-text-primary font-bold uppercase text-base px-9 py-5 hover:border-cust-red transition"
            >
              Lihat Katalog Game
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 FITUR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-cust-red font-bold text-base uppercase tracking-widest mb-3">Kenapa Elysium Arena</p>
          <h2 className="text-cust-text-primary font-black text-4xl sm:text-5xl uppercase">Semua yang Kamu Butuhkan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, title: 'Harga Transparan', desc: 'Tarif per jam jelas, dihitung otomatis, tidak ada biaya tersembunyi.' },
            { icon: ThumbsUp, title: 'Booking Online', desc: 'Pilih slot waktu dari HP, cek ketersediaan real-time sebelum datang.' },
            { icon: Monitor, title: 'Device Berkualitas', desc: 'PS5, PS4, dan PC gaming spek tinggi, terawat dan siap main.' },
          ].map((f) => (
            <div key={f.title} className="bg-cust-elevated border border-cust-border p-9">
              <div className="w-14 h-14 rounded-full bg-cust-red flex items-center justify-center mb-6">
                <f.icon size={26} className="text-white" />
              </div>
              <h3 className="text-cust-text-primary font-black uppercase text-xl mb-3">{f.title}</h3>
              <p className="text-cust-text-secondary text-base leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORI DEVICE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-cust-red font-bold text-base uppercase tracking-widest mb-3">Pilih Sesuai Selera</p>
          <h2 className="text-cust-text-primary font-black text-4xl sm:text-5xl uppercase">Kategori Gaming Station</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { photo: '/images/ps5-category.jpg', title: 'PlayStation 5', desc: 'Grafis next-gen, loading super cepat, DualSense haptic.' },
            { photo: '/images/ps4-category.jpg', title: 'PlayStation 4', desc: 'Koleksi game klasik lengkap, harga lebih hemat per jam.' },
            { photo: '/images/pc-category.jpg', title: 'PC Gaming', desc: 'Spek tinggi untuk game kompetitif dan open-world berat.' },
          ].map((cat) => (
            <Link
              key={cat.title}
              to="/browse-devices"
              className="group bg-cust-elevated border border-cust-border overflow-hidden hover:border-cust-red transition"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={cat.photo}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <h3 className="text-cust-text-primary font-black uppercase text-xl mb-2">{cat.title}</h3>
                <p className="text-cust-text-secondary text-base leading-relaxed">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATISTIK ── */}
      <section className="bg-cust-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-2 sm:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <s.icon size={40} className="text-cust-red shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-cust-text-primary font-black text-3xl sm:text-4xl leading-tight">{s.value}</p>
                <p className="text-cust-text-secondary text-sm uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORI & STATUS DEVICE LIVE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-28">
        <div className="flex items-center justify-between mb-14 flex-wrap gap-4">
          <div>
            <p className="text-cust-red font-bold text-base uppercase tracking-widest mb-3">Status Real-time</p>
            <h2 className="text-cust-text-primary font-black text-4xl sm:text-5xl uppercase">Gaming Station</h2>
          </div>
          <Link to="/browse-devices" className="text-cust-red font-bold text-base uppercase flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="text-cust-text-secondary text-base">Memuat data...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {devices.map((device) => {
              const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
              return (
                <Link
                  key={device.id}
                  to="/browse-devices"
                  className="bg-cust-elevated border border-cust-border p-5 hover:border-cust-red transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    {device.device_type?.name === 'PC' ? (
                      <Monitor size={24} className="text-cust-text-secondary" />
                    ) : (
                      <Gamepad2 size={24} className="text-cust-text-secondary" />
                    )}
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-cust-text-secondary">
                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-cust-text-primary font-bold text-base">{device.code}</p>
                  <p className="text-cust-text-secondary text-sm mt-1">Rp {Number(device.price_per_hour).toLocaleString('id-ID')}/jam</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── KATALOG GAME ── */}
      <section
        className="relative overflow-hidden bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
      >
        <div className="absolute inset-0 bg-cust-bg/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28">
          <div className="text-center mb-14">
            <p className="text-cust-red font-bold text-base uppercase tracking-widest mb-3">Katalog Game</p>
            <h2 className="text-cust-text-primary font-black text-4xl sm:text-5xl uppercase mb-4">
              Koleksi Game <span className="text-cust-red">Terlengkap</span>
            </h2>
            <p className="text-cust-text-secondary text-lg max-w-2xl mx-auto">
              Ratusan judul game tersedia di PS5, PS4, dan PC. Cek daftar lengkap sebelum booking.
            </p>
          </div>

          {games.length > 0 && (
            <div className="relative">
              <button
                onClick={() => scrollGames(-1)}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-cust-red items-center justify-center transition -translate-x-5"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>

              <div ref={gameScrollRef} className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-2">
                {games.slice(0, 12).map((game) => (
                  <Link
                    key={game.id}
                    to="/browse-games"
                    className="group relative shrink-0 w-72 sm:w-80 h-96 overflow-hidden border border-cust-border hover:border-cust-red transition"
                  >
                    {game.cover_image ? (
                      <img
                        src={resolveImageUrl(game.cover_image)}
                        alt={game.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-cust-elevated flex items-center justify-center">
                        <Gamepad2 size={44} className="text-cust-text-secondary opacity-30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {game.platforms?.length > 0 && (
                      <div className="absolute top-4 right-4 flex gap-1">
                        {game.platforms.map((p) => (
                          <span key={p} className="bg-cust-red text-white text-xs font-bold px-2 py-1">{p}</span>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-black uppercase text-xl leading-tight mb-2">{game.name}</h3>
                      {game.description && (
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">{game.description}</p>
                      )}
                      <span className="text-cust-red text-sm font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lihat Detail <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => scrollGames(1)}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-cust-red items-center justify-center transition translate-x-5"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 border-2 border-cust-border text-cust-text-primary font-bold uppercase text-base px-9 py-4 hover:border-cust-red transition"
            >
              Lihat Semua Game <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA AKHIR ── */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-32 text-center">
          <h2 className="text-cust-text-primary font-black text-4xl sm:text-6xl uppercase leading-tight mb-6">
            Siap Main <span className="text-cust-red">Sekarang?</span>
          </h2>
          <p className="text-cust-text-secondary text-lg mb-10">
            Daftar akun, booking slot waktu, dan datang langsung main. Prosesnya cuma butuh 2 menit.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-base px-10 py-5 transition"
          >
            Daftar & Booking <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}