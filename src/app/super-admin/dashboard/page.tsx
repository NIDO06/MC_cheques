"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  SlidersHorizontal, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  CheckCircle, 
  Info 
} from "lucide-react";

// Structure de données pour modéliser les banques partenaires
interface InstitutionBank {
  name: string;
  subTitle: string;
  code: string;
  agencesCount: number;
  status: "Active" | "Inactive";
  logoColor: string;
}

export default function BankManagementPage() {
  // --- ÉTATS PRINCIPAUX ---
  const [subFilter, setSubFilter] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // --- ÉTAT DU TOAST DE NOTIFICATION ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- ÉTAT MUTABLE DES BANQUES ---
  const [institutions, setInstitutions] = useState<InstitutionBank[]>([
    { name: "ACE Finance", subTitle: "Siège Social, Paris", code: "ACEF-FR-22", agencesCount: 45, status: "Active", logoColor: "bg-[#0B3B26]" },
    { name: "UBA", subTitle: "Regional HQ, Dakar", code: "UBA-SN-11", agencesCount: 112, status: "Active", logoColor: "bg-[#D1232A]" },
    { name: "ECOBANK", subTitle: "Lomé Hub", code: "ECO-TG-04", agencesCount: 88, status: "Inactive", logoColor: "bg-[#005B82]" },
    { name: "Société Générale", subTitle: "Siège, Douala", code: "SG-CM-09", agencesCount: 34, status: "Active", logoColor: "bg-red-600" },
    { name: "Attijariwafa Bank", subTitle: "Casablanca", code: "AWB-MA-77", agencesCount: 156, status: "Active", logoColor: "bg-amber-600" }
  ]);

  // --- ÉTATS DE LA MODALE D'AJOUT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSubTitle, setFormSubTitle] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formAgences, setFormAgences] = useState("1");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");

  // --- RECALCULS DYNAMIQUES (KPIs) ---
  const totalPartners = institutions.length;
  const activePartners = useMemo(() => institutions.filter(b => b.status === "Active").length, [institutions]);
  const operationalPercentage = useMemo(() => {
    return totalPartners > 0 ? Math.round((activePartners / totalPartners) * 100) : 0;
  }, [activePartners, totalPartners]);

  // --- MOTEUR DE FILTRAGE ---
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((bank) => {
      const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            bank.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = subFilter === "Toutes" || 
                            (subFilter === "Actives" && bank.status === "Active") || 
                            (subFilter === "Inactives" && bank.status === "Inactive");
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, subFilter, institutions]);

  // --- LOGIQUE DE PAGINATION ---
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage) || 1;
  
  // Ajuster la page courante si le filtrage réduit les résultats
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredInstitutions, currentPage, totalPages]);

  const paginatedInstitutions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInstitutions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInstitutions, currentPage]);

  // --- ACTIONS DU FORMULAIRE ---
  const handleAddBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    const colors = ["bg-[#0B3B26]", "bg-[#D1232A]", "bg-[#005B82]", "bg-indigo-700", "bg-purple-700", "bg-teal-700"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newBank: InstitutionBank = {
      name: formName.trim(),
      subTitle: formSubTitle.trim() || "Agence Principale",
      code: formCode.trim().toUpperCase(),
      agencesCount: Math.max(1, parseInt(formAgences) || 1),
      status: formStatus,
      logoColor: randomColor
    };

    setInstitutions([newBank, ...institutions]);
    setIsModalOpen(false);
    
    // Reset inputs
    setFormName("");
    setFormSubTitle("");
    setFormCode("");
    setFormAgences("1");
    setFormStatus("Active");

    triggerToast(`La banque "${newBank.name}" a été configurée avec succès.`);
  };

  // Action interactive de changement de statut rapide au clic sur le badge du tableau
  const toggleBankStatus = (code: string) => {
    setInstitutions(institutions.map(bank => {
      if (bank.code === code) {
        const nextStatus = bank.status === "Active" ? "Inactive" : "Active";
        triggerToast(`Statut de ${bank.name} modifié : ${nextStatus === "Active" ? "Actif" : "Inactif"}`);
        return { ...bank, status: nextStatus };
      }
      return bank;
    }));
  };

  return (
    <div className="flex-1 bg-[#F8F9FD] flex flex-col min-w-0 p-6 space-y-6 relative">
      
      {/* =========================================================================
          BARRE DES NOTIFICATIONS (TOAST ALERT CONTROLLABLE)
         ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 z-50 animate-bounce">
          <Info className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* SEARCH INPUT BAR (TOPBAR INTEGREE POUR CE SCRIPT) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-black text-slate-900 tracking-tight">Panneau d'administration</h2>
          <p className="text-[11px] text-slate-400 font-bold">Filtrez, analysez ou ajoutez des entités bancaires en temps réel.</p>
        </div>
        <div className="max-w-xs w-full">
          <input 
            type="text"
            placeholder="Recherche dynamique (nom, code)..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#0B6634] shadow-2xs"
          />
        </div>
      </div>

      {/* SECTION DES CARTES DE STATISTIQUES (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partenaires Totaux</span>
            <div className="text-3xl font-black text-slate-900">{totalPartners}</div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            Etablissements configurés sur le réseau global.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut Actif</span>
            <div className="text-3xl font-black text-slate-900">{activePartners}</div>
          </div>
          <p className="text-[11px] text-[#0B6634] font-bold mt-3 flex items-center gap-1">
            ↑ {operationalPercentage}% Opérationnel
          </p>
        </div>

        {/* Bouton d'action Rapide - Ouvre la modale */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0B6634] text-white rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden group cursor-pointer hover:bg-[#074724] transition-all active:scale-98"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Actions Rapides</span>
            <Plus className="h-5 w-5 text-white stroke-[3]" />
          </div>
          <div className="mt-4">
            <div className="text-sm font-black">Ajouter une Banque</div>
            <p className="text-[10px] text-emerald-100/80 font-medium mt-0.5">Configurer un nouvel établissement partenaire</p>
          </div>
        </div>
      </div>

      {/* BARRE INTERACTONS DES FILTRES DE RÉSULTATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Onglets secondaires */}
        <div className="bg-slate-100 p-1 rounded-xl inline-flex items-center gap-1 self-start">
          {["Toutes", "Actives", "Inactives"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setSubFilter(tab); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                (subFilter === "Toutes" && tab === "Toutes") || 
                (subFilter === "Actives" && tab === "Actives") || 
                (subFilter === "Inactives" && tab === "Inactives")
                  ? "bg-[#0B6634] text-white shadow-xs" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Actions utilitaires interactives */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            type="button" 
            onClick={() => triggerToast("Filtres avancés : Aucun filtre additionnel disponible pour le moment.")}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            title="Options avancées"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => triggerToast("Préparation du téléchargement du tableur (CSV/XLS)...")}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            title="Exporter les données"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* TABLEAU PRINCIPAL DE GESTION DES INSTITUTIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Institution</th>
                <th className="py-3.5 px-6">Code Banque</th>
                <th className="py-3.5 px-6">Agences</th>
                <th className="py-3.5 px-6">Statut (cliquable)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedInstitutions.length > 0 ? (
                paginatedInstitutions.map((bank, index) => (
                  <tr key={index} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-9 h-9 ${bank.logoColor} rounded-xl flex items-center justify-center text-white font-black text-[10px] shadow-2xs shrink-0`}>
                        {bank.name.substring(0, 3).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 group-hover:text-[#0B6634] transition-colors">{bank.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{bank.subTitle}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700`}>
                        {bank.code}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-700">
                      {bank.agencesCount} Agences
                    </td>

                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => toggleBankStatus(bank.code)}
                        className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-1 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all ${
                          bank.status === "Active" ? "text-emerald-600 bg-emerald-50/50 hover:ring-emerald-200" : "text-slate-400 bg-slate-100 hover:ring-slate-200"
                        }`}
                        title="Inverser le statut de l'établissement"
                      >
                        <span className={`w-2 h-2 rounded-full ${bank.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                        {bank.status === "Active" ? "Actif" : "Inactif"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold text-xs">
                    Aucun établissement ne correspond aux critères de recherche actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION FOOTER ET PAGINATION DU TABLEAU INTERACTIF */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-bold">
            Affichage de <span className="text-slate-800">{filteredInstitutions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à {Math.min(currentPage * itemsPerPage, filteredInstitutions.length)}</span> sur <span className="text-slate-800">{filteredInstitutions.length}</span> résultats
          </span>
          
          {/* Contrôles de navigation dynamiques */}
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`p-1.5 border border-slate-200 rounded-lg bg-white transition-colors ${
                currentPage === 1 ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                type="button" 
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                  currentPage === page 
                    ? "bg-[#0B6634] text-white shadow-xs" 
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              type="button" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`p-1.5 border border-slate-200 rounded-lg bg-white transition-colors ${
                currentPage === totalPages ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALE / POP-UP DE FORMULAIRE POUR AJOUTER UNE NOUVELLE BANQUE
         ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-950">Ajouter une Banque Partenaire</h4>
                <p className="text-[10px] text-slate-400 font-medium">Inscrire un nouvel établissement sur la plateforme</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddBankSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Nom de la Banque *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: ACE Finance, UBA, EcoBank"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Siège social / Ville Hub</label>
                <input 
                  type="text" 
                  placeholder="Ex: Siège Social, Paris ou Lomé Hub"
                  value={formSubTitle}
                  onChange={(e) => setFormSubTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Code Banque Unique *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: ACEF-FR-22"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre d'Agences</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formAgences}
                    onChange={(e) => setFormAgences(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Statut Initial</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus("Active")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      formStatus === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Actif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus("Inactive")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      formStatus === "Inactive" ? "bg-slate-100 text-slate-700 border-slate-300 ring-1 ring-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Inactif
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#0B6634] hover:bg-[#074724] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-[0.98]"
                >
                  Enregistrer l'entité
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}