export default function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-cust-text-secondary text-xs w-6">{star}★</span>
      <div className="flex-1 h-1.5 bg-cust-bg overflow-hidden">
        <div className="h-full bg-cust-red transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-cust-text-secondary text-xs w-6 text-right">{count}</span>
    </div>
  );
}