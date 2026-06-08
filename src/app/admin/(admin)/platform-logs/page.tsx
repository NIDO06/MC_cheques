"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Key, 
  Mail, 
  Building2, 
  Globe, 
  SlidersHorizontal,
  ShieldAlert,
  X,
  Info
} from "lucide-react";

interface ResponsableAgence {
  id: string;
  nom: string;
  email: string;
  agenceNom: string;
  agenceCode: string;
  cleAcces: string;
  derniereIp: string;
  statutCompte: "ACTIF" | "SUSPENDU" | "EN_ATTENTE" | "REVOQUÉ";
}

export default function ResponsablesLogsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Registre complet des responsables d'agences
  const [responsables, setResponsables] = useState<ResponsableAgence[]>([
    {
      id: "RESP-001",
      nom: "M. Jean Ewane",
      email: "j.ewane@mc-cheques.cm",
      agenceNom: "Agence Principale Akwa",
      agenceCode: "AG-DLA-01",
      cleAcces: "MC-🔑-8831",
      derniereIp: "197.244.32.10",
      statutCompte: "ACTIF"
    },
    {
      id: "RESP-002",
      nom: "Mme. Carine Ngo",
      email: "c.ngo@mc-cheques.cm",
      agenceNom: "Agence Hippodrome",
      agenceCode: "AG-YDE-02",
      cleAcces: "MC-🔑-4402",
      derniereIp: "41.202.65.188",
      statutCompte: "ACTIF"
    },
    {
      id: "RESP-003",
      nom: "M. Amadou Diallo",
      email: "a.diallo@mc-cheques.cm",
      agenceNom: "Succursale de Garoua",
      agenceCode: "AG-GOU-03",
      cleAcces: "MC-🔑-1109",
      derniereIp: "102.54.12.9",
      statutCompte: "EN_ATTENTE"
    },
    {
      id: "RESP-004",
      nom: "Mme. Alice Toko",
      email: "a.toko@mc-cheques.cm",
      agenceNom: "Agence Bonanjo",
      agenceCode: "AG-DLA-02",
      cleAcces: "MC-🔑-6675",
      derniereIp: "197.244.35.44",
      statutCompte: "SUSPENDU"
    }
  ]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Fonction de révocation immédiate des accès réseau
  const handleRevokeAcces = (id: string, nom: string) => {
    if (confirm(`Êtes-vous sûr de vouloir révoquer TOUS les accès réseau de ${nom} ? Sa clé électronique sera détruite.`)) {
      setResponsables(prev => 
        prev.map(resp => 
          resp.id === id 
            ? { ...resp, statutCompte: "REVOQUÉ", cleAcces: "DÉTRUITE / EXPIRÉE" } 
            : resp
        )
      );
      triggerToast(`Droits révoqués avec succès. Les accès de ${nom} sont désormais bloqués.`);
    }
  };

  // Filtrage par nom de responsable ou nom d'agence
  const filteredResponsables = responsables.filter(resp => 
    resp.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resp.agenceNom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4 md:p-6 text-slate-800 antialiased bg-[#F8F9FD] min-h-screen">
      
      {/* TOAST NOTIFICATION DE SÉCURITÉ */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Info className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 border border-slate-200 bg-white rounded-xl text-slate-500 hover:text-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0B6634]">Contrôle des habilitations</span>
            <h1 className="text-xl font-black text-[#0A1D37] tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0B6634]" />
              <span>Registre et Identifiants des Responsables</span>
            </h1>
          </div>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher un responsable ou une agence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0B6634] text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
          </div>
          <button className="p-2 border border-slate-200 bg-white text-slate-500 rounded-xl hover:bg-slate-50 shadow-2xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* COMPTEUR ET FLUX SÉCURISÉ */}
      <div className="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono p-3 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>AUTORITÉ DE CERTIFICATION : Module de révocation instantanée des jetons connecté.</span>
        </div>
        <span className="text-emerald-400 font-bold hidden sm:inline">{filteredResponsables.length} Profils Réseau</span>
      </div>

      {/* TABLEAU PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Identité du Responsable</th>
                <th className="py-3 px-5">Agence d'Appartenance</th>
                <th className="py-3 px-5">Identifiant / Email</th>
                <th className="py-3 px-5">Clé Numérique</th>
                <th className="py-3 px-5">Dernière IP</th>
                <th className="py-3 px-5">Statut Compte</th>
                <th className="py-3 px-5 text-right">Sécurité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredResponsables.length > 0 ? (
                filteredResponsables.map((resp) => (
                  <tr key={resp.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Identité */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-black text-[10px]">
                          {resp.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">{resp.nom}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{resp.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Agence */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{resp.agenceNom}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-semibold">{resp.agenceCode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Identifiant Email */}
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-slate-600 font-medium flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {resp.email}
                      </span>
                    </td>

                    {/* Clé Numérique */}
                    <td className="py-3.5 px-5">
                      <span className={`font-mono border px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                        resp.statutCompte === "REVOQUÉ" 
                          ? "bg-rose-50 text-rose-700 border-rose-200 line-through" 
                          : "bg-slate-100 border-slate-200 text-slate-800"
                      }`}>
                        <Key className="h-2.5 w-2.5 text-slate-400" />
                        {resp.cleAcces}
                      </span>
                    </td>

                    {/* Dernière IP */}
                    <td className="py-3.5 px-5 font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span>{resp.derniereIp}</span>
                      </div>
                    </td>

                    {/* Statut Compte */}
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-sm border ${
                        resp.statutCompte === "ACTIF" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        resp.statutCompte === "EN_ATTENTE" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        resp.statutCompte === "SUSPENDU" ? "bg-slate-100 text-slate-600 border-slate-200" :
                        "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          resp.statutCompte === "ACTIF" ? "bg-emerald-500" :
                          resp.statutCompte === "EN_ATTENTE" ? "bg-amber-500" :
                          resp.statutCompte === "SUSPENDU" ? "bg-slate-400" : "bg-rose-500"
                        }`}></span>
                        {resp.statutCompte}
                      </span>
                    </td>

                    {/* BOUTON DE RÉVOCATION DES ACCÈS */}
                    <td className="py-3.5 px-5 text-right">
                      {resp.statutCompte !== "REVOQUÉ" ? (
                        <button
                          onClick={() => handleRevokeAcces(resp.id, resp.nom)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-rose-600 border border-slate-200 hover:border-rose-600 text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                          title="Révoquer définitivement les accès"
                        >
                          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                          <span className="hidden md:inline">Révoquer</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-rose-500 font-bold italic pr-2 select-none">
                          Accès Verrouillés
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium italic">
                    Aucun responsable ou agence ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}