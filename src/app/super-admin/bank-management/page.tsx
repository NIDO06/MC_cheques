"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Download, 
  Plus, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  X,
  Bell,
  Info,
  Loader
} from "lucide-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { apiClient } from "@/lib/api";

interface InstitutionData {
  logoText: string;
  logoBg: string;
  name: string;
  code: string;
  status: "ACTIF" | "MAINTENANCE" | "INACTIF";
  agences: number;
  volume24h: number;
}

interface AlerteSysteme {
  id: number;
  type: "CRITIQUE" | "SYNCHRO" | "SUCCES";
  titre: string;
  temps: string;
  description: string;
}

export default function NetworkDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const itemsPerPage = 3;

  const [alertes, setAlertes] = useState<AlerteSysteme[]>([
    { id: 1, type: "CRITIQUE", titre: "Banque Centrale - Node A", temps: "5m ago", description: "Délai de réponse anormal détecté sur la passerelle API de clearing." },
    { id: 2, type: "SYNCHRO", titre: "Sync Agences - Agence 42", temps: "15m ago", description: "Déconnexion prolongée du terminal de capture #T-D91." },
    { id: 3, type: "SUCCES", titre: "Mise à jour Certificats", temps: "1h ago", description: "Mise à jour réussie des clés de chiffrement TLS 1.3 sur tout le réseau." }
  ]);

  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formAgences, setFormAgences] = useState("");
  const [formVolume, setFormVolume] = useState("");
  const [formStatus, setFormStatus] = useState<"ACTIF" | "MAINTENANCE">("ACTIF");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les banques depuis l'API
  useEffect(() => {
    const loadBanks = async () => {
      setIsLoading(true);
      try {
        const banks = await apiClient.getBanks();
        const bgColors = ["bg-blue-800 text-white", "bg-purple-800 text-white", "bg-teal-700 text-white", "bg-amber-700 text-white", "bg-indigo-800 text-white"];
        
        const formattedBanks = banks.map((bank: any, index: number) => ({
          logoText: bank.name.substring(0, 3).toUpperCase(),
          logoBg: bgColors[index % bgColors.length],
          name: bank.name,
          code: `ID : ${bank.swift_code || bank.id} - BANK-${bank.country_code || 'CM'}`,
          status: bank.is_active ? "ACTIF" : "MAINTENANCE" as "ACTIF" | "MAINTENANCE",
          agences: bank.agencies_count || 0,
          volume24h: bank.volume_24h || 0
        }));
        
        setInstitutions(formattedBanks);
      } catch (error) {
        console.error('Erreur lors du chargement des banques:', error);
        setInstitutions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanks();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const totalBanquesCount = institutions.length;
  
  const totalAgencesCount = useMemo(() => {
    return institutions.reduce((acc, curr) => acc + curr.agences, 0);
  }, [institutions]);

  const totalThroughput = useMemo(() => {
    const totalFCFA = institutions.reduce((acc, curr) => acc + curr.volume24h, 0);
    return `${(totalFCFA / 1000000).toFixed(1)}M FCFA`;
  }, [institutions]);

  const networkHealthScore = useMemo(() => {
    const maintenanceCount = institutions.filter(b => b.status === "MAINTENANCE").length;
    if (totalBanquesCount === 0) return 100;
    return Math.round(((totalBanquesCount - maintenanceCount) / totalBanquesCount) * 100);
  }, [institutions, totalBanquesCount]);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, institutions]);

  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage) || 1;
  const paginatedInstitutions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInstitutions.slice(start, start + itemsPerPage);
  }, [filteredInstitutions, currentPage]);

  // =========================================================================
  // LOGIQUE DE CAPTURE ET STOCKAGE LOGIQUE DU PDF (html2canvas + jsPDF)
  // =========================================================================
  const handleExportPDF = async () => {
    const element = document.getElementById("main-report-content");
    if (!element) return;

    setToastMessage("Génération et écriture du fichier PDF en cours...");

    try {
      // 1. Capture du bloc HTML sous forme de Canvas HD (scale 2 améliore la clarté des textes)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F8F9FD" 
      });

      const imgData = canvas.toDataURL("image/png");
      
      // 2. Initialisation du document PDF (Format A4, orientation Portrait)
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Largeur de la feuille A4 en mm
      const pageHeight = 295; // Hauteur de la feuille A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 3. Injection de l'image capturée dans le document PDF
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Gestion multi-pages si le tableau est très long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 4. Déclenchement du stockage natif sur le disque dur / mémoire de l'appareil
      const dateFormatted = new Date().toISOString().split('T')[0];
      pdf.save(`Bilan_Bank_Management_${dateFormatted}.pdf`);

      setToastMessage("Le rapport PDF a été stocké avec succès sur votre appareil.");
    } catch (error) {
      console.error("Erreur d'exportation PDF :", error);
      setToastMessage("Une erreur est survenue lors de l'enregistrement du document.");
    }
  };

  const handleAddBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    setIsSubmitting(true);
    try {
      const newBank = await apiClient.createBank({
        name: formName.trim(),
        swift_code: formCode.trim(),
        is_active: formStatus === "ACTIF",
      });

      // Recharger la liste des banques
      const banks = await apiClient.getBanks();
      const bgColors = ["bg-blue-800 text-white", "bg-purple-800 text-white", "bg-teal-700 text-white", "bg-amber-700 text-white", "bg-indigo-800 text-white"];
      
      const formattedBanks = banks.map((bank: any, index: number) => ({
        logoText: bank.name.substring(0, 3).toUpperCase(),
        logoBg: bgColors[index % bgColors.length],
        name: bank.name,
        code: `ID : ${bank.swift_code || bank.id} - BANK-${bank.country_code || 'CM'}`,
        status: bank.is_active ? "ACTIF" : "MAINTENANCE" as "ACTIF" | "MAINTENANCE",
        agences: bank.agencies_count || 0,
        volume24h: bank.volume_24h || 0
      }));
      
      setInstitutions(formattedBanks);
      setIsModalOpen(false);
      setFormName("");
      setFormCode("");
      setFormAgences("");
      setFormVolume("");
      setFormStatus("ACTIF");

      setToastMessage(`Banque "${newBank.name}" créée avec succès.`);
    } catch (error: any) {
      console.error('Erreur lors de la création de la banque:', error);
      setToastMessage(error.message || "Erreur lors de la création de la banque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatusDirect = (code: string) => {
    setInstitutions(prev => prev.map(inst => {
      if (inst.code === code) {
        const nextStatus = inst.status === "ACTIF" ? "MAINTENANCE" : "ACTIF";
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  return (
    <div className="flex-1 bg-[#F8F9FD] min-h-screen p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full relative antialiased">
      
      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Info className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* ZONE D'ACTIONS EXCLUE DE LA CAPTURE NUMÉRIQUE DU PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#0B6634]">Espace Super Admin</span>
          <h1 className="text-2xl font-black text-[#0A1D37] tracking-tight">Console de Commande</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* DECLENCHEUR DU STOCKAGE DU RAPPORT SANS ACTION D'IMPRESSION */}
          <button 
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-bold px-4 py-3 rounded-xl text-xs hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer group active:scale-98"
          >
            <Download className="h-4 w-4 text-slate-400 group-hover:text-[#0B6634]" />
            <span>Télécharger le PDF</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#0B6634] text-white font-bold px-4 py-3 rounded-xl text-xs shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Nouvelle Banque</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTENEUR IDENTIFIÉ : SEUL CE BLOC EST CAPTURÉ ET CONVERTI EN FICHIER PDF
         ========================================================================= */}
      <div id="main-report-content" className="space-y-6 p-2 rounded-xl">
        
        {/* EN-TÊTE INTÉGRÉ AU DOCUMENT LOCAL */}
        <div className="pb-2 border-b border-slate-200/60 hidden md:block">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Bilan Réseau Officiel - Page Principale</h2>
          <p className="text-[10px] text-slate-400 font-medium font-mono">ID-SESSION-AUTH : SUPER-ADMIN-CONSOLE</p>
        </div>

        {/* COMPTEURS KPIs DE LA PAGE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Banques</span>
              <div className="text-3xl font-black text-slate-900 font-mono">{totalBanquesCount}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Agences Actives</span>
              <div className="text-3xl font-black text-slate-900 font-mono">{totalAgencesCount.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Volume Global (24h)</span>
              <div className="text-3xl font-black text-[#0B6634] font-mono tracking-tight">{totalThroughput}</div>
            </div>
          </div>
        </div>

        {/* TABLEAU PRINCIPAL DE BANK MANAGEMENT */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Données des Établissements Connectés</h3>
            <span className="text-[10px] font-mono text-slate-400 font-bold">Mis à jour en temps réel</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Institution</th>
                  <th className="py-3 px-5">Statut Opérationnel</th>
                  <th className="py-3 px-5">Agences</th>
                  <th className="py-3 px-5 text-right">Volume (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {institutions.map((inst, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${inst.logoBg} flex items-center justify-center font-black text-[10px] shrink-0`}>
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
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-600 font-mono">{inst.agences}</td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900">
                      {inst.volume24h.toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER CERTIFICATE INCORPORÉ DIRECTEMENT SUR L'IMAGE DU PDF */}
        <div className="bg-[#0A1D37] text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">Certificat d'Intégrité Interbancaire</div>
            <p className="text-[11px] text-slate-400">Généré localement de manière sécurisée et immuable.</p>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-400 font-bold">
            Fait le {new Date().toLocaleDateString()}
          </div>
        </div>

      </div>

      {/* AUTRES SECTIONS UTILS DE L'APPLICATION (EXCLUES DU PARCOURS DE TÉLÉCHARGEMENT PDF) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Activité d'infrastructure (Hors-Bilan)</h3>
        <p className="text-xs text-slate-500 font-medium">Ces données de monitoring en arrière-plan ne font pas partie des rapports de comptes exportables.</p>
      </div>

      {/* MODALE FORMULAIRE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Ajouter une Nouvelle Banque</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nom de la banque</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: BNP Paribas"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B6634]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Code Banque</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="ex: 4922"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B6634]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre d'agences</label>
                <input
                  type="number"
                  value={formAgences}
                  onChange={(e) => setFormAgences(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B6634]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Volume 24h (FCFA)</label>
                <input
                  type="number"
                  value={formVolume}
                  onChange={(e) => setFormVolume(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B6634]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statut</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "ACTIF" | "MAINTENANCE")}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0B6634]"
                >
                  <option value="ACTIF">ACTIF</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0B6634] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#074724] cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader size={14} className="animate-spin" />}
                  {isSubmitting ? "Création..." : "Ajouter la banque"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}