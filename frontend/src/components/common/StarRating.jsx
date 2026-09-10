import { Star } from 'lucide-react';

export default function StarRating({ value = 0, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= Math.round(value);
        return (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(s)}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
          >
            <Star
              size={size}
              className={filled ? 'text-cust-red' : 'text-cust-border'}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={filled ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}