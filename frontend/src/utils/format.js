const API_ORIGIN = import.meta.env.VITE_API_URL.replace('/api', '');

export function resolveImageUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export const STATUS_CONFIG = {
  available: { label: 'Available', color: 'status-available' },
  occupied: { label: 'Occupied', color: 'status-occupied' },
  booked: { label: 'Booked', color: 'status-booked' },
  maintenance: { label: 'Maintenance', color: 'status-maintenance' },
};

export const BOOKING_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'status-booked' },
  confirmed: { label: 'Confirmed', color: 'status-available' },
  cancelled: { label: 'Cancelled', color: 'status-occupied' },
  completed: { label: 'Completed', color: 'status-maintenance' },
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
  in_stock: { label: 'Stok Aman', color: 'status-available' },
  low_stock: { label: 'Stok Menipis', color: 'status-booked' },
  out_of_stock: { label: 'Stok Habis', color: 'status-occupied' },
};

export const ORDER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'status-booked' },
  processing: { label: 'Processing', color: 'status-occupied' },
  ready: { label: 'Ready', color: 'status-available' },
  delivered: { label: 'Delivered', color: 'status-maintenance' },
  completed: { label: 'Completed', color: 'status-maintenance' },
  cancelled: { label: 'Cancelled', color: 'status-occupied' },
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
  pending: { label: 'Belum Dibayar', color: 'status-booked' },
  paid: { label: 'Lunas', color: 'status-available' },
  failed: { label: 'Gagal', color: 'status-occupied' },
  cancelled: { label: 'Dibatalkan', color: 'status-occupied' },
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