import { useState } from 'react';
import { X, Star } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <h3 className="font-display font-black text-white uppercase text-lg tracking-wide">
              Beri Ulasan Arena {deviceCode ? `— ${deviceCode}` : ''}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2.5 mb-6 py-2">
          <StarRating value={rating} size={32} interactive onChange={setRating} />
          <p className="text-zinc-400 text-xs font-medium">
            {rating > 0 ? `${rating} dari 5 bintang` : 'Pilih bintang untuk memberikan rating'}
          </p>
        </div>

        <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
          Ulasan & Pengalaman Bermain
        </label>
        <textarea
          rows={3}
          placeholder="Ceritakan pengalaman bermainmu (kenyamanan rig, layar, koneksi, atau layanan kafe)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-xs sm:text-sm p-3.5 outline-none focus:border-cust-red transition mb-5"
        />

        <button
          type="submit"
          disabled={rating === 0 || loading}
          className="w-full bg-cust-red hover:bg-cust-red-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl shadow-sm transition"
        >
          {loading ? 'Mengirim Rating...' : 'Kirim Ulasan Sekarang'}
        </button>
      </form>
    </div>
  );
}