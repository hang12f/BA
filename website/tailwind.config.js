/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E17',
        surface: '#111827',
        'surface-2': '#1E293B',
        border: '#1E3A5F',
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          dark: '#0891B2',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        highlight: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
        },
        gridFlow: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-40px)' },
        },
      },
      backgroundImage: {
        'hero-grad': 'linear-gradient(135deg, #0A0E17 0%, #0F172A 40%, #1E1B4B 100%)',
        'card-grad': 'linear-gradient(180deg, #111827 0%, #1E293B 100%)',
        'primary-grad': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
        'accent-grad': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'grid-pattern': 'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}
