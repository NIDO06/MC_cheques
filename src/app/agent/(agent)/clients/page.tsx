"use client";

import React, { useState, useMemo } from "react";
import { 
  UserPlus, 
  Search, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  Building2,
  X
} from "lucide-react";

// Données fictives initiales (Mock Data)
const INITIAL_MOCK_CLIENTS = [
  { id: 1, name: "Ahmed Mansour", email: "ahmed.m@example.com", company: "Société Logistique Nord", type: "Entreprise", status: "Actif", avatar: "AM" },
  { id: 2, name: "Fatoumata Traoré", email: "f.traore@holding.sn", company: "SENEGAL HOLDING SARL", type: "Entreprise", status: "Actif", avatar: "FT" },
  { id: 3, name: "Marc Lefebvre", email: "m.lefebvre@global-tech.com", company: "Global Tech Solutions", type: "Entreprise", status: "Inactif", avatar: "ML" },
  { id: 4, name: "Koffi Kouamé", email: "k.kouame@ivoire.ci", company: "Ivoire Invest", type: "Entreprise", status: "Actif", avatar: "KK" },
  { id: 5, name: "Marie Diallo", email: "m.diallo@tech.gn", company: "Conakry Digital", type: "Entreprise", status: "Inactif", avatar: "MD" },
];

export default function GestionClientsPage() {
  // États de l'application
  const [clients, setClients] = useState(INITIAL_MOCK_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // États pour le nouveau client dans le formulaire
  const [newClient, setNewClient] = useState({ name: "", email: "", company: "", status: "Actif" });

  const ITEMS_PER_PAGE = 3;

  // 1. Filtrage combiné : Recherche + Statut
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "Tous" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  // 2. Pagination dynamique des données filtrées
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;

  // 3. Calcul dynamique des statistiques KPI
  const stats = useMemo(() => {
    const total = clients.length;
    const actifs = clients.filter(c => c.status === "Actif").length;
    const inactifs = total - actifs;
    const pourcentageActifs = total > 0 ? Math.round((actifs / total) * 100) : 0;
    return { total, actifs, inactifs, pourcentageActifs };
  }, [clients]);

  // 4. Soumission du formulaire d'ajout
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.company) {
      alert("Veuillez remplir tous les champs requit.");
      return;
    }

    // Génération des initiales pour l'avatar
    const initials = newClient.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const clientToAdd = {
      id: Date.now(),
      ...newClient,
      type: "Entreprise",
      avatar: initials || "CL"
    };

    setClients([clientToAdd, ...clients]);
    setNewClient({ name: "", email: "", company: "", status: "Actif" });
    setIsModalOpen(false); // Fermer le modal
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto relative">
      
      {/* SECTION EN-TÊTE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Gestion des Clients</h1>
          <p className="text-slate-700 text-sm font-semibold mt-1">
            Administrez les comptes clients et suivez leurs activités bancaires.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#0B6634] hover:bg-[#074724] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md active:scale-95 transition-all"
        >
          <UserPlus className="h-4 w-4 stroke-[2.5]" />
          <span>Ajouter un Client</span>
        </button>
      </div>

      {/* BLOCS STATISTIQUES RECALCULÉS EN TEMPS RÉEL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Clients</span>
            <div className="text-2xl font-black text-slate-950 flex items-baseline gap-2">
              {stats.total} <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><Users className="h-5 w-5" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Actifs</span>
            <div className="text-2xl font-black text-slate-950">{stats.actifs}</div>
            <span className="text-xs text-slate-600 font-medium block">{stats.pourcentageActifs}% du total</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Inactifs</span>
            <div className="text-2xl font-black text-slate-950">{stats.inactifs}</div>
            <span className="text-xs text-slate-600 font-medium block">Stable</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><XCircle className="h-5 w-5" /></div>
        </div>
      </div>

      {/* RECHERCHE ET FILTRES DYNAMIQUES */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Rechercher par nom, entreprise ou email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all cursor-pointer"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Actif">Actifs uniquement</option>
              <option value="Inactif">Inactifs uniquement</option>
            </select>
            <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* RENDU DU TABLEAU */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Entreprise / Organisation</th>
                <th className="py-4 px-6 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {client.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-950 truncate">{client.name}</span>
                          <span className="text-xs font-semibold text-slate-500 truncate">{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{client.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        client.status === "Actif" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${client.status === "Actif" ? "bg-emerald-600" : "bg-slate-500"}`} />
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-sm font-bold text-slate-400">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FONCTIONNELLE */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-600">
            Affichage de <span className="text-slate-900">{filteredClients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)}</span> sur <span className="text-slate-900">{filteredClients.length}</span> résultats filtrés
          </span>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-[#0B6634] text-white shadow-md shadow-[#0B6634]/10" 
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2 border-2 border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. FENÊTRE MODAL D'AJOUT CLIENT (POPUP POP-IN INTERACTIF) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border-2 border-slate-100 shadow-2xl p-6 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-950">Créer un nouveau client</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Nom complet du client</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Alassane Diop" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ex: a.diop@entreprise.com" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Entreprise / Raison Sociale</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Sahel Tech Corp" 
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Statut initial</label>
                <select 
                  value={newClient.status}
                  onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-2 border-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#0B6634] hover:bg-[#074724] text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}