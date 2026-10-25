import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, Joystick, CalendarCheck, Timer,
  UtensilsCrossed, ShoppingBag, Receipt, BarChart3, MessageSquare,
  Users, LogOut, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', roles: ['OWNER', 'ADMIN'] },
      { label: 'Laporan & Finansial', icon: BarChart3, path: '/admin/reports', roles: ['OWNER'] },
    ],
  },
  {
    title: 'Operasional Rig',
    items: [
      { label: 'Sesi Aktif', icon: Timer, path: '/admin/sessions', roles: ['OWNER', 'ADMIN'] },
      { label: 'Daftar Booking', icon: CalendarCheck, path: '/admin/bookings', roles: ['OWNER', 'ADMIN'] },
      { label: 'Katalog Stasiun', icon: Gamepad2, path: '/admin/devices', roles: ['OWNER', 'ADMIN'] },
      { label: 'Pustaka Game', icon: Joystick, path: '/admin/games', roles: ['OWNER', 'ADMIN'] },
    ],
  },
  {
    title: 'Kafe & Kasir',
    items: [
      { label: 'Menu F&B', icon: UtensilsCrossed, path: '/admin/products', roles: ['OWNER', 'ADMIN', 'STAFF_CAFE'] },
      { label: 'Pesanan Meja', icon: ShoppingBag, path: '/admin/orders', roles: ['OWNER', 'ADMIN', 'STAFF_CAFE'] },
      { label: 'Transaksi Kasir', icon: Receipt, path: '/admin/transactions', roles: ['OWNER', 'ADMIN'] },
      { label: 'Cafe Dashboard', icon: LayoutDashboard, path: '/cafe/dashboard', roles: ['STAFF_CAFE'] },
    ],
  },
  {
    title: 'Sistem & Pelanggan',
    items: [
      { label: 'Masukan & Request', icon: MessageSquare, path: '/admin/feedback', roles: ['OWNER', 'ADMIN'] },
      { label: 'Kelola Staf', icon: Users, path: '/admin/staff', roles: ['OWNER'] },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <>
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[270px] bg-white flex flex-col justify-between z-50 select-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ── TOP BRAND HEADER ── */}
        <div>
          <div className="h-16 flex items-center justify-between px-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
              <img
                src="/images/logoElysiumFix.png"
                alt="Elysium Arena"
                className="h-8 w-auto rounded-md object-contain"
              />
              <div>
                <h1 className="font-display font-black text-zinc-950 text-base tracking-wider uppercase leading-none">
                  Elysium Arena
                </h1>
                <p className="text-zinc-500 text-[10px] uppercase font-mono-tech tracking-widest mt-0.5 font-semibold">
                  Admin Console
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── GROUPED NAVIGATION LINKS ── */}
          <nav className="p-3.5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
            {NAV_GROUPS.map((group) => {
              const visibleItems = group.items.filter((item) => item.roles.includes(user?.role));
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.title} className="space-y-1">
                  <p className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono-tech mb-1.5">
                    {group.title}
                  </p>
                  {visibleItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => onClose?.()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-cust-red text-white shadow-sm font-bold'
                            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ── BOTTOM USER FOOTER CARD ── */}
        <div className="p-3 bg-white">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-xs shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-zinc-950 text-xs font-bold truncate leading-tight">
                  {user?.name}
                </p>
                <span className="text-[10px] text-zinc-500 font-mono-tech uppercase font-semibold">
                  {user?.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar / Logout"
              className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-red-50 hover:text-red-600 border border-zinc-200 text-zinc-600 flex items-center justify-center transition shrink-0 ml-1 cursor-pointer"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
