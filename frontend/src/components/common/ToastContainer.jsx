import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const TOAST_CONFIG = {
  success: { icon: CheckCircle2, colorVar: 'status-available' },
  error: { icon: XCircle, colorVar: 'status-occupied' },
  info: { icon: Info, colorVar: 'accent-light' },
};

export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
        const Icon = config.icon;
        return (
          <div
            key={t.id}
            className="flex items-start gap-2.5 bg-surface-elevated border border-border rounded-lg p-3.5 shadow-lg"
            style={{ borderLeftWidth: 3, borderLeftColor: `var(--color-${config.colorVar})` }}
          >
            <Icon size={18} style={{ color: `var(--color-${config.colorVar})` }} className="shrink-0 mt-0.5" />
            <p className="text-text-primary text-sm flex-1">{t.message}</p>
            <button onClick={() => onRemove(t.id)} className="text-text-secondary hover:text-text-primary shrink-0">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}