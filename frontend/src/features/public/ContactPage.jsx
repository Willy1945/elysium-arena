import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Mail, ExternalLink,
  MessageSquarePlus, Send, Trash2, Radio,
  Gamepad2, UtensilsCrossed, AlertCircle, HelpCircle,
  MessageCircle, CheckCircle2, User, ArrowRight
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { feedbackService } from '../../api/feedbackService';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CATEGORY_OPTIONS = [
  { value: 'game_request', label: 'Request Game', icon: Gamepad2, desc: 'Usul judul game baru untuk PS5 atau PC' },
  { value: 'menu_request', label: 'Request Menu', icon: UtensilsCrossed, desc: 'Ide camilan, makanan, atau minuman kafe' },
  { value: 'complaint', label: 'Kendala Teknis', icon: AlertCircle, desc: 'Laporan rig, periferal, atau koneksi' },
  { value: 'other', label: 'Pertanyaan / Kerja Sama', icon: HelpCircle, desc: 'Booking grup, event turnamen, atau saran' },
];

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Review', color: 'text-amber-800 border-amber-300 bg-amber-50' },
  in_review: { label: 'Sedang Ditinjau', color: 'text-sky-800 border-sky-300 bg-sky-50' },
  resolved: { label: 'Ditindaklanjuti', color: 'text-emerald-800 border-emerald-300 bg-emerald-50' },
};

const SUMEDANG_MAPS_URL = 'https://maps.google.com/?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323';
const WHATSAPP_NUMBER = '6283869002070';

export default function ContactPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [category, setCategory] = useState('game_request');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingFeedback, setDeletingFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchHistory = () => {
    if (!user) return;
    setLoadingHistory(true);
    feedbackService
      .getAll()
      .then(({ data }) => {
        setHistory(data.data || []);
      })
      .catch((err) => {
        console.error('Gagal mengambil riwayat masukan:', err);
      })
      .finally(() => {
        setLoadingHistory(false);
      });
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleSubmitSystem = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Mohon isi subjek dan detail pesan masukan Anda.');
      return;
    }

    setSubmitting(true);
    try {
      await feedbackService.create({ category, subject, message });
      toast.success('Masukan berhasil terkirim ke tim Elysium Arena! Terima kasih.');
      setSubject('');
      setMessage('');
      setCategory('game_request');
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim masukan ke sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWhatsApp = (e) => {
    if (e) e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Mohon isi subjek dan detail pesan terlebih dahulu.');
      return;
    }

    const catLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label || category;
    const senderName = user?.name || guestName.trim() || 'Pengunjung Elysium Arena';
    const senderContact = user?.email || guestContact.trim() || '-';

    const textPayload =
      `*HALO ELYSIUM ARENA - PESAN & MASUKAN*\n` +
      `──────────────────────────\n` +
      `👤 *Nama:* ${senderName}\n` +
      `📱 *Kontak:* ${senderContact}\n` +
      `🏷️ *Kategori:* ${catLabel}\n` +
      `📌 *Subjek:* ${subject}\n\n` +
      `💬 *Pesan:*\n${message}\n` +
      `──────────────────────────\n` +
      `_Dikirim melalui halaman Kontak Elysium Arena_`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textPayload)}`;
    window.open(waUrl, '_blank');
  };

  const handleDeleteFeedback = async () => {
    if (!deletingFeedback) return;
    setActionLoading(true);
    try {
      await feedbackService.remove(deletingFeedback.id);
      toast.success('Masukan berhasil dihapus dari riwayat akun.');
      setDeletingFeedback(null);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus masukan.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PublicLayout>

      <section className="relative bg-black text-white overflow-hidden border-b border-zinc-800 -mt-[72px] sm:-mt-[80px] pt-36 sm:pt-44 pb-20 sm:pb-24">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-100 pointer-events-none"
          style={{ backgroundImage: "url('/images/device-room.jpeg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50 pointer-events-none" />
        <div className="pointer-events-none absolute -top-40 right-10 w-[500px] h-[500px] bg-cust-red/15 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 left-10 w-[400px] h-[400px] bg-cust-red/10 rounded-full blur-[140px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full mb-6 shadow-md text-white">
            <Radio size={13} className="text-cust-red animate-pulse" />
            <span className="text-[11px] font-mono-tech uppercase tracking-widest font-bold text-white/90">
              Markas & Pusat Layanan Pelanggan
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[10px] font-mono-tech text-emerald-300 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Live Support Sumedang
            </span>
          </div>

          <h1 className="font-display font-black text-white text-4xl sm:text-6xl lg:text-[76px] uppercase tracking-tight mb-4 leading-none drop-shadow-md">
            HUBUNGI KAMI & <span className="text-cust-red">KIRIM MASUKAN</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm mb-6">
            Kunjungi markas arena gaming kami di pusat kota Sumedang, konsultasikan kebutuhan mabar & turnamen, atau sampaikan masukan, request game, serta ide menu baru.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl shadow-md text-xs font-medium text-zinc-300">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <strong className="text-white font-bold">Jam Buka:</strong> Setiap Hari 10:00 - 22:00 WIB
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={13} />
              <span>CS WhatsApp Fast Response</span>
            </span>
          </div>
        </div>
      </section>

      <div className="bg-zinc-50/60 border-b border-zinc-200">

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-5 space-y-5">

              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono-tech text-cust-red uppercase font-bold tracking-widest">
                      Markas Fisik & Lokasi
                    </span>
                    <h3 className="font-display font-black text-zinc-950 text-base uppercase tracking-tight">
                      Elysium Arena Sumedang
                    </h3>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-medium">
                      Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45323
                    </p>
                    <div className="pt-2">
                      <a
                        href={SUMEDANG_MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cust-red hover:text-cust-red-dark group transition"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 shadow-2xs">
                    <Phone size={18} />
                  </div>
                  <span className="text-[10px] font-mono-tech text-emerald-800 uppercase font-bold tracking-wider">
                    Hotline CS
                  </span>
                  <h4 className="font-bold text-zinc-950 text-sm mt-0.5">WhatsApp Admin</h4>
                  <p className="text-zinc-500 text-xs font-mono mt-0.5">+62 838-6900-2070</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Admin%20Elysium%20Arena%2C%20saya%20ingin%20bertanya%20seputar%20booking%20atau%20layanan%20arena.`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition"
                  >
                    <span>Chat WhatsApp</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mb-3 shadow-2xs">
                    <Clock size={18} />
                  </div>
                  <span className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold tracking-wider">
                     Jam Layanan
                  </span>
                  <h4 className="font-bold text-zinc-950 text-sm mt-0.5">Buka Setiap Hari</h4>
                  <p className="text-zinc-600 text-xs font-semibold mt-0.5">10:00 - 22:00 WIB</p>
                  <span className="mt-3 inline-block text-[11px] font-bold text-emerald-800">
                    • Tanpa Libur
                  </span>
                </div>
              </div>

              <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold tracking-wider">Email Resmi</span>
                    <p className="font-bold text-zinc-950 text-xs sm:text-sm font-mono">elysiumarena1@gmail.com</p>
                  </div>
                </div>
                <a
                  href="mailto:elysiumarena1@gmail.com"
                  className="text-xs font-bold uppercase tracking-wider text-cust-red hover:underline shrink-0"
                >
                  Kirim Email
                </a>
              </div>

              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]">
                <div className="p-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-800 font-bold">
                    <MapPin size={14} className="text-cust-red" />
                    <span>Peta Lokasi Interaktif</span>
                  </div>
                  <a
                    href={SUMEDANG_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-cust-red hover:underline flex items-center gap-1"
                  >
                    <span>Perbesar Peta</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="h-64 sm:h-72 w-full">
                  <iframe
                    title="Peta Lokasi Elysium Arena"
                    src="https://www.google.com/maps?q=Jl.+Mayor+Abdurahman+No.209,+Kotakaler,+Kec.+Sumedang+Utara,+Kabupaten+Sumedang,+Jawa+Barat+45323&output=embed"
                    className="w-full h-full border-0 contrast-[1.05]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

            <div className="lg:col-span-7 space-y-8">

              <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-cust-red text-xs font-bold uppercase tracking-wider mb-2">
                    <MessageSquarePlus size={13} />
                    <span>Formulir Terpadu</span>
                  </div>
                  <h2 className="font-display font-black text-zinc-950 text-2xl sm:text-3xl uppercase tracking-tight">
                    Sampaikan Masukan atau Pertanyaan
                  </h2>
                  <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                    Setiap saran, request judul game baru, ide hidangan kafe, atau pertanyaan seputar event dibaca dan ditindaklanjuti langsung oleh manajemen Elysium.
                  </p>
                </div>

                {user ? (
                  <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cust-red/10 border border-cust-red/20 text-cust-red flex items-center justify-center font-black text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className="text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold">
                            Akun Terverifikasi
                          </span>
                        </p>
                        <p className="text-zinc-500 text-xs">{user.email || user.username}</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[11px] text-zinc-500 font-medium">
                      Otomatis tersimpan ke akun
                    </span>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                        <User size={13} className="text-cust-red" />
                        <span>Identitas Pengirim (Tamu)</span>
                      </span>
                      <Link
                        to="/login"
                        className="text-xs font-bold text-cust-red hover:underline flex items-center gap-1"
                      >
                        <span>Sudah Punya Akun? Masuk</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Nama Anda..."
                          className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-xs sm:text-sm px-3.5 py-2.5 outline-none focus:border-cust-red transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-600 uppercase mb-1">
                          No. WhatsApp / Email
                        </label>
                        <input
                          type="text"
                          value={guestContact}
                          onChange={(e) => setGuestContact(e.target.value)}
                          placeholder="0812xxxx atau email..."
                          className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-xs sm:text-sm px-3.5 py-2.5 outline-none focus:border-cust-red transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={user ? handleSubmitSystem : handleSendWhatsApp} className="space-y-5">

                  <div>
                    <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                      Pilih Kategori Pesan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CATEGORY_OPTIONS.map((opt) => {
                        const isSelected = category === opt.value;
                        const Icon = opt.icon;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setCategory(opt.value)}
                            className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                              isSelected
                                ? 'border-cust-red bg-red-50/60 ring-2 ring-cust-red/20 shadow-xs'
                                : 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100 hover:border-zinc-300'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-cust-red text-white' : 'bg-white border border-zinc-200 text-zinc-700'}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className={`font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-cust-red' : 'text-zinc-900'}`}>
                                {opt.label}
                              </p>
                              <p className="text-zinc-500 text-[11px] font-medium leading-tight mt-0.5">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                      Judul / Topik Masukan
                    </label>
                    <input
                      required
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Request Game Black Myth Wukong atau Penambahan Sofa Turnamen..."
                      className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-xs sm:text-sm px-4 py-3 outline-none focus:border-cust-red focus:ring-2 focus:ring-cust-red/10 transition shadow-2xs placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                      Penjelasan Detail
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      placeholder="Jelaskan kebutuhan, kendala stasiun yang dialami, atau saran Anda secara spesifik agar segera ditindaklanjuti tim kru kami..."
                      className="w-full bg-white border border-zinc-300 rounded-xl text-zinc-900 text-xs sm:text-sm p-4 outline-none focus:border-cust-red focus:ring-2 focus:ring-cust-red/10 transition shadow-2xs placeholder:text-zinc-400"
                    />
                    <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-1">
                      <span>Maksimal 2.000 karakter</span>
                      <span>{message.length} / 2000</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {user ? (
                      <>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(227,30,36,0.25)] hover:shadow-[0_8px_24px_rgba(227,30,36,0.35)] transition cursor-pointer disabled:opacity-50"
                        >
                          <Send size={15} />
                          <span>{submitting ? 'Mengirim Masukan...' : 'Kirim ke Sistem Elysium'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSendWhatsApp}
                          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-xs hover:shadow-sm transition cursor-pointer"
                          title="Buka pesan ini langsung ke chat WhatsApp admin"
                        >
                          <MessageCircle size={15} />
                          <span>Kirim via WhatsApp</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleSendWhatsApp}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-md transition cursor-pointer"
                        >
                          <MessageCircle size={16} />
                          <span>Kirim Langsung via WhatsApp CS</span>
                        </button>

                        <Link
                          to="/login"
                          className="inline-flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition"
                        >
                          <span>Masuk Akun</span>
                          <ArrowRight size={13} />
                        </Link>
                      </>
                    )}
                  </div>
                </form>
              </div>

              {user && (
                <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cust-red/10 border border-cust-red/20 text-cust-red flex items-center justify-center">
                        <MessageSquarePlus size={16} />
                      </div>
                      <h3 className="font-display font-black text-zinc-950 uppercase text-lg sm:text-xl tracking-tight">
                        Riwayat Masukan Akun Anda
                      </h3>
                    </div>
                    <span className="text-xs font-mono-tech text-zinc-500 font-bold">
                      {history.length} Catatan
                    </span>
                  </div>

                  {loadingHistory ? (
                    <p className="text-zinc-500 text-xs font-medium py-4 text-center">Memuat riwayat masukan...</p>
                  ) : history.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                      <p className="text-zinc-600 text-xs font-medium">Belum ada masukan yang Anda kirimkan lewat akun ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((f) => {
                        const catOpt = CATEGORY_OPTIONS.find((c) => c.value === f.category);
                        const status = STATUS_CONFIG[f.status] || STATUS_CONFIG.pending;
                        const Icon = catOpt?.icon || HelpCircle;

                        return (
                          <div
                            key={f.id}
                            className="bg-zinc-50/70 border border-zinc-200/90 hover:border-zinc-300 rounded-2xl p-5 transition-all shadow-2xs"
                          >
                            <div className="flex items-start justify-between mb-2.5 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded bg-white border border-zinc-200 text-cust-red">
                                  <Icon size={13} />
                                </span>
                                <span className="text-zinc-700 text-xs font-bold uppercase tracking-wider">
                                  {catOpt?.label || f.category}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${status.color}`}>
                                  {status.label}
                                </span>
                                <button
                                  onClick={() => setDeletingFeedback(f)}
                                  title="Hapus masukan dari riwayat"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-zinc-950 font-bold text-sm mb-1">{f.subject}</h4>
                            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed font-medium mb-3">{f.message}</p>

                            {f.admin_response && (
                              <div className="bg-white border-l-2 border-cust-red p-3.5 rounded-r-xl border border-zinc-200 mb-3 shadow-2xs">
                                <p className="text-cust-red text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} />
                                  <span>Tanggapan Tim Manajemen Elysium</span>
                                </p>
                                <p className="text-zinc-800 text-xs sm:text-sm leading-relaxed font-medium">
                                  {f.admin_response}
                                </p>
                              </div>
                            )}

                            <p className="text-zinc-500 text-[11px] font-mono-tech">
                              Terkirim: {new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </section>

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
