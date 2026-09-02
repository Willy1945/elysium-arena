export default function Badge({ colorVar, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wide"
      style={{
        backgroundColor: `color-mix(in srgb, var(--color-${colorVar}) 10%, transparent)`,
        borderWidth: 1,
        borderColor: `color-mix(in srgb, var(--color-${colorVar}) 20%, transparent)`,
        color: `var(--color-${colorVar})`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: `var(--color-${colorVar})` }}
      />
      {children}
    </span>
  );
}