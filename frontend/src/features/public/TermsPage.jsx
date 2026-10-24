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
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider mb-8 transition"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Page Title Header */}
        <div className="mb-10 pb-8 border-b border-zinc-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-cust-red text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <FileText size={14} />
            <span>Legalitas & Tata Tertib</span>
          </div>
          <h1 className="font-display font-black text-zinc-950 text-3xl sm:text-5xl uppercase tracking-tight">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-zinc-700 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl font-medium">
            Ketentuan resmi mengenai pemesanan gaming station, penggunaan perangkat hardware, etika di arena, serta hak dan kewajiban seluruh pengunjung Elysium Arena.
          </p>
          <div className="flex items-center gap-4 text-zinc-500 text-xs font-mono mt-4 font-semibold">
            <span>Berlaku efektif sejak: 13 Oktober 2026</span>
            <span>•</span>
            <span>Versi: 2.1 (Terbaru)</span>
          </div>
        </div>

        {/* ── SECTIONS LIST ── */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-zinc-700">
          
          {/* Pasal 1: Ketentuan Umum & Akun */}
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                1. Ketentuan Umum & Registrasi Akun
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                <Gamepad2 size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                2. Pemakaian Perangkat & Tata Tertib Stasiun
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                <Clock size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                3. Prosedur Reservasi & Waktu Bermain
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
              <p>
                3.1. Pemesanan station secara online menghasilkan Kode Booking unik (contoh: <code className="text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-300 font-bold">BK-XXXXX</code>) yang wajib ditunjukkan ke kasir/resepsionis saat tiba di arena.
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                <UtensilsCrossed size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                4. Layanan Kafe F&B & Kebersihan Area
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                <Coins size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                5. Koin Loyalitas & Penukaran Hadiah
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
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
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-cust-red shrink-0 shadow-2xs">
                <ShieldAlert size={18} />
              </div>
              <h2 className="font-display font-black text-zinc-950 text-lg sm:text-xl uppercase tracking-wide">
                6. Keamanan Barang Pribadi & Etika
              </h2>
            </div>
            <div className="space-y-3 text-zinc-700 font-medium">
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
        <div className="mt-12 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="font-display font-black text-zinc-950 text-base">Ada Pertanyaan Mengenai Ketentuan?</h4>
              <p className="text-zinc-600 text-xs mt-0.5 font-medium">Hubungi customer service staf Elysium Arena melalui WhatsApp resmi kami.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6283869002070"
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
