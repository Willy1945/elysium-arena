export default function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`bg-white/[0.06] animate-pulse ${rounded} ${className}`}
    />
  );
}