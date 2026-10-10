import { useState } from 'react';
import { X, PlusCircle, MinusCircle } from 'lucide-react';

const ADD_OPTIONS = [
  { label: '+15 Menit', value: 15 },
  { label: '+30 Menit', value: 30 },
  { label: '+1 Jam', value: 60 },
  { label: '+2 Jam', value: 120 },
];

const REDUCE_OPTIONS = [
  { label: '-15 Menit', value: -15 },
  { label: '-30 Menit', value: -30 },
  { label: '-1 Jam', value: -60 },
  { label: '-2 Jam', value: -120 },
];

export default function ExtendSessionModal({ open, onClose, onConfirm, loading }) {
  const [mode, setMode] = useState('add'); // 'add' | 'reduce'

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-bold text-lg">Kelola Durasi Sesi</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Tambah vs Kurangi */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-inset rounded-lg mb-4 border border-border/50">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition ${
              mode === 'add'
                ? 'bg-status-available/15 text-status-available border border-status-available/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <PlusCircle size={14} /> Tambah Waktu
          </button>

          <button
            type="button"
            onClick={() => setMode('reduce')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition ${
              mode === 'reduce'
                ? 'bg-status-occupied/15 text-status-occupied border border-status-occupied/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <MinusCircle size={14} /> Kurangi Waktu
          </button>
        </div>

        {/* Opsi Pilihan Waktu */}
        <div className="grid grid-cols-2 gap-2">
          {(mode === 'add' ? ADD_OPTIONS : REDUCE_OPTIONS).map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => onConfirm(opt.value)}
              className={`w-full border rounded-lg py-3 text-sm font-semibold transition disabled:opacity-50 ${
                mode === 'add'
                  ? 'bg-surface-inset border-border text-text-primary hover:border-status-available hover:bg-status-available/10 hover:text-status-available'
                  : 'bg-surface-inset border-border text-text-primary hover:border-status-occupied hover:bg-status-occupied/10 hover:text-status-occupied'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-text-secondary text-center mt-4">
          Perubahan waktu akan otomatis disinkronkan ke PC stasiun.
        </p>
      </div>
    </div>
  );
}