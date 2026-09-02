import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AdjustStockModal({ open, onClose, onSubmit, product, loading }) {
  const [type, setType] = useState('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) {
      setType('in');
      setQuantity('');
      setReason('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, quantity: Number(quantity), reason });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">Sesuaikan Stok</h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <p className="text-text-secondary text-sm mb-4">
          {product?.name} — Stok saat ini: <span className="text-text-primary font-medium">{product?.stock}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType('in')}
            className={`py-2 rounded-lg text-sm border transition ${type === 'in' ? 'border-status-available bg-status-available/10 text-status-available' : 'border-border text-text-secondary'}`}
          >
            Stok Masuk (+)
          </button>
          <button
            type="button"
            onClick={() => setType('out')}
            className={`py-2 rounded-lg text-sm border transition ${type === 'out' ? 'border-status-occupied bg-status-occupied/10 text-status-occupied' : 'border-border text-text-secondary'}`}
          >
            Stok Keluar (-)
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Jumlah</label>
          <input
            required
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-text-secondary text-xs mb-1">Alasan</label>
          <input
            required
            placeholder="Restock dari supplier / Barang rusak / dll"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:opacity-90 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}