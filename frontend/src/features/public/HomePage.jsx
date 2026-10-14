import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2, Monitor, DollarSign, ArrowRight,
  ChevronLeft, ChevronRight, Check,
  MapPin, Phone, Clock, Quote, Activity, Coffee,
  ShieldCheck, Wifi, Award, Sparkles, UserCheck, Calendar
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
  available: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Tersedia' },
  occupied: { text: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Terpakai' },
  booked: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/30', dot: 'bg-amber-400', label: 'Dibooking' },
  maintenance: { text: 'text-zinc-400', bg: 'bg-zinc-900', border: 'border-zinc-700/40', dot: 'bg-zinc-500', label: 'Servis' },
};

export default function HomePage() {
  const { user } = useAuth();
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
        setDevices(devicesRes.data.data || []);
        setGames(gamesRes.data.data || []);
        setReviews(reviewsRes.data || { overall_average: 0, overall_count: 0, reviews: [] });
        setOccupancy(occupancyRes.data || null);
      })
      .catch((err) => console.error('Gagal memuat data publik:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollGames = (direction) => {
    gameScrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

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
      {/* ── 1. CINEMATIC HERO SECTION (MINIMALIST & PREMIUM) ── */}
      <section className="relative bg-[#09090b] text-white overflow-hidden border-b border-zinc-800/80">
        {/* Background Image with Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-100"
          style={{ backgroundImage: "url('/images/hero-gaming-room.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#09090b]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-24 lg:pb-36">
          <div className="max-w-3xl">
            {/* Minimalist Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/60 mb-6 text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-cust-red animate-pulse" />
              <span className="font-medium tracking-wide">Elysium Gaming Arena • Sumedang</span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400 font-medium">{availableCount} Station Ready</span>
            </div>

            {/* Clean, Bold Headline */}
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-7xl uppercase tracking-tight leading-[1.05] sm:leading-[0.95] mb-6">
              Arena Gaming Modern, <br />
              <span className="text-cust-red">Dedikasi Untuk Sang Juara.</span>
            </h1>

            {/* Readable, Balanced Subtitle */}
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              Nikmati kenyamanan bermain dengan spesifikasi rig PC kompetitif 240Hz, PlayStation 5 Pro berlayar 4K HDR, dan hidangan kafe lezat di pusat kota Sumedang. Tanpa antre manual, booking langsung dari ponselmu.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/browse-devices"
                className="inline-flex items-center gap-2.5 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md transition duration-200"
              >
                <span>Booking Station Sekarang</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-200 font-semibold text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition duration-200"
              >
                <Coffee size={16} className="text-amber-400" />
                <span>Lihat Menu Kafe</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FLOATING 4 QUICK METRIC CARDS (FAUZANNET STYLE) ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 z-20 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Koleksi Game */}
          <Link
            to="/browse-games"
            className="group bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-xl transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0 group-hover:scale-105 transition-transform">
              <Gamepad2 size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 font-medium">Koleksi Game</p>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                <CountUp value={games.length} suffix="+" /> Judul
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 truncate">AAA, Esports & Co-Op Ready</p>
            </div>
          </Link>

          {/* Card 2: Station Tersedia */}
          <Link
            to="/browse-devices"
            className="group bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-xl transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Monitor size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400 font-medium">Station Siap Main</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready
                </span>
              </div>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                {availableCount} Unit Free
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 truncate">Dari total {devices.length} station arena</p>
            </div>
          </Link>

          {/* Card 3: Okupansi / Status Realtime */}
          <Link
            to="/browse-devices"
            className="group bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-xl transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0 group-hover:scale-105 transition-transform">
              <Activity size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 font-medium">Kepadatan Arena</p>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                {occupancyPercentage}% Terisi
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 truncate">{occupiedCount} station sedang digunakan</p>
            </div>
          </Link>

          {/* Card 4: Kafe & Pemesanan */}
          <Link
            to="/menu"
            className="group bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-xl transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Coffee size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 font-medium">Layanan Kafe</p>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mt-0.5">
                Order Ke Meja
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 truncate">Snack & kopi diantar langsung</p>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. FEATURE SPOTLIGHT: MALAS ANTRE? BOOKING DARI RUMAH! ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cust-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>Fitur Unggulan Elysium</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white mb-4 sm:mb-5 leading-tight">
                Malas Antre? Amankan Station <br />
                <span className="text-cust-red">Favoritmu Dari Rumah!</span>
              </h2>
              <p className="text-zinc-300 text-xs sm:text-base leading-relaxed mb-6 font-normal">
                Kini kamu tidak perlu datang dan kecewa mendapati PC atau PS5 impianmu sedang penuh. Cek ketersediaan secara realtime, lakukan booking online, dan station langsung terkunci khusus untukmu saat kamu tiba.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Cek ketersediaan rig PC, PS5, dan PS4 secara langsung dan transparan.',
                  'Station terkunci otomatis dengan Smart Lock hingga kamu login di tempat.',
                  'Bisa pesan makanan & minuman langsung diantar ke mejamu saat bermain.',
                  'Pembayaran mudah dengan scan QRIS atau transfer instan.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition shadow-md"
                >
                  <span>Pilih Station & Booking</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to={user ? '/customer/bookings' : '/register'}
                  className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 font-semibold text-xs uppercase tracking-wider px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition"
                >
                  <UserCheck size={14} />
                  <span>{user ? 'Kelola Booking Saya' : 'Daftar Akun Gratis'}</span>
                </Link>
              </div>
            </div>

            {/* Right Preview Card: Live Station Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b0b0e] border border-zinc-800 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-zinc-800/80">
                  <div>
                    <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide">Status Station Terkini</h3>
                    <p className="text-zinc-500 text-[11px] sm:text-xs">Pembaruan realtime server</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Station Mini Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-4 sm:mb-5">
                  {devices.slice(0, 8).map((device) => {
                    const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                    return (
                      <Link
                        key={device.id}
                        to="/browse-devices"
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border ${pill.bg} ${pill.border} hover:border-zinc-600 transition-all`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${pill.dot} shrink-0`} />
                          <span className="text-[11px] sm:text-xs font-bold text-white truncate font-mono-tech">
                            {device.code}
                          </span>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-semibold uppercase ${pill.text} shrink-0`}>
                          {pill.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  to="/browse-devices"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider transition"
                >
                  <span>Lihat Seluruh Station ({devices.length} Unit)</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. KATEGORI RIG & SPESIFIKASI (CLEAN 3-COLUMN CARDS) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={15} />
              <span>Pilihan Perangkat Berkualitas</span>
            </div>
            <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
              Kategori & Spesifikasi Rig
            </h2>
          </div>
          <Link
            to="/browse-devices"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition uppercase tracking-wider"
          >
            <span>Semua Station ({devices.length} Unit)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Crisp Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.type}
              className="bg-[#121216] border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Visual Banner */}
                <div className="relative h-52 overflow-hidden bg-zinc-900">
                  <img
                    src={cat.photo}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/30 to-transparent" />

                  {/* Badges on Banner */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white">
                      {cat.badge}
                    </span>
                    <span className="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      {cat.readyCount} Siap Pakai
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-5">
                    {cat.desc}
                  </p>

                  {/* Checklist Specs */}
                  <div className="space-y-2 mb-6">
                    {cat.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check size={14} className="text-cust-red shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking Strip */}
              <div className="p-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between bg-zinc-900/30">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Tarif Sewa</p>
                  <p className="font-display font-black text-white text-xl">
                    Rp{Math.round(cat.minPrice / 1000)}K<span className="text-xs text-zinc-400 font-sans">/jam</span>
                  </p>
                </div>
                <Link
                  to="/browse-devices"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider transition"
                >
                  <span>Pilih Unit</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. LIVE ARENA STATION MATRIX (INTERACTIVE MONITORING) ── */}
      <section className="bg-[#0c0c10] border-y border-zinc-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Live Monitoring Terminal
                </span>
              </div>
              <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
                Peta Ketersediaan Station Realtime
              </h2>
            </div>

            {/* Type Filter Buttons */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex gap-1 w-fit">
              {['Semua', 'PC', 'PS5', 'PS4'].map((f) => {
                const count = f === 'Semua' ? devices.length : typeCounts[f];
                const active = activeTypeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveTypeFilter(f)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      active
                        ? 'bg-cust-red text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <span>{f}</span>
                    <span className={`text-[10px] ${active ? 'text-white/80' : 'text-zinc-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Station Matrix Display (8 Cols) */}
            <div className="lg:col-span-8 bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-white text-xl uppercase">Daftar Terminal</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    {availableCount} Station Kosong & Siap
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Siap
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Terpakai
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Dibooking
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {groupedByType.map((group) => (
                  <div key={group.type}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        Zona {group.type} ({group.list.length} Unit)
                      </p>
                      <span className="text-xs text-zinc-500">
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
                            className={`p-3.5 rounded-xl border ${pill.bg} ${pill.border} hover:border-zinc-600 transition flex flex-col justify-between h-20 group`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono-tech font-bold text-sm text-white group-hover:text-cust-red transition-colors">
                                {device.code}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${pill.dot}`} />
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
                              <span className="text-zinc-500">{device.device_type?.name}</span>
                              <span className={`font-semibold uppercase ${pill.text}`}>{pill.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hours / Occupancy Guide (4 Cols) */}
            <div className="lg:col-span-4 bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-black text-white text-xl uppercase mb-1">Pola Jam Ramai Arena</h3>
                <p className="text-zinc-400 text-xs mb-6">
                  Grafik kepadatan pengunjung berdasarkan data operasional 7 hari terakhir.
                </p>

                {occupancy?.has_data ? (
                  <div className="space-y-5">
                    <div className="flex items-end gap-1.5 h-32 px-1 mb-2">
                      {occupancy.hourly.map((h) => {
                        const isBusiest = h.hour === occupancy.busiest?.hour;
                        return (
                          <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div
                              className={`w-full rounded-t-sm transition-all ${
                                isBusiest ? 'bg-cust-red' : 'bg-zinc-700 hover:bg-zinc-500'
                              }`}
                              style={{ height: `${Math.max(h.bar_pct, 8)}%` }}
                              title={`${h.hour}:00 WIB`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-1.5 text-[9px] text-zinc-500 font-mono-tech text-center">
                      {occupancy.hourly.map((h) => (
                        <span key={h.hour} className="flex-1">{h.hour}</span>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Jam Paling Santai:</span>
                        <span className="text-emerald-400 font-semibold">{occupancy.quietest?.hour}:00 WIB</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Jam Paling Ramai:</span>
                        <span className="text-cust-red font-semibold">{occupancy.busiest?.hour}:00 WIB</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 text-center">
                    Data okupansi sedang dikalkulasi oleh server.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-800">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  💡 <strong>Tips Juara:</strong> Ingin mabar di jam sibuk sore/malam? Booking 1-2 jam sebelumnya agar station tidak diambil pemain lain.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. CARA BOOKING & BERMAIN (4 LANGKAH SEDERHANA) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
          <span>Proses Cepat & Praktis</span>
        </div>
        <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight mb-4">
          Empat Langkah Menuju Kemenangan
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-14">
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
              className="bg-[#121216] border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl flex flex-col justify-between transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-black text-zinc-700 text-3xl">{item.step}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cust-red" />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-lg uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. GAME VAULT CAROUSEL ── */}
      <section className="bg-[#0c0c10] border-y border-zinc-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
                <Gamepad2 size={15} />
                <span>Pustaka Game Lengkap</span>
              </div>
              <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
                Game Vault Terupdate
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollGames(-1)}
                className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition"
                aria-label="Geser Kiri"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollGames(1)}
                className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition"
                aria-label="Geser Kanan"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {games.length > 0 ? (
            <div ref={gameScrollRef} className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4">
              {games.slice(0, 16).map((game) => (
                <Link
                  key={game.id}
                  to={`/browse-games/${game.id}`}
                  className="group relative shrink-0 w-48 sm:w-52 h-72 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition shadow-lg bg-zinc-900"
                >
                  {game.cover_image ? (
                    <img
                      src={resolveImageUrl(game.cover_image)}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                      <Gamepad2 size={36} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
                      {game.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm">
              Memuat pustaka game...
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition"
            >
              <span>Buka Seluruh Koleksi Game ({games.length}+)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. REPUTASI & ULASAN TERVERIFIKASI ── */}
      {reviews.reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
              <Award size={16} />
              <span>Pengalaman Terverifikasi</span>
            </div>
            <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
              {reviews.overall_average} / 5.0 Rating Komunitas
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Ulasan jujur dari para pemain yang telah merasakan langsung atmosfer Elysium Arena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.reviews.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating value={r.rating} size={15} />
                    <span className="text-zinc-500 text-xs">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                    “{r.comment}”
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-cust-red font-bold text-xs">
                    {r.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider">{r.user_name}</p>
                    <p className="text-zinc-500 text-[10px]">Pemain Terverifikasi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 9. LOKASI, JAM OPERASIONAL & KONTAK ── */}
      <section className="bg-[#0c0c10] border-t border-zinc-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin size={15} />
                  <span>Kunjungi Langsung</span>
                </div>
                <h2 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight mb-3">
                  Lokasi & Jam Buka
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Lokasi strategis di pusat kota Sumedang dengan area parkir luas dan fasilitas lengkap untuk kenyamanan mabar.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Alamat Arena</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45323
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">Jam Operasional</h3>
                    <p className="text-zinc-400 text-xs">Setiap Hari: 10:00 - 22:00 WIB</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121216] border border-zinc-800 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-1">WhatsApp Customer Service</h3>
                    <p className="text-zinc-400 text-xs">+62 812-3456-7890 (Layanan Cepat)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clean Embedded Map */}
            <div className="lg:col-span-7 bg-[#121216] border border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden h-72 sm:h-96 shadow-lg">
              <iframe
                title="Peta Lokasi Elysium Arena"
                src="https://www.google.com/maps?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323&output=embed"
                className="w-full h-full border-0 grayscale invert-[0.9] contrast-[0.95]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 10. FINAL CALL TO ACTION BANNER ── */}
      <section className="relative bg-[#09090b] py-20 border-t border-zinc-800/80 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <span className="text-cust-red text-xs font-bold uppercase tracking-wider mb-2 block">
            Pengalaman Gaming Maksimal
          </span>
          <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight mb-4">
            Siap Main Tanpa Antre Hari Ini?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Pilih station terbaikmu sekarang, pesan hidangan kafe favorit, dan nikmati waktu bermain tanpa hambatan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/browse-devices' : '/register'}
              className="inline-flex items-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md transition"
            >
              <span>{user ? 'Booking Station Sekarang' : 'Daftar Akun & Booking'}</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/browse-devices"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs uppercase tracking-wider px-7 py-4 rounded-xl transition"
            >
              Cek Ketersediaan Rig
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}