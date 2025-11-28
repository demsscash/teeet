// Configuration Tailwind CSS pour le design moderne
window.tailwind.config = {
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