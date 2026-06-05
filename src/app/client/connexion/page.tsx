"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banknote, Mail, Lock, ArrowRight, LucideAlertCircle } from 'lucide-react';

export default function UniversalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // Simulation d'une logique d'authentification et de routage basée sur les rôles
    // (À remplacer plus tard par ton appel API de ton backend Laravel)
    setTimeout(() => {
      if (cleanEmail.includes('superadmin')) {
        // Redirection Super Administrateur (Gestion globale de la plateforme, des banques, etc.)
        router.push('/super-admin/dashboard');
      } else if (cleanEmail.includes('admin') || cleanEmail.endsWith('@acefinance.com')) {
        // Redirection Administrateur Institutionnel (Ex: ACE Finance, UBA, etc.)
        router.push('/admin/dashboard');
      } else if (cleanEmail.includes('agent') || cleanEmail.includes('staff')) {
        // Redirection Agent / Gestionnaire de compte (Traitement des chéquiers)
        router.push('/agent/dashboard');
      } else if (cleanEmail.length > 0 && password.length > 0) {
        // Redirection par défaut : Espace Client (Entreprises et Particuliers)
        router.push('/client/dashboard');
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
        setIsLoading(false);
      }
    }, 800); // Léger délai pour simuler l'attente réseau
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col justify-between font-sans text-slate-900 antialiased w-full">
      
      {/* 1. Header supérieur épuré */}
      <header className="bg-white border-b border-gray-200 h-[73px] px-6 flex items-center w-full">
        <div className="flex items-center gap-2 text-[#0f6e38] font-bold text-lg tracking-tight">
          <Banknote size={22} /> M.C CHEQUES
        </div>
      </header>

      {/* 2. Zone centrale : Formulaire de connexion unique */}
      <main className="flex-1 flex items-center justify-center p-6 py-12 w-full">
        <div className="w-full max-w-[520px] bg-white border border-gray-200/80 rounded-2xl p-10 shadow-sm">
          
          {/* Titres */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Connexion</h1>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Saisissez vos identifiants pour accéder à votre espace sécurisé.
            </p>
          </div>

          {/* Message d'erreur dynamique */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <LucideAlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire unique */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Email */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@domaine.com"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0f6e38] focus:ring-1 focus:ring-[#0f6e38] transition-all"
                />
              </div>
            </div>

            {/* Input Mot de Passe */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Mot de passe
                </label>
                <a href="#" className="text-xs font-bold text-[#0f6e38] hover:underline">
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0f6e38] focus:ring-1 focus:ring-[#0f6e38] transition-all"
                />
              </div>
            </div>

            {/* Case à cocher "Se souvenir de moi" */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#0f6e38] focus:ring-[#0f6e38] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-600 cursor-pointer select-none">
                Se souvenir de moi
              </label>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#0f6e38] text-white py-4 rounded-xl font-bold text-sm shadow-md shadow-green-100 hover:bg-[#0b5229] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] duration-150
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span>{isLoading ? 'Vérification...' : 'Se Connecter'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Séparateur horizontal */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Pied du formulaire */}
          <div className="text-center text-xs">
            <span className="text-gray-500">Problème d'accès ?</span>{' '}
            <a href="#" className="font-bold text-[#0f6e38] hover:underline block mt-1">
              Contacter le support IT
            </a>
          </div>

        </div>
      </main>

      {/* 3. Footer Système */}
      <footer className="bg-white border-t border-gray-200 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-500 w-full">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[#0f6e38] uppercase font-bold text-[11px] tracking-wider">Système Opérationnel</span>
          <span className="text-gray-400 font-normal">v2.4.0 Release</span>
        </div>
        <div className="flex gap-6 text-[11px] text-gray-600 font-bold">
          <a href="#" className="hover:underline">Politique de Confidentialité</a>
          <a href="#" className="hover:underline">Conditions d'Utilisation</a>
        </div>
      </footer>

    </div>
  );
}