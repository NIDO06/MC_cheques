"use client";

import React from 'react';
import Sidebar from '@components/admin/Sidebar';
import { Menu } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans text-slate-900 antialiased w-full">
      
      {/* Navigation Latérale Fixe */}
      <Sidebar />

      {/* Zone de Contenu Droite (Header + Pages de l'application) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Contenu de la page injecté ici */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </div>
  );
}