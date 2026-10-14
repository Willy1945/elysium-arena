import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  UserCheck,
  Server,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Page Title Header */}
        <div className="mb-10 pb-8 border-b border-zinc-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} />
            <span>Perlindungan Data & Privasi</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl">
            Komitmen Elysium Arena dalam melindungi kerahasiaan, integritas, dan keamanan informasi pribadi seluruh member dan pelanggan kami.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-xs font-mono mt-4">
            <span>Berlaku efektif sejak: 13 Oktober 2026</span>
            <span>•</span>
            <span>Kerahasiaan Terjamin</span>
          </div>
        </div>

        {/* ── SECTIONS LIST ── */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-300">
          
          {/* Section 1: Informasi yang Dikumpulkan */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Database size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                1. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                Saat Anda membuat akun member atau melakukan reservasi di Elysium Arena, kami mengumpulkan data yang diperlukan untuk kelancaran layanan, meliputi:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li><strong>Informasi Identitas Akun:</strong> Nama lengkap, alamat email, dan nomor kontak (WhatsApp).</li>
                <li><strong>Informasi Aktivitas & Reservasi:</strong> Jadwal pemesanan stasiun, durasi sewa, stasiun yang digunakan, dan pesanan kafe F&B.</li>
                <li><strong>Informasi Poin & Reward:</strong> Saldo koin loyalitas, riwayat mutasi poin, dan voucher yang berhasil ditukarkan.</li>
              </ul>
              <p className="text-zinc-400 mt-2">
                Kami <strong>tidak pernah</strong> menyimpan data kredensial akun game pribadi Anda (seperti password Steam, Riot, Epic Games, atau PlayStation Network).
              </p>
            </div>
          </section>

          {/* Section 2: Tujuan Penggunaan Data */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <UserCheck size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                2. Tujuan Penggunaan Informasi
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                Informasi yang kami kumpulkan digunakan secara eksklusif untuk tujuan operasional dan peningkatan layanan, antara lain:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li>Memverifikasi dan mengonfirmasi reservasi stasiun PC & PS5 Anda saat tiba di kasir.</li>
                <li>Mengirimkan notifikasi status booking, perolehan koin loyalitas, dan struk pesanan kafe.</li>
                <li>Mengelola saldo koin loyalitas dan hak penukaran voucher Anda.</li>
                <li>Mendeteksi serta mencegah penyalahgunaan sistem, kecurangan, atau gangguan operasional arena.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Keamanan & Enkripsi Data */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                3. Keamanan & Enkripsi Kata Sandi
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                Kami menerapkan standar keamanan enkripsi terkini untuk melindungi data akun pengguna:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li>
                  <strong>Enkripsi Password Kuat:</strong> Kata sandi (password) Anda di-hash menggunakan algoritma satu arah <em>Bcrypt</em> dengan salt dinamis. Bahkan staf manajemen Elysium Arena tidak memiliki kemampuan untuk melihat password teks asli Anda.
                </li>
                <li>
                  <strong>Token Autentikasi Terproteksi:</strong> Sesi login diamankan menggunakan token API Sanctum dengan enkripsi stateful/stateless yang mencegah pencurian sesi.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Larangan Pembagian Data ke Pihak Ketiga */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <EyeOff size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                4. Tidak Ada Penjualan Data ke Pihak Ketiga
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                Elysium Arena menjamin bahwa kami <strong>tidak akan pernah menjual, menyewakan, memperdagangkan, atau memberikan data pribadi Anda</strong> kepada pihak ketiga, biro iklan, atau platform broker data mana pun.
              </p>
              <p>
                Data Anda hanya dapat diakses oleh sistem internal dan staf kasir/administrator yang berwenang demi kebutuhan konfirmasi transaksi sewa dan pesanan Anda.
              </p>
            </div>
          </section>

          {/* Section 5: Hak & Kontrol Pengguna atas Data Pribadi */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                <Server size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                5. Hak & Pengelolaan Profil Pengguna
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                Sebagai member, Anda memiliki kendali penuh atas informasi akun Anda:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-300">
                <li>Anda dapat memperbarui nama, nomor telepon, dan password akun kapan saja melalui halaman <strong>Edit Profil</strong> di Dashboard.</li>
                <li>Anda berhak meminta penghapusan akun atau penutupan profil member dengan menghubungi administrator melalui layanan bantuan.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Support Contact Box */}
        <div className="mt-12 bg-gradient-to-r from-zinc-900 via-[#14141a] to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">Pertanyaan Seputar Privasi Data?</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Tim privasi & staf Elysium Arena siap membantu menjawab pertanyaan Anda.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition whitespace-nowrap shadow-md cursor-pointer"
          >
            Hubungi Tim Privasi
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
