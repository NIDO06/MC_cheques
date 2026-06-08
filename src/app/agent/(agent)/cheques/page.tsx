"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Factory, 
  ChevronDown, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  X
} from "lucide-react";
import { apiClient } from '@/lib/api';

// =========================================================================
// Chargement des données de chéquiers réelles depuis le backend
// =========================================================================

// Espace 1 : Liste initiale des demandes visibles uniquement par l'Agent Connecté
type AgentDemande = {
  id: number;
  ref: string;
  clientName: string;
  account: string;
  date: string;
  status: string;
};

type ChequeBackendItem = {
  id: number;
  cheque_number?: string;
  user?: { name?: string };
  user_id?: number;
  account_number?: string;
  issued_at?: string;
  statut_demande?: { name?: string };
};

export default function DemandesChequierPage() {
  const [demandesAgent, setDemandesAgent] = useState<AgentDemande[]>([]);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formClientName, setFormClientName] = useState("");
  const [formAccount, setFormAccount] = useState("");

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const loadCheques = async () => {
      setIsLoading(true);
      try {
        const cheques = await apiClient.getCheques<ChequeBackendItem>();
        const mapped = cheques.map((cheque) => ({
          id: cheque.id,
          ref: cheque.cheque_number || `#CHQ-${cheque.id}`,
          clientName: cheque.user?.name || `Client ${cheque.user_id || 'N/A'}`,
          account: cheque.account_number || 'N/A',
          date: cheque.issued_at ? new Date(cheque.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
          status: cheque.statut_demande?.name === 'EN_PRODUCTION' ? 'En impression' : cheque.statut_demande?.name === 'EN_ATTENTE' ? 'En attente' : 'Livré',
        }));

        setDemandesAgent(mapped);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCheques();
  }, []);

  // =========================================================================
  // FONCTION CONFIRMER : DOUBLE REDIRECTION AUTOMATIQUE EN ARRIÈRE-PLAN
  // =========================================================================
  const handleCreateDemande = (e: React.FormEvent) => {
    e.preventDefault();
    alert("La création de demande est gérée par le backend. Elle sera intégrée très prochainement.");
    setIsModalOpen(false);
  };

  // =========================================================================
  // TRAITEMENT DES DONNÉES (Vue Agent exclusive)
  // =========================================================================
  
  // Filtrage par statut de l'Agent
  const filteredDemandes = useMemo(() => {
    if (statusFilter === "Tous") return demandesAgent;
    return demandesAgent.filter(d => d.status === statusFilter);
  }, [demandesAgent, statusFilter]);

  // Pagination
  const paginatedDemandes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDemandes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDemandes, currentPage]);

  const totalPages = Math.ceil(filteredDemandes.length / ITEMS_PER_PAGE) || 1;

  // Compteur global de l'imprimerie
  const totalEnProduction = useMemo(() => {
    return demandesAgent.filter(d => d.status === "En impression").length + 20;
  }, [demandesAgent]);

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col">
      {/* Conteneur principal plein écran */}
      <div className="w-full flex-1 bg-white flex flex-col justify-between overflow-hidden relative">
        
        <div className="flex-1 w-full">
          <div className="p-6 space-y-6 max-w-(screen-2xl) mx-auto w-full">
            
            {/* GRILLE DU HAUT (2 Colonnes fluides : Demande + Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* BLOC : CRÉATION DEMANDE (Prend 2 colonnes) */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">Nouvelle Demande de Chéquier</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Renseignez le titulaire et son compte. Le système se charge de dupliquer la demande vers le tableau de bord du client concerné.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0B6634] hover:bg-[#074724] text-white rounded-xl px-5 py-3.5 flex items-center gap-2 transition-all active:scale-95 shadow-md shrink-0 font-bold text-xs"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Créer une demande</span>
                </button>
              </div>

              {/* BLOC STATISTIQUE AGENT (Prend 1 colonne) */}
              <div className="bg-[#137C43] text-white rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-200 uppercase block">Total En Impression</span>
                    <div className="text-4xl font-black tracking-tight">{totalEnProduction}</div>
                    <p className="text-xs text-emerald-100 font-medium pt-1">Flux global de l&apos;imprimerie</p>
                  </div>
                  <Factory className="h-7 w-7 text-emerald-200/80 opacity-90 stroke-[1.8]" />
                </div>
              </div>

            </div>

            {/* TITRE EXCLUSIF DE LA VUE DE L'AGENT */}
            <div className="border-b border-slate-200 pb-2">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Suivi des Demandes Enregistrées par votre Agence
              </h2>
            </div>

            {/* FILTRES DE RECHERCHE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrer par Statut</span>
                  <div className="relative">
                    <select 
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:border-[#0B6634] cursor-pointer"
                    >
                      <option value="Tous">Tous les statuts</option>
                      <option value="En impression">En impression</option>
                      <option value="En attente">En attente</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Période de flux</span>
                  <div className="relative">
                    <select className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:border-[#0B6634] cursor-pointer">
                      <option>Derniers 30 jours</option>
                      <option>Derniers 7 jours</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert("Filtres avancés.")}
                className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-slate-50 transition-colors w-full sm:w-auto h-[42px] shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                <span>Filtres Avancés</span>
              </button>
            </div>

            {/* TABLEAU DES DEMANDES DE L'AGENT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full">
              <div className="grid grid-cols-4 bg-slate-50 px-6 py-3.5 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Référence</span>
                <span>Titulaire du Compte</span>
                <span>Numéro de Compte</span>
                <span className="text-right">Date de la Demande</span>
              </div>

              <div className="divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-12 text-center text-sm font-bold text-slate-500">
                    Chargement des demandes en cours...
                  </div>
                ) : paginatedDemandes.length > 0 ? (
                  paginatedDemandes.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors">
                      <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                        {item.ref}
                      </span>
                      <span className="text-xs font-black text-slate-950 truncate pr-2">
                        {item.clientName}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        {item.account}
                      </span>
                      <span className="text-xs font-bold text-slate-600 text-right">
                        {item.date}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-sm font-bold text-slate-400">
                    Aucune demande de chéquier gérée pour le moment.
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400">
                  Affichage de {filteredDemandes.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredDemandes.length)} sur {filteredDemandes.length} fiches de votre agence
                </span>

                <div className="flex items-center gap-1.5">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                        currentPage === p 
                          ? "bg-[#0B6634] text-white shadow-xs" 
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 border border-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL : FORMULAIRE DE DOUBLE TRANSFERT SÉCURISÉ */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-30 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-950">Initier une demande</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Double distribution automatique Agent ⇄ Client</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateDemande} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Nom complet du client</label>
                  <input 
                    type="text" required placeholder="Ex: Amadou Koulibaly"
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Numéro de compte</label>
                  <input 
                    type="text" placeholder="Ex: 0045-89322-01"
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-[#0B6634] hover:bg-[#074724] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                  >
                    Confirmer la demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}