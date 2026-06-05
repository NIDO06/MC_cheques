"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Key, 
  UserPlus, 
  Info, 
  X, 
  Terminal, 
  ArrowRight 
} from "lucide-react";

interface AgenceData {
  id: string;
  code: string;
  nom: string;
  ville: string;
  chefAssigne: string;
  statut: "OPERATIONNEL" | "ALERTE" | "INACTIF";
  volume24h: number;
}

interface ChefAcces {
  id: string;
  nom: string;
  email: string;
  agenceNom: string;
  cleAcces: string;
  statut: "ACTIF" | "SUSPENDU";
}

export default function BankAdminDashboard() {
  const [agences, setAgences] = useState<AgenceData[]>([
    { id: "1", code: "AG-DLA-01", nom: "Agence Principale Akwa", ville: "Douala", chefAssigne: "M. Jean Ewane", statut: "OPERATIONNEL", volume24h: 14500000 },
    { id: "2", code: "AG-YDE-02", nom: "Agence Hippodrome", ville: "Yaoundé", chefAssigne: "Mme. Carine Ngo", statut: "OPERATIONNEL", volume24h: 8900000 },
    { id: "3", code: "AG-GOU-03", nom: "Succursale de Garoua", ville: "Garoua", chefAssigne: "Non Assigné", statut: "ALERTE", volume24h: 0 }
  ]);

  const [accesChefs, setAccesChefs] = useState<ChefAcces[]>([
    { id: "C1", nom: "M. Jean Ewane", email: "j.ewane@mc-cheques.cm", agenceNom: "Agence Principale Akwa", cleAcces: "MC-🔑-8831", statut: "ACTIF" },
    { id: "C2", nom: "Mme. Carine Ngo", email: "c.ngo@mc-cheques.cm", agenceNom: "Agence Hippodrome", cleAcces: "MC-🔑-4402", statut: "ACTIF" }
  ]);

  const [showAgenceModal, setShowAgenceModal] = useState(false);
  const [showChefModal, setShowChefModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [newAgNom, setNewAgNom] = useState("");
  const [newAgVille, setNewAgVille] = useState("");
  const [newAgCode, setNewAgCode] = useState("");

  const [newChefNom, setNewChefNom] = useState("");
  const [newChefEmail, setNewChefEmail] = useState("");
  const [newChefAgenceId, setNewChefAgenceId] = useState("");

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateAgence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgNom || !newAgCode || !newAgVille) return;
    const newAg: AgenceData = {
      id: String(agences.length + 1),
      code: newAgCode.toUpperCase(),
      nom: newAgNom,
      ville: newAgVille,
      chefAssigne: "Non Assigné",
      statut: "OPERATIONNEL",
      volume24h: 0
    };
    setAgences([...agences, newAg]);
    setShowAgenceModal(false);
    setNewAgNom(""); setNewAgCode(""); setNewAgVille("");
    triggerToast(`Succursale "${newAg.nom}" configurée sur le réseau.`);
  };

  const handleCreateChef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChefNom || !newChefEmail || !newChefAgenceId) return;
    const targetAgence = agences.find(a => a.id === newChefAgenceId);
    if (!targetAgence) return;

    const randomKey = `MC-🔑-${Math.floor(1000 + Math.random() * 9000)}`;
    const newChef: ChefAcces = {
      id: `C${accesChefs.length + 1}`,
      nom: newChefNom,
      email: newChefEmail,
      agenceNom: targetAgence.nom,
      cleAcces: randomKey,
      statut: "ACTIF"
    };

    setAgences(agences.map(a => a.id === targetAgence.id ? { ...a, chefAssigne: newChefNom } : a));
    setAccesChefs([...accesChefs, newChef]);
    setShowChefModal(false);
    setNewChefNom(""); setNewChefEmail("");
    triggerToast(`Accréditation générée pour ${newChef.nom}.`);
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4 md:p-6 text-slate-800 antialiased bg-[#F8F9FD] min-h-screen">
      
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <Info className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2"><X className="h-3 w-3" /></button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#0A1D37] tracking-tight">Console Administration Institutionnelle</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAgenceModal(true)} className="flex items-center gap-2 bg-[#0B6634] text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-xs"><Building2 className="h-3.5 w-3.5" /><span>Ajouter une Agence</span></button>
          <button onClick={() => setShowChefModal(true)} className="flex items-center gap-2 border border-[#0B6634] text-[#0B6634] bg-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"><UserPlus className="h-3.5 w-3.5" /><span>Accréditer un Chef</span></button>
        </div>
      </div>

      {/* TABLEAU DES AGENCES */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Cartographie des Agences Établies</h2>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Nom de l'Agence</th>
                <th className="py-3 px-5">Ville</th>
                <th className="py-3 px-5">Chef d'Agence</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Volume Compensé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {agences.map((ag) => (
                <tr key={ag.id}>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{ag.nom}</td>
                  <td className="py-3.5 px-5 text-slate-600">{ag.ville}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-700">{ag.chefAssigne}</td>
                  <td className="py-3.5 px-5">
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded">{ag.statut}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">{ag.volume24h.toLocaleString()} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION DU REGISTRE DES DROITS (AVEC LE BOUTON DE REDIRECTION DEMANDÉ) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Registre des Droits et Clés Réseau (Chefs d'Agences)
          </h2>
          
          {/* BOUTON DE REDIRECTION VERS PLATFORM-LOGS */}
          <a 
            href="/admin/platform-logs" 
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-[11px] shadow-sm transition-all group active:scale-98"
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Consulter les Logs de Connexion</span>
            <ArrowRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Identité du Cadre</th>
                <th className="py-3 px-5">Adresse Email Réseau</th>
                <th className="py-3 px-5">Agence Affectée</th>
                <th className="py-3 px-5">Clé Électronique Générée</th>
                <th className="py-3 px-5 text-right">Statut Clé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {accesChefs.map((chef) => (
                <tr key={chef.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-black text-slate-900">{chef.nom}</td>
                  <td className="py-3.5 px-5 text-slate-500 font-mono">{chef.email}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-700">{chef.agenceNom}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-mono bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                      <Key className="h-2.5 w-2.5 text-slate-400" />
                      {chef.cleAcces}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">{chef.statut}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALES REPRISES DES CODES PRÉCÉDENTS */}
      {showAgenceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Ajouter une nouvelle succursale</h3>
              <button onClick={() => setShowAgenceModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateAgence} className="space-y-4 mt-4">
              <input required type="text" placeholder="Nom de l'Agence" value={newAgNom} onChange={e => setNewAgNom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="Code Identifiant" value={newAgCode} onChange={e => setNewAgCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                <input required type="text" placeholder="Ville" value={newAgVille} onChange={e => setNewAgVille(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
              </div>
              <button type="submit" className="w-full bg-[#0B6634] text-white font-bold py-2.5 rounded-xl text-xs">Inscrire la succursale</button>
            </form>
          </div>
        </div>
      )}

      {showChefModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Création accès chef d'agence</h3>
              <button onClick={() => setShowChefModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateChef} className="space-y-4 mt-4">
              <input required type="text" placeholder="Nom Complet du Dirigeant" value={newChefNom} onChange={e => setNewChefNom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
              <input required type="email" placeholder="Adresse Email Professionnelle" value={newChefEmail} onChange={e => setNewChefEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
              <select required value={newChefAgenceId} onChange={e => setNewChefAgenceId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white">
                <option value="">Sélectionner une agence...</option>
                {agences.map(a => (<option key={a.id} value={a.id}>{a.nom}</option>))}
              </select>
              <button type="submit" className="w-full bg-[#0B6634] text-white font-bold py-2.5 rounded-xl text-xs">Générer les accréditations</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}