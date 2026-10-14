import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquarePlus, AlertCircle, Gamepad2, UtensilsCrossed, HelpCircle, Send, Trash2 } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { feedbackService } from '../../api/feedbackService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CATEGORY_OPTIONS = [
  { value: 'complaint', label: 'Keluhan', icon: AlertCircle },
  { value: 'game_request', label: 'Request Game', icon: Gamepad2 },
  { value: 'menu_request', label: 'Request Menu', icon: UtensilsCrossed },
  { value: 'other', label: 'Lainnya', icon: HelpCircle },
];

const STATUS_CONFIG = {
  pending: { label: 'Baru', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  in_review: { label: 'Ditinjau', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  resolved: { label: 'Selesai', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
};

export default function FeedbackPage() {
  const toast = useToast();
  const [category, setCategory] = useState('complaint');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchHistory = () => {
    setLoadingHistory(true);
    feedbackService.getAll().then(({ data }) => {
      setHistory(data.data);
      setLoadingHistory(false);
    });
  };

  const handleDeleteFeedback = async () => {
    if (!deletingFeedback) return;
    setActionLoading(true);
    try {
      await feedbackService.remove(deletingFeedback.id);
      toast.success('Masukan berhasil dihapus dari riwayat.');
      setDeletingFeedback(null);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus masukan.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await feedbackService.create({ category, subject, message });
      toast.success('Masukan berhasil dikirim. Terima kasih!');
      setSubject('');
      setMessage('');
      setCategory('complaint');
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim masukan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquarePlus size={14} />
            <span>Customer Voice & Request</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl sm:text-4xl uppercase tracking-tight">
            Kirim Masukan & Request
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Keluhan teknis, permintaan judul game baru, ide menu kafe, atau saran fasilitas — kami membaca dan menindaklanjuti setiap masukan.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-12">
          <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-3">
            Pilih Kategori
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`flex flex-col items-center gap-2 py-3.5 px-3 rounded-2xl border text-xs font-bold uppercase transition cursor-pointer ${
                  category === opt.value
                    ? 'border-cust-red bg-cust-red/10 text-cust-red'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <opt.icon size={18} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
            Judul Masukan
          </label>
          <input
            required
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ringkasan singkat masukan atau nama game/menu yang diinginkan..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm px-4 py-3 outline-none focus:border-cust-red transition mb-5"
          />

          <label className="block text-zinc-300 text-xs font-bold uppercase tracking-wider mb-2">
            Penjelasan Detail
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            placeholder="Tuliskan detail masukan kamu agar tim kami dapat memahami dan menindaklanjuti dengan cepat..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl text-white text-sm p-4 outline-none focus:border-cust-red transition mb-6"
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-xs tracking-wider px-7 py-3.5 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Send size={15} />
            <span>{submitting ? 'Mengirim Masukan...' : 'Kirim Masukan Sekarang'}</span>
          </button>
        </form>

        {/* Feedback History */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <MessageSquarePlus size={18} className="text-cust-red" />
            <h2 className="font-display font-black text-white uppercase text-xl">
              Riwayat Masukan Kamu
            </h2>
          </div>

          {loadingHistory ? (
            <p className="text-zinc-500 text-xs">Memuat riwayat masukan...</p>
          ) : history.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#121216] border border-zinc-800 text-center">
              <p className="text-zinc-500 text-xs">Belum ada masukan yang kamu kirimkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((f) => {
                const catOpt = CATEGORY_OPTIONS.find((c) => c.value === f.category);
                const status = STATUS_CONFIG[f.status] || STATUS_CONFIG.pending;
                return (
                  <div key={f.id} className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 sm:p-6">
                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {catOpt && <catOpt.icon size={15} className="text-cust-red" />}
                        <span className="text-zinc-400 text-xs font-bold uppercase">{catOpt?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md border ${status.color}`}>
                          {status.label}
                        </span>
                        <button
                          onClick={() => setDeletingFeedback(f)}
                          title="Hapus masukan ini dari riwayat"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-sm mb-1.5">{f.subject}</h3>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">{f.message}</p>

                    {f.admin_response && (
                      <div className="bg-zinc-900 border-l-2 border-cust-red p-3.5 rounded-r-xl mt-3">
                        <p className="text-cust-red text-xs font-bold uppercase mb-1">Tanggapan Operator / Admin</p>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{f.admin_response}</p>
                      </div>
                    )}

                    <p className="text-zinc-500 text-[11px] mt-3 font-mono-tech">
                      {new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingFeedback}
        title="Hapus Riwayat Masukan?"
        message={`Yakin ingin menghapus masukan "${deletingFeedback?.subject}" dari riwayat akun Anda?`}
        confirmText="Hapus Masukan"
        cancelText="Batal"
        onConfirm={handleDeleteFeedback}
        onCancel={() => setDeletingFeedback(null)}
        loading={actionLoading}
      />
    </PublicLayout>
  );
}