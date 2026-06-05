"use client";

import React from 'react';
import Sidebar from '@components/client/Sidebar';
import { Menu } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans text-slate-900 antialiased w-full">
      
      {/* Navigation Latérale Fixe */}
      <Sidebar />

      {/* Zone de Contenu Droite (Header + Pages de l'application) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar Supérieure */}
        <header className="bg-white border-b border-gray-200 h-[73px] px-8 flex items-center justify-between w-full shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Le bouton hamburger reste présent pour la version mobile si nécessaire */}
            <button className="text-gray-600 hover:text-gray-900 cursor-pointer lg:hidden">
              <Menu size={22} />
            </button>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider hidden lg:block">
              Espace Client Personnel
            </div>
          </div>
        </header>

        {/* Contenu de la page injecté ici */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}