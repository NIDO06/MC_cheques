"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Eye, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  CheckCircle 
} from 'lucide-react';

interface RequestItem {
  id: string;
  type: string;
  date: string;
  status: 'En attente' | 'Livré';
}

export default function DashboardPage() {
  const router = useRouter();

  // --- États UI & Données ---
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [successToast, setSuccessToast] = useState('');
  const [checkType, setCheckType] = useState('Standard 50 Pages');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 'REQ-2023-0892', type: 'Standard 50 Pages', date: 'Oct 12, 2023', status: 'En attente' },
    { id: 'REQ-2023-0914', type: 'Premium Gold', date: 'Oct 15, 2023', status: 'En attente' },
    { id: 'REQ-2023-0788', type: 'Business Desk', date: 'Oct 05, 2023', status: 'Livré' },
  ]);

  // --- Actions ---
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      setRequests(prev => [{ id: generatedId, type: checkType, date: formattedDate, status: 'En attente' }, ...prev]);
      setIsSubmitting(false);
      setIsRequestModalOpen(false);
      setSuccessToast(`Demande ${generatedId} enregistrée !`);
      setTimeout(() => setSuccessToast(''), 4000);
    }, 700);
  };

  const countEnCours = requests.filter(r => r.status === 'En attente').length;
  const countLivres = requests.filter(r => r.status === 'Livré').length + 11;

  return (
    // Sécurité contraste : application d'un fond blanc/gris clair global pour éliminer la zone noire indésirable
    <div className="min-h-full bg-[#f8fafc] p-6 md:p-10 w-full text-slate-900 antialiased selection:bg-green-100">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 bg-slate-950 text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50 border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-sm font-bold">{successToast}</span>
          </div>
        )}

        {/* En-tête du Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#0f6e38] uppercase tracking-widest block mb-1">
              Dashboard Client
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Jean Dupont
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Gérez vos carnets de chèques et suivez vos demandes en temps réel.
            </p>
          </div>
          
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-[#0f6e38] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-green-900/10 hover:bg-[#0b5229] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] self-start sm:self-center"
          >
            <Plus size={18} className="stroke-[2.5]" />
            <span>New Checkbook Request</span>
          </button>
        </div>

        {/* Aperçu Rapide (Spécimen) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Aperçu Rapide
            </span>
            <Eye size={18} className="text-[#0f6e38]" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-1">Spécimen de Chèque</h3>
          <p className="text-xs font-medium text-slate-400 mb-5">
            Consultez le format officiel approuvé par ACE Finance.
          </p>

          <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 h-44 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-[1px] opacity-25 scale-105"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop')` }}
            />
            <button 
              onClick={() => setIsPreviewModalOpen(true)}
              className="relative bg-white text-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FileCheck size={16} className="text-red-500" />
              <span>View Check Specimen</span>
            </button>
          </div>
        </div>

        {/* Statistiques à fond blanc hautement contrasté */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* En Cours */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[160px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">En cours</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {countEnCours.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Clock size={22} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full mb-3 overflow-hidden">
                <div 
                  className="bg-[#0f6e38] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(countEnCours * 25, 100)}%` }}
                />
              </div>
              <p className="text-xs font-medium text-slate-500">2 demandes sont en attente de signature.</p>
            </div>
          </div>

          {/* Livrées */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[160px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Livrées (Mois)</span>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {countLivres.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center -space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-[#0f6e38] border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">+9</div>
              </div>
              <p className="text-xs font-medium text-slate-500">Activité stable par rapport au mois dernier.</p>
            </div>
          </div>
        </div>

        {/* Tableau des Demandes */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Suivi des Demandes</h3>
            <button 
              onClick={() => router.push('/client/demandes')}
              className="text-xs font-bold text-[#0f6e38] hover:underline cursor-pointer"
            >
              Voir tout
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Réf. Demande</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-none">
                    <td className="py-4 px-6 text-sm font-bold text-slate-800 tracking-tight">{req.id}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      <span className="flex items-center gap-2">
                        {req.type}
                        {req.status === 'En attente' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="En traitement"></span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-400">{req.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="text-slate-400 hover:text-[#0f6e38] transition-colors p-1 cursor-pointer"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= MODALE NOUVELLE DEMANDE ================= */}
        {isRequestModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Nouvelle Demande</h3>
                <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Type de carnet</label>
                  <select 
                    value={checkType}
                    onChange={(e) => setCheckType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0f6e38]"
                  >
                    <option value="Personnel">Personnel</option>
                    <option value="Entreprise">Entreprise</option>
                  </select>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 border border-slate-100">
                  Cette demande sera envoyée aux validateurs d'<strong>ACE Finance</strong> pour traitement sous 48h.
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0f6e38] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#0b5229] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Traitement...' : 'Confirmer la Demande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODALE VISIONNEUSE DE CHÈQUE ================= */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={() => setIsPreviewModalOpen(false)}>
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Format Officiel Approuvé</h3>
                  <p className="text-xs text-slate-400">Gabarit d'impression standardisé — ACE Finance</p>
                </div>
                <button onClick={() => setIsPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video flex items-center justify-center relative shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=1000&auto=format&fit=crop" 
                  alt="Chèque"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= MODALE FICHE DE COMMANDE ================= */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">Fiche de Demande</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-3 text-sm border-t border-b border-slate-100 py-4 my-2">
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Référence :</span> <span className="font-bold text-slate-900">{selectedRequest.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Modèle :</span> <span className="font-semibold text-slate-700">{selectedRequest.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Émise le :</span> <span className="font-semibold text-slate-700">{selectedRequest.date}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Statut :</span> 
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${selectedRequest.status === 'Livré' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRequest(null)}
                className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Fermer la vue
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}