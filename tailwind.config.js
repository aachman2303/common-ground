/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        stone: {
          50: '#FDFBF7', // Warmer cream
          100: '#F5F2EB',
          200: '#E6E2D8',
          300: '#D1CCC0',
          400: '#A39E93',
          500: '#7D786E',
          600: '#5C5850',
          700: '#403D38',
          800: '#262422',
          900: '#1C1A19',
        },
        brand: {
          50: '#F4F7F5',
          100: '#E3EBE6',
          200: '#C5D6CD',
          300: '#A3BDB1',
          400: '#7E9C8F',
          500: '#5F8174', // Muted Sage
          600: '#4A665C',
          700: '#384F47',
          800: '#2A3B36',
          900: '#1F2B28',
        },
        cozy: {
          cream: '#FEFCF5',
          latte: '#EBDCC1',
          clay: '#D4A373',
          rust: '#BC6C25',
        },
        calm: {
          green: '#CCD5AE',
          yellow: '#FAEDCD',
          red: '#E9C46A',
          cream: '#FEFAE0',
        }
      },
      boxShadow: {
        'soft': '0 8px 30px -8px rgba(95, 129, 116, 0.15)',
        'glow': '0 0 25px rgba(95, 129, 116, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'appear': 'appear 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        'blob': 'blob 10s infinite',
        'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        appear: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}