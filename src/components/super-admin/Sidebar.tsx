"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Banknote, Terminal } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Tableau de bord', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Bank-management', href: '/super-admin/bank-management', icon: FileText },
    { name: 'platform-logs', href: '/super-admin/platform-logs', icon: Terminal },

  ];
  return (
    <aside className="w-full max-w-[280px] bg-[#f8fafc] border-r border-gray-200 flex flex-col justify-between min-h-screen lg:sticky lg:top-0 shrink-0">
      {/* Haut de la Sidebar : Logo */}
      <div>
        <div className="h-[73px] px-6 flex items-center border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-[#0f6e38] font-bold text-lg tracking-tight">
            <Banknote size={22} className="stroke-[2.5]" />
            <span>M.C CHEQUES</span>
          </div>
        </div>

        {/* Liens de Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0f6e38] text-white shadow-sm shadow-green-100'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bas de la Sidebar : Profil Utilisateur connecté */}
      <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          JD
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-gray-900 truncate">Jean Dupont</span>
          <span className="text-[10px] font-semibold text-gray-400 truncate">ACE Finance</span>
        </div>
      </div>
    </aside>
  );
}