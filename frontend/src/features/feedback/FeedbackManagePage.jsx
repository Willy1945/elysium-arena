import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, AlertCircle, Gamepad2, UtensilsCrossed, HelpCircle, Send } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../context/ToastContext';
import { adminFeedbackService } from '../../api/adminFeedbackService';

const CATEGORY_CONFIG = {
  complaint: { label: 'Keluhan', icon: AlertCircle, color: 'text-status-occupied' },
  game_request: { label: 'Request Game', icon: Gamepad2, color: 'text-accent-light' },
  menu_request: { label: 'Request Menu', icon: UtensilsCrossed, color: 'text-status-booked' },
  other: { label: 'Lainnya', icon: HelpCircle, color: 'text-text-secondary' },
};

const STATUS_CONFIG = {
  pending: { label: 'Baru', color: 'status-booked' },
  in_review: { label: 'Ditinjau', color: 'accent-light' },
  resolved: { label: 'Selesai', color: 'status-available' },
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
      toast.success('Balasan berhasil dikirim.');
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

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-text-primary text-2xl font-semibold">Feedback & Masukan</h2>
          <p className="text-text-secondary text-sm">Kelola keluhan, request game, dan saran dari customer.</p>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                statusFilter === f ? 'bg-accent text-accent-lighter' : 'border border-border text-text-secondary hover:bg-surface-elevated'
              }`}
            >
              {f === 'All' ? 'Semua' : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Memuat data...</p>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-16 bg-surface-elevated border border-border rounded-xl">
          <MessageSquare size={32} className="text-text-secondary opacity-40 mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Belum ada masukan masuk.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {feedbacks.map((f) => {
            const cat = CATEGORY_CONFIG[f.category];
            const status = STATUS_CONFIG[f.status];
            const isResponding = responding === f.id;

            return (
              <div key={f.id} className="bg-surface-elevated border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <cat.icon size={16} className={cat.color} />
                    <span className="text-text-secondary text-xs font-medium uppercase">{cat.label}</span>
                    <span className="text-text-secondary/50 text-xs">•</span>
                    <span className="text-text-secondary text-xs">{f.user?.name}</span>
                  </div>
                  <span
                    className="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, var(--color-${status.color}) 15%, transparent)`, color: `var(--color-${status.color})` }}
                  >
                    {status.label}
                  </span>
                </div>

                <h3 className="text-text-primary font-semibold text-base mb-2">{f.subject}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{f.message}</p>

                {f.admin_response && !isResponding && (
                  <div className="bg-surface-inset border-l-2 border-accent p-4 mb-4">
                    <p className="text-accent-light text-xs font-bold uppercase mb-1.5">Balasan Kamu</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{f.admin_response}</p>
                  </div>
                )}

                {isResponding ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      rows={3}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Tulis balasan untuk customer..."
                      className="w-full bg-surface-inset border border-border rounded-lg p-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendResponse(f)}
                        disabled={saving}
                        className="flex items-center gap-1.5 bg-accent hover:opacity-90 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        <Send size={14} /> {saving ? 'Mengirim...' : 'Kirim & Tandai Selesai'}
                      </button>
                      <button
                        onClick={() => setResponding(null)}
                        className="border border-border text-text-secondary text-sm px-4 py-2 rounded-lg hover:bg-surface-inset transition"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {f.status === 'pending' && (
                      <button
                        onClick={() => handleQuickStatus(f, 'in_review')}
                        className="text-xs border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:bg-surface-inset transition"
                      >
                        Tandai Ditinjau
                      </button>
                    )}
                    <button
                      onClick={() => openResponseForm(f)}
                      className="text-xs bg-accent/10 text-accent-light px-3 py-1.5 rounded-lg hover:bg-accent/20 transition"
                    >
                      {f.admin_response ? 'Edit Balasan' : 'Balas & Selesaikan'}
                    </button>
                  </div>
                )}

                <p className="text-text-secondary/50 text-[11px] mt-3">
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