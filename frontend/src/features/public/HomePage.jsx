import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2, Monitor, DollarSign, ThumbsUp, ArrowRight,
  ChevronLeft, ChevronRight, UserPlus, CalendarCheck, Joystick,
  MapPin, Phone, Clock, Quote, Radio, Check, Sparkles, Flame,
  Cpu, Zap, Coffee, ShieldCheck, Activity, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';
import StarRating from '../../components/common/StarRating';
import CountUp from '../../components/common/CountUp';
import Reveal from '../../components/common/Reveal';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl, timeAgo } from '../../utils/format';

const CATEGORY_META = {
  PS5: {
    photo: '/images/ps5.png',
    title: 'PlayStation 5 Pro Station',
    badge: 'Tier 1 Next-Gen',
    specs: ['4K HDR 120Hz Display', 'DualSense Haptic Feedback', 'High-Speed NVMe SSD', 'Exclusive PS5 AAA Titles'],
    desc: 'Pengalaman gaming tanpa kompromi. Loading nyaris instan dengan grafis fidelity tertinggi untuk game-game flagship.',
  },
  PS4: {
    photo: '/images/ps4.png',
    title: 'PlayStation 4 Lounge',
    badge: 'Classic & Co-Op',
    specs: ['Dual Controller Included', '50+ Koleksi Game Klasik', 'Full HD Gaming Screen', 'Sofa & Lounge Area'],
    desc: 'Pilihan paling hemat untuk nongkrong bareng teman, turnamen mini FIFA/PES, atau menyelesaikan game petualangan klasik.',
  },
  PC: {
    photo: '/images/pc2.jpg',
    title: 'PC Esports Battleground',
    badge: 'High FPS Rig',
    specs: ['High Refresh 165Hz/240Hz', 'Mechanical Keyboard & Pro Mouse', 'Gigabit Low Latency LAN', 'Clean Discord & Voice Setup'],
    desc: 'Didedikasikan untuk gamer kompetitif. Frame rate tinggi tanpa stutter, sensor mouse presisi, dan ping stabil untuk ranked match.',
  },
};

const STATUS_PILL = {
  available: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400', label: 'Ready' },
  occupied: { text: 'text-cust-red', bg: 'bg-cust-red/10', border: 'border-cust-red/25', dot: 'bg-cust-red', label: 'In-Use' },
  booked: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400', label: 'Reserved' },
  maintenance: { text: 'text-zinc-500', bg: 'bg-zinc-800/40', border: 'border-zinc-700/30', dot: 'bg-zinc-500', label: 'Service' },
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
        setDevices(devicesRes.data.data);
        setGames(gamesRes.data.data);
        setReviews(reviewsRes.data);
        setOccupancy(occupancyRes.data);
      })
      .catch((err) => console.error('Gagal memuat data publik:', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollGames = (direction) => {
    gameScrollRef.current?.scrollBy({ left: direction * 340, behavior: 'smooth' });
  };

  const availableCount = devices.filter((d) => d.status === 'available').length;
  const cheapestPrice = devices.length > 0 ? Math.min(...devices.map((d) => Number(d.price_per_hour))) : 0;
  const occupancyPercentage = devices.length > 0 ? Math.round(((devices.length - availableCount) / devices.length) * 100) : 0;

  const categories = ['PS5', 'PC', 'PS4']
    .map((type) => {
      const list = devices.filter((d) => d.device_type?.name === type);
      if (list.length === 0) return null;
      const minPrice = Math.min(...list.map((d) => Number(d.price_per_hour)));
      return { type, ...CATEGORY_META[type], minPrice, count: list.length, readyCount: list.filter((x) => x.status === 'available').length };
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

  const groupedByType = ['PS5', 'PC', 'PS4']
    .map((type) => ({ type, list: devices.filter((d) => d.device_type?.name === type) }))
    .filter((g) => g.list.length > 0 && (activeTypeFilter === 'Semua' || activeTypeFilter === g.type));

  return (
    <PublicLayout>
      {/* ── SECTION 1: ASYMMETRICAL COMMAND DECK HERO ── */}
      <section className="relative overflow-hidden min-h-[740px] lg:min-h-[820px] flex items-center justify-center border-b border-white/[0.06] bg-[#070709]">

        {/* Background Image with Cinematic Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/hero-gaming-room.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-[#070709]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/85 to-transparent pointer-events-none" />

        {/* Background Atmosphere Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(227,30,36,0.18),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cust-red/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Bold Typography & Main Value */}
            <div className="lg:col-span-7 flex flex-col justify-center">

              {/* Tactical Status Bar */}
              <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-full w-fit mb-8 shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono-tech text-white/90 uppercase tracking-widest font-semibold">
                  Arena Online · Sumedang Hub
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="text-[10px] font-mono-tech text-cust-red font-bold uppercase">
                  {availableCount} Station Free
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-[80px] leading-[0.9] tracking-tight uppercase mb-6">
                Next-Level Gaming <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cust-red via-red-500 to-amber-500">
                  Zero Antre.
                </span>
              </h1>

              <p className="text-cust-text-secondary text-base sm:text-lg max-w-xl leading-relaxed mb-10 font-normal">
                Sistem gaming lounge terintegrasi. Amankan rig PlayStation 5 & PC Esports pilihanmu langsung dari ponsel, masuk arena, dan langsung bermain tanpa menunggu teknisi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/browse-devices"
                    className="flex items-center gap-3 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(227,30,36,0.4)] transition-all"
                  >
                    <Zap size={16} />
                    <span>Booking Station Sekarang</span>
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/menu"
                    className="flex items-center gap-2.5 bg-[#121215]/80 hover:bg-white/[0.08] border border-white/[0.1] text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-xl transition-all"
                  >
                    <Coffee size={16} className="text-amber-400" />
                    <span>Lihat Menu F&B Cafe</span>
                  </Link>
                </motion.div>
              </div>

              {/* Mini Stats Ribbon */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08] max-w-lg">
                <div>
                  <p className="text-[11px] font-mono-tech text-white/40 uppercase mb-1">Mulai Dari</p>
                  <p className="font-display font-black text-white text-2xl sm:text-3xl">
                    Rp{cheapestPrice ? Math.round(cheapestPrice / 1000) : 0}K<span className="text-xs text-white/50 font-sans">/jam</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono-tech text-white/40 uppercase mb-1">Total Koleksi</p>
                  <p className="font-display font-black text-white text-2xl sm:text-3xl">
                    <CountUp value={games.length} suffix="+" /> Game
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono-tech text-white/40 uppercase mb-1">Jam Layanan</p>
                  <p className="font-display font-black text-white text-2xl sm:text-3xl">
                    10 - 22 <span className="text-xs text-white/50 font-sans">WIB</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Arena HUD Terminal */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#0d0d10]/90 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">

                {/* HUD Header Bar */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cust-red/15 border border-cust-red/30 flex items-center justify-center text-cust-red">
                      <Activity size={16} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono-tech">Arena Telemetry Console</h3>
                      <p className="text-white/40 text-[10px] font-mono-tech">LIVE REFRESH · REALTIME DATA</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    PING: 4ms
                  </span>
                </div>

                {/* Occupancy Radial Gauge Teaser */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-[11px] font-mono-tech uppercase">Arena Density</p>
                    <p className="text-white font-display font-black text-2xl mt-0.5">
                      {occupancyPercentage}% <span className="text-xs font-normal text-white/60">Terisi Saat Ini</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-mono-tech text-emerald-400 font-bold">
                      {availableCount} Unit Siap Main
                    </p>
                    <p className="text-white/40 text-[10px] font-mono-tech">
                      {devices.length - availableCount} Unit Sedang Berjalan
                    </p>
                  </div>
                </div>

                {/* Live Stations Mini Radar Grid */}
                <p className="text-white/40 text-[10px] font-mono-tech uppercase tracking-widest mb-3">Live Station Snapshot</p>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {devices.slice(0, 6).map((device) => {
                    const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                    return (
                      <Link
                        key={device.id}
                        to="/browse-devices"
                        className={`flex items-center justify-between p-3 rounded-xl border ${pill.bg} ${pill.border} hover:border-white/30 transition-all group`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${pill.dot}`} />
                          <span className="font-mono-tech text-xs font-bold text-white group-hover:text-cust-red transition-colors">
                            {device.code}
                          </span>
                        </div>
                        <span className={`font-mono-tech text-[10px] uppercase font-semibold ${pill.text}`}>
                          {pill.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Instant Reserve CTA within HUD */}
                <Link
                  to="/browse-devices"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] hover:bg-cust-red text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Buka Peta Station Lengkap</span>
                  <ArrowRight size={13} />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: ASYMMETRICAL BENTO GRID (STANDAR ARENA) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-cust-red text-xs font-mono-tech font-bold uppercase tracking-widest mb-3">
              <ShieldCheck size={14} />
              <span>Standar Fasilitas Unggulan</span>
            </div>
            <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight leading-none">
              Didesain Khusus Para Pemain
            </h2>
          </div>
          <p className="text-cust-text-secondary text-sm max-w-md leading-relaxed">
            Tidak ada lagi kursi keras, internet drop saat war, atau antre manual tanpa kejelasan. Setiap aspek disiapkan untuk kenyamanan maksimal.
          </p>
        </div>

        {/* Bento Grid: 1 Large Hero Card + 2 Stacked Feature Cards + 1 Wide Bottom Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bento Item 1: Large Tech Specs Card (Spans 7 cols) */}
          <div className="lg:col-span-7 bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cust-red/10 rounded-full blur-[100px] pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] font-mono-tech font-bold text-cust-red bg-cust-red/10 border border-cust-red/20 px-3 py-1 rounded-full uppercase">
                  Hardware Standards
                </span>
                <Cpu size={24} className="text-white/40 group-hover:text-cust-red transition-colors" />
              </div>

              <h3 className="font-display font-black text-white text-3xl sm:text-4xl uppercase tracking-wide mb-4">
                High-Refresh Display & Periferal Pro
              </h3>
              <p className="text-cust-text-secondary text-sm leading-relaxed mb-8 max-w-lg">
                Setiap PlayStation 5 terhubung ke monitor dan TV HDR 120Hz dengan controller DualSense yang selalu dicek kondisi fisiknya. Untuk PC, kami sediakan monitor 165Hz+, mechanical keyboard, dan mouse gaming berkabel anti-delay.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
              {[
                { label: 'Screen Tech', val: '4K / 120Hz+' },
                { label: 'Input Latency', val: '< 1ms Pro Mode' },
                { label: 'Network', val: 'Gigabit LAN' },
                { label: 'Comfort', val: 'Full AC & Sofa' },
              ].map((spec) => (
                <div key={spec.label} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <p className="text-[10px] font-mono-tech text-white/40 uppercase">{spec.label}</p>
                  <p className="font-mono-tech text-xs font-bold text-white mt-1">{spec.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Item 2 & 3: Stacked Right Cards (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Top Right Card: Transparent Billing */}
            <div className="bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <DollarSign size={20} />
                </div>
                <h4 className="font-display font-black text-white text-2xl uppercase mb-2">
                  Tarif Transparan & Akurat
                </h4>
                <p className="text-cust-text-secondary text-xs leading-relaxed">
                  Tidak ada pembulatan sepihak. Sesi tercatat detik demi detik di sistem, dengan struk digital yang bisa kamu cek langsung di dashboard pribadimu.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-bold uppercase">
                <Check size={14} /> Otomatis Sesuai Paket
              </div>
            </div>

            {/* Bottom Right Card: Cafe Runner Service */}
            <div className="bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                  <Coffee size={20} />
                </div>
                <h4 className="font-display font-black text-white text-2xl uppercase mb-2">
                  Cafe Diantar Langsung ke Meja
                </h4>
                <p className="text-cust-text-secondary text-xs leading-relaxed">
                  Lapar atau haus di tengah ranked match? Pesan snack dan minuman dingin dari smartphone kamu, pesanan akan diantar oleh staf langsung ke station-mu.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-amber-400 text-xs font-mono-tech font-bold uppercase">
                <Check size={14} /> Fast Table Delivery
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 3: PLATFORM DOSSIER SHOWCASE (KATEGORI RE-DESIGN) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <p className="text-cust-red font-mono-tech font-bold text-xs uppercase tracking-widest mb-2">Daftar Platform</p>
            <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight">Kategori Station</h2>
          </div>
          <Link
            to="/browse-devices"
            className="flex items-center gap-2 text-xs font-mono-tech font-bold text-cust-red hover:text-white transition uppercase tracking-wider"
          >
            <span>Semua Station ({devices.length} Unit)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Large Dossier Cards with Specs Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.type}
              className="bg-[#0c0c0f] border border-white/[0.08] hover:border-cust-red/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Visual Banner */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cat.photo}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-[#0c0c0f]/40 to-transparent" />

                  {/* Badge Pills */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech font-bold uppercase px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white">
                      {cat.badge}
                    </span>
                    <span className="text-[10px] font-mono-tech font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {cat.readyCount} Ready
                    </span>
                  </div>
                </div>

                {/* Content Dossier */}
                <div className="p-7">
                  <h3 className="font-display font-black text-white text-2xl uppercase tracking-wide mb-3">
                    {cat.title}
                  </h3>
                  <p className="text-cust-text-secondary text-xs leading-relaxed mb-6">
                    {cat.desc}
                  </p>

                  {/* Hardware Spec Badges */}
                  <div className="flex flex-col gap-2 mb-6">
                    {cat.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-2.5 text-[11px] text-white/80 font-mono-tech">
                        <span className="w-1.5 h-1.5 rounded-full bg-cust-red shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking Strip */}
              <div className="p-7 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono-tech text-white/40 uppercase">Tarif Sewa</p>
                  <p className="font-display font-black text-white text-xl">
                    Rp{Math.round(cat.minPrice / 1000)}K<span className="text-xs text-white/50 font-sans">/jam</span>
                  </p>
                </div>
                <Link
                  to="/browse-devices"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-cust-red text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Pilih Unit</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: TACTICAL LIVE ARENA MAP (RE-DESIGN MONITORING) ── */}
      <section className="border-y border-white/[0.06] bg-[#08080a] py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-cust-red animate-pulse" />
                <span className="font-mono-tech text-cust-red text-xs font-bold tracking-widest uppercase">
                  Arena Station Grid
                </span>
              </div>
              <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight">
                Peta Ketersediaan Realtime
              </h2>
            </div>

            {/* Filter Pill Buttons */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-xl p-1.5 flex gap-1.5 w-fit">
              {['Semua', 'PS5', 'PC', 'PS4'].map((f) => {
                const count = f === 'Semua' ? devices.length : typeCounts[f];
                const active = activeTypeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveTypeFilter(f)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${active
                      ? 'bg-cust-red text-white shadow-[0_0_15px_rgba(227,30,36,0.3)]'
                      : 'text-cust-text-secondary hover:text-white hover:bg-white/[0.05]'
                      }`}
                  >
                    <span>{f}</span>
                    <span className={`font-mono-tech text-[10px] ${active ? 'text-white' : 'text-white/40'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Grid Station Cards (Spans 8 cols) */}
            <div className="lg:col-span-8 bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-7 sm:p-8">
              <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/[0.08] gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-white text-2xl">STATUS SECTOR</span>
                  <span className="text-xs font-mono-tech text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                    {statusCounts.available} STATIONS ONLINE & READY
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono-tech">
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Siap</span>
                  <span className="flex items-center gap-1.5 text-cust-red"><span className="w-2 h-2 rounded-full bg-cust-red" /> Terpakai</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Dibooking</span>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {groupedByType.map((group) => (
                  <div key={group.type}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-mono-tech text-xs font-bold text-white uppercase tracking-widest">
                        {group.type} ZONE ({group.list.length} UNIT)
                      </p>
                      <span className="text-[10px] font-mono-tech text-white/40">
                        {group.list.filter((x) => x.status === 'available').length} TERSEDIA
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {group.list.map((device) => {
                        const pill = STATUS_PILL[device.status] || STATUS_PILL.available;
                        return (
                          <Link
                            key={device.id}
                            to="/browse-devices"
                            className={`p-3.5 rounded-2xl border ${pill.bg} ${pill.border} hover:scale-[1.03] transition-all flex flex-col justify-between h-24 group`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono-tech font-bold text-sm text-white group-hover:text-cust-red transition-colors">
                                {device.code}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${pill.dot}`} />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono-tech pt-2 border-t border-white/[0.05]">
                              <span className="text-white/50">{device.device_type?.name}</span>
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

            {/* Occupancy Heatmap Strip (Spans 4 cols) */}
            <div className="lg:col-span-4 bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-black text-white text-2xl uppercase mb-1">Pola Jam Ramai</h3>
                <p className="text-cust-text-secondary text-xs mb-8">
                  Estimasi kepadatan station berdasarkan data 7 hari terakhir.
                </p>

                {occupancy?.has_data && (
                  <div className="space-y-6">
                    <div className="flex items-end gap-1.5 h-36 px-1 mb-2">
                      {occupancy.hourly.map((h) => {
                        const isBusiest = h.hour === occupancy.busiest?.hour;
                        return (
                          <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full">
                            <div
                              className={`w-full rounded-t-sm transition-all ${isBusiest ? 'bg-cust-red shadow-[0_0_12px_rgba(227,30,36,0.6)]' : 'bg-white/20 hover:bg-white/40'
                                }`}
                              style={{ height: `${Math.max(h.bar_pct, 6)}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-1.5 text-[9px] font-mono-tech text-white/30 text-center">
                      {occupancy.hourly.map((h) => (
                        <span key={h.hour} className="flex-1">{h.hour}</span>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Paling Santai</span>
                        <span className="text-emerald-400 font-mono-tech font-bold">{occupancy.quietest?.hour}:00 WIB</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Paling Penuh</span>
                        <span className="text-cust-red font-mono-tech font-bold">{occupancy.busiest?.hour}:00 WIB</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  💡 Ingin main di jam sibuk malam? Amankan booking 2 jam sebelum berangkat agar slot tidak diambil pemain lain.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5: HORIZONTAL SEQUENCE PROTOCOL (ALUR 4 LANGKAH) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
        <p className="text-cust-red font-mono-tech font-bold text-xs uppercase tracking-widest mb-3">Seamless Protocol</p>
        <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight mb-4">
          Empat Langkah Menuju Kemenangan
        </h2>
        <p className="text-cust-text-secondary text-sm max-w-lg mx-auto mb-16">
          Sistem otomatis kami menghubungkan akunmu langsung ke terminal station tanpa birokrasi manual.
        </p>

        {/* Sequence Rail with Interconnected Dots */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left relative">
          {[
            { step: '01', title: 'Registrasi Kilat', desc: 'Daftar dengan email dan nomor WhatsApp dalam hitungan detik.' },
            { step: '02', title: 'Pilih Rig Favorit', desc: 'Pilih PlayStation 5, PC, atau PS4 sesuai game yang ingin dimainkan.' },
            { step: '03', title: 'Tentukan Waktu', desc: 'Pilih jam mulai dan durasi. Tarif otomatis terkalkulasi transparan.' },
            { step: '04', title: 'Datang & Main', desc: 'Tiba di arena, duduk di station pilihanmu, dan langsung push rank.' },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-8 rounded-3xl bg-[#0c0c0f] border border-white/[0.08] hover:border-white/[0.2] flex flex-col justify-between transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-black text-white/30 text-4xl">{item.step}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cust-red" />
              </div>
              <div>
                <h3 className="font-display font-black text-white text-xl uppercase mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-cust-text-secondary text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: GAME VAULT CAROUSEL ── */}
      <section
        className="relative overflow-hidden py-28 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: "url('/images/gaming-hall.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#070709]/90 backdrop-blur-sm" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-cust-red font-mono-tech font-bold text-xs uppercase tracking-widest mb-2">Pustaka Game</p>
              <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight mb-2">Game Vault</h2>
              <p className="text-cust-text-secondary text-sm max-w-md">Koleksi game terupdate yang siap kamu mainkan seketika.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollGames(-1)}
                className="w-12 h-12 rounded-2xl bg-white/[0.05] hover:bg-cust-red border border-white/[0.1] text-white flex items-center justify-center transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scrollGames(1)}
                className="w-12 h-12 rounded-2xl bg-white/[0.05] hover:bg-cust-red border border-white/[0.1] text-white flex items-center justify-center transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {games.length > 0 && (
            <div ref={gameScrollRef} className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar pb-6">
              {games.slice(0, 14).map((game) => (
                <Link
                  key={game.id}
                  to={`/browse-games/${game.id}`}
                  className="group relative shrink-0 w-56 h-84 rounded-3xl overflow-hidden border border-white/[0.08] hover:border-cust-red transition-all shadow-2xl"
                >
                  {game.cover_image ? (
                    <img
                      src={resolveImageUrl(game.cover_image)}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#161619] flex items-center justify-center">
                      <Gamepad2 size={40} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow-md">
                      {game.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/browse-games"
              className="inline-flex items-center gap-2 border border-white/[0.15] hover:border-cust-red bg-white/[0.04] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all"
            >
              <span>Buka Seluruh Koleksi Game</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: VERIFIED REVIEWS & REPUTATION ── */}
      {reviews.reviews.length > 0 && (
        <section className="border-t border-white/[0.06] bg-[#070709] py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-cust-red" />
                <p className="text-cust-red text-xs font-mono-tech font-bold uppercase tracking-widest">Reputasi Komunitas</p>
              </div>
              <h2 className="font-display font-black text-white text-4xl sm:text-6xl uppercase tracking-tight">
                {reviews.overall_average} / 5.0 Rating Terverifikasi
              </h2>
              <p className="text-cust-text-secondary text-sm mt-3">
                Ulasan dikirim langsung oleh pemain yang telah menyelesaikan sesi bermain di Elysium Arena.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {reviews.reviews[0] && (
                <div className="lg:col-span-7 bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-8 sm:p-12 flex flex-col justify-between">
                  <div>
                    <Quote size={44} className="text-cust-red/60 mb-6" />
                    <p className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight mb-8">
                      “{reviews.reviews[0].comment}”
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-cust-red/10 border border-cust-red/40 text-cust-red flex items-center justify-center font-bold text-sm">
                        {reviews.reviews[0].user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{reviews.reviews[0].user_name}</p>
                        <p className="text-cust-text-secondary text-[10px] font-mono-tech">{timeAgo(reviews.reviews[0].created_at)}</p>
                      </div>
                    </div>
                    <StarRating value={reviews.reviews[0].rating} size={18} />
                  </div>
                </div>
              )}

              <div className="lg:col-span-5 flex flex-col gap-4">
                {reviews.reviews.slice(1, 4).map((r) => (
                  <div key={r.id} className="bg-[#0c0c0f] border border-white/[0.08] rounded-3xl p-6 flex flex-col justify-between">
                    <div className="mb-3 flex items-center justify-between">
                      <StarRating value={r.rating} size={14} />
                      <span className="text-cust-text-secondary text-[10px] font-mono-tech">{timeAgo(r.created_at)}</span>
                    </div>
                    <p className="text-cust-text-secondary text-sm leading-relaxed mb-4">
                      “{r.comment}”
                    </p>
                    <p className="text-white text-xs font-bold uppercase tracking-wider">{r.user_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 8: LOCATION & CONTACT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <p className="text-cust-red font-mono-tech font-bold text-xs uppercase tracking-widest mb-2">Kunjungi Arena</p>
              <h2 className="font-display font-black text-white text-4xl sm:text-5xl uppercase tracking-tight mb-4">
                Lokasi & Kontak
              </h2>
              <p className="text-cust-text-secondary text-sm leading-relaxed">
                Terletak di pusat kota Sumedang dengan area parkir aman untuk motor & mobil.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cust-red/10 border border-cust-red/30 flex items-center justify-center text-cust-red shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1 uppercase font-display">Alamat Lengkap</p>
                  <p className="text-cust-text-secondary text-xs leading-relaxed">
                    Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45323
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cust-red/10 border border-cust-red/30 flex items-center justify-center text-cust-red shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1 uppercase font-display">Jam Operasional</p>
                  <p className="text-cust-text-secondary text-xs">Setiap Hari · 10:00 - 22:00 WIB</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cust-red/10 border border-cust-red/30 flex items-center justify-center text-cust-red shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1 uppercase font-display">Customer Support Hotline</p>
                  <p className="text-cust-text-secondary text-xs">+62 812-3456-7890 (WhatsApp)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0c0c0f] border border-white/[0.08] rounded-3xl overflow-hidden h-[420px]">
            <iframe
              title="Lokasi Elysium Arena"
              src="https://www.google.com/maps?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323&output=embed"
              className="w-full h-full border-0 grayscale invert-[0.9] contrast-[0.95]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CALL TO ACTION ── */}
      <section
        className="relative overflow-hidden py-28 border-t border-white/[0.06] bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/device-room.jpeg')" }}
      >
        {/* Layer Gelap Sinematik agar Teks Tetap Tajam */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/95 via-[#070709]/90 to-[#070709]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(227,30,36,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-cust-red font-mono-tech font-bold text-xs uppercase tracking-widest mb-3">Sesi Berikutnya Menunggumu</p>
          <h2 className="font-display font-black text-white text-5xl sm:text-7xl uppercase tracking-tight leading-none mb-6">
            Siap Main Tanpa Antre?
          </h2>
          <p className="text-cust-text-secondary text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Pilih station terbaikmu sekarang, pesan camilan, dan nikmati waktu bermain tanpa gangguan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/browse-devices' : '/register'}
              className="flex items-center gap-2.5 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(227,30,36,0.4)] transition-all cursor-pointer"
            >
              <span>{user ? 'Booking Station Sekarang' : 'Daftar Akun & Booking'}</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/browse-devices"
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
            >
              Cek Semua Station
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}