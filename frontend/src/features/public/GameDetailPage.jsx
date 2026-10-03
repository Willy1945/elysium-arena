import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Joystick, Gamepad2, Monitor, ArrowRight, MessageCircle } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { resolveImageUrl } from '../../utils/format';

const PLATFORM_STYLE = {
  PS5: '#00439c',
  PS4: '#7c8794',
  PC: '#16a34a',
};

const STATUS_LABEL = {
  available: { label: 'Tersedia', dot: 'bg-green-500' },
  occupied: { label: 'Digunakan', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicService.getGameById(id).then(({ data }) => {
      setGame(data.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!game) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Game tidak ditemukan.</p>
        </div>
      </PublicLayout>
    );
  }

  const availableCount = game.devices?.filter((d) => d.status === 'available').length || 0;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <Link to="/browse-games" className="inline-flex items-center gap-2 bg-cust-elevated border border-cust-border px-4 py-2 text-xs font-bold uppercase text-cust-text-primary hover:border-cust-red transition">
            <ArrowLeft size={14} /> Kembali ke Katalog
          </Link>
          <span className="font-mono-tech text-cust-text-secondary text-xs">
            Katalog Game <span className="text-cust-border mx-1">/</span> <span className="text-cust-red">ID #{game.id}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri — Cover & Info Ringkas */}
          <div className="lg:col-span-4">
            <div className="relative aspect-[3/4] bg-cust-elevated border border-cust-border overflow-hidden mb-4">
              {game.cover_image ? (
                <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Joystick size={48} className="text-cust-text-secondary opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex gap-1.5">
                {game.platforms?.map((p) => (
                  <span key={p} className="text-xs font-bold text-white px-2.5 py-1" style={{ backgroundColor: PLATFORM_STYLE[p] || '#666' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-cust-elevated border border-cust-border p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-cust-border">
                <span className="font-mono-tech text-cust-text-secondary text-[10px] font-bold uppercase">Ringkasan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cust-text-secondary text-xs">Total Device</span>
                <span className="text-cust-text-primary font-bold text-sm">{game.devices?.length || 0} Unit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cust-text-secondary text-xs">Siap Main Sekarang</span>
                <span className="text-green-400 font-bold text-sm">{availableCount} Unit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cust-text-secondary text-xs">Platform</span>
                <span className="text-cust-text-primary font-bold text-sm">{game.platforms?.join(' / ')}</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan — Detail & Station */}
          <div className="lg:col-span-8">
            <h1 className="font-display font-black text-cust-text-primary text-3xl sm:text-4xl uppercase leading-tight mb-4">
              {game.name}
            </h1>

            {game.description && (
              <div className="bg-cust-elevated border border-cust-border p-6 mb-8">
                <p className="text-cust-text-secondary text-base leading-relaxed">{game.description}</p>
              </div>
            )}

            {/* Tersedia di Device */}
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <h2 className="font-display font-black text-cust-text-primary text-xl uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-cust-red rotate-45" />
                  Tersedia di Device
                </h2>
                <span className="font-mono-tech text-cust-text-secondary text-xs">
                  {game.devices?.length || 0} Station Terpasang <span className="text-green-400 ml-1">• {availableCount} Ready</span>
                </span>
              </div>

              {(!game.devices || game.devices.length === 0) ? (
                <p className="text-cust-text-secondary text-sm">Game ini belum terpasang di device manapun.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.devices.map((device) => {
                    const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
                    const isAvailable = device.status === 'available';
                    const isOccupied = device.status === 'occupied';
                    const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;

                    return (
                      <div key={device.id} className={`bg-cust-elevated border p-4 ${isAvailable ? 'border-cust-border' : 'border-cust-border opacity-80'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cust-bg border border-cust-border flex items-center justify-center shrink-0">
                              <TypeIcon size={17} className="text-cust-text-secondary" />
                            </div>
                            <div>
                              <p className="text-cust-text-primary font-black text-sm uppercase">{device.code}</p>
                              <p className="font-mono-tech text-cust-text-secondary text-[11px]">{device.device_type?.name}</p>
                            </div>
                          </div>
                          <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 border ${isAvailable ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-cust-border text-cust-text-secondary bg-cust-bg'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-cust-border">
                          {isOccupied && device.estimated_free_at ? (
                            <div>
                              <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">Estimasi Selesai</p>
                              <p className="text-cust-red font-bold text-sm">{formatTime(device.estimated_free_at)} WIB</p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-mono-tech text-cust-text-secondary text-[10px] uppercase">Tarif Sewa</p>
                              <p className="text-cust-text-primary font-bold text-sm">
                                Rp{Math.round(device.price_per_hour / 1000)}K<span className="text-cust-text-secondary text-xs font-normal">/jam</span>
                              </p>
                            </div>
                          )}
                          <Link
                            to="/browse-devices"
                            className={`flex items-center gap-1 text-xs font-bold uppercase px-4 py-2.5 transition ${isAvailable ? 'bg-cust-red hover:bg-cust-red-dark text-white' : 'bg-cust-border text-cust-text-secondary pointer-events-none'
                              }`}
                          >
                            Pilih Device <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Bantuan */}
        <div className="bg-cust-elevated border border-cust-border p-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cust-red/15 flex items-center justify-center shrink-0">
              <MessageCircle size={20} className="text-cust-red" />
            </div>
            <div>
              <p className="text-cust-text-primary font-black uppercase text-base mb-1">Mau Game Ini Ditambahkan ke Device Lain?</p>
              <p className="text-cust-text-secondary text-sm">Kirim request lewat pesan ke admin, kami usahakan bantu.</p>
            </div>
          </div>
          <Link
            to="/feedback"
            className="shrink-0 bg-cust-bg border border-cust-border hover:border-cust-red text-cust-text-primary font-bold text-sm px-6 py-3.5 transition whitespace-nowrap"
          >
            Kirim Pesan ke Admin
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}