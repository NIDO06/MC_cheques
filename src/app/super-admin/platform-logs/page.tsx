"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  Plus, 
  X, 
  Info, 
  Mail, 
  Key,
  SlidersHorizontal
} from "lucide-react";

interface InstitutionBanque {
  id: string;
  nomInstitution: string;
  codeInterbancaire: string; // Ex: BIC / Code Banque
  adminNom: string;
  adminEmail: string;
  cleMaitresse: string;
  statutRéseau: "ACTIF" | "SUSPENDU" | "EN_ATTENTE";
  agencesConnectees: number;
}

export default function SuperAdminBanksDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);

  // Formulaire d'ajout d'institution & d'administrateur
  const [newBankNom, setNewBankNom] = useState("");
  const [newBankCode, setNewBankCode] = useState("");
  const [newAdminNom, setNewAdminNom] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // Registre Global des Banques et de leurs Administrateurs Généraux
  const [banques, setBanques] = useState<InstitutionBanque[]>([
    {
      id: "BANK-001",
      nomInstitution: "ACE FINANCE S.A.",
      codeInterbancaire: "ACEFCMXX",
      adminNom: "M. Paul Ondoua",
      adminEmail: "p.ondoua@ace-finance.cm",
      cleMaitresse: "MASTER-🔑-9901-SEC",
      statutRéseau: "ACTIF",
      agencesConnectees: 12
    },
    {
      id: "BANK-002",
      nomInstitution: "Afriland First Bank",
      codeInterbancaire: "AFRICMXX",
      adminNom: "Mme. Henriette Siga",
      adminEmail: "h.siga@afriland.cm",
      cleMaitresse: "MASTER-🔑-4412-SEC",
      statutRéseau: "ACTIF",
      agencesConnectees: 45
    },
    {
      id: "BANK-003",
      nomInstitution: "Société Générale Cameroun",
      codeInterbancaire: "SGECCMXX",
      adminNom: "M. Ibrahim Bello",
      adminEmail: "i.bello@sgc.com",
      cleMaitresse: "MASTER-🔑-7756-SEC",
      statutRéseau: "EN_ATTENTE",
      agencesConnectees: 0
    }
  ]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Enregistrement d'une banque et attribution des accès à son administrateur
  const handleRegisterBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankNom || !newBankCode || !newAdminNom || !newAdminEmail) return;

    const randomMasterKey = `MASTER-🔑-${Math.floor(1000 + Math.random() * 9000)}-SEC`;
    const newInstitution: InstitutionBanque = {
      id: `BANK-00${banques.length + 1}`,
      nomInstitution: newBankNom,
      codeInterbancaire: newBankCode.toUpperCase(),
      adminNom: newAdminNom,
      adminEmail: newAdminEmail,
      cleMaitresse: randomMasterKey,
      statutRéseau: "ACTIF",
      agencesConnectees: 0
    };

    setBanques([...banques, newInstitution]);
    setShowBankModal(false);
    // Reset
    setNewBankNom(""); setNewBankCode(""); setNewAdminNom(""); setNewAdminEmail("");
    triggerToast(`Institution "${newInstitution.nomInstitution}" rattachée. Accès Administrateur provisionnés.`);
  };

  // Révocation immédiate des privilèges d'un Administrateur de Banque
  const handleRevokeAdmin = (id: string, nomBank: string, nomAdmin: string) => {
    if (confirm(`CRITIQUE: Êtes-vous sûr de vouloir révoquer les accès de l'administrateur (${nomAdmin}) de la banque ${nomBank} ? Toutes ses agences rattachées perdront la connexion.`)) {
      setBanques(prev => 
        prev.map(b => 
          b.id === id 
            ? { ...b, statutRéseau: "SUSPENDU", cleMaitresse: "RÉVOQUÉE / VERROUILLÉE" } 
            : b
        )
      );
      triggerToast(`Accès révoqués pour ${nomBank}. Le jeton d'administration a été détruit.`);
    }
  };

  // Filtrage
  const filteredBanques = banques.filter(b => 
    b.nomInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.adminNom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4 md:p-6 text-slate-800 antialiased bg-[#F8F9FD] min-h-screen">
      
      {/* TOAST SYSTEM */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Info className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer"><X className="h-3 w-3" /></button>
        </div>
      )}

      {/* EN-TÊTE DU SUPER-ADMIN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-purple-700 text-white px-2 py-0.5 rounded uppercase tracking-widest">Console Racine Autorité (Super-Admin)</span>
          </div>
          <h1 className="text-2xl font-black text-[#0A1D37] tracking-tight">Gestion des Banques & Droits Institutionnels</h1>
        </div>

        <button 
          onClick={() => setShowBankModal(true)}
          className="flex items-center gap-2 bg-[#0B6634] hover:bg-[#074724] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Enregistrer une Institution & Admin</span>
        </button>
      </div>

      {/* METRIQUES CENTRALES DU SYSTÈME INTERBANCAIRE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Banques Partenaires</span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">{banques.length}</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Agences Total Connectées</span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
            {banques.reduce((acc, b) => acc + b.agencesConnectees, 0)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Statut Passerelle de Compensation</span>
          <div className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-max mt-2 border border-emerald-200">
            OPÉRATIONNELLE & SÉCURISÉE
          </div>
        </div>
      </div>

      {/* CONTROLE DES ACCÈS ADMINISTRATEURS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Habilitations des Administrateurs de Banques</h2>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Filtrer par banque ou admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0B6634]"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Institution Bancaire</th>
                <th className="py-3 px-5">Administrateur Général Nommé</th>
                <th className="py-3 px-5">Identifiant / Email Racine</th>
                <th className="py-3 px-5">Clé Maîtresse d'Accès</th>
                <th className="py-3 px-5">Réseau d'Agences</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Actions de Sécurité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBanques.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Institution */}
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900">{b.nomInstitution}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">{b.codeInterbancaire}</span>
                    </div>
                  </td>

                  {/* Nom Admin */}
                  <td className="py-3.5 px-5 font-bold text-slate-800">{b.adminNom}</td>

                  {/* Email Admin */}
                  <td className="py-3.5 px-5">
                    <span className="font-mono text-slate-600 font-medium flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {b.adminEmail}
                    </span>
                  </td>

                  {/* Clé Maîtresse */}
                  <td className="py-3.5 px-5">
                    <span className={`font-mono border px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                      b.statutRéseau === "SUSPENDU" ? "bg-rose-50 text-rose-700 border-rose-200 line-through" : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}>
                      <Key className="h-3 w-3 text-purple-400" />
                      {b.cleMaitresse}
                    </span>
                  </td>

                  {/* Agences Couvertes */}
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-600">{b.agencesConnectees} succursales</td>

                  {/* Statut Réseau */}
                  <td className="py-3.5 px-5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm border ${
                      b.statutRéseau === "ACTIF" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      b.statutRéseau === "EN_ATTENTE" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-rose-50 text-rose-600 border-rose-200"
                    }`}>
                      {b.statutRéseau}
                    </span>
                  </td>

                  {/* Révocation */}
                  <td className="py-3.5 px-5 text-right">
                    {b.statutRéseau !== "SUSPENDU" ? (
                      <button
                        onClick={() => handleRevokeAdmin(b.id, b.nomInstitution, b.adminNom)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-rose-600 border border-slate-200 hover:border-rose-600 text-slate-500 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-500 group-hover:text-white" />
                        <span>Révoquer l'Admin</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-rose-600 font-bold italic select-none">Banque Déconnectée</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE : CRÉATION DU COMPTE ADMINISTRATEUR BANQUE */}
      {showBankModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Enregistrer une Banque & son Administrateur</h3>
              <button onClick={() => setShowBankModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            
            <form onSubmit={handleRegisterBank} className="space-y-4 mt-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] font-medium">
                Cette action va inscrire l'établissement sur le réseau interbancaire et générer des accès sécurisés racines pour son administrateur désigné.
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Nom de la Banque Institutionnelle</label>
                  <input required type="text" placeholder="Ex: ACE FINANCE S.A." value={newBankNom} onChange={e => setNewBankNom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Code BIC / Code Institution Interbancaire</label>
                  <input required type="text" placeholder="Ex: ACEFCMXX" value={newBankCode} onChange={e => setNewBankCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none" />
                </div>

                <div className="w-full h-px bg-slate-100 my-2"></div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Nom Complet de l'Administrateur de Banque</label>
                  <input required type="text" placeholder="Ex: M. Paul Ondoua" value={newAdminNom} onChange={e => setNewAdminNom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Email Professionnel (Identifiant Racine)</label>
                  <input required type="email" placeholder="p.ondoua@ace-finance.cm" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0B6634] text-white font-bold py-2.5 rounded-xl text-xs shadow-sm mt-2 transition-all cursor-pointer active:scale-98">
                Inscrire la Banque et Activer l'Administrateur
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}