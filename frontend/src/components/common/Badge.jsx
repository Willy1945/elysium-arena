import React from 'react';

const PRESETS = {

  'status-available': {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  available: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  confirmed: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  paid: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  lunas: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  ready: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  in_stock: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  success: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  green: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-950 border-zinc-950',
    dot: 'bg-emerald-600 border-zinc-950/60',
  },

  'status-booked': {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  booked: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  pending: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  low_stock: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  yellow: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },
  orange: {
    badge: 'bg-amber-100 text-amber-950 border-zinc-950',
    dot: 'bg-amber-500 border-zinc-950/60',
  },

  'status-occupied': {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  occupied: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  cancelled: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  batal: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  failed: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  gagal: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  out_of_stock: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  danger: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  error: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  red: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },
  rose: {
    badge: 'bg-rose-100 text-rose-950 border-zinc-950',
    dot: 'bg-rose-600 border-zinc-950/60',
  },

  'status-maintenance': {
    badge: 'bg-sky-100 text-sky-950 border-zinc-950',
    dot: 'bg-sky-600 border-zinc-950/60',
  },
  completed: {
    badge: 'bg-sky-100 text-sky-950 border-zinc-950',
    dot: 'bg-sky-600 border-zinc-950/60',
  },
  selesai: {
    badge: 'bg-sky-100 text-sky-950 border-zinc-950',
    dot: 'bg-sky-600 border-zinc-950/60',
  },
  processing: {
    badge: 'bg-blue-100 text-blue-950 border-zinc-950',
    dot: 'bg-blue-600 border-zinc-950/60',
  },
  delivered: {
    badge: 'bg-indigo-100 text-indigo-950 border-zinc-950',
    dot: 'bg-indigo-600 border-zinc-950/60',
  },
  maintenance: {
    badge: 'bg-zinc-200 text-zinc-950 border-zinc-950',
    dot: 'bg-zinc-500 border-zinc-950/60',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-950 border-zinc-950',
    dot: 'bg-blue-600 border-zinc-950/60',
  },
  sky: {
    badge: 'bg-sky-100 text-sky-950 border-zinc-950',
    dot: 'bg-sky-600 border-zinc-950/60',
  },

  neutral: {
    badge: 'bg-zinc-100 text-zinc-900 border-zinc-950',
    dot: 'bg-zinc-400 border-zinc-950/60',
  },
};

function resolveTheme(colorVar, children) {
  if (colorVar && PRESETS[colorVar]) {
    return PRESETS[colorVar];
  }
  if (typeof children === 'string') {
    const text = children.trim().toLowerCase();
    if (PRESETS[text]) return PRESETS[text];
    if (text.includes('lunas') || text.includes('confirm') || text.includes('siap') || text.includes('aman')) {
      return PRESETS.confirmed;
    }
    if (text.includes('pending') || text.includes('tunggu') || text.includes('menipis') || text.includes('booked')) {
      return PRESETS.pending;
    }
    if (text.includes('batal') || text.includes('cancel') || text.includes('gagal') || text.includes('habis')) {
      return PRESETS.cancelled;
    }
    if (text.includes('selesai') || text.includes('complete') || text.includes('diantar')) {
      return PRESETS.completed;
    }
  }
  return PRESETS.neutral;
}

export default function Badge({ colorVar, children, className = '' }) {
  const theme = resolveTheme(colorVar, children);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold uppercase tracking-wider border shadow-[1px_1px_0px_0px_#18181b] transition ${theme.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full border shrink-0 ${theme.dot}`} />
      <span>{children}</span>
    </span>
  );
}
