import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'M.C CHEQUES',
  description: 'Gestion des chéquiers et suivi des demandes bancaires',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
