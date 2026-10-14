import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldAlert,
  Clock,
  Gamepad2,
  UtensilsCrossed,
  Coins,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cust-red text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText size={14} />
            <span>Legalitas & Tata Tertib</span>
          </div>
          <h1 className="font-display font-black text-white text-3xl sm:text-5xl uppercase tracking-tight">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl">
            Ketentuan resmi mengenai pemesanan gaming station, penggunaan perangkat hardware, etika di arena, serta hak dan kewajiban seluruh pengunjung Elysium Arena.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-xs font-mono mt-4">
            <span>Berlaku efektif sejak: 13 Oktober 2026</span>
            <span>•</span>
            <span>Versi: 2.1 (Terbaru)</span>
          </div>
        </div>

        {/* ── SECTIONS LIST ── */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-300">
          
          {/* Pasal 1: Ketentuan Umum & Akun */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                1. Ketentuan Umum & Registrasi Akun
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                1.1. Dengan mendaftar akun atau menggunakan fasilitas di Elysium Arena, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini.
              </p>
              <p>
                1.2. Pengguna wajib memberikan data yang akurat dan sah (Nama, Email, dan Nomor WhatsApp aktif) saat melakukan pendaftaran akun member.
              </p>
              <p>
                1.3. Akun member bersifat personal dan tidak diperkenankan dipindahtangankan atau disalahgunakan oleh pihak lain tanpa izin pemilik akun.
              </p>
            </div>
          </section>

          {/* Pasal 2: Tata Tertib Stasiun Gaming & Perangkat */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                <Gamepad2 size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                2. Pemakaian Perangkat & Tata Tertib Stasiun
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                2.1. Seluruh periferal gaming (Monitor high-refresh rate, Mechanical Keyboard, Mouse Gaming, Headset, serta Controller DualSense PS5) disediakan dalam kondisi prima dan diuji sebelum sesi dimulai.
              </p>
              <p>
                2.2. Pengunjung wajib menjaga keutuhan hardware dan periferal. Kerusakan fisik yang diakibatkan oleh kelalaian disengaja (membanting controller, menumpahkan cairan ke keyboard/rig, dll.) menjadi tanggung jawab penuh pengunjung yang bersangkutan.
              </p>
              <p>
                2.3. Dilarang keras mengunduh atau menginstal perangkat lunak pihak ketiga yang bersifat ilegal (Cheat, Hack Engine, Script injector, Malware, atau Bot) pada PC turnamen. Pelanggaran akan mengakibatkan pemblokiran akun dan penghentian sesi seketika tanpa pengembalian dana.
              </p>
              <p>
                2.4. Keamanan akun platform game pihak ketiga (seperti Steam, Riot Games, Epic Games, PlayStation Network) merupakan tanggung jawab masing-masing pemain. Pengunjung diwajibkan melakukan <em>Logout</em> dari semua akun pribadi sebelum meninggalkan stasiun.
              </p>
            </div>
          </section>

          {/* Pasal 3: Reservasi & Booking Waktu */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                <Clock size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                3. Prosedur Reservasi & Waktu Bermain
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                3.1. Pemesanan station secara online menghasilkan Kode Booking unik (contoh: <code className="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">BK-XXXXX</code>) yang wajib ditunjukkan ke kasir/resepsionis saat tiba di arena.
              </p>
              <p>
                3.2. <strong>Batas Toleransi Keterlambatan:</strong> Diberikan batas toleransi kedatangan maksimal <strong>15 menit</strong> dari jadwal mulai booking. Apabila pemain belum hadir melebihi 15 menit tanpa konfirmasi sebelumnya, pihak arena berhak mengalihkan stasiun ke pelanggan walk-in.
              </p>
              <p>
                3.3. Perpanjangan durasi bermain (Extend) dapat diajukan kepada staf kasir selama slot stasiun bersangkutan belum dipesan oleh pemain berikutnya.
              </p>
            </div>
          </section>

          {/* Pasal 4: Kafe F&B & Kenyamanan Bersama */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                <UtensilsCrossed size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                4. Layanan Kafe F&B & Kebersihan Area
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                4.1. Pesanan makanan dan minuman kafe dapat dipesan langsung dari dashboard atau kasir dan akan diantar langsung ke meja stasiun pemain.
              </p>
              <p>
                4.2. Pengunjung diimbau meletakkan minuman di tempat yang aman (cup holder) dan berhati-hati saat menyantap makanan agar tidak mengotori perangkat gaming.
              </p>
              <p>
                4.3. Demi kenyamanan seluruh member, area bermain utama merupakan area <strong>Bebas Asap Rokok (No Smoking Area)</strong>. Aktivitas merokok dan vape hanya diperkenankan di area Outdoor Lounge yang telah disediakan.
              </p>
            </div>
          </section>

          {/* Pasal 5: Koin Loyalitas & Voucher Reward */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                <Coins size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                5. Koin Loyalitas & Penukaran Hadiah
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                5.1. Koin loyalitas dihitung otomatis dari durasi bermain (100 Koin per 1 jam selesai bermain).
              </p>
              <p>
                5.2. Koin dapat ditukarkan secara bebas di Katalog Reward dengan voucher jam bermain gratis atau menu kafe yang tersedia.
              </p>
              <p>
                5.3. Koin loyalitas tidak dapat diuangkan dalam bentuk uang tunai (cash) dan tidak dapat dialihkan ke akun member lain.
              </p>
            </div>
          </section>

          {/* Pasal 6: Keamanan & Pembatasan Tanggung Jawab */}
          <section className="bg-[#121217] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cust-red shrink-0">
                <ShieldAlert size={18} />
              </div>
              <h2 className="font-display font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
                6. Keamanan Barang Pribadi & Etika
              </h2>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p>
                6.1. Pengunjung bertanggung jawab penuh atas barang bawaan pribadi (ponsel, dompet, laptop, dll.). Pihak manajemen Elysium Arena tidak bertanggung jawab atas kehilangan atau kerusakan barang bawaan pribadi akibat kelalaian pengunjung.
              </p>
              <p>
                6.2. Manajemen Elysium Arena berhak meminta pengunjung meninggalkan lokasi atau menonaktifkan akun member tanpa kompensasi apabila pengunjung melakukan tindakan pelecehan, kekerasan, perjudian ilegal, atau mengganggu ketertiban umum di arena.
              </p>
            </div>
          </section>

        </div>

        {/* Support Contact Box */}
        <div className="mt-12 bg-gradient-to-r from-zinc-900 via-[#14141a] to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-base">Ada Pertanyaan Mengenai Ketentuan?</h4>
              <p className="text-zinc-400 text-xs mt-0.5">Hubungi customer service staf Elysium Arena melalui WhatsApp resmi kami.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-cust-red hover:bg-cust-red-dark text-white font-bold text-xs uppercase tracking-wider transition whitespace-nowrap shadow-md cursor-pointer"
          >
            Hubungi Staf via WA
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
