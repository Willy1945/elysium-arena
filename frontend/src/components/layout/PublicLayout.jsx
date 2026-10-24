import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-cust-red selection:text-white">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
