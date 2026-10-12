/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        acm: {
          blue: '#0085CA',
          darkBlue: '#005a8c',
          cyan: '#06b6d4',
          accent: '#38bdf8',
          light: '#38bdf8',
          glow: '#0284c7',
        },
        brand: {
          blue: '#0a86d2',
          bright: '#0a8fdc',
          deep: '#064a95',
          navy: '#0a2342',
          ink: '#07172e',
          orange: '#f97b2c',
          mist: '#f2f6fa',
        },
        navy: {
          800: '#111b2e',
          850: '#0d1527',
          900: '#090e1a',
          950: '#040711',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(6, 182, 212, 0.25)',
        'glow': '0 0 25px -3px rgba(0, 133, 202, 0.35)',
        'glow-lg': '0 0 40px -5px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
