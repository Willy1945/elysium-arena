import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Monitor, ArrowRight } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { publicService } from '../../api/publicService';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/format';

const STATUS_LABEL = {
    available: { label: 'Tersedia', dot: 'bg-green-500', text: 'text-green-500' },
    occupied: { label: 'Dipakai', dot: 'bg-cust-red', text: 'text-cust-red' },
    booked: { label: 'Dibooking', dot: 'bg-yellow-500', text: 'text-yellow-500' },
    maintenance: { label: 'Maintenance', dot: 'bg-gray-500', text: 'text-gray-500' },
};

export default function BrowseDevicesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDevices = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (activeFilter !== 'All') params.type = activeFilter;
            if (search) params.search = search;
            const { data } = await publicService.getDevices(params);
            setDevices(data.data);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, search]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    const handleBooking = (device) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/dashboard/booking/${device.id}`);
    };

    const filters = ['All', 'PS5', 'PS4', 'PC'];

    return (
        <PublicLayout>
            {/* ── HEADER ── */}
            <section
                className="relative overflow-hidden min-h-[420px] flex items-center"
                style={{ backgroundImage: "url('/images/device-room.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-cust-bg/75" />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center w-full">
                    <div className="inline-flex items-center gap-2 bg-cust-elevated border border-cust-border px-4 py-2 mb-6 text-xs font-bold uppercase">
                        <Link to="/" className="text-cust-text-secondary hover:text-cust-text-primary transition">Beranda</Link>
                        <span className="text-cust-text-secondary">›</span>
                        <span className="text-cust-red">Device</span>
                    </div>

                    <h1 className="text-cust-text-primary font-black text-3xl sm:text-5xl uppercase leading-tight mb-2">
                        Semua Gaming <span className="text-cust-red">Station</span>
                    </h1>
                    <div className="w-16 h-1 bg-cust-red mx-auto mb-6" />
                    <p className="text-cust-text-secondary text-base max-w-xl mx-auto">
                        Cek ketersediaan real-time, pilih device, dan booking slot waktu sebelum datang.
                    </p>
                </div>
            </section>

            {/* ── FILTER & SEARCH ── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-5 py-2.5 text-sm font-bold uppercase transition ${activeFilter === f
                                        ? 'bg-cust-red text-white'
                                        : 'border border-cust-border text-cust-text-secondary hover:border-cust-red hover:text-cust-text-primary'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        placeholder="Cari kode device..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-cust-elevated border border-cust-border text-cust-text-primary text-sm px-4 py-2.5 outline-none focus:border-cust-red transition sm:w-64"
                    />
                </div>
            </section>

            {/* ── GRID DEVICE ── */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
                {loading ? (
                    <p className="text-cust-text-secondary text-sm">Memuat data...</p>
                ) : devices.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-cust-border">
                        <p className="text-cust-text-secondary text-sm">Tidak ada device yang cocok dengan pencarian.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devices.map((device) => {
                            const status = STATUS_LABEL[device.status] || STATUS_LABEL.available;
                            const TypeIcon = device.device_type?.name === 'PC' ? Monitor : Gamepad2;
                            const isAvailable = device.status === 'available';

                            return (
                                <div
                                    key={device.id}
                                    className="bg-cust-elevated border border-cust-border overflow-hidden hover:border-cust-red transition group"
                                >
                                    <div className="h-48 bg-cust-bg relative overflow-hidden">
                                        {device.photo ? (
                                            <img
                                                src={resolveImageUrl(device.photo)}
                                                alt={device.code}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <TypeIcon size={40} className="text-cust-text-secondary opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1">
                                            <span className="text-white text-xs font-bold uppercase">{device.device_type?.name}</span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-cust-text-primary font-black uppercase text-lg">{device.code}</h3>
                                            <span className={`flex items-center gap-1.5 text-xs font-bold uppercase ${status.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                {status.label}
                                            </span>
                                        </div>

                                        <p className="text-cust-text-secondary text-sm mb-1">Harga per Jam</p>
                                        <p className="text-cust-text-primary font-black text-2xl mb-5">
                                            Rp {Number(device.price_per_hour).toLocaleString('id-ID')}
                                        </p>

                                        {device.games?.length > 0 && (
                                            <p className="text-cust-text-secondary text-xs mb-5">
                                                {device.games.length} game tersedia
                                            </p>
                                        )}

                                        <button
                                            onClick={() => handleBooking(device)}
                                            disabled={!isAvailable}
                                            className="w-full flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark disabled:bg-cust-border disabled:text-cust-text-secondary disabled:cursor-not-allowed text-white font-bold uppercase text-sm py-3.5 transition"
                                        >
                                            {isAvailable ? (
                                                <>Booking Sekarang <ArrowRight size={16} /></>
                                            ) : (
                                                'Tidak Tersedia'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}