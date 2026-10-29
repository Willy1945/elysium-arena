const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, '');

export function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ORIGIN}${cleanPath}`;
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export const STATUS_CONFIG = {
  available: {
    label: 'Available',
    color: 'available',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-zinc-950 font-bold',
  },
  occupied: {
    label: 'Occupied',
    color: 'occupied',
    badgeClass: 'bg-rose-100 text-rose-950 border-zinc-950 font-bold',
  },
  booked: {
    label: 'Booked',
    color: 'booked',
    badgeClass: 'bg-amber-100 text-amber-950 border-zinc-950 font-bold',
  },
  maintenance: {
    label: 'Maintenance',
    color: 'maintenance',
    badgeClass: 'bg-zinc-200 text-zinc-950 border-zinc-950 font-bold',
  },
};

export const BOOKING_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'pending' },
  confirmed: { label: 'Confirmed', color: 'confirmed' },
  cancelled: { label: 'Cancelled', color: 'cancelled' },
  completed: { label: 'Completed', color: 'completed' },
};

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function addHoursToTime(time, hours) {
  const totalMinutes = timeToMinutes(time) + hours * 60;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isSlotAvailable(startTime, durationHours, bookedSlots) {
  const start = timeToMinutes(startTime);
  const end = start + durationHours * 60;
  return !bookedSlots.some((slot) => {
    const bookedStart = timeToMinutes(slot.start_time);
    const bookedEnd = timeToMinutes(slot.end_time);
    return start < bookedEnd && end > bookedStart;
  });
}

export const STOCK_STATUS_CONFIG = {
  in_stock: { label: 'Stok Aman', color: 'in_stock' },
  low_stock: { label: 'Stok Menipis', color: 'low_stock' },
  out_of_stock: { label: 'Stok Habis', color: 'out_of_stock' },
};

export const ORDER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'pending' },
  processing: { label: 'Processing', color: 'processing' },
  ready: { label: 'Ready', color: 'ready' },
  delivered: { label: 'Delivered', color: 'delivered' },
  completed: { label: 'Completed', color: 'completed' },
  cancelled: { label: 'Cancelled', color: 'cancelled' },
};

export const ORDER_STATUS_FLOW = {
  pending: 'processing',
  processing: 'ready',
  ready: 'delivered',
  delivered: 'completed',
};

export const ORDER_STATUS_ACTION_LABEL = {
  pending: 'Proses',
  processing: 'Tandai Siap',
  ready: 'Tandai Diantar',
  delivered: 'Selesaikan',
};

export const TRANSACTION_STATUS_CONFIG = {
  pending: { label: 'Belum Dibayar', color: 'pending' },
  paid: { label: 'Lunas', color: 'paid' },
  failed: { label: 'Gagal', color: 'failed' },
  cancelled: { label: 'Dibatalkan', color: 'cancelled' },
};

export const PAYMENT_METHOD_LABEL = {
  cash: 'Tunai',
  qris: 'QRIS',
  transfer: 'Transfer Bank',
};

export function timeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
