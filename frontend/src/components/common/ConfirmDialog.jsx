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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2 font-display uppercase tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white transition disabled:opacity-50"
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition disabled:opacity-50 ${
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