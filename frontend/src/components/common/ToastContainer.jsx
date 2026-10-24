import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-700',
    iconBg: 'bg-emerald-100 border-zinc-950',
    accentBorder: 'border-l-emerald-600',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-rose-700',
    iconBg: 'bg-rose-100 border-zinc-950',
    accentBorder: 'border-l-rose-600',
  },
  info: {
    icon: Info,
    iconClass: 'text-cust-red',
    iconBg: 'bg-red-50 border-zinc-950',
    accentBorder: 'border-l-cust-red',
  },
};

export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2.5 sm:max-w-sm pointer-events-none print:hidden">
      {toasts.map((t) => {
        const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
        const Icon = config.icon;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 bg-white border border-zinc-950 rounded-xl p-3.5 shadow-[4px_4px_0px_0px_#18181b] pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200 border-l-4 ${config.accentBorder}`}
          >
            <div className={`p-1 rounded-lg border shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_#18181b] ${config.iconBg}`}>
              <Icon size={16} className={config.iconClass} />
            </div>
            <p className="text-zinc-950 text-xs sm:text-sm font-bold flex-1 leading-snug pt-0.5">
              {t.message}
            </p>
            <button
              onClick={() => onRemove(t.id)}
              className="text-zinc-400 hover:text-zinc-950 p-1 hover:bg-zinc-100 rounded-md transition shrink-0 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
