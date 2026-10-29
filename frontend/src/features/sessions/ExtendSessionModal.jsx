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
  const [mode, setMode] = useState('add');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-950 rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-[4px_4px_0px_0px_#18181b]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div>
            <span className="text-[10px] font-mono-tech text-cust-red uppercase tracking-widest font-bold">
              Kompensasi & Perpanjangan
            </span>
            <h3 className="text-zinc-950 font-black text-xl font-display uppercase tracking-tight">
              Kelola Durasi Sesi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 border border-zinc-950 rounded-xl mb-5 shadow-[2px_2px_0px_0px_#18181b]">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
              mode === 'add'
                ? 'bg-emerald-600 text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <PlusCircle size={14} /> Tambah Waktu
          </button>

          <button
            type="button"
            onClick={() => setMode('reduce')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
              mode === 'reduce'
                ? 'bg-rose-600 text-white border border-zinc-950 shadow-[1px_1px_0px_0px_#18181b]'
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            <MinusCircle size={14} /> Kurangi Waktu
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {(mode === 'add' ? ADD_OPTIONS : REDUCE_OPTIONS).map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => onConfirm(opt.value)}
              className={`w-full border border-zinc-950 rounded-xl py-3.5 text-xs font-black font-mono-tech transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 ${
                mode === 'add'
                  ? 'bg-white text-zinc-950 hover:bg-emerald-50'
                  : 'bg-white text-zinc-950 hover:bg-rose-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-zinc-600 text-center leading-relaxed font-medium">
          Perubahan waktu bermain akan otomatis disinkronkan ke PC stasiun dan timer dashboard.
        </p>
      </div>
    </div>
  );
}
