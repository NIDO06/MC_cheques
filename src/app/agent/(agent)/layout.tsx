"use client";

import React, { useState } from 'react';
import Sidebar from '@components/agent/Sidebar';
import { Menu, X } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-900 antialiased w-full">
      <div className="lg:flex lg:min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-[280px] transform bg-[#f8fafc] border-r border-gray-200 transition-transform duration-300 lg:static lg:translate-x-0 lg:w-[280px] lg:border-none ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="lg:hidden flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-[#0f6e38] font-bold text-lg tracking-tight">
              <span>M.C CHEQUES</span>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
          </div>
          <Sidebar />
        </div>

        {isSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          />
        ) : null}

        <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
          <header className="bg-white border-b border-gray-200 h-[73px] px-6 flex items-center justify-between w-full shrink-0 sticky top-0 z-40">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider hidden lg:block">
              Espace Agent
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}