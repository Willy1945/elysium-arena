import { Link } from 'react-router-dom';
import {
  Gamepad2,
  MapPin,
  Phone,
  Clock,
  ArrowUp,
  Zap,
  Award,
  Coffee,
  Monitor,
  Wifi,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#07070a] text-white border-t border-[#1e1e24] overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Ambient Red Glows in Footer Background */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[300px] bg-cust-red/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-[400px] h-[300px] bg-orange-600/5 rounded-full blur-[120px]" />

      {/* Subtle Tactical Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── MAIN FOOTER CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Telemetry (Span 4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cust-red to-[#8b0000] p-0.5 shadow-[0_0_20px_rgba(227,30,36,0.35)] group-hover:shadow-[0_0_25px_rgba(227,30,36,0.6)] transition-all duration-300">
                <div className="w-full h-full bg-[#0a0a0c] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="text-cust-red w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-wider uppercase text-white">
                  ELYSIUM ARENA
                </span>
                <p className="font-mono-tech text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                  Apex Esports & Café Lounge
                </p>
              </div>
            </Link>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Pusat hiburan gaming terdepan dengan spesifikasi PC turnamen RTX 40-Series, 
              PlayStation 5, PlayStation 4, serta integrasi café modern berfasilitas lengkap di Sumedang.
            </p>

            {/* Live Arena Telemetry Badges */}
            <div className="space-y-2.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121217] border border-[#24242e] text-xs font-mono-tech text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>OPERASIONAL BUKA: 10:00 - 22:00 WIB</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-neutral-400">
                <Wifi size={13} className="text-cust-red shrink-0" />
                <span>Dedicated 1 Gbps Fiber • Ultra-Low Latency</span>
              </div>
            </div>

            {/* Platform & Payment Support */}
            <div>
              <p className="text-[11px] font-mono-tech text-neutral-500 uppercase tracking-wider mb-2">
                Metode Pembayaran
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['QRIS', 'Transfer Bank', 'Cash Kasir', 'E-Wallet'].map((pay) => (
                  <span
                    key={pay}
                    className="px-2 py-0.5 rounded bg-[#131318] border border-[#22222c] text-[11px] font-mono-tech text-neutral-300"
                  >
                    {pay}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Navigasi Stasiun & Game (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-neutral-200 font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-sm" />
              Stasiun & Fasilitas
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/browse-devices"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Monitor size={15} className="text-neutral-500 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">PC Esports Battleground</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-devices"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Gamepad2 size={15} className="text-neutral-500 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">PlayStation 5 VIP Lounge</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-devices"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Gamepad2 size={15} className="text-neutral-500 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">PlayStation 4 Co-Op Zone</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-games"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Zap size={15} className="text-neutral-500 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Katalog Game Terpasang</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Coffee size={15} className="text-neutral-500 group-hover:text-amber-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Elysium Café & Refreshment</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Member & Layanan (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-neutral-200 font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-sm" />
              Member Area
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Dashboard Member</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/rewards"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <Award size={14} className="text-amber-400" />
                  <span className="group-hover:translate-x-1 transition-transform">Loyalty Rewards</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <MessageSquare size={14} className="text-neutral-500 group-hover:text-cust-red" />
                  <span className="group-hover:translate-x-1 transition-transform">Kritik & Saran</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Masuk ke Akun</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-cust-red hover:text-cust-red-light font-semibold text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Daftar Akun Baru</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Lokasi & Kontak (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-neutral-200 font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-sm" />
              Lokasi & Kontak
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin size={18} className="text-cust-red shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45323
                </p>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <Clock size={17} className="text-neutral-500 shrink-0" />
                <p>Setiap Hari: <strong className="text-white font-medium">10:00 - 22:00 WIB</strong></p>
              </div>

              <div className="flex items-center gap-3 text-neutral-400">
                <Phone size={17} className="text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors font-mono-tech flex items-center gap-1.5"
                >
                  <span>+62 812-3456-7890</span>
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUB-FOOTER BOTTOM BAR ── */}
      <div className="border-t border-[#181820] bg-[#050507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-neutral-500 font-mono-tech">
            <p>© {new Date().getFullYear()} ELYSIUM ARENA. All rights reserved.</p>
            <div className="flex items-center gap-4 text-neutral-400">
              <span className="hover:text-neutral-200 cursor-pointer">Syarat & Ketentuan</span>
              <span>•</span>
              <span className="hover:text-neutral-200 cursor-pointer">Kebijakan Privasi</span>
            </div>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#111116] hover:bg-cust-red hover:border-cust-red border border-[#24242e] text-neutral-300 hover:text-white font-mono-tech text-xs transition-all duration-300 cursor-pointer shadow-sm active:scale-95 group"
            title="Kembali ke atas"
          >
            <span>KEMBALI KE ATAS</span>
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}