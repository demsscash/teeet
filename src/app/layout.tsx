import type { Metadata } from "next";
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Tableau de Bord - Institution Éducative",
  description: "Système de gestion moderne pour institution éducative",
  keywords: ["éducation", "gestion", "tableau de bord", "moderne"],
  authors: [{ name: "Équipe Technique" }],
  icons: {
    icon: "https://z-ai-web-dev-sdk.cdn.zukizoo.com/favicon.ico",
  },
  openGraph: {
    title: "Tableau de Bord Éducatif",
    description: "Système de gestion complet pour institutions éducatives",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tableau de Bord Éducatif",
    description: "Système de gestion moderne pour institution éducative",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com/3.4.1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      primary: {
                        50: '#f0fdf4',
                        100: '#dcfce7',
                        200: '#bbf7d0',
                        300: '#86efac',
                        400: '#4ade80',
                        500: '#22c55e',
                        600: '#16a34a',
                        700: '#15803d',
                        800: '#166534',
                        900: '#14532d',
                        950: '#052e16',
                      },
                      accent: {
                        50: '#fef7ff',
                        100: '#fae8ff',
                        200: '#f5d0fe',
                        300: '#f0abfc',
                        400: '#e879f9',
                        500: '#d946ef',
                        600: '#c026d3',
                        700: '#a21caf',
                        800: '#86198f',
                        900: '#701a75',
                        950: '#4a044e',
                      },
                      secondary: {
                        50: '#f8fafc',
                        100: '#f1f5f9',
                        200: '#e2e8f0',
                        300: '#cbd5e1',
                        400: '#94a3b8',
                        500: '#64748b',
                        600: '#475569',
                        700: '#334155',
                        800: '#1e293b',
                        900: '#0f172a',
                        950: '#020617',
                      },
                      danger: {
                        50: '#fef2f2',
                        100: '#fee2e2',
                        200: '#fecaca',
                        300: '#fca5a5',
                        400: '#f87171',
                        500: '#ef4444',
                        600: '#dc2626',
                        700: '#b91c1c',
                        800: '#991b1b',
                        900: '#7f1d1d',
                        950: '#450a0a',
                      },
                      warning: {
                        50: '#fffbeb',
                        100: '#fef3c7',
                        200: '#fde68a',
                        300: '#fcd34d',
                        400: '#fbbf24',
                        500: '#f59e0b',
                        600: '#d97706',
                        700: '#b45309',
                        800: '#92400e',
                        900: '#78350f',
                        950: '#451a03',
                      },
                      success: {
                        50: '#f0fdf4',
                        100: '#dcfce7',
                        200: '#bbf7d0',
                        300: '#86efac',
                        400: '#4ade80',
                        500: '#22c55e',
                        600: '#16a34a',
                        700: '#15803d',
                        800: '#166534',
                        900: '#14532d',
                        950: '#052e16',
                      },
                      info: {
                        50: '#eff6ff',
                        100: '#dbeafe',
                        200: '#bfdbfe',
                        300: '#93c5fd',
                        400: '#60a5fa',
                        500: '#3b82f6',
                        600: '#2563eb',
                        700: '#1d4ed8',
                        800: '#1e40af',
                        900: '#1e3a8a',
                        950: '#172554',
                      },
                    },
                    animation: {
                      'fade-in': 'fadeIn 0.5s ease-in-out',
                      'slide-up': 'slideUp 0.3s ease-out',
                      'slide-in-right': 'slideInRight 0.3s ease-out',
                      'slide-down': 'slideDown 0.3s ease-out',
                      'slide-out-up': 'slideOutUp 0.3s ease-out',
                      'slide-out-right': 'slideOutRight 0.3s ease-out',
                      'bounce-soft': 'bounceSoft 2s infinite',
                      'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      'spin-slow': 'spin 3s linear infinite',
                      'wiggle': 'wiggle 1s ease-in-out infinite',
                      'float': 'float 3s ease-in-out infinite',
                      'glow': 'glow 2s ease-in-out infinite alternate',
                    },
                    keyframes: {
                      fadeIn: {
                        '0%': { opacity: '0', transform: 'translateY(10px)' },
                        '100%': { opacity: '1', transform: 'translateY(0)' },
                      },
                      slideUp: {
                        '0%': { transform: 'translateY(20px)', opacity: '0' },
                        '100%': { transform: 'translateY(0)', opacity: '1' },
                      },
                      slideDown: {
                        '0%': { transform: 'translateY(-20px)', opacity: '0' },
                        '100%': { transform: 'translateY(0)', opacity: '1' },
                      },
                      slideInRight: {
                        '0%': { transform: 'translateX(20px)', opacity: '0' },
                        '100%': { transform: 'translateX(0)', opacity: '1' },
                      },
                      slideOutUp: {
                        '0%': { transform: 'translateY(0)', opacity: '1' },
                        '100%': { transform: 'translateY(-20px)', opacity: '0' },
                      },
                      slideOutRight: {
                        '0%': { transform: 'translateX(0)', opacity: '1' },
                        '100%': { transform: 'translateX(20px)', opacity: '0' },
                      },
                      bounceSoft: {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-5px)' },
                      },
                      pulseSoft: {
                        '0%, 100%': { opacity: '1' },
                        '50%': { opacity: '0.8' },
                      },
                      wiggle: {
                        '0%, 100%': { transform: 'rotate(-3deg)' },
                        '50%': { transform: 'rotate(3deg)' },
                      },
                      float: {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                      glow: {
                        '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
                        '100%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)' },
                      },
                    },
                    backdropBlur: {
                      xs: '2px',
                      sm: '4px',
                      md: '8px',
                      lg: '16px',
                      xl: '24px',
                      '2xl': '40px',
                    },
                    boxShadow: {
                      'glow': '0 0 20px rgba(34, 197, 94, 0.15)',
                      'glow-lg': '0 0 40px rgba(34, 197, 94, 0.2)',
                      'glow-xl': '0 0 60px rgba(34, 197, 94, 0.25)',
                      'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      'card-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                    },
                    fontFamily: {
                      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
                      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
                    },
                    spacing: {
                      '18': '4.5rem',
                      '88': '22rem',
                      '128': '32rem',
                      '144': '36rem',
                    },
                    borderRadius: {
                      '4xl': '2rem',
                      '5xl': '2.5rem',
                      '6xl': '3rem',
                    },
                    backgroundImage: {
                      'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                      'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                      'gradient-mesh': 'radial-gradient(at 40% 0%, #22c55e 0px, transparent 50%), radial-gradient(at 80% 50%, #d946ef 0px, transparent 50%), radial-gradient(at 0% 100%, #3b82f6 0px, transparent 50%)',
                    },
                  },
                },
                plugins: [
                  function({ addUtilities, addComponents }) {
                    addUtilities({
                      '.glass': {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                      },
                      '.glass-dark': {
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      },
                      '.gradient-primary': {
                        background: 'linear-gradient(135deg, rgb(34 197 94) 0%, rgb(22 163 74) 100%)',
                      },
                      '.gradient-accent': {
                        background: 'linear-gradient(135deg, rgb(217 70 239) 0%, rgb(192 38 211) 100%)',
                      },
                      '.gradient-secondary': {
                        background: 'linear-gradient(135deg, rgb(148 163 184) 0%, rgb(100 116 139) 100%)',
                      },
                      '.gradient-danger': {
                        background: 'linear-gradient(135deg, rgb(239 68 68) 0%, rgb(220 38 38) 100%)',
                      },
                      '.gradient-warning': {
                        background: 'linear-gradient(135deg, rgb(245 158 11) 0%, rgb(217 119 6) 100%)',
                      },
                      '.gradient-info': {
                        background: 'linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%)',
                      },
                      '.gradient-hero': {
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)',
                      },
                      '.gradient-mesh': {
                        backgroundImage: 'radial-gradient(at 40% 0%, #22c55e 0px, transparent 50%), radial-gradient(at 80% 50%, #d946ef 0px, transparent 50%), radial-gradient(at 0% 100%, #3b82f6 0px, transparent 50%)',
                      },
                      '.gradient-text': {
                        background: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      },
                      '.card-hover': {
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '.card-hover:hover': {
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      },
                      '.btn-3d': {
                        transform: 'perspective(1px) translateZ(0)',
                        transition: 'all 0.2s',
                        position: 'relative',
                      },
                      '.btn-3d:before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'inherit',
                        'border-radius': 'inherit',
                        transform: 'translateZ(-1px)',
                        filter: 'brightness(0.8)',
                      },
                      '.btn-3d:hover': {
                        transform: 'perspective(1px) translateZ(2px)',
                      },
                      '.btn-3d:active': {
                        transform: 'perspective(1px) translateZ(0)',
                      },
                      '.shimmer': {
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite',
                      },
                      '.neon-glow': {
                        textShadow: '0 0 10px rgba(34, 197, 94, 0.8), 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)',
                      },
                      '.text-shadow-glow': {
                        textShadow: '0 0 10px currentColor',
                      },
                      '.backdrop-blur-glass': {
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      },
                    });

                    addComponents({
                      '.btn': {
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        lineHeight: '1',
                        borderRadius: '0.75rem',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        textDecoration: 'none',
                        '&:focus-visible': {
                          boxShadow: '0 0 0 2px currentColor',
                        },
                        '&:disabled': {
                          opacity: '0.5',
                          cursor: 'not-allowed',
                          pointerEvents: 'none',
                        },
                      },
                      '.btn-primary': {
                        backgroundColor: '#22c55e',
                        color: 'white',
                        '&:hover:not(:disabled)': {
                          backgroundColor: '#16a34a',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                        },
                        '&:active:not(:disabled)': {
                          transform: 'translateY(0)',
                        },
                      },
                      '.btn-secondary': {
                        backgroundColor: '#64748b',
                        color: 'white',
                        '&:hover:not(:disabled)': {
                          backgroundColor: '#475569',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(100, 116, 139, 0.4)',
                        },
                        '&:active:not(:disabled)': {
                          transform: 'translateY(0)',
                        },
                      },
                      '.btn-outline': {
                        backgroundColor: 'transparent',
                        color: '#22c55e',
                        border: '1px solid #22c55e',
                        '&:hover:not(:disabled)': {
                          backgroundColor: '#22c55e',
                          color: 'white',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                        },
                        '&:active:not(:disabled)': {
                          transform: 'translateY(0)',
                        },
                      },
                      '.btn-ghost': {
                        backgroundColor: 'transparent',
                        color: '#64748b',
                        '&:hover:not(:disabled)': {
                          backgroundColor: 'rgba(100, 116, 139, 0.1)',
                          color: '#334155',
                        },
                      },
                      '.btn-sm': {
                        padding: '0.375rem 0.75rem',
                        fontSize: '0.75rem',
                      },
                      '.btn-lg': {
                        padding: '0.875rem 1.75rem',
                        fontSize: '1rem',
                      },
                      '.card': {
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        '&:hover': {
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          transform: 'translateY(-2px)',
                        },
                      },
                      '.input': {
                        display: 'block',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:focus': {
                          outline: 'none',
                          borderColor: '#22c55e',
                          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
                        },
                        '&:hover:not(:focus)': {
                          borderColor: '#cbd5e1',
                        },
                        '&::placeholder': {
                          color: '#94a3b8',
                        },
                      },
                      '.badge': {
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        lineHeight: '1',
                      },
                    });
                  }
                ]
              };
            `
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }

            :root {
              --background: 0 0% 100%;
              --foreground: 222.2 84% 4.9%;
              --card: 0 0% 100%;
              --card-foreground: 222.2 84% 4.9%;
              --popover: 0 0% 100%;
              --popover-foreground: 222.2 84% 4.9%;
              --primary: 142 86% 28%;
              --primary-foreground: 355.7 100% 97.3%;
              --secondary: 210 40% 96%;
              --secondary-foreground: 222.2 84% 4.9%;
              --muted: 210 40% 96%;
              --muted-foreground: 215.4 16.3% 46.9%;
              --accent: 270 100% 90%;
              --accent-foreground: 222.2 84% 4.9%;
              --destructive: 0 84.2% 60.2%;
              --destructive-foreground: 210 40% 98%;
              --border: 214.3 31.8% 91.4%;
              --input: 214.3 31.8% 91.4%;
              --ring: 142 86% 28%;
              --radius: 0.5rem;
            }

            .dark {
              --background: 222.2 84% 4.9%;
              --foreground: 210 40% 98%;
              --card: 222.2 84% 4.9%;
              --card-foreground: 210 40% 98%;
              --popover: 222.2 84% 4.9%;
              --popover-foreground: 210 40% 98%;
              --primary: 142 70% 45%;
              --primary-foreground: 144 61% 20%;
              --secondary: 217.2 32.6% 17.5%;
              --secondary-foreground: 210 40% 98%;
              --muted: 217.2 32.6% 17.5%;
              --muted-foreground: 215 20.2% 65.1%;
              --accent: 270 100% 90%;
              --accent-foreground: 210 40% 98%;
              --destructive: 0 62.8% 30.6%;
              --destructive-foreground: 210 40% 98%;
              --border: 217.2 32.6% 17.5%;
              --input: 217.2 32.6% 17.5%;
              --ring: 142 70% 45%;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            .glass-morphism {
              background: rgba(255, 255, 255, 0.25);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.18);
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }

            .dark .glass-morphism {
              background: rgba(30, 41, 59, 0.25);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .gradient-bg {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .gradient-bg-2 {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }

            .gradient-bg-3 {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }

            .gradient-bg-4 {
              background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            }

            .text-gradient {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .hover-lift {
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .hover-lift:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            }

            .scroll-smooth {
              scroll-behavior: smooth;
            }

            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 4px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(34, 197, 94, 0.5);
              border-radius: 4px;
              transition: background 0.2s;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(34, 197, 94, 0.7);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(34, 197, 94, 0.3);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(34, 197, 94, 0.5);
            }

            /* Classes personnalisées pour remplacer Tailwind */
            .glass {
              background: rgba(255, 255, 255, 0.95) !important;
              backdrop-filter: blur(16px) !important;
              -webkit-backdrop-filter: blur(16px) !important;
              border: 1px solid rgba(255, 255, 255, 0.18) !important;
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
            }

            .glass-dark {
              background: rgba(30, 41, 59, 0.95) !important;
              backdrop-filter: blur(16px) !important;
              -webkit-backdrop-filter: blur(16px) !important;
              border: 1px solid rgba(255, 255, 255, 0.1) !important;
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
            }

            .gradient-primary {
              background: linear-gradient(135deg, rgb(34 197 94) 0%, rgb(22 163 74) 100%) !important;
            }

            .gradient-accent {
              background: linear-gradient(135deg, rgb(217 70 239) 0%, rgb(192 38 211) 100%) !important;
            }

            .gradient-secondary {
              background: linear-gradient(135deg, rgb(148 163 184) 0%, rgb(100 116 139) 100%) !important;
            }

            .gradient-danger {
              background: linear-gradient(135deg, rgb(239 68 68) 0%, rgb(220 38 38) 100%) !important;
            }

            .gradient-warning {
              background: linear-gradient(135deg, rgb(245 158 11) 0%, rgb(217 119 6) 100%) !important;
            }

            .gradient-info {
              background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%) !important;
            }

            .gradient-success {
              background: linear-gradient(135deg, rgb(34 197 94) 0%, rgb(22 163 74) 100%) !important;
            }

            .gradient-hero {
              background: linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%) !important;
            }

            .gradient-text {
              background: linear-gradient(135deg, #10b981 0%, #065f46 100%) !important;
              -webkit-background-clip: text !important;
              -webkit-text-fill-color: transparent !important;
              background-clip: text !important;
            }

            .btn {
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 0.5rem !important;
              padding: 0.625rem 1.25rem !important;
              font-size: 0.875rem !important;
              font-weight: 500 !important;
              line-height: 1 !important;
              border-radius: 0.75rem !important;
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
              cursor: pointer !important;
              border: none !important;
              outline: none !important;
              position: relative !important;
              overflow: hidden !important;
              text-decoration: none !important;
            }

            .btn-primary {
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
              color: white !important;
            }

            .btn-primary:hover:not(:disabled) {
              background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4) !important;
            }

            .btn-secondary {
              background: #64748b !important;
              color: white !important;
            }

            .btn-secondary:hover:not(:disabled) {
              background: #475569 !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4) !important;
            }

            .btn-outline {
              background: transparent !important;
              color: #22c55e !important;
              border: 1px solid #22c55e !important;
            }

            .btn-outline:hover:not(:disabled) {
              background: #22c55e !important;
              color: white !important;
              transform: translateY(-1px) !important;
              box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4) !important;
            }

            .btn-ghost {
              background: transparent !important;
              color: #64748b !important;
            }

            .btn-ghost:hover:not(:disabled) {
              background: rgba(100, 116, 139, 0.1) !important;
              color: #334155 !important;
            }

            .btn-sm {
              padding: 0.375rem 0.75rem !important;
              font-size: 0.75rem !important;
            }

            .btn-lg {
              padding: 0.875rem 1.75rem !important;
              font-size: 1rem !important;
            }

            .card {
              background: white !important;
              border-radius: 1rem !important;
              padding: 1.5rem !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
              border: 1px solid rgba(226, 232, 240, 0.8) !important;
            }

            .card:hover {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
              transform: translateY(-2px) !important;
            }

            .badge {
              display: inline-flex !important;
              align-items: center !important;
              padding: 0.25rem 0.75rem !important;
              border-radius: 9999px !important;
              font-size: 0.75rem !important;
              font-weight: 600 !important;
              line-height: 1 !important;
            }

            .shadow-soft {
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            }

            .shadow-medium {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            }

            .animate-fade-in {
              animation: fadeIn 0.5s ease-in-out !important;
            }

            .animate-bounce-soft {
              animation: bounceSoft 2s infinite !important;
            }

            .animate-pulse-soft {
              animation: pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
            }

            .bg-primary-50 { background-color: rgba(34, 197, 94, 0.05) !important; }
            .bg-primary-100 { background-color: rgba(34, 197, 94, 0.1) !important; }
            .bg-primary-200 { background-color: rgba(34, 197, 94, 0.2) !important; }
            .bg-primary-600 { background-color: #16a34a !important; }
            .text-primary-600 { color: #16a34a !important; }
            .border-primary-200 { border-color: rgba(34, 197, 94, 0.2) !important; }
            .border-primary-300 { border-color: rgba(34, 197, 94, 0.3) !important; }

            .bg-accent-50 { background-color: rgba(245, 158, 11, 0.05) !important; }
            .bg-accent-100 { background-color: rgba(245, 158, 11, 0.1) !important; }
            .bg-accent-600 { color: #d97706 !important; }
            .text-accent-600 { color: #d97706 !important; }

            .bg-danger-50 { background-color: rgba(239, 68, 68, 0.05) !important; }
            .bg-danger-100 { background-color: rgba(239, 68, 68, 0.1) !important; }
            .bg-danger-600 { background-color: #dc2626 !important; }
            .text-danger-600 { color: #dc2626 !important; }
            .text-danger-700 { color: #b91c1c !important; }

            .bg-success-50 { background-color: rgba(34, 197, 94, 0.05) !important; }
            .bg-success-100 { background-color: rgba(34, 197, 94, 0.1) !important; }
            .bg-success-600 { background-color: #16a34a !important; }
            .text-success-600 { color: #16a34a !important; }
            .text-success-700 { color: #15803d !important; }

            .text-white { color: white !important; }

            .hover\\:scale-105:hover { transform: scale(1.05) !important; }
            .hover\\:scale-110:hover { transform: scale(1.1) !important; }
            .hover\\:translate-x-1:hover { transform: translateX(0.25rem) !important; }
            .hover\\:translate-y-1:hover { transform: translateY(-0.25rem) !important; }
            .hover\\:bg-white:hover { background-color: white !important; }
            .hover\\:bg-white\\/50:hover { background-color: rgba(255, 255, 255, 0.5) !important; }
            .hover\\:bg-white\\/80:hover { background-color: rgba(255, 255, 255, 0.8) !important; }
            .hover\\:bg-primary-50:hover { background-color: rgba(34, 197, 94, 0.1) !important; }
            .hover\\:bg-gray-100:hover { background-color: #f3f4f6 !important; }
            .hover\\:bg-gray-200:hover { background-color: #e5e7eb !important; }
            .hover\\:text-primary-600:hover { color: #16a34a !important; }
            .hover\\:text-gray-900:hover { color: #111827 !important; }
            .hover\\:shadow-soft:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
            .hover\\:shadow-medium:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }

            .group:hover .group-hover\\:text-primary-600 { color: #16a34a !important; }
            .group:hover .group-hover\\:scale-110 { transform: scale(1.1) !important; }
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `
        }} />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 text-gray-900 scroll-smooth"
        suppressHydrationWarning
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}