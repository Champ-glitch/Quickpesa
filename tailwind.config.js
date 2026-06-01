/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2236',
          600: '#1f2937',
          border: '#2a3441',
        },
        brand: {
          green: '#22c55e',
          greenDark: '#16a34a',
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-fast': 'pulse 0.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'crash-shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-6px)' },
          '75%': { transform: 'translateX(6px)' }
        }
      }
    }
  },
  plugins: []
}
