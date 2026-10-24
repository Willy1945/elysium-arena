import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Komponen ini memastikan setiap kali navigasi/pindah halaman di React Router,
 * posisi scroll browser akan otomatis kembali ke bagian paling atas (top: 0).
 * Jika ada target ID hash (#...), akan otomatis scroll ke elemen tersebut.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Jika ada anchor hash (#kontak, #fasilitas, dll), arahkan ke elemen tersebut
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    } else {
      // Pindah halaman biasa: langsung kembalikan scroll ke paling atas
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
