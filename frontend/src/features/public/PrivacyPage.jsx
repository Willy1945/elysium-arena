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
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Page Title Header */}
        <div className="mb-10 pb-8 border-b border-zinc-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck size={14} />
            <span>Perlindungan Data & Privasi</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl uppercase tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-zinc-700 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl font-medium">
            Komitmen Elysium Arena dalam melindungi kerahasiaan, integritas, dan keamanan informasi pribadi seluruh member dan pelanggan kami.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-xs font-mono mt-4 font-semibold">
            <span>Berlaku efektif sejak: 13 Oktober 2026</span>
            <span>•</span>
            <span>Kerahasiaan Terjamin</span>
          </div>
        </div>

        {/* ── SECTIONS LIST ── */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700">
          
          {/* Section 1: Informasi yang Dikumpulkan */}
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <Database size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                1. Informasi yang Kami Kumpulkan
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                Saat Anda membuat akun member atau melakukan reservasi di Elysium Arena, kami mengumpulkan data yang diperlukan untuk kelancaran layanan, meliputi:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-800">
                <li><strong>Informasi Identitas Akun:</strong> Nama lengkap, alamat email, dan nomor kontak (WhatsApp).</li>
                <li><strong>Informasi Aktivitas & Reservasi:</strong> Jadwal pemesanan stasiun, durasi sewa, stasiun yang digunakan, dan pesanan kafe F&B.</li>
                <li><strong>Informasi Poin & Reward:</strong> Saldo koin loyalitas, riwayat mutasi poin, dan voucher yang berhasil ditukarkan.</li>
              </ul>
              <p className="text-zinc-600 mt-2">
                Kami <strong>tidak pernah</strong> menyimpan data kredensial akun game pribadi Anda (seperti password Steam, Riot, Epic Games, atau PlayStation Network).
              </p>
            </div>
          </section>

          {/* Section 2: Tujuan Penggunaan Data */}
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <UserCheck size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                2. Tujuan Penggunaan Informasi
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                Informasi yang kami kumpulkan digunakan secara eksklusif untuk tujuan operasional dan peningkatan layanan, antara lain:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-800">
                <li>Memverifikasi dan mengonfirmasi reservasi stasiun PC & PS5 Anda saat tiba di kasir.</li>
                <li>Mengirimkan notifikasi status booking, perolehan koin loyalitas, dan struk pesanan kafe.</li>
                <li>Mengelola saldo koin loyalitas dan hak penukaran voucher Anda.</li>
                <li>Mendeteksi serta mencegah penyalahgunaan sistem, kecurangan, atau gangguan operasional arena.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Keamanan & Enkripsi Data */}
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <Lock size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                3. Keamanan & Enkripsi Kata Sandi
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                Kami menerapkan standar keamanan enkripsi terkini untuk melindungi data akun pengguna:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-800">
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <EyeOff size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                4. Tidak Ada Penjualan Data ke Pihak Ketiga
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                Elysium Arena menjamin bahwa kami <strong>tidak akan pernah menjual, menyewakan, memperdagangkan, atau memberikan data pribadi Anda</strong> kepada pihak ketiga, biro iklan, atau platform broker data mana pun.
              </p>
              <p>
                Data Anda hanya dapat diakses oleh sistem internal dan staf kasir/administrator yang berwenang demi kebutuhan konfirmasi transaksi sewa dan pesanan Anda.
              </p>
            </div>
          </section>

          {/* Section 5: Hak & Kontrol Pengguna atas Data Pribadi */}
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <Server size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                5. Hak & Pengelolaan Profil Pengguna
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                Sebagai member, Anda memiliki kendali penuh atas informasi akun Anda:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-800">
                <li>Anda dapat memperbarui nama, nomor telepon, dan password akun kapan saja melalui halaman <strong>Edit Profil</strong> di Dashboard.</li>
                <li>Anda berhak meminta penghapusan akun atau penutupan profil member dengan menghubungi administrator melalui layanan bantuan.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Support Contact Box */}
        <div className="mt-12 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-display font-black text-zinc-950 text-base">Pertanyaan Seputar Privasi Data?</h4>
              <p className="text-zinc-600 text-xs mt-0.5 font-medium">Tim privasi & staf Elysium Arena siap membantu menjawab pertanyaan Anda.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6283869002070"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition whitespace-nowrap shadow-md cursor-pointer"
          >
            Hubungi Tim Privasi
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
