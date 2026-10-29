import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Monitor, DollarSign, ArrowRight, Check,
  Quote, Activity, Coffee,
  ShieldCheck, Wifi, Award, Sparkles, UserCheck, Calendar,
  Trophy
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import StarRating from '../../components/common/StarRating';
import CountUp from '../../components/common/CountUp';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl, timeAgo } from '../../utils/format';

const CATEGORY_META = {
  PS5: {
    photo: '/images/ps5-category.jpg',
    title: 'PlayStation 5 Pro Station',
    badge: 'Flagship Console',
    specs: ['Display 4K HDR 120Hz', 'DualSense Wireless Controller', 'Koleksi Game AAA Eksklusif', 'Sofa Ergonomis & Audio Imersif'],
    desc: 'Pengalaman gaming konsol resolusi tinggi tanpa kompromi. Rasakan haptic feedback dan grafis 120 FPS di setiap sesi.',
  },
  PC: {
    photo: '/images/pc-category.jpg',
    title: 'PC Esports Battleground',
    badge: 'High-FPS Tournament',
    specs: ['Monitor Gaming 165Hz - 240Hz', 'Mechanical Keyboard & Pro Mouse', 'Gigabit Dedicated Low-Latency LAN', 'Discord & Voice Chat Ready'],
    desc: 'Dirancang spesifik untuk pemain kompetitif. Frame rate stabil tanpa drop, sensor mouse akurat, dan koneksi bebas lag untuk push rank.',
  },
  PS4: {
    photo: '/images/ps4-category.jpg',
    title: 'PlayStation 4 Lounge',
    badge: 'Casual & Co-Op',
    specs: ['Dual Controller (Bisa Mabar)', '50+ Pilihan Game Klasik & Olahraga', 'Layar Full HD Refresh Cepat', 'Area Santai Nyaman Bersama Teman'],
    desc: 'Pilihan paling hemat untuk nongkrong, turnamen mini FIFA/PES bareng teman, atau menyelesaikan petualangan legendaris.',
  },
};

const STATUS_PILL = {
  available: {
    text: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
    label: 'Tersedia'
  },
  occupied: {
    text: 'text-red-800',
    bg: 'bg-red-50',
    border: 'border-red-300',
    dot: 'bg-red-500',
    label: 'Terpakai'
  },
  booked: {
    text: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    label: 'Dibooking'
  },
  maintenance: {
    text: 'text-zinc-700',
    bg: 'bg-zinc-100',
    border: 'border-zinc-300',
    dot: 'bg-zinc-400',
    label: 'Servis'
  },
};

export default function HomePage() {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [games, setGames] = useState([]);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
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
        setDevices(devicesRes.data.data || []);
        setGames(gamesRes.data.data || []);
        setReviews(reviewsRes.data || { overall_average: 0, overall_count: 0, reviews: [] });
        setOccupancy(occupancyRes.data || null);
      })
      .catch((err) => console.error('Gagal memuat data publik:', err))
      .finally(() => setLoading(false));
  }, []);

  const availableCount = devices.filter((d) => d.status === 'available').length;
  const occupiedCount = devices.filter((d) => d.status === 'occupied').length;
  const cheapestPrice = devices.length > 0 ? Math.min(...devices.map((d) => Number(d.price_per_hour))) : 0;
  const occupancyPercentage = devices.length > 0 ? Math.round(((devices.length - availableCount) / devices.length) * 100) : 0;

  const categories = ['PC', 'PS5', 'PS4']
    .map((type) => {
      const list = devices.filter((d) => d.device_type?.name === type);
      if (list.length === 0) return null;
      const minPrice = Math.min(...list.map((d) => Number(d.price_per_hour)));
      return {
        type,
        ...CATEGORY_META[type],
        minPrice,
        count: list.length,
        readyCount: list.filter((x) => x.status === 'available').length
      };
    })
    .filter(Boolean);

  const typeCounts = { PS5: 0, PS4: 0, PC: 0 };
  devices.forEach((d) => {
    if (typeCounts[d.device_type?.name] !== undefined) typeCounts[d.device_type?.name]++;
  });

  const groupedByType = ['PC', 'PS5', 'PS4']
    .map((type) => ({ type, list: devices.filter((d) => d.device_type?.name === type) }))
    .filter((g) => g.list.length > 0 && (activeTypeFilter === 'Semua' || activeTypeFilter === g.type));

  return (
    <PublicLayout>

      <section className="relative bg-black text-white overflow-hidden border-b border-zinc-800 -mt-[72px] sm:-mt-[80px]">

        <div
          className="absolute inset-0 bg-cover bg-center scale-100 pointer-events-none"
          style={{ backgroundImage: "url('/images/hero-gaming-room.jpg')" }}
        />

        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

        <div className="pointer-events-none absolute -top-40 right-10 w-[550px] h-[550px] bg-cust-red/20 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 left-10 w-[450px] h-[450px] bg-cust-red/15 rounded-full blur-[110px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44 pb-32 lg:pb-40">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-md mb-6 text-xs text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-cust-red animate-pulse" />
              <span className="font-medium tracking-wide">Elysium Gaming Arena • Sumedang</span>
              <span className="text-white/30">|</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {availableCount} Station Ready
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-7xl uppercase tracking-tight leading-[1.05] sm:leading-[0.95] mb-6 text-white drop-shadow-md">
              Elysium Arena, <br />
              <span className="text-cust-red drop-shadow-[0_2px_15px_rgba(227,30,36,0.6)]">Surga Para Gamer.</span>
            </h1>

            <p className="text-zinc-200 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal drop-shadow-sm">
              Pusat hiburan gaming dan café lounge modern di jantung kota Sumedang. Diciptakan sebagai tempat berkumpul terbaik untuk mabar bersama teman, mengasah jiwa kompetitif, serta menikmati waktu luang dengan kenyamanan maksimal dan kemudahan booking online langsung dari ponselmu.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/browse-devices"
                className="inline-flex items-center gap-2.5 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-[0_8px_25px_rgba(227,30,36,0.45)] hover:shadow-[0_12px_32px_rgba(227,30,36,0.6)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Booking Station Sekarang</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Coffee size={16} className="text-amber-400" />
                <span>Lihat Menu Kafe</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 z-20 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          <Link
            to="/browse-games"
            className="group bg-white border border-zinc-200/90 border-b-4 border-b-cust-red hover:border-cust-red/60 hover:border-b-cust-red-dark rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.12),0_10px_15px_-5px_rgba(227,30,36,0.15)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 group-hover:scale-105 shadow-xs transition-transform">
              <Gamepad2 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Koleksi Game</p>
              <h4 className="text-2xl font-display font-black text-zinc-950 uppercase tracking-tight mt-0.5">
                <CountUp value={games.length} suffix="+" /> Judul
              </h4>
              <p className="text-xs text-zinc-600 font-medium mt-1 truncate">AAA, Esports & Co-Op Ready</p>
            </div>
          </Link>

          <Link
            to="/browse-devices"
            className="group bg-white border border-zinc-200/90 border-b-4 border-b-cust-red hover:border-cust-red/60 hover:border-b-cust-red-dark rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.12),0_10px_15px_-5px_rgba(227,30,36,0.15)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 shadow-xs transition-transform">
              <Monitor size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Station Siap Main</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </span>
              </div>
              <h4 className="text-2xl font-display font-black text-zinc-950 uppercase tracking-tight mt-0.5">
                {availableCount} Unit Free
              </h4>
              <p className="text-xs text-zinc-600 font-medium mt-1 truncate">Dari total {devices.length} station arena</p>
            </div>
          </Link>

          <Link
            to="/browse-devices"
            className="group bg-white border border-zinc-200/90 border-b-4 border-b-cust-red hover:border-cust-red/60 hover:border-b-cust-red-dark rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.12),0_10px_15px_-5px_rgba(227,30,36,0.15)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 group-hover:scale-105 shadow-xs transition-transform">
              <Activity size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Kepadatan Arena</p>
              <h4 className="text-2xl font-display font-black text-zinc-950 uppercase tracking-tight mt-0.5">
                {occupancyPercentage}% Terisi
              </h4>
              <p className="text-xs text-zinc-600 font-medium mt-1 truncate">{occupiedCount} station sedang digunakan</p>
            </div>
          </Link>

          <Link
            to="/menu"
            className="group bg-white border border-zinc-200/90 border-b-4 border-b-cust-red hover:border-cust-red/60 hover:border-b-cust-red-dark rounded-2xl p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.12),0_10px_15px_-5px_rgba(227,30,36,0.15)] hover:-translate-y-1 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 shadow-xs transition-transform">
              <Coffee size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Layanan Kafe</p>
              <h4 className="text-2xl font-display font-black text-zinc-950 uppercase tracking-tight mt-0.5">
                Order Ke Meja
              </h4>
              <p className="text-xs text-zinc-600 font-medium mt-1 truncate">Snack & kopi diantar langsung</p>
            </div>
          </Link>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_10px_20px_-5px_rgba(0,0,0,0.06)]">

          <div className="absolute top-0 right-0 w-96 h-96 bg-cust-red/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                <Sparkles size={14} />
                <span>Fitur Unggulan Elysium</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-zinc-950 mb-4 sm:mb-5 leading-tight">
                Malas Antre? Amankan Station <br />
                <span className="text-cust-red">Favoritmu Dari Rumah!</span>
              </h2>
              <p className="text-zinc-700 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                Kini kamu tidak perlu datang dan kecewa mendapati PC atau PS5 impianmu sedang penuh. Cek ketersediaan secara realtime, lakukan booking online, dan station langsung terkunci khusus untukmu saat kamu tiba.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Cek ketersediaan rig PC, PS5, dan PS4 secara langsung dan transparan.',
                  'Station terkunci otomatis dengan Smart Lock hingga kamu login di tempat.',
                  'Bisa pesan makanan & minuman langsung diantar ke mejamu saat bermain.',
                  'Pembayaran praktis langsung di kasir via QRIS atau Cash Tunai.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-[0_6px_16px_rgba(227,30,36,0.35)] hover:shadow-[0_10px_22px_rgba(227,30,36,0.5)] hover:-translate-y-0.5"
                >
                  <span>Pilih Station & Booking</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to={user ? '/customer/bookings' : '/register'}
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <UserCheck size={14} />
                  <span>{user ? 'Kelola Booking Saya' : 'Daftar Akun Gratis'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-200">
                  <div>
                    <h3 className="text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wide">Status Station Terkini</h3>
                    <p className="text-zinc-600 text-[11px] sm:text-xs font-medium">Pembaruan realtime server</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md font-extrabold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-4 sm:mb-5">
                  {devices.slice(0, 8).map((device) => {
                    const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                    return (
                      <Link
                        key={device.id}
                        to="/browse-devices"
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border bg-white ${pill.border} hover:border-zinc-400 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full ${pill.dot} shrink-0`} />
                          <span className="text-xs font-black text-zinc-950 truncate font-mono-tech">
                            {device.code}
                          </span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase ${pill.text} shrink-0`}>
                          {pill.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  to="/browse-devices"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow-md"
                >
                  <span>Lihat Seluruh Station ({devices.length} Unit)</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50/80 border-y border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={15} />
                <span>Pilihan Perangkat Berkualitas</span>
              </div>
              <h2 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl uppercase tracking-tight">
                Kategori & Spesifikasi Rig
              </h2>
            </div>
            <Link
              to="/browse-devices"
              className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-cust-red transition uppercase tracking-wider"
            >
              <span>Semua Station ({devices.length} Unit)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.type}
                className="bg-white border border-zinc-200/90 hover:border-cust-red/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_16px_40px_-5px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.18)] hover:-translate-y-1.5 group"
              >
                <div>

                  <div className="relative h-56 overflow-hidden bg-zinc-950 border-b border-zinc-200/80">
                    <img
                      src={cat.photo}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/20 text-white shadow-sm">
                        {cat.badge}
                      </span>
                      <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/90 text-white border border-emerald-400/30 backdrop-blur-md shadow-sm">
                        {cat.readyCount} Siap Pakai
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-wide mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-zinc-700 text-xs sm:text-sm font-medium leading-relaxed mb-5">
                      {cat.desc}
                    </p>

                    <div className="space-y-2.5 mb-6">
                      {cat.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-800 font-semibold">
                          <Check size={15} className="text-cust-red shrink-0 stroke-[2.5]" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-zinc-200/90 flex items-center justify-between bg-zinc-50">
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">Tarif Sewa</p>
                    <p className="font-display font-black text-zinc-950 text-2xl">
                      Rp{Math.round(cat.minPrice / 1000)}K<span className="text-xs text-zinc-500 font-sans font-normal">/jam</span>
                    </p>
                  </div>
                  <Link
                    to="/browse-devices"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider transition shadow-[0_4px_14px_rgba(227,30,36,0.3)] hover:shadow-[0_6px_20px_rgba(227,30,36,0.5)] hover:-translate-y-0.5"
                  >
                    <span>Pilih Unit</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Live Monitoring Terminal
                </span>
              </div>
              <h2 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl uppercase tracking-tight">
                Peta Ketersediaan Station Realtime
              </h2>
            </div>

            <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-1.5 flex gap-1 w-fit shadow-inner">
              {['Semua', 'PC', 'PS5', 'PS4'].map((f) => {
                const count = f === 'Semua' ? devices.length : typeCounts[f];
                const active = activeTypeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveTypeFilter(f)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-cust-red text-white shadow-md'
                        : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/70'
                    }`}
                  >
                    <span>{f}</span>
                    <span className={`text-[10px] ${active ? 'text-white/90 font-extrabold' : 'text-zinc-500 font-semibold'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-8 bg-zinc-50/90 border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
              <div className="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-zinc-200 gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-zinc-950 text-xl uppercase">Daftar Terminal</span>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-md shadow-2xs">
                    {availableCount} Station Kosong & Siap
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Siap
                  </span>
                  <span className="flex items-center gap-1.5 text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Terpakai
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Dibooking
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {groupedByType.map((group) => (
                  <div key={group.type}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                        Zona {group.type} ({group.list.length} Unit)
                      </p>
                      <span className="text-xs text-zinc-600 font-semibold">
                        {group.list.filter((x) => x.status === 'available').length} Tersedia
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {group.list.map((device) => {
                        const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                        return (
                          <Link
                            key={device.id}
                            to="/browse-devices"
                            className={`p-3.5 rounded-xl border bg-white ${pill.border} hover:border-cust-red/60 transition-all duration-200 flex flex-col justify-between h-20 group shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono-tech font-black text-sm text-zinc-950 group-hover:text-cust-red transition-colors">
                                {device.code}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${pill.dot}`} />
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-zinc-100">
                              <span className="text-zinc-600 font-medium">{device.device_type?.name}</span>
                              <span className={`font-extrabold uppercase text-[10px] ${pill.text}`}>{pill.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_35px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 text-zinc-950">

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-cust-red text-[10px] font-black uppercase tracking-wider border border-red-200 shadow-2xs">
                    <Activity size={12} className="text-cust-red animate-pulse" />
                    <span>Live Telemetry</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono-tech font-bold uppercase tracking-wider">7 Hari Terakhir</span>
                </div>

                <h3 className="font-display font-black text-zinc-950 text-2xl uppercase tracking-tight mb-1">
                  Pola Jam Ramai Arena
                </h3>
                <p className="text-zinc-600 text-xs font-medium mb-6 leading-relaxed">
                  Grafik kepadatan pengunjung berdasarkan data operasional arena.
                </p>

                {occupancy?.has_data ? (
                  <div className="space-y-5">

                    <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200/80">
                      <div className="flex items-end gap-1.5 h-32 px-1 mb-2">
                        {occupancy.hourly.map((h) => {
                          const isBusiest = h.hour === occupancy.busiest?.hour;
                          return (
                            <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full">
                              <div
                                className={`w-full rounded-t-sm transition-all duration-300 ${
                                  isBusiest
                                    ? 'bg-cust-red shadow-[0_0_12px_rgba(227,30,36,0.35)]'
                                    : 'bg-zinc-200 hover:bg-zinc-300'
                                }`}
                                style={{ height: `${Math.max(h.bar_pct, 10)}%` }}
                                title={`${h.hour}:00 WIB (${h.bar_pct}% ramai)`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-1.5 text-[9px] text-zinc-500 font-mono-tech text-center font-bold px-1">
                        {occupancy.hourly.map((h) => (
                          <span key={h.hour} className="flex-1">{h.hour}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-700 font-semibold">Jam Paling Santai:</span>
                        <span className="text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-md border border-emerald-300 font-black text-xs font-mono-tech shadow-2xs">
                          {occupancy.quietest?.hour}:00 WIB
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-700 font-semibold">Jam Paling Ramai:</span>
                        <span className="text-red-800 bg-red-100/90 px-2.5 py-0.5 rounded-md border border-red-300 font-black text-xs font-mono-tech shadow-2xs">
                          {occupancy.busiest?.hour}:00 WIB
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 text-center font-medium">
                    Data okupansi sedang dikalkulasi oleh server.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-200">
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  💡 <strong className="text-zinc-950 font-bold">Tips Juara:</strong> Ingin mabar di jam sibuk sore/malam? Booking 1-2 jam sebelumnya agar station tidak diambil pemain lain.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-zinc-50/80 border-b border-zinc-200 py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
            <span>Proses Cepat & Praktis</span>
          </div>
          <h2 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl uppercase tracking-tight mb-4">
            Empat Langkah Menuju Kemenangan
          </h2>
          <p className="text-zinc-700 text-sm max-w-xl mx-auto mb-14 font-medium">
            Sistem otomatis kami memastikan rig pilihanmu siap digunakan begitu kamu tiba di arena.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                step: '01',
                title: 'Daftar & Login Akun',
                desc: 'Buat akun pelanggan dengan cepat menggunakan nama dan WhatsApp aktif.',
              },
              {
                step: '02',
                title: 'Pilih Station Favorit',
                desc: 'Tentukan rig PC Esports, PS5 Pro, atau PS4 sesuai game yang ingin kamu mainkan.',
              },
              {
                step: '03',
                title: 'Tentukan Durasi & Jam',
                desc: 'Atur waktu mulai dan durasi sewa. Perhitungan tarif transparan tanpa biaya tersembunyi.',
              },
              {
                step: '04',
                title: 'Datang & Langsung Main',
                desc: 'Tiba di arena, login di station yang kamu pesan, dan nikmati permainan tanpa antre.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-zinc-200/90 hover:border-cust-red/50 p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-[0_12px_32px_-5px_rgba(0,0,0,0.09)] hover:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-black text-zinc-300 group-hover:text-red-200 transition-colors text-4xl">
                    {item.step}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cust-red shadow-xs" />
                </div>
                <div>
                  <h3 className="font-display font-black text-zinc-950 text-lg uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-zinc-700 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-zinc-900/60 bg-zinc-950 text-white">

        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/images/gamee.jpeg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
                <Sparkles size={13} className="text-cust-red" />
                <span>Kurasi Game Pilihan</span>
              </div>
              <h2 className="font-display font-black text-white text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Game Vault Terupdate
              </h2>
              <p className="mt-2 text-zinc-200 text-sm sm:text-base font-medium max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Dari rilisan blockbuster AAA hingga turnamen esports kompetitif. Cek ketersediaan judul favorit di stasiun gaming Elysium.
              </p>
            </div>

            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 self-start md:self-auto text-xs font-bold uppercase tracking-wider text-white hover:text-cust-red group transition px-3.5 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 hover:border-cust-red/40 shadow-md"
            >
              <span>Eksplor Seluruh Katalog ({games.length}+)</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {games.length > 0 ? (
            (() => {
              const safeIndex = (spotlightIndex >= 0 && spotlightIndex < games.length) ? spotlightIndex : 0;
              const featuredGame = games[safeIndex] || games[0];
              const displayGames = games.slice(0, 6);

              return (
                <div className="space-y-6 sm:space-y-8">

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    <div className="lg:col-span-5 p-2 rounded-[28px] bg-black/50 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] flex flex-col">
                      <div className="relative rounded-[22px] min-h-[460px] sm:min-h-[520px] lg:h-full flex flex-col justify-between overflow-hidden bg-zinc-950/90 text-white p-6 sm:p-8 isolate border border-white/10">

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={featuredGame.id}
                            initial={{ opacity: 0, scale: 1.06 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 z-0 pointer-events-none"
                          >
                            {featuredGame.cover_image ? (
                              <img
                                src={resolveImageUrl(featuredGame.cover_image)}
                                alt={featuredGame.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                <Gamepad2 size={64} />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
                          </motion.div>
                        </AnimatePresence>

                        <div className="pointer-events-none absolute -bottom-12 -left-12 w-64 h-64 bg-cust-red/25 rounded-full blur-[100px] z-10" />

                        <div className="relative z-20 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-cust-red animate-pulse" />
                            <span>Spotlight Game</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {featuredGame.platforms && featuredGame.platforms.length > 0 ? (
                              featuredGame.platforms.map((p) => (
                                <span
                                  key={p}
                                  className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider"
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                                All Platform
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="relative z-20 pt-24 sm:pt-32">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`details-${featuredGame.id}`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.35, ease: 'easeOut' }}
                            >
                              <div className="inline-flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-2 drop-shadow">
                                <Monitor size={14} />
                                <span>Tersedia di {featuredGame.devices_count || 4} Station Gaming</span>
                              </div>

                              <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white drop-shadow-md line-clamp-2 mb-3">
                                {featuredGame.name}
                              </h3>

                              <p className="text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 mb-6 drop-shadow-sm">
                                {featuredGame.description || 'Siap dimainkan langsung dengan visual grafis ultra dan performa maksimal di stasiun arena Elysium.'}
                              </p>
                            </motion.div>
                          </AnimatePresence>

                          <Link
                            to={`/browse-games/${featuredGame.id}`}
                            className="group/spotlight flex items-center justify-between p-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all duration-300 shadow-md"
                          >
                            <span className="text-xs sm:text-sm font-bold text-white px-3 flex items-center gap-2">
                              <span>Lihat Stasiun & Info Game</span>
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cust-red group-hover/spotlight:bg-cust-red-dark text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md group-hover/spotlight:translate-x-0.5">
                              <span>Mainkan</span>
                              <ArrowRight size={14} />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                        {displayGames.map((game, idx) => {
                          const isSelected = safeIndex === idx;

                          return (
                            <div
                              key={game.id}
                              onMouseEnter={() => setSpotlightIndex(idx)}
                              onClick={() => setSpotlightIndex(idx)}
                              className={`group relative rounded-2xl p-2.5 transition-all duration-300 cursor-pointer border flex flex-col justify-between backdrop-blur-md ${
                                isSelected
                                  ? 'bg-red-950/70 border-cust-red shadow-[0_12px_28px_-6px_rgba(227,30,36,0.35)] -translate-y-1.5 ring-2 ring-cust-red/40'
                                  : 'bg-black/60 hover:bg-black/75 border-white/15 hover:border-white/30 shadow-md hover:shadow-xl hover:-translate-y-1'
                              }`}
                            >

                              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 mb-3">
                                {game.cover_image ? (
                                  <img
                                    src={resolveImageUrl(game.cover_image)}
                                    alt={game.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                    <Gamepad2 size={28} />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                  {(game.platforms || ['PC']).slice(0, 2).map((p) => (
                                    <span
                                      key={p}
                                      className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider"
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>

                                {isSelected && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cust-red text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span>Aktif</span>
                                  </div>
                                )}

                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white/90 text-[10px] font-bold">
                                  <span>{game.devices_count || 4} Station</span>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-cust-red transition-colors">
                                  {game.name}
                                </h4>
                                <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-300 font-medium">
                                  <span>{game.platforms?.join(' · ') || 'Multi-platform'}</span>
                                  <Link
                                    to={`/browse-games/${game.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-zinc-400 hover:text-white p-1 -mr-1 transition-colors"
                                    title="Detail Game"
                                  >
                                    <ArrowRight size={13} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 sm:mt-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-cust-red/20 border border-cust-red/40 text-cust-red flex items-center justify-center shrink-0">
                            <Trophy size={18} />
                          </div>
                          <div>
                            <p className="text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                              Punya Request Judul Game?
                            </p>
                            <p className="text-zinc-300 text-xs font-medium">
                              Beri tahu kru kami sebelum booking untuk pra-instalasi game pilihanmu.
                            </p>
                          </div>
                        </div>

                        <Link
                          to="/browse-games"
                          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-md hover:shadow-lg"
                        >
                          <span>Buka Vault Lengkap ({games.length}+)</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-16 text-zinc-400 text-sm font-medium">
              Memuat pustaka game...
            </div>
          )}
        </div>
      </section>

      {reviews.reviews.length > 0 && (
        <section className="bg-white border-b border-zinc-200 py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#1a080b] via-[#100507] to-[#080304] border border-red-950/40 p-7 sm:p-10 lg:p-12 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_10px_25px_-5px_rgba(227,30,36,0.15)]">

              <div className="pointer-events-none absolute -top-28 -right-20 w-[450px] h-[450px] bg-cust-red/15 rounded-full blur-[130px]" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 w-[400px] h-[400px] bg-cust-red/10 rounded-full blur-[110px]" />

              <div className="relative z-10">
                <div className="max-w-2xl mb-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-cust-red text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                    <Award size={15} />
                    <span>Pengalaman Terverifikasi</span>
                  </div>
                  <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
                    {reviews.overall_average} / 5.0{' '}
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-red-400 bg-clip-text text-transparent">
                      Rating Komunitas
                    </span>
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-medium max-w-xl leading-relaxed">
                    Ulasan jujur dari para pemain yang telah merasakan langsung atmosfer dan performa gaming di Elysium Arena.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                  {reviews.reviews.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-cust-red/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_-5px_rgba(227,30,36,0.2)] hover:-translate-y-1.5 transition-all duration-300 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <StarRating value={r.rating} size={15} emptyClassName="text-zinc-700" />
                          <span className="text-zinc-500 text-xs font-semibold">{timeAgo(r.created_at)}</span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium italic">
                          “{r.comment}”
                        </p>
                      </div>
                      <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cust-red/15 border border-cust-red/30 flex items-center justify-center text-cust-red font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
                          {r.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-xs font-black uppercase tracking-wider group-hover:text-cust-red transition-colors">{r.user_name}</p>
                          <p className="text-zinc-500 text-[10px] font-bold">Pemain Terverifikasi</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      <section className="relative bg-white py-20 sm:py-28 text-center text-zinc-950 overflow-hidden border-t border-zinc-200">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(227,30,36,0.05),transparent)]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cust-red animate-pulse" />
            Pengalaman Gaming Maksimal
          </span>
          <h2 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight mb-4">
            Siap Main Tanpa Antre Hari Ini?
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-medium">
            Pilih station terbaikmu sekarang, pesan hidangan kafe favorit, dan nikmati waktu bermain tanpa hambatan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/browse-devices' : '/register'}
              className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-[0_6px_20px_rgba(227,30,36,0.25)] hover:shadow-[0_10px_28px_rgba(227,30,36,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>{user ? 'Booking Station Sekarang' : 'Daftar Akun & Booking'}</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/browse-devices"
              className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Cek Ketersediaan Rig
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
