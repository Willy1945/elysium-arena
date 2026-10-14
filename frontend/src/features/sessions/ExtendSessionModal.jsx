import { useState } from 'react';
import { X, PlusCircle, MinusCircle, Clock } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-semibold">
              Kompensasi & Perpanjangan
            </span>
            <h3 className="text-white font-black text-xl font-display uppercase tracking-tight">
              Kelola Durasi Sesi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Tambah vs Kurangi */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition ${
              mode === 'add'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <PlusCircle size={14} /> Tambah Waktu
          </button>

          <button
            type="button"
            onClick={() => setMode('reduce')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition ${
              mode === 'reduce'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MinusCircle size={14} /> Kurangi Waktu
          </button>
        </div>

        {/* Opsi Pilihan Waktu */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {(mode === 'add' ? ADD_OPTIONS : REDUCE_OPTIONS).map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => onConfirm(opt.value)}
              className={`w-full border rounded-2xl py-3.5 text-xs font-bold font-mono-tech transition disabled:opacity-50 ${
                mode === 'add'
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Perubahan waktu bermain akan otomatis disinkronkan ke PC stasiun dan timer dashboard.
        </p>
      </div>
    </div>
  );
}