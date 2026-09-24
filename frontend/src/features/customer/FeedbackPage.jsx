import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquarePlus, AlertCircle, Gamepad2, UtensilsCrossed, HelpCircle, Send } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useToast } from '../../context/ToastContext';
import { feedbackService } from '../../api/feedbackService';

const CATEGORY_OPTIONS = [
  { value: 'complaint', label: 'Keluhan', icon: AlertCircle },
  { value: 'game_request', label: 'Request Game', icon: Gamepad2 },
  { value: 'menu_request', label: 'Request Menu', icon: UtensilsCrossed },
  { value: 'other', label: 'Lainnya', icon: HelpCircle },
];

const STATUS_CONFIG = {
  pending: { label: 'Baru', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
  in_review: { label: 'Ditinjau', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  resolved: { label: 'Selesai', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
};

export default function FeedbackPage() {
  const toast = useToast();
  const [category, setCategory] = useState('complaint');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = () => {
    setLoadingHistory(true);
    feedbackService.getAll().then(({ data }) => {
      setHistory(data.data);
      setLoadingHistory(false);
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-cust-text-secondary hover:text-cust-text-primary text-sm font-bold uppercase mb-8 transition">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <div className="mb-10">
          <p className="text-cust-red font-bold text-sm uppercase tracking-widest mb-1">Suara Kamu Penting</p>
          <h1 className="text-cust-text-primary font-black text-3xl uppercase">Kirim Masukan</h1>
          <p className="text-cust-text-secondary text-sm mt-2">Keluhan, request game baru, request menu, atau saran lainnya — kami baca semuanya.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-cust-elevated border border-cust-border p-7 mb-10">
          <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-3">Kategori</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`flex flex-col items-center gap-2 py-4 border text-xs font-bold uppercase transition ${
                  category === opt.value
                    ? 'border-cust-red bg-cust-red/10 text-cust-red'
                    : 'border-cust-border text-cust-text-secondary hover:border-cust-text-secondary'
                }`}
              >
                <opt.icon size={18} />
                {opt.label}
              </button>
            ))}
          </div>

          <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Judul</label>
          <input
            required
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ringkasan singkat masukan kamu"
            className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm px-4 py-3 outline-none focus:border-cust-red transition mb-5"
          />

          <label className="block text-cust-text-secondary text-xs font-bold uppercase mb-2">Detail</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            placeholder="Jelaskan lebih detail supaya kami bisa bantu dengan tepat..."
            className="w-full bg-cust-bg border border-cust-border text-cust-text-primary text-sm p-4 outline-none focus:border-cust-red transition mb-6"
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold uppercase text-sm px-7 py-3.5 transition disabled:opacity-50"
          >
            <Send size={15} /> {submitting ? 'Mengirim...' : 'Kirim Masukan'}
          </button>
        </form>

        {/* Riwayat */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <MessageSquarePlus size={18} className="text-cust-red" />
            <h2 className="text-cust-text-primary font-black uppercase text-lg">Riwayat Masukan Kamu</h2>
          </div>

          {loadingHistory ? (
            <p className="text-cust-text-secondary text-sm">Memuat...</p>
          ) : history.length === 0 ? (
            <p className="text-cust-text-secondary text-sm">Belum ada masukan yang dikirim.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((f) => {
                const catOpt = CATEGORY_OPTIONS.find((c) => c.value === f.category);
                const status = STATUS_CONFIG[f.status];
                return (
                  <div key={f.id} className="bg-cust-elevated border border-cust-border p-6">
                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {catOpt && <catOpt.icon size={15} className="text-cust-red" />}
                        <span className="text-cust-text-secondary text-xs font-bold uppercase">{catOpt?.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 border ${status.color}`}>{status.label}</span>
                    </div>
                    <h3 className="text-cust-text-primary font-bold text-sm mb-2">{f.subject}</h3>
                    <p className="text-cust-text-secondary text-sm leading-relaxed mb-3">{f.message}</p>

                    {f.admin_response && (
                      <div className="bg-cust-bg border-l-2 border-cust-red p-4 mt-3">
                        <p className="text-cust-red text-xs font-bold uppercase mb-1.5">Balasan Admin</p>
                        <p className="text-cust-text-secondary text-sm leading-relaxed">{f.admin_response}</p>
                      </div>
                    )}

                    <p className="text-cust-text-secondary/60 text-[11px] mt-3">
                      {new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}