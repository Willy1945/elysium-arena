import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-cust-elevated border-t border-cust-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="/images/logo.png" alt="Elysium Arena" className="h-12 w-auto" />
            <span className="text-cust-text-primary font-black text-xl uppercase">Elysium Arena</span>
          </div>
          <p className="text-cust-text-secondary text-base leading-relaxed max-w-sm">
            Gaming center dengan PS5, PS4, dan PC spek tinggi. Booking online, main tanpa antre.
          </p>
        </div>

        <div>
          <h4 className="text-cust-text-primary font-bold uppercase text-base mb-6">Link Cepat</h4>
          <div className="flex flex-col gap-4">
            <Link to="/browse-devices" className="text-cust-text-secondary hover:text-cust-red text-base transition">Device</Link>
            <Link to="/browse-games" className="text-cust-text-secondary hover:text-cust-red text-base transition">Katalog Game</Link>
            <Link to="/login" className="text-cust-text-secondary hover:text-cust-red text-base transition">Masuk</Link>
          </div>
        </div>

        <div>
          <h4 className="text-cust-text-primary font-bold uppercase text-base mb-6">Jam Buka</h4>
          <p className="text-cust-text-secondary text-base">Setiap Hari</p>
          <p className="text-cust-text-primary font-bold text-lg">10:00 - 22:00 WIB</p>
        </div>

        <div>
          <h4 className="text-cust-text-primary font-bold uppercase text-base mb-6">Lokasi</h4>
          <p className="text-cust-text-secondary text-sm leading-relaxed">
            Jl. Mayor Abdurahman No.209,<br />Sumedang, Jawa Barat 45323
          </p>
        </div>
      </div>

      <div className="border-t border-cust-border px-4 sm:px-6 py-7">
        <p className="max-w-7xl mx-auto text-cust-text-secondary text-sm">
          © {new Date().getFullYear()} Elysium Arena. All rights reserved.
        </p>
      </div>
    </footer>
  );
}