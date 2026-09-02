import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-cust-elevated border-t border-cust-border mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/images/logo.png" alt="Elysium Arena" className="h-9 w-auto" />
            <span className="text-cust-text-primary font-black uppercase">Elysium Arena</span>
          </div>
          <p className="text-cust-text-secondary text-sm leading-relaxed">
            Gaming center dengan PS5, PS4, dan PC spek tinggi. Booking online, main tanpa antri.
          </p>
        </div>

        <div>
          <h4 className="text-cust-text-primary font-bold uppercase text-sm mb-4">Link Cepat</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/browse-devices" className="text-cust-text-secondary hover:text-cust-red text-sm transition">Device</Link>
            <Link to="/browse-games" className="text-cust-text-secondary hover:text-cust-red text-sm transition">Katalog Game</Link>
            <Link to="/login" className="text-cust-text-secondary hover:text-cust-red text-sm transition">Masuk</Link>
          </div>
        </div>

        <div>
          <h4 className="text-cust-text-primary font-bold uppercase text-sm mb-4">Jam Buka</h4>
          <p className="text-cust-text-secondary text-sm">Setiap Hari</p>
          <p className="text-cust-text-primary font-bold text-sm">10:00 - 22:00 WIB</p>
        </div>
      </div>

      <div className="border-t border-cust-border px-4 sm:px-6 py-5">
        <p className="max-w-6xl mx-auto text-cust-text-secondary text-xs">
          © {new Date().getFullYear()} Elysium Arena. All rights reserved.
        </p>
      </div>
    </footer>
  );
}