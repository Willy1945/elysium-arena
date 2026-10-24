import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  Zap,
  Coffee,
  Monitor,
  ExternalLink,
  MessageSquare,
  Coins,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#09090c] text-zinc-400 border-t border-zinc-800/80 overflow-hidden font-sans selection:bg-cust-red selection:text-white">
      {/* Subtle Ambient Red Glow */}
      <div className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[250px] bg-cust-red/[0.04] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 w-[400px] h-[200px] bg-red-950/[0.15] rounded-full blur-[120px]" />

      {/* ── MAIN FOOTER CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Telemetry (Span 4) */}
          <div className="lg:col-span-4">
            {/* Logo Elysium Arena */}
            <Link to="/" className="inline-flex items-center gap-3.5 group mb-5">
              <img
                src="/images/logo-elysium.png"
                alt="Elysium Arena Logo"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-wider uppercase text-white group-hover:text-cust-red transition-colors">
                  ELYSIUM ARENA
                </span>
                <span className="font-mono text-[9px] tracking-[0.22em] text-zinc-400 uppercase font-semibold">
                  Surga Para Gamer • Sumedang
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Surga gaming modern dan pusat hiburan esports terdepan di Sumedang yang memadukan kenyamanan lounge bermain dengan kafe berfasilitas lengkap.
            </p>

            {/* Live Operational Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>OPERASIONAL: <strong className="text-white">10:00 - 22:00 WIB</strong></span>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2 font-semibold">
                Metode Pembayaran
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['QRIS (Scan Kasir)', 'Tunai / Cash'].map((pay) => (
                  <span
                    key={pay}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/90 text-[11px] font-mono text-zinc-300 shadow-2xs font-medium"
                  >
                    {pay}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Stasiun & Fasilitas (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-full" />
              Stasiun & Fasilitas
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/browse-devices"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2.5 group"
                >
                  <Monitor size={15} className="text-zinc-400 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">PC Esports Battleground</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-devices"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2.5 group"
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-[9px] font-bold text-zinc-300 group-hover:text-cust-red group-hover:border-cust-red transition-colors">
                    5
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">PlayStation 5 VIP Lounge</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-devices"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2.5 group"
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-[9px] font-bold text-zinc-300 group-hover:text-cust-red group-hover:border-cust-red transition-colors">
                    4
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">PlayStation 4 Co-Op Zone</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse-games"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2.5 group"
                >
                  <Zap size={15} className="text-zinc-400 group-hover:text-amber-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Katalog Game Terpasang</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2.5 group"
                >
                  <Coffee size={15} className="text-zinc-400 group-hover:text-amber-400 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Elysium Café & Refreshment</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Member Area (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-full" />
              Member Area
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Dashboard Member</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/rewards"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2 group"
                >
                  <Coins size={14} className="text-amber-400" />
                  <span className="group-hover:translate-x-1 transition-transform">Koin & Loyalty Rewards</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2 group"
                >
                  <MessageSquare size={14} className="text-zinc-400 group-hover:text-cust-red transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Kontak & Kirim Masukan</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">Masuk ke Akun</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-cust-red hover:text-red-400 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight size={13} className="text-cust-red group-hover:translate-x-0.5 transition-transform" />
                  <span className="group-hover:translate-x-1 transition-transform">Daftar Akun Baru</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Lokasi & Kontak (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cust-red rounded-full" />
              Lokasi & Kontak
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 text-zinc-400">
                <MapPin size={17} className="text-cust-red shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45323
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-400">
                <Clock size={16} className="text-zinc-400 shrink-0" />
                <p>Setiap Hari: <strong className="text-zinc-200 font-medium">10:00 - 22:00 WIB</strong></p>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-400">
                <Phone size={16} className="text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6283869002070"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono flex items-center gap-1.5 font-medium"
                >
                  <span>+62 838-6900-2070</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-400">
                <Mail size={16} className="text-cust-red shrink-0" />
                <a
                  href="mailto:elysiumarena1@gmail.com"
                  className="text-zinc-300 hover:text-white transition-colors font-mono text-xs sm:text-sm font-medium"
                >
                  <span>elysiumarena1@gmail.com</span>
                </a>
              </div>

              {/* Google Maps link button & Contact Page */}
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href="https://maps.google.com/?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition shadow-xs w-fit"
                >
                  <MapPin size={12} className="text-cust-red" />
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink size={11} className="opacity-60" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs text-cust-red hover:underline font-bold uppercase tracking-wider"
                >
                  <span>Halaman Kontak & Denah Lengkap</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUB-FOOTER BOTTOM BAR ── */}
      <div className="border-t border-zinc-800/80 bg-[#050507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-zinc-400 font-mono text-center sm:text-left">
            <p>© {currentYear} ELYSIUM ARENA. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-zinc-400">
              <Link to="/terms" className="hover:text-zinc-200 transition cursor-pointer">
                Syarat & Ketentuan
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-zinc-200 transition cursor-pointer">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <span className="inline-flex items-center gap-1 hover:text-zinc-200 transition cursor-pointer">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Sistem Terverifikasi</span>
              </span>
            </div>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs transition-all duration-200 cursor-pointer active:scale-95 group shadow-xs"
            title="Kembali ke atas"
          >
            <span>KEMBALI KE ATAS</span>
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform text-zinc-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
