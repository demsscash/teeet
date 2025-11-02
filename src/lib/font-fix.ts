// Ce fichier est un wrapper pour résoudre le problème de next/font avec tsx
// Sauvegardez-le sous le nom src/lib/font-fix.ts

import { Inter, Geist, Geist_Mono } from 'next/font/google';

// Définir les polices en dehors du composant layout
// Elles seront importées et utilisées dans layout.tsx
export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

// Ajoutez d'autres polices si nécessaire
export const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});