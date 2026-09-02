import { X } from 'lucide-react';

const OPTIONS = [
  { label: '+30 Menit', value: 30 },
  { label: '+1 Jam', value: 60 },
  { label: '+2 Jam', value: 120 },
];

export default function ExtendSessionModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">Tambah Waktu</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={loading}
              onClick={() => onConfirm(opt.value)}
              className="w-full bg-surface-inset border border-border rounded-lg py-3 text-sm text-text-primary hover:border-accent/50 hover:bg-accent/10 transition disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}