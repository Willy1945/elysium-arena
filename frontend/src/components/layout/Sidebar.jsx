import { NavLink } from 'react-router-dom';
import {
  Gamepad2, LayoutDashboard, CalendarCheck, Joystick,
  UtensilsCrossed, ShoppingBag, Package, Receipt, BarChart3, Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Timer } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', roles: ['OWNER', 'ADMIN'] },
  { label: 'Cafe Dashboard', icon: LayoutDashboard, path: '/cafe/dashboard', roles: ['STAFF_CAFE'] },
  { label: 'Devices', icon: Gamepad2, path: '/admin/devices', roles: ['OWNER', 'ADMIN'] },
  { label: 'Games', icon: Joystick, path: '/admin/games', roles: ['OWNER', 'ADMIN'] },
  { label: 'Bookings', icon: CalendarCheck, path: '/admin/bookings', roles: ['OWNER', 'ADMIN'] },
  { label: 'Food & Beverage', icon: UtensilsCrossed, path: '/admin/products', roles: ['OWNER', 'ADMIN', 'STAFF_CAFE'] },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders', roles: ['OWNER', 'ADMIN', 'STAFF_CAFE'] },
  { label: 'Inventory', icon: Package, path: '/admin/inventory', roles: ['OWNER', 'ADMIN'] },
  { label: 'Transactions', icon: Receipt, path: '/admin/transactions', roles: ['OWNER', 'ADMIN'] },
  { label: 'Reports', icon: BarChart3, path: '/admin/reports', roles: ['OWNER'] },
  { label: 'Sessions', icon: Timer, path: '/admin/sessions', roles: ['OWNER', 'ADMIN'] },
  { label: 'Settings', icon: Settings, path: '/admin/settings', roles: ['OWNER', 'ADMIN', 'STAFF_CAFE'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-surface-elevated border-r border-border flex flex-col py-6 px-4">
      <div className="flex items-center gap-2 px-2 pb-6">
        <Gamepad2 className="text-accent-light" size={28} />
        <div>
          <h1 className="text-accent-light font-bold text-lg leading-tight">ELYSIUM<br />ARENA</h1>
          <p className="text-text-secondary text-[11px] tracking-wider uppercase">Management Hub</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-auto">
        {items.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${isActive
                ? 'bg-accent text-accent-lighter font-semibold'
                : 'text-text-secondary hover:bg-surface-inset'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}