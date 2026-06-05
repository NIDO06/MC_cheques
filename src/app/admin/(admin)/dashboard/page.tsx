"use client";

import React, { useState } from "react";
import { 
  Download, 
  Plus, 
  Search, 
  SlidersHorizontal,
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2,
  ShieldCheck,
  Sliders
} from "lucide-react";

export default function MainNetworkDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Données des établissements tirées de image_d8de5d.jpg
  const institutions = [
    { name: "BNP Paribas", code: "ID : 4922 - BANK-FR", status: "ACTIF", agences: 249, volume: "4,205,000 FCFA", logoText: "BNP", logoBg: "bg-[#0B6634]/10 text-[#0B6634]" },
    { name: "Société Générale", code: "ID : 8821 - BANK-FR", status: "ACTIF", agences: 182, volume: "2,890,400 FCFA", logoText: "SG", logoBg: "bg-slate-200 text-slate-700" },
    { name: "Banque de l'Est", code: "ID : 2241 - BANK-FR", status: "MAINTENANCE", agences: 15, volume: "0 FCFA", logoText: "BCE", logoBg: "bg-rose-100 text-rose-700" },
    { name: "Crédit Agricole", code: "ID : 1102 - BANK-FR", status: "ACTIF", agences: 412, volume: "7,110,850 FCFA", logoText: "CA", logoBg: "bg-emerald-100 text-emerald-800" },
  ];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto p-2">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0B6634]">Console de Supervision</span>
          <h1 className="text-3xl font-black text-[#0A1D37] tracking-tight leading-none">
            Vue d'ensemble<br />du réseau
          </h1>
        </div>

        {/* Boutons d'actions principaux */}
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors shadow-2xs group active:scale-98">
            <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0B6634] transition-colors" />
            <span>Exporter le Rapport</span>
          </button>
          
          <button className="flex items-center gap-2 bg-[#0B6634] hover:bg-[#074724] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-98">
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Nouvelle Banque</span>
          </button>
        </div>
      </div>

      {/* SECTION DES TROIS COMPTEURS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Agences</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">24</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">+2 ce mois</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-4">Réseau interbancaire connecté</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Agences Actives</span>
            <div className="text-3xl font-black text-slate-900 font-mono">1,142</div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-4">Points de service opérationnels</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Throughput (24h)</span>
            <div className="text-3xl font-black text-[#0B6634] font-mono tracking-tight">14.8M</div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-4">Flux transactionnel totalisé</p>
        </div>
      </div>

      {/* ALERTES SYSTÈME */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>Alertes Système</span>
          </h2>
          <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-md">
            4 Critiques
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
          <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50 transition-colors">
            <div className="p-2 rounded-xl shrink-0 bg-rose-50 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900">Banque Centrale - Node A</span>
                <span className="text-[10px] font-medium text-slate-400 shrink-0">5m ago</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Délai de réponse anormal détecté sur la passerelle API de clearing.</p>
            </div>
          </div>

          <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50 transition-colors">
            <div className="p-2 rounded-xl shrink-0 bg-slate-100 text-slate-500">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900">Sync Agences - Agence 42</span>
                <span className="text-[10px] font-medium text-slate-400 shrink-0">15m ago</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Déconnexion prolongée du terminal de capture #T-D91.</p>
            </div>
          </div>

          <div className="p-4 flex gap-4 items-start hover:bg-slate-50/50 transition-colors">
            <div className="p-2 rounded-xl shrink-0 bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900">Mise à jour Certificats</span>
                <span className="text-[10px] font-medium text-slate-400 shrink-0">1h ago</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Mise à jour réussie des clés de chiffrement TLS 1.3 sur tout le réseau.</p>
            </div>
          </div>

          
        </div>
      </div>

      {/* SECTION SUPERVISION INTERBANCAIRE (TABLEAU) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Supervision Interbancaire</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher une banque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0B6634] text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <button className="p-2 border border-slate-200 bg-white text-slate-500 rounded-xl hover:bg-slate-50">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Institution</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Agences</th>
                  <th className="py-3 px-5 text-right">Volume (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {institutions.map((inst, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${inst.logoBg} flex items-center justify-center font-black text-[10px] tracking-tight shrink-0`}>
                        {inst.logoText}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{inst.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">{inst.code}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded ${
                        inst.status === "ACTIF" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${inst.status === "ACTIF" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-600 font-mono">{inst.agences}</td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                      {inst.volume}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination du tableau */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] text-slate-400 font-bold">
              Affichage de 4 sur 24 banques enregistrées
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-slate-200 rounded-lg bg-white text-slate-400 cursor-not-allowed">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black bg-[#0B6634] text-white">
                1
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                2
              </button>
              <button className="p-1 border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITÉ RÉSEAU HEBDOMADAIRE (HISTOGRAMME) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Activité Réseau Hebdomadaire</h2>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#0B6634]" />
              <span>Compensations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Rejets</span>
            </div>
          </div>
        </div>
        
        <div className="h-28 flex items-end gap-3 pt-4 border-b border-slate-100 px-2">
          {[
            { comp: 40, rej: 15 },
            { comp: 60, rej: 20 },
            { comp: 35, rej: 10 },
            { comp: 80, rej: 25 },
            { comp: 70, rej: 15 },
            { comp: 20, rej: 5 },
            { comp: 45, rej: 12 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex gap-1 h-full items-end">
              <div style={{ height: `${bar.comp}%` }} className="flex-1 bg-[#0B6634]/30 rounded-t-sm hover:bg-[#0B6634]/50 transition-all" />
              <div style={{ height: `${bar.rej}%` }} className="flex-1 bg-slate-200 rounded-t-sm hover:bg-slate-300 transition-all" />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 font-mono">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </div>

      {/* SCORE DE SANTÉ RÉSEAU */}
      <div className="bg-[#0B6634] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-emerald-100">Score de Santé Réseau</h2>
            <p className="text-[11px] text-emerald-100/70 font-medium">Basé sur 1,142 agences en temps réel</p>
          </div>
          <ShieldCheck className="h-10 w-10 text-emerald-100/10 absolute right-6 top-6" />
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center text-lg font-black font-mono">
              98
            </div>
            <div className="space-y-0.5">
              <div className="text-base font-black">Excellent</div>
              <p className="text-xs text-emerald-100/80 font-medium">Aucune interruption majeure détectée depuis 7 jours.</p>
            </div>
          </div>
          
          <button className="bg-white text-[#0B6634] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-center">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Lancer un Audit de Sécurité</span>
          </button>
        </div>
      </div>

    </div>
  );
}