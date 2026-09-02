import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout({ children, onSearch }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <TopNavbar onSearch={onSearch} />
      <main className="pl-[240px] pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}