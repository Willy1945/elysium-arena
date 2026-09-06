import { Search, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SEARCH_PLACEHOLDER = {
  '/admin/devices': 'Search devices...',
  '/admin/games': 'Search games...',
  '/admin/bookings': 'Search bookings...',
  '/admin/products': 'Search products...',
  '/admin/orders': 'Search orders...',
  '/admin/transactions': 'Search transactions...',
  '/admin/sessions': 'Search sessions...',
  '/admin/inventory': 'Search inventory...',
  '/admin/reports': 'Search reports...',
  '/admin/dashboard': 'Search...',
  '/cafe/dashboard': 'Search...',
};

function getPlaceholder(pathname) {
  const match = Object.keys(SEARCH_PLACEHOLDER).find((path) => pathname.startsWith(path));
  return match ? SEARCH_PLACEHOLDER[match] : 'Search...';
}

export default function TopNavbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-surface-elevated border-b border-border flex items-center justify-between px-6 z-10">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-surface-inset border border-border rounded px-3 py-2">
          <Search size={16} className="text-text-secondary" />
          <input
            type="text"
            placeholder={getPlaceholder(location.pathname)}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-secondary flex-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1 text-text-secondary hover:text-text-primary transition">
          <Bell size={20} />
        </button>
        <button className="p-1 text-text-secondary hover:text-text-primary transition">
          <HelpCircle size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#37333e] border border-border flex items-center justify-center text-text-primary text-xs font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-xs">
            <p className="text-text-primary font-medium">{user?.name}</p>
            <p className="text-text-secondary">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-1 text-text-secondary hover:text-status-occupied transition"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}