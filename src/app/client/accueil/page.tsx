"use client";

import type { ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Banknote, 
  User, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

// --- Interfaces ---
interface FeatureCardProps {
  icon: ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
}

interface PortalCardProps {
  icon: ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

// --- Composants Internes Réutilisables ---

// Cartes de sélection d'espace (Client / Agent)
const PortalCard = ({ icon: Icon, title, description, buttonText, onClick }: PortalCardProps) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
    <div>
      <div className="w-12 h-12 rounded-xl bg-[#e8f2ec] text-[#0f6e38] flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
    </div>
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-bold text-[#0f6e38] hover:underline cursor-pointer group mt-2 text-left"
    >
      <span>{buttonText}</span>
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </button>
  </div>
);

// Cartes d'arguments (Pourquoi choisir M.C CHEQUES)
const FeatureItem = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="w-14 h-14 rounded-full bg-[#e8f2ec] text-[#0f6e38] flex items-center justify-center mb-4 shadow-sm">
      <Icon size={26} />
    </div>
    <h4 className="text-base font-bold text-gray-900 mb-2">{title}</h4>
    <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium">{description}</p>
  </div>
);

// --- Page Principale ---
export default function AccueilPage() {
  const router = useRouter();

  const handleNavigateToLogin = () => {
    router.push('/client/connexion');
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] flex flex-col font-sans text-slate-900 antialiased w-full">
      
      {/* 1. Barre de navigation supérieure */}
      <header className="bg-white border-b border-gray-100 h-[73px] px-6 flex items-center justify-between w-full sticky top-0 z-50 shadow-sm/5">
        <div className="flex items-center gap-2 text-[#0f6e38] font-bold text-lg tracking-tight">
          <Banknote size={22} className="stroke-[2.5]" />
          <span>M.C CHEQUES</span>
        </div>
        <button 
          onClick={handleNavigateToLogin}
          className="bg-[#0f6e38] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0b5229] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          Connexion
        </button>
      </header>

      {/* 2. Zone Hero (Titre & Introduction) */}
      <section className="px-6 py-12 md:py-20 max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
          La gestion de vos chéquiers, <br />
          <span className="text-[#0f6e38]">simplifiée.</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Une plateforme unique pour commander, suivre et gérer vos chéquiers institutionnels auprès de toutes vos banques partenaires avec une précision chirurgicale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            type="button"
            onClick={handleNavigateToLogin}
            className="bg-[#0f6e38] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-green-100 hover:bg-[#0b5229] transition-all cursor-pointer active:scale-[0.98]"
          >
            Accéder à mon espace
          </button>
        </div>
      </section>

      {/* 3. Section des Espaces Portails (Client / Agent) */}
      <section className="px-6 py-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortalCard 
          icon={User}
          title="Espace Client"
          description="Particuliers et entreprises : gérez vos comptes et commandez vos chéquiers en quelques clics auprès de vos banques."
          buttonText="Accéder au portail client"
          onClick={handleNavigateToLogin}
        />
        <PortalCard 
          icon={Building2}
          title="Espace Agent"
          description="Administrateurs bancaires (ACE Finance, UBA, ECOBANK) : traitez les demandes et validez les émissions de chéquiers en toute sécurité."
          buttonText="Se connecter en tant qu'agent"
          onClick={handleNavigateToLogin}
        />
      </section>

      {/* 4. Section : Pourquoi choisir M.C CHEQUES ? */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pourquoi choisir M.C CHEQUES ?
          </h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed font-medium">
            Une technologie robuste au service de la conformité bancaire et de l'expérience utilisateur.
          </p>
        </div>

        {/* Grille des caractéristiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem 
            icon={ShieldCheck}
            title="Sécurité Maximale"
            description="Protocoles de cryptage bancaire et authentification multi-facteurs pour chaque transaction."
          />
          <FeatureItem 
            icon={Building2}
            title="Multi-Banques"
            description="Interface centralisée compatible avec ACE Finance, UBA, ECOBANK et vos partenaires locaux."
          />
          <FeatureItem 
            icon={TrendingUp}
            title="Suivi Temps Réel"
            description="Notifications instantanées sur l'état de fabrication et de livraison de vos carnets."
          />
        </div>
      </section>

      {/* 5. Section Partenaires de Confiance */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-2 mb-10">
          <p className="text-sm uppercase font-semibold tracking-[0.32em] text-[#0f6e38]/80">Partenaires de confiance</p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Nos partenaires bancaires</h3>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Une collaboration avec des banques locales et internationales pour garantir la meilleure couverture et conformité.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['ACE Finance', 'UBA', 'ECOBANK', 'BCEAO'].map((name) => (
            <div key={name} className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f2ec] flex items-center justify-center text-[#0f6e38] mb-3">
                <Banknote size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer légal */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6 text-center space-y-4 w-full mt-auto text-[11px] text-gray-500 font-medium">
        <div>
          <span className="font-bold text-gray-700">M.C CHEQUES</span>
          <p className="mt-1">© 2026 M.C CHEQUES. Sécurité et Transparence.</p>
        </div>
        <div className="flex justify-center gap-6 text-gray-400 font-semibold">
          <a href="#" className="hover:text-gray-600">Sécurité</a>
          <a href="#" className="hover:text-gray-600">Mentions Légales</a>
          <a href="#" className="hover:text-gray-600">Contact</a>
          <a href="#" className="hover:text-gray-600">Aide</a>
        </div>
      </footer>

    </div>
  );
}