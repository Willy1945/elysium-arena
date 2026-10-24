import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout({ children, onSearch }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex print:bg-white print:min-h-0 print:block">
      <div className="print:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 min-w-0 pl-0 lg:pl-[270px] print:pl-0 flex flex-col print:block">
        <div className="print:hidden">
          <TopNavbar
            onSearch={onSearch}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 print:mt-0 print:p-0 max-w-[1400px] w-full print:max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
