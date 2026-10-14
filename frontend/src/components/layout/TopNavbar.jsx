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
    <header className="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-[#0d0d11]/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-3.5 sm:px-6 z-30">
      
      {/* Mobile Hamburger & Search Input Box */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xs sm:max-w-md">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition active:scale-95 shrink-0 cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-700 transition flex-1 min-w-0">
          <Search size={14} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder={getPlaceholder(location.pathname)}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent outline-none text-xs text-white placeholder:text-zinc-500 flex-1 font-medium w-full min-w-0"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 ml-2">
        
        {/* System Online Status Pill (Hidden on mobile) */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono-tech">PORT 8000 · ONLINE</span>
        </div>

        {/* View Public Website */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition"
          title="Buka Website Publik"
        >
          <span className="hidden sm:inline">Website Publik</span>
          <span className="sm:hidden text-xs">Web</span>
          <ExternalLink size={12} className="text-zinc-500 shrink-0" />
        </Link>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-xs">
            <p className="text-white font-medium leading-none">{user?.name?.split(' ')[0]}</p>
            <p className="text-zinc-500 text-[10px] uppercase font-mono-tech mt-0.5">{user?.role}</p>
          </div>
        </div>

      </div>
    </header>
  );
}