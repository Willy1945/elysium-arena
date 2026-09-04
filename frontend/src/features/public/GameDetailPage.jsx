import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Joystick, Gamepad2, Monitor, ArrowRight } from 'lucide-react';
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
  occupied: { label: 'Dipakai', dot: 'bg-cust-red' },
  booked: { label: 'Dibooking', dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance', dot: 'bg-gray-500' },
};

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Memuat data...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!game) {
    return (
      <PublicLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-cust-text-secondary text-sm">Game tidak ditemukan.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/browse-games" className="inline-flex items-center gap-1.5 text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase mb-8 transition">
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cover */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] bg-cust-elevated border border-cust-border overflow-hidden">
              {game.cover_image ? (
                <img src={resolveImageUrl(game.cover_image)} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Joystick size={48} className="text-cust-text-secondary opacity-30" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-4">
              {game.platforms?.map((p) => (
                <span
                  key={p}
                  className="text-xs font-bold text-white px-3 py-1.5"
                  style={{ backgroundColor: PLATFORM_STYLE[p] || '#666' }}
                >
                  {p}
                </span>
              ))}
            </div>

            <h1 className="text-cust-text-primary font-black text-3xl sm:text-4xl uppercase leading-tight mb-6">
              {game.name}
            </h1>

            {game.description && (
              <p className="text-cust-text-secondary text-base leading-relaxed mb-10">{game.description}</p>
            )}

            <div className="border-t border-cust-border pt-8">
              <h2 className="text-cust-text-primary font-black uppercase text-lg mb-5">Tersedia di Device</h2>

              {game.devices?.length === 0 ? (
                <p className="text-cust-text-secondary text-sm">Game ini belum terpasang di device manapun.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.devices?.map((device) => {
                    const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
                    const isAvailable = device.status === 'available';
                    const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;

                    return (
                      <Link
                        key={device.id}
                        to="/browse-devices"
                        className="flex items-center justify-between bg-cust-elevated border border-cust-border p-4 hover:border-cust-red transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cust-bg border border-cust-border flex items-center justify-center">
                            <TypeIcon size={18} className="text-cust-text-secondary" />
                          </div>
                          <div>
                            <p className="text-cust-text-primary font-bold text-sm">{device.code}</p>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-cust-text-secondary mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>
                        </div>
                        {isAvailable && (
                          <ArrowRight size={16} className="text-cust-text-secondary group-hover:text-cust-red group-hover:translate-x-1 transition-all" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}