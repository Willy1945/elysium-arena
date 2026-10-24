export default function ConfirmDialog({
  open,
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  confirmLabel,
  confirmText,
  confirmingLabel,
  cancelLabel = 'Batal',
  cancelText,
  danger = true,
}) {
  const isVisible = open ?? isOpen;
  if (!isVisible) return null;

  const resolvedConfirm = confirmLabel || confirmText || (title?.toLowerCase().includes('hapus') ? 'Hapus' : 'Konfirmasi');
  const resolvedConfirming = confirmingLabel || (resolvedConfirm === 'Hapus' ? 'Menghapus...' : 'Memproses...');
  const resolvedCancel = cancelLabel || cancelText || 'Batal';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-950 rounded-2xl p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_#18181b]">
        <h3 className="text-zinc-950 font-black text-lg mb-2 font-display uppercase tracking-tight">{title}</h3>
        <p className="text-zinc-700 text-xs sm:text-sm mb-6 leading-relaxed font-medium">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 border border-zinc-950 bg-white hover:bg-zinc-100 transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 cursor-pointer"
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white border border-zinc-950 transition shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 cursor-pointer ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-cust-red hover:bg-cust-red-dark'
            }`}
          >
            {loading ? resolvedConfirming : resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
