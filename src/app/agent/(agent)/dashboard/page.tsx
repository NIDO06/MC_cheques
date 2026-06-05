"use client";

import React, { useState } from "react";
// Importation de jsPDF pour la génération et l'exportation du document en mémoire
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Users, 
  FileText, 
  Factory, 
  FileDown, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  UploadCloud,
  X
} from "lucide-react";

// =========================================================================
// DONNÉES FICTIVES INITIALES (MOCK DATA)
// À remplacer par vos futurs appels API (ex: fetch('/api/dashboard'))
// =========================================================================
const INITIAL_ACTIVITIES = [
  { id: 1, type: "success", title: "Nouvelle demande reçue", desc: "SARL Delta Tech (Compte COAT-2)", time: "Il y a 12 min", ref: "N° 8541" },
  { id: 2, type: "danger", title: "Demande annulée par l'administrateur", desc: "Signature non conforme", time: "Il y a 1 heure", ref: "N° 8320" },
  { id: 3, type: "info", title: "Chéquier prêt pour retrait", desc: "Client: Koffi Amadou", time: "Il y a 2 heures", ref: "N° 7942" }
];

const INITIAL_STATS = {
  totalClients: 1284,
  demandesAttente: 42,
  enProduction: 156
};

export default function DashboardPage() {
  // États de l'application
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [baseStats, setBaseStats] = useState(INITIAL_STATS);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // État pour le formulaire de nouvelle demande
  const [newDemande, setNewDemande] = useState({ clientName: "", accountType: "Courant" });

  // =========================================================================
  // ACTION MODIFIÉE : GÉNÉRATION ET EXPORTATION DU RAPPORT EN PDF REEL
  // =========================================================================
  const handleExport = () => {
    setIsExporting(true);

    try {
      // 1. Initialisation du document PDF en orientation Portrait, unité millimètres, format A4
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // 2. Ajout de l'en-tête et titre du document
      doc.setFillColor(11, 102, 52); // Couleur de la marque (#0B6634)
      doc.rect(0, 0, 210, 40, "F"); // Rectangle d'en-tête de 40mm de haut

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("RAPPORT D'ACTIVITÉ DE L'AGENCE", 15, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const dateEdition = new Date().toLocaleString("fr-FR");
      doc.text(`Édité le : ${dateEdition} • Statut : Certifié`, 15, 28);

      // 3. Section des Statistiques Globales (KPIs)
      doc.setTextColor(15, 29, 55); // Couleur sombre text-slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("1. Indicateurs de Performance (KPIs)", 15, 55);

      // Ligne de séparation
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 58, 195, 58);

      // Structure des valeurs KPIs textuelles
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Total des clients actifs :`, 20, 68);
      doc.setFont("helvetica", "normal");
      doc.text(`${baseStats.totalClients.toLocaleString()} comptes`, 75, 68);

      doc.setFont("helvetica", "bold");
      doc.text(`Demandes actuellement en attente :`, 20, 76);
      doc.setFont("helvetica", "normal");
      doc.text(`${baseStats.demandesAttente} chéquiers`, 90, 76);

      doc.setFont("helvetica", "bold");
      doc.text(`Flux en cours de production (Usine) :`, 20, 84);
      doc.setFont("helvetica", "normal");
      doc.text(`${baseStats.enProduction} unités`, 95, 84);

      // 4. Section Historique des flux de l'agence (Tableau structuré)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. Journal des activités récentes de l'agence", 15, 102);
      doc.line(15, 105, 195, 105);

      // Préparation des lignes du tableau à partir de la variable d'état dynamique React
      const tableRows = activities.map((act) => [
        act.ref,
        act.title,
        act.desc,
        act.time
      ]);

      // Génération automatique du tableau structuré avec jspdf-autotable
      autoTable(doc, {
        startY: 112,
        head: [["Référence", "Événement", "Détails de l'opération", "Ancienneté"]],
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [11, 102, 52], // Arrière-plan vert #0B6634
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [51, 65, 85]
        },
        columnStyles: {
          0: { cellWidth: 25, fontStyle: "bold" }, // Colonne référence resserrée
          1: { cellWidth: 55, fontStyle: "bold" },
          2: { cellWidth: 70 },
          3: { cellWidth: 30 }
        },
        margin: { left: 15, right: 15 }
      });

      // 5. Sauvegarde en mémoire et déclenchement automatique du téléchargement local
      doc.save(`Rapport_Agence_${Date.now()}.pdf`);

    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert("Une erreur est survenue lors de l'exportation du document.");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Action : Gestion interactive du téléversement du spécimen d'agence
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (Maximum 5 Mo).");
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("specimen-upload")?.click();
  };

  // 3. Action : Soumission du formulaire de nouvelle demande
  const handleCreateDemande = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDemande.clientName.trim()) return;

    const randomRef = `N° ${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Ajouter au flux d'activité récente
    const newActivity = {
      id: Date.now(),
      type: "success",
      title: "Nouvelle demande créée",
      desc: `Client: ${newDemande.clientName} (Compte ${newDemande.accountType})`,
      time: "À l'instant",
      ref: randomRef
    };

    setActivities([newActivity, ...activities]);
    
    // Mettre à jour dynamiquement les compteurs de statistiques
    setBaseStats(prev => ({
      ...prev,
      demandesAttente: prev.demandesAttente + 1
    }));

    // Réinitialisation
    setNewDemande({ clientName: "", accountType: "Courant" });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto relative">
      
      {/* 1. EN-TÊTE DE LA PAGE PRINCIPALE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">
            Statistiques de l'Agence
          </h1>
          <p className="text-slate-700 text-sm font-semibold mt-1">
            Aperçu opérationnel et suivi de production des chéquiers.
          </p>
        </div>
        
        {/* Actions d'en-tête */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all disabled:opacity-50"
          >
            <FileDown className={`h-4 w-4 text-slate-700 ${isExporting ? "animate-bounce" : ""}`} />
            <span>{isExporting ? "Exportation..." : "Exporter Rapport"}</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#0B6634] hover:bg-[#074724] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Nouvelle demande</span>
          </button>
        </div>
      </div>

      {/* 2. BLOCS KPI INTERACTIFS ET RECALCULÉS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Clients */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Total Clients</span>
            <div className="text-3xl font-black text-slate-950 tracking-tight">
              {baseStats.totalClients.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 stroke-[3]" /> +12%
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><Users className="h-5 w-5" /></div>
        </div>

        {/* Demandes en Attente */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Demandes en attente</span>
            <div className="text-3xl font-black text-slate-950 tracking-tight">
              {baseStats.demandesAttente}
            </div>
            <span className="text-xs text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-full block text-center">
              Mise à jour en direct
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl"><FileText className="h-5 w-5" /></div>
        </div>

        {/* En Production Usine */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">En Production</span>
            <div className="text-3xl font-black text-slate-950 tracking-tight">
              {baseStats.enProduction}
            </div>
            <span className="text-xs text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-full block text-center">
              Suivi usine actif
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-[#0B6634] rounded-xl"><Factory className="h-5 w-5" /></div>
        </div>
      </div>

      {/* 3. CONTENUS ET FLUX OPÉRATIONNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flux des Activités Récentes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Activité récente de l'agence
          </h3>
          
          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-2">
            {activities.map((act) => (
              <div key={act.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0 animate-fade-in">
                <div className={`p-2 rounded-xl shrink-0 ${
                  act.type === "success" ? "bg-emerald-50 text-emerald-700" :
                  act.type === "danger" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {act.type === "success" ? <CheckCircle2 className="h-5 w-5" /> :
                   act.type === "danger" ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{act.title}</h4>
                    <span className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold shrink-0">
                      {act.ref}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{act.desc}</p>
                  <span className="text-[11px] font-bold text-slate-400 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloc Zone d'importation interactive du Spécimen */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm h-full flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Spécimen d'Agence
            </h4>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              Téléversez le fichier de signature approuvé pour valider la fabrication.
            </p>
          </div>
          
          <input 
            type="file" 
            id="specimen-upload" 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          <div 
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group flex-1 flex flex-col justify-center items-center ${
              selectedFile 
                ? "border-[#0B6634] bg-emerald-50/40" 
                : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#0B6634]"
            }`}
          >
            <UploadCloud className={`h-10 w-10 mb-3 transition-colors ${selectedFile ? "text-[#0B6634]" : "text-slate-400 group-hover:text-[#0B6634]"}`} />
            
            {selectedFile ? (
              <div className="space-y-1 w-full px-2">
                <span className="text-xs font-bold text-[#0B6634] block truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-slate-500 block font-semibold">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Prêt
                </span>
              </div>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-900 block group-hover:text-[#0B6634] transition-colors">
                  Parcourir les fichiers
                </span>
                <span className="text-[10px] font-medium text-slate-500 block mt-1.5">
                  PDF, PNG ou JPG jusqu'à 5 Mo
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. MODAL POP-UP EN DIRECT : NOUVELLE DEMANDE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border-2 border-slate-100 shadow-2xl p-6 relative space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-950">Initier une demande</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDemande} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Nom de l'entreprise / Client</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Société Transport Sahel" 
                  value={newDemande.clientName}
                  onChange={(e) => setNewDemande({...newDemande, clientName: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Type de compte rattaché</label>
                <select 
                  value={newDemande.accountType}
                  onChange={(e) => setNewDemande({...newDemande, accountType: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:border-[#0B6634] focus:bg-white transition-all"
                >
                  <option value="Courant">Compte Courant Commercial</option>
                  <option value="Épargne">Compte d'Épargne Pro</option>
                  <option value="Joint">Compte Joint Établissement</option>
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
                  Confirmer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}