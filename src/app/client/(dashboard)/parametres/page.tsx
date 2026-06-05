"use client";

import React, { useState, useRef } from 'react';
import { 
  Menu,
  User, 
  Bell, 
  Shield, 
  Lock, 
  AlertTriangle,
  Camera,
  CheckCircle2
} from 'lucide-react';

type TabType = 'profil' | 'notifications' | 'securite';

export default function ParametresPage() {
  // --- Gestion de l'onglet actif ---
  const [activeTab, setActiveTab] = useState<TabType>('profil');

  // --- États des informations personnelles ---
  const [nom, setNom] = useState('Jean Dupont');
  const [telephone, setTelephone] = useState('+33 1 23 45 67 89');
  const [email, setEmail] = useState('jean.dupont@acefinance.fr');
  const [role, setRole] = useState('Client');
  
  // --- État de la photo de profil ---
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- États de sécurité ---
  const [currentPassword, setCurrentPassword] = useState('************');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Notification Toast locale pour feedback visuel ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Gestionnaires d'événements ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop lourde (max 2 Mo)");
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
      showToast('Photo de profil mise à jour localement !');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Informations personnelles enregistrées !');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    showToast('Mot de passe mis à jour avec succès !');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous absolument sûr de vouloir supprimer ce compte ? Cette action est irréversible.')) {
      showToast('Compte supprimé (simulation).');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans flex flex-col relative">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* ================= CONTENU CENTRAL ================= */}
      <main className="flex-1 w-full overflow-y-auto pb-12">
        <div className="p-4 max-w-md w-full mx-auto space-y-4">
          
          {/* CARTE DE PROFIL DYNAMIQUE */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col items-center justify-center text-center relative group">
            
            {/* Input fichier caché */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />

            {/* Conteneur de l'image de profil cliquable */}
            <button 
              onClick={triggerFileInput}
              className="w-18 h-18 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-inner relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              title="Changer la photo de profil"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="stroke-[1.5]" />
              )}
              
              {/* Overlay au survol / bouton d'édition intégré */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={16} />
              </div>
            </button>

            {/* Petit badge caméra flottant */}
            <button 
              onClick={triggerFileInput}
              className="absolute top-[68px] right-[172px] bg-emerald-600 text-white p-1.5 rounded-full border border-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Camera size={10} />
            </button>

            <h2 className="text-base font-black text-slate-800 tracking-tight">{nom || 'Utilisateur'}</h2>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">{role}</p>
          </div>

          {/* NAVIGATION DES ONGLETS PARAMÈTRES (INTERACTIFS) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs space-y-0.5 flex flex-col">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profil' 
                  ? 'bg-[#0f6e38] text-white shadow-xs' 
                  : 'text-slate-400 hover:bg-slate-50 text-left'
              }`}
            >
              <User size={15} className={activeTab === 'profil' ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span>Profil</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'notifications' 
                  ? 'bg-[#0f6e38] text-white shadow-xs' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Bell size={15} className={activeTab === 'notifications' ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span>Notifications</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('securite')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'securite' 
                  ? 'bg-[#0f6e38] text-white shadow-xs' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Shield size={15} className={activeTab === 'securite' ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span>Sécurité</span>
            </button>
          </div>

          {/* ================= CONTENU CONDITIONNEL SELON L'ONGLET ================= */}
          
          {activeTab === 'profil' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 tracking-tight">Informations personnelles</h3>
                <div className="text-slate-400">
                  <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </div>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-3.5">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nom Complet
                  </label>
                  <input 
                    type="text" 
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-[#f8fafc]/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0f6e38] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Numéro de Téléphone
                  </label>
                  <input 
                    type="text" 
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-[#f8fafc]/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0f6e38] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Adresse E-mail
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8fafc]/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0f6e38] focus:bg-white transition-all"
                  />
                  <p className="text-[10px] font-medium text-slate-400 mt-1.5 leading-relaxed">
                    L'adresse e-mail est gérée par votre organisation.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0f6e38] text-white py-2.5 rounded-xl font-bold text-xs shadow-2xs hover:bg-[#0b5229] transition-all cursor-pointer active:scale-[0.99]"
                >
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 animate-fadeIn">
              <h3 className="text-sm font-black text-slate-800 tracking-tight">Préférences de notifications</h3>
              <p className="text-xs text-slate-400">Gérez la façon dont vous recevez les alertes de suivi de chéquiers.</p>
              
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Alertes SMS à la validation</span>
                  <input type="checkbox" defaultChecked className="accent-emerald-600 h-4 w-4" />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">Rapports hebdomadaires par e-mail</span>
                  <input type="checkbox" className="accent-emerald-600 h-4 w-4" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Formulaire Mot de passe */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Sécurité</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Mettez à jour votre mot de passe pour sécuriser votre compte.
                    </p>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    <Lock size={16} className="stroke-[2]" />
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Mot de passe actuel
                    </label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#f8fafc]/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0f6e38] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Nouveau mot de passe
                    </label>
                    <input 
                      type="password" 
                      placeholder="Min. 12 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#0f6e38] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input 
                      type="password" 
                      placeholder="Min. 12 caractères"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#0f6e38] transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full border border-slate-200 bg-white text-slate-700 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    Mettez à jour le mot de passe
                  </button>
                </form>
              </div>

              {/* BLOC : ZONE DE DANGER */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="text-red-600 mt-0.5 shrink-0">
                    <AlertTriangle size={15} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-red-800 tracking-wider uppercase">
                      Zone de danger
                    </h4>
                    <p className="text-[11px] font-semibold text-red-700/80 leading-snug mt-0.5">
                      Une fois supprimé, votre compte ne peut plus être récupéré.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleDeleteAccount}
                  className="w-full bg-transparent text-red-700 border border-red-200 hover:bg-red-100/50 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-[0.99]"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}