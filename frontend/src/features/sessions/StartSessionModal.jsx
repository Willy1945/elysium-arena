import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { userService } from '../../api/userService';

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6];

export default function StartSessionModal({ open, onClose, onSubmit, device, loading }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (!open) return;
    userService.search({ role: 'CUSTOMER', search }).then(({ data }) => setCustomers(data.data));
  }, [open, search]);

  useEffect(() => {
    if (!open) {
      setSelectedUserId('');
      setSearch('');
      setDuration(1);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      device_id: device.id,
      user_id: Number(selectedUserId),
      duration: duration * 60,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border rounded-lg p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-lg">Start Session — {device.code}</h3>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-text-secondary text-xs mb-1">Cari Customer</label>
          <input
            type="text"
            placeholder="Nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent mb-2"
          />
          <select
            required
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Pilih customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-text-secondary text-xs mb-1">Durasi</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-surface-inset border border-border rounded px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent"
          >
            {DURATION_OPTIONS.map((h) => (
              <option key={h} value={h}>{h} {h === 1 ? 'Jam' : 'Jam'}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedUserId}
          className="w-full bg-accent hover:opacity-90 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Memulai...' : 'Mulai Session'}
        </button>
      </form>
    </div>
  );
}