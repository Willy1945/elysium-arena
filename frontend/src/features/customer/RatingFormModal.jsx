import { useState } from 'react';
import { X } from 'lucide-react';
import StarRating from '../../components/common/StarRating';

export default function RatingFormModal({ open, onClose, onSubmit, deviceCode, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-cust-elevated border border-cust-border p-7 max-w-sm w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-cust-text-primary font-black uppercase text-base">Beri Rating — {deviceCode}</h3>
          <button type="button" onClick={onClose} className="text-cust-text-secondary hover:text-cust-text-primary">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 mb-6">
          <StarRating value={rating} size={32} interactive onChange={setRating} />
          <p className="text-cust-text-secondary text-xs">
            {rating > 0 ? `${rating} dari 5 bintang` : 'Ketuk bintang untuk menilai'}
          </p>
        </div>

        <textarea
          rows={3}
          placeholder="Ceritakan pengalaman kamu (opsional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm p-3 outline-none focus:border-cust-red transition mb-5"
        />

        <button
          type="submit"
          disabled={rating === 0 || loading}
          className="w-full bg-cust-red hover:bg-cust-red-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold uppercase text-sm py-3.5 transition"
        >
          {loading ? 'Mengirim...' : 'Kirim Rating'}
        </button>
      </form>
    </div>
  );
}