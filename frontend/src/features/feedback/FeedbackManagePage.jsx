import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, AlertCircle, Gamepad2, UtensilsCrossed, HelpCircle, Send } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../context/ToastContext';
import { adminFeedbackService } from '../../api/adminFeedbackService';

const CATEGORY_CONFIG = {
  complaint: { label: 'Keluhan', icon: AlertCircle, color: 'text-red-400' },
  game_request: { label: 'Request Game', icon: Gamepad2, color: 'text-cust-red' },
  menu_request: { label: 'Request Menu', icon: UtensilsCrossed, color: 'text-amber-400' },
  other: { label: 'Lainnya', icon: HelpCircle, color: 'text-zinc-400' },
};

const STATUS_CONFIG = {
  pending: { label: 'Baru Masuk', badge: 'bg-amber-950/60 text-amber-400 border-amber-500/30' },
  in_review: { label: 'Sedang Ditinjau', badge: 'bg-sky-950/60 text-sky-400 border-sky-500/30' },
  resolved: { label: 'Telah Ditanggapi', badge: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' },
};

export default function FeedbackManagePage() {
  const toast = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      const { data } = await adminFeedbackService.getAll(params);
      setFeedbacks(data.data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleQuickStatus = async (feedback, status) => {
    try {
      await adminFeedbackService.updateStatus(feedback.id, { status, admin_response: feedback.admin_response });
      toast.success('Status berhasil diperbarui.');
      fetchFeedbacks();
    } catch (err) {
      toast.error('Gagal memperbarui status.');
    }
  };

  const openResponseForm = (feedback) => {
    setResponding(feedback.id);
    setResponseText(feedback.admin_response || '');
  };

  const handleSendResponse = async (feedback) => {
    setSaving(true);
    try {
      await adminFeedbackService.updateStatus(feedback.id, { status: 'resolved', admin_response: responseText });
      toast.success('Balasan resmi berhasil dikirim ke pelanggan.');
      setResponding(null);
      setResponseText('');
      fetchFeedbacks();
    } catch (err) {
      toast.error('Gagal mengirim balasan.');
    } finally {
      setSaving(false);
    }
  };

  const filters = ['All', 'pending', 'in_review', 'resolved'];
  const FILTER_LABEL = {
    All: 'Semua',
    pending: 'Baru',
    in_review: 'Ditinjau',
    resolved: 'Selesai',
  };

  return (
    <DashboardLayout>
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquare size={14} />
            <span>Customer Voice & Helpdesk</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl uppercase tracking-tight">
            Masukan & Request Pelanggan
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Tanggapi keluhan pengguna, tampung permintaan game baru, dan tingkatkan kualitas arena.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="overflow-x-auto max-w-full pb-1 scrollbar-none">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 inline-flex gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === f
                    ? 'bg-cust-red text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {FILTER_LABEL[f] || f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-zinc-500 text-xs uppercase tracking-wider">
          Memuat data masukan...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-[#121216]/50">
          <MessageSquare size={36} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-white font-bold text-sm mb-1">Tidak Ada Masukan</p>
          <p className="text-zinc-500 text-xs">Belum ada pesan atau request baru dari pelanggan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f) => {
            const cat = CATEGORY_CONFIG[f.category] || CATEGORY_CONFIG.other;
            const status = STATUS_CONFIG[f.status] || STATUS_CONFIG.pending;
            const isResponding = responding === f.id;
            const Icon = cat.icon;

            return (
              <div key={f.id} className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-lg">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={cat.color} />
                    <span className="text-zinc-300 text-xs font-semibold uppercase">{cat.label}</span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-400 text-xs font-medium">{f.user?.name}</span>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${status.badge}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="text-white font-bold text-base mb-2">{f.subject}</h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">{f.message}</p>

                {f.admin_response && !isResponding && (
                  <div className="bg-zinc-900 border-l-2 border-cust-red p-4 rounded-r-2xl mb-4">
                    <p className="text-cust-red text-xs font-bold uppercase mb-1">Tanggapan Kamu</p>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{f.admin_response}</p>
                  </div>
                )}

                {isResponding ? (
                  <div className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Tuliskan tanggapan resmi untuk customer..."
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white outline-none focus:border-cust-red"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendResponse(f)}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 bg-cust-red hover:bg-cust-red-dark text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition disabled:opacity-50 cursor-pointer"
                      >
                        <Send size={13} />
                        <span>{saving ? 'Mengirim...' : 'Kirim Balasan & Selesaikan'}</span>
                      </button>
                      <button
                        onClick={() => setResponding(null)}
                        className="border border-zinc-800 text-zinc-400 hover:text-white text-xs px-3.5 py-2 rounded-xl hover:bg-zinc-800 transition cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60">
                    {f.status === 'pending' && (
                      <button
                        onClick={() => handleQuickStatus(f, 'in_review')}
                        className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Tandai Ditinjau
                      </button>
                    )}
                    <button
                      onClick={() => openResponseForm(f)}
                      className="text-xs bg-cust-red/10 border border-cust-red/30 text-cust-red hover:bg-cust-red hover:text-white px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      {f.admin_response ? 'Ubah Balasan' : 'Balas & Selesaikan'}
                    </button>
                  </div>
                )}

                <p className="text-zinc-600 text-[11px] font-mono-tech mt-3">
                  {new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}