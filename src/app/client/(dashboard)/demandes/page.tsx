"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  SlidersHorizontal, 
  Plus, 
  Info, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';

interface Demande {
  id: string;
  date: string;
  heure: string;
  type: string;
}

export default function SuiviDemandesPage() {
  const router = useRouter();

  // =========================================================================
  // ETAT DES DONNÉES (Initialisé à vide prêt pour l'API)
  // =========================================================================
  const [allDemandes, setAllDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // EXEMPLE D'INTÉGRATION API (À activer quand ton backend est prêt)
  /*
  useEffect(() => {
    const fetchDemandes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.acefinance.com/client/demandes');
        const data = await response.json();
        setAllDemandes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDemandes();
  }, []);
  */

  // --- États UI de l'interface ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('Personnel');

  // --- Configuration de la pagination ---
  const ITEMS_PER_PAGE = 4;

  // --- Logique Métier : Extraction DYNAMIQUE des types existants pour le filtre ---
  const filterOptions = useMemo(() => {
    const typesUniques = Array.from(new Set(allDemandes.map(item => item.type)));
    return ['Tous', ...typesUniques];
  }, [allDemandes]);

  // --- Logique Métier : Filtrage ---
  const filteredDemandes = useMemo(() => {
    if (selectedFilter === 'Tous') return allDemandes;
    return allDemandes.filter(item => item.type === selectedFilter);
  }, [allDemandes, selectedFilter]);

  // --- Logique Métier : Pagination calculée ---
  const totalPages = useMemo(() => {
    return Math.ceil(filteredDemandes.length / ITEMS_PER_PAGE) || 1;
  }, [filteredDemandes]);

  const displayedDemandes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDemandes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDemandes, currentPage]);

  // Sécurité : Réajustement de la page si le filtre réduit drastiquement les résultats
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Réinitialiser le filtre sélectionné si le type de demande associé n'existe plus du tout
  useEffect(() => {
    if (!filterOptions.includes(selectedFilter)) {
      setSelectedFilter('Tous');
    }
  }, [filterOptions, selectedFilter]);

  // --- Action : Soumission d'une nouvelle demande (Simulation locale) ---
  const handleCreateDemande = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    
    const newDoc: Demande = {
      id: `#CHQ-2024-0${allDemandes.length + 1}`,
      date: today.toLocaleDateString('fr-FR', options),
      heure: today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: selectedType
    };

    setAllDemandes([newDoc, ...allDemandes]);
    setIsNewRequestOpen(false);
    setCurrentPage(1); 
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans flex flex-col">
      {/* ================= ZONE DE CONTENU CENTRAL ================= */}
      <main className="flex-1 w-full overflow-y-auto">
        <div className="p-6 md:p-10 max-w-3xl w-full mx-auto space-y-6">
          
          {/* Titre de la page */}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              Suivi des Demandes
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Gestion et historique des carnets de chèques institutionnels.
            </p>
          </div>

          {/* Barre d'actions */}
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`border px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                isFilterMenuOpen || selectedFilter !== 'Tous'
                  ? 'bg-[#edf7f1] border-[#0f6e38] text-[#0f6e38]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filtrer : {selectedFilter}</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute left-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 w-52 z-30 animate-in fade-in slide-in-from-top-2 duration-100">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setCurrentPage(1);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold block hover:bg-slate-50 ${
                      selectedFilter === filter ? 'text-[#0f6e38] bg-[#edf7f1]/50' : 'text-slate-600'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setIsNewRequestOpen(true)}
              className="bg-[#0f6e38] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xs hover:bg-[#0b5229] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Nouvelle Demande</span>
            </button>
          </div>

          {/* TABLEAU DES DEMANDES */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-bold text-slate-400">ID DEMANDE</th>
                    <th className="py-3.5 px-6 font-bold text-slate-400">DATE DE CRÉATION</th>
                    <th className="py-3.5 px-6 font-bold text-slate-400">TYPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12 text-xs font-medium text-slate-400">
                        Chargement des demandes...
                      </td>
                    </tr>
                  ) : displayedDemandes.length > 0 ? (
                    displayedDemandes.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => alert(`Détails de la demande ${item.id}`)}
                        className="hover:bg-slate-50/50 transition-colors last:border-none cursor-pointer group"
                      >
                        <td className="py-4.5 px-6 text-xs font-bold text-slate-800 tracking-tight group-hover:text-[#0f6e38] transition-colors">
                          {item.id}
                        </td>
                        <td className="py-4.5 px-6 text-xs font-medium text-slate-500">
                          <div>{item.date},</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{item.heure}</div>
                        </td>
                        <td className="py-4.5 px-6 text-xs font-semibold text-slate-600">
                          {item.type}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-12 text-xs font-medium text-slate-400 bg-slate-50/10">
                        Aucune demande enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination sécurisée */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-400">
                Affichage de {filteredDemandes.length === 0 ? 0 : 1 + (currentPage - 1) * ITEMS_PER_PAGE}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredDemandes.length)} sur {filteredDemandes.length} demandes
              </span>
              
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={14} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === pageNumber
                        ? 'bg-[#0f6e38] text-white shadow-2xs scale-105'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button 
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* BLOC INFO */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-3 shadow-2xs">
            <div className="text-[#0f6e38] mt-0.5 shrink-0">
              <Info size={16} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#0f6e38] mb-1">
                Délai de traitement
              </h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Les demandes de carnets de chèques sont généralement traitées sous 48 heures ouvrables après validation.
              </p>
            </div>
          </div>

          {/* BANNIÈRE SÉCURITÉ */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-6 flex items-start justify-between text-white shadow-md">
            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop')` }} />
            
            <div className="relative z-10 max-w-[85%]">
              <h4 className="text-xs font-extrabold text-white tracking-wide flex items-center gap-2 mb-1.5">
                <span>Sécurité Avancée</span>
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Chaque carnet contient des hologrammes de sécurité et une numérotation unique pour prévenir toute fraude bancaire.
              </p>
            </div>

            <div className="relative z-10 text-slate-500 mt-0.5">
              <ShieldCheck size={18} className="text-slate-400 stroke-[2]" />
            </div>
          </div>

        </div>
      </main>

      {/* ================= MODALE INTERACTIVE : CRÉATION DEMANDE ================= */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handleCreateDemande}
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Nouvelle Demande de Carnet</h3>
              <button 
                type="button" 
                onClick={() => setIsNewRequestOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Type de Format Requis
                </label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0f6e38]"
                >
                  <option value="Personnel">Personnel</option>
                  <option value="Entreprise">Entreprise</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewRequestOpen(false)} 
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-[#0f6e38] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0b5229] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 size={12} />
                  <span>Confirmer la commande</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}