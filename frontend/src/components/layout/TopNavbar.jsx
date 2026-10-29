import { Search, ExternalLink, RefreshCw, Radio, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';

const SEARCH_PLACEHOLDER = {
  '/admin/devices': 'Cari kode unit atau stasiun...',
  '/admin/games': 'Cari judul game atau genre...',
  '/admin/bookings': 'Cari booking kode atau nama...',
  '/admin/products': 'Cari menu makanan / minuman...',
  '/admin/orders': 'Cari order meja...',
  '/admin/transactions': 'Cari nomor transaksi...',
  '/admin/sessions': 'Cari sesi stasiun...',
  '/admin/reports': 'Cari laporan...',
  '/admin/dashboard': 'Cari apa saja...',
  '/cafe/dashboard': 'Cari pesanan kafe...',
};

function getPlaceholder(pathname) {
  const match = Object.keys(SEARCH_PLACEHOLDER).find((path) => pathname.startsWith(path));
  return match ? SEARCH_PLACEHOLDER[match] : 'Cari di konsol admin...';
}

export default function TopNavbar({ onSearch, onToggleSidebar }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 lg:left-[270px] right-0 h-16 bg-white/80 backdrop-blur-md flex items-center justify-between px-3.5 sm:px-6 z-30">

      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xs sm:max-w-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-zinc-200 transition active:scale-95 shrink-0 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 bg-zinc-100/80 border border-zinc-200/90 rounded-xl px-3 py-2 focus-within:border-cust-red focus-within:bg-white transition flex-1 min-w-0">
          <Search size={14} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder={getPlaceholder(location.pathname)}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent outline-none text-xs text-zinc-900 placeholder:text-zinc-400 flex-1 font-medium w-full min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-2">

        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono-tech">PORT 8000 · ONLINE</span>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs font-semibold transition"
          title="Buka Website Publik"
        >
          <span className="hidden sm:inline">Website Publik</span>
          <span className="sm:hidden text-xs">Web</span>
          <ExternalLink size={12} className="text-zinc-500 shrink-0" />
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 hover:opacity-85 transition group cursor-pointer"
          title="Edit Profil & Ganti Password"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-red-50 border border-zinc-300 group-hover:border-cust-red/40 flex items-center justify-center text-zinc-900 group-hover:text-cust-red text-xs font-bold shrink-0 transition">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-xs text-left">
            <p className="text-zinc-950 font-bold leading-none group-hover:text-cust-red transition">{user?.name?.split(' ')[0]}</p>
            <p className="text-zinc-500 text-[10px] uppercase font-mono-tech mt-0.5 font-semibold">{user?.role}</p>
          </div>
        </Link>

      </div>
    </header>
  );
}
