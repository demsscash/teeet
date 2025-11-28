import type { Metadata } from "next";
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Ecoly - Tableau de Bord",
  description: "Système de gestion scolaire Ecoly",
  keywords: ["éducation", "gestion", "tableau de bord", "Ecoly", "scolaire"],
  authors: [{ name: "Équipe Ecoly" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ecoly - Système de Gestion Scolaire",
    description: "Système de gestion professionnel pour les établissements scolaires",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecoly - Système de Gestion Scolaire",
    description: "Système de gestion professionnel pour les établissements scolaires",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com/3.4.1"></script>
        <link
          href="/styles/custom.css"
          rel="stylesheet"
        />
        <script
          src="/scripts/tailwind-config.js"
          defer
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen scroll-smooth"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}