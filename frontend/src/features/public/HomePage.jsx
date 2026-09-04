import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Monitor, DollarSign, ThumbsUp, ShieldCheck, ArrowRight, Cpu, ChevronLeft, ChevronRight, UserPlus, CalendarCheck, Joystick } from 'lucide-react';
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
    gameScrollRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });
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
      <section className="relative overflow-hidden min-h-[560px] flex items-center">
        <img
          src="/images/hero-gaming-room.jpg"
          alt="Gaming Setup Elysium Arena"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cust-bg via-cust-bg/85 to-cust-bg/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-cust-bg via-transparent to-transparent z-10" />
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-3">Selamat Datang di Elysium Arena</p>
          <h1 className="text-cust-text-primary font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight mb-5">
            Solusi Gaming <span className="text-cust-red">Tanpa Antri</span>
          </h1>
          <p className="text-cust-text-secondary text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            PS5, PS4, dan PC gaming spek tinggi. Booking slot waktu online, datang, langsung main. Cek ketersediaan device secara real-time sebelum berangkat.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/browse-devices"
              className="flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm px-7 py-4 transition"
            >
              Booking Sekarang <ArrowRight size={16} />
            </Link>
            <Link
              to="/browse-games"
              className="flex items-center gap-2 border border-cust-border text-cust-text-primary font-bold uppercase text-sm px-7 py-4 hover:border-cust-red transition"
            >
              Lihat Katalog Game
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 FITUR ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Kenapa Elysium Arena</p>
          <h2 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase">Semua yang Kamu Butuhkan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: DollarSign, title: 'Harga Transparan', desc: 'Tarif per jam jelas, dihitung otomatis, tidak ada biaya tersembunyi.' },
            { icon: ThumbsUp, title: 'Booking Online', desc: 'Pilih slot waktu dari HP, cek ketersediaan real-time sebelum datang.' },
            { icon: Monitor, title: 'Device Berkualitas', desc: 'PS5, PS4, dan PC gaming spek tinggi, terawat dan siap main.' },
          ].map((f) => (
            <div key={f.title} className="bg-cust-elevated border border-cust-border p-7">
              <div className="w-12 h-12 rounded-full bg-cust-red flex items-center justify-center mb-5">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-cust-text-primary font-black uppercase text-lg mb-2">{f.title}</h3>
              <p className="text-cust-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORI DEVICE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Pilih Sesuai Selera</p>
          <h2 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase">Kategori Gaming Station</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
              <div className="h-52 overflow-hidden">
                <img
                  src={cat.photo}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-cust-text-primary font-black uppercase text-lg mb-2">{cat.title}</h3>
                <p className="text-cust-text-secondary text-sm leading-relaxed">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATISTIK ── */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <s.icon size={28} className="text-cust-red shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-cust-text-primary font-black text-2xl leading-tight">{s.value}</p>
                <p className="text-cust-text-secondary text-xs uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORI & STATUS DEVICE LIVE ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
          <div>
            <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Status Real-time</p>
            <h2 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase">Gaming Station</h2>
          </div>
          <Link to="/browse-devices" className="text-cust-red font-bold text-sm uppercase flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {devices.map((device) => {
              const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
              const isAvailable = device.status === 'available';
              const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;

              return (
                <Link
                  key={device.id}
                  to="/browse-devices"
                  className={`relative bg-cust-elevated border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isAvailable ? 'border-cust-border hover:border-cust-red' : 'border-cust-border opacity-60'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-cust-bg border border-cust-border flex items-center justify-center">
                        <TypeIcon size={22} className="text-cust-text-secondary" />
                      </div>
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 border ${
                        isAvailable ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-cust-border text-cust-text-secondary bg-cust-bg'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-cust-text-primary font-black uppercase text-lg">{device.code}</h3>
                      <span className="text-[10px] font-bold uppercase text-cust-text-secondary border border-cust-border px-2 py-0.5">
                        {device.device_type?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-cust-border">
                      <div>
                        <p className="text-cust-text-secondary text-[10px] uppercase">Tarif</p>
                        <p className={`font-black text-lg ${isAvailable ? 'text-cust-red' : 'text-cust-text-secondary line-through'}`}>
                          Rp {Number(device.price_per_hour).toLocaleString('id-ID')}
                          <span className="text-cust-text-secondary text-xs font-normal">/jam</span>
                        </p>
                      </div>
                      <ArrowRight size={18} className="text-cust-text-secondary group-hover:text-cust-red transition-colors" />
                    </div>
                  </div>
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
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Katalog Game</p>
            <h2 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase mb-3">
              Koleksi Game <span className="text-cust-red">Terlengkap</span>
            </h2>
            <p className="text-cust-text-secondary text-sm max-w-xl mx-auto">
              Ratusan judul game tersedia di PS5, PS4, dan PC. Cek daftar lengkap sebelum booking.
            </p>
          </div>

          {games.length > 0 && (
            <div className="relative">
              <button
                onClick={() => scrollGames(-1)}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-cust-red items-center justify-center transition -translate-x-4"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>

              <div ref={gameScrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2">
                {games.slice(0, 12).map((game) => (
                  <Link
                    key={game.id}
                    to="/browse-games"
                    className="group relative shrink-0 w-64 sm:w-72 h-80 overflow-hidden border border-cust-border hover:border-cust-red transition"
                  >
                    {game.cover_image ? (
                      <img
                        src={resolveImageUrl(game.cover_image)}
                        alt={game.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-cust-elevated flex items-center justify-center">
                        <Gamepad2 size={40} className="text-cust-text-secondary opacity-30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {game.platforms?.length > 0 && (
                      <div className="absolute top-3 right-3 flex gap-1">
                        {game.platforms.map((p) => (
                          <span key={p} className="bg-cust-red text-white text-[10px] font-bold px-1.5 py-0.5">{p}</span>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-black uppercase text-lg leading-tight mb-2">{game.name}</h3>
                      {game.description && (
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-2">{game.description}</p>
                      )}
                      <span className="text-cust-red text-xs font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lihat Detail <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => scrollGames(1)}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-cust-red items-center justify-center transition translate-x-4"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 border border-cust-border text-cust-text-primary font-bold uppercase text-sm px-7 py-3 hover:border-cust-red transition"
            >
              Lihat Semua Game <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

       {/* ── CARA KERJA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-2">Gampang Banget</p>
          <h2 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase">Cara Kerja</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { icon: UserPlus, step: '01', title: 'Daftar Akun', desc: 'Buat akun cuma butuh nama, email, dan password. Kurang dari 2 menit.' },
            { icon: Gamepad2, step: '02', title: 'Pilih Device', desc: 'Cek daftar PS5, PS4, atau PC beserta status ketersediaan real-time.' },
            { icon: CalendarCheck, step: '03', title: 'Booking Slot Waktu', desc: 'Pilih tanggal, jam mulai, dan durasi main. Harga langsung terhitung otomatis.' },
            { icon: Joystick, step: '04', title: 'Datang & Main', desc: 'Datang sesuai jadwal, langsung main tanpa antre atau nunggu device kosong.' },
          ].map((item, idx) => (
            <div key={item.step} className="relative">
              {idx < 3 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-cust-border" />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-cust-elevated border-2 border-cust-red flex items-center justify-center mb-5">
                  <item.icon size={26} className="text-cust-red" />
                </div>
                <span className="text-cust-red font-black text-xs mb-2">{item.step}</span>
                <h3 className="text-cust-text-primary font-black uppercase text-base mb-2">{item.title}</h3>
                <p className="text-cust-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA AKHIR ── */}
      <section>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-cust-text-primary font-black text-3xl sm:text-5xl uppercase leading-tight mb-5">
            Siap Main <span className="text-cust-red">Sekarang?</span>
          </h2>
          <p className="text-cust-text-secondary text-base mb-8">
            Daftar akun, booking slot waktu, dan datang langsung main. Prosesnya cuma butuh 2 menit.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm px-8 py-4 transition"
          >
            Daftar & Booking <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}