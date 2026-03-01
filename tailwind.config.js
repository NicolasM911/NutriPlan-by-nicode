/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terracotta: { 50: '#fff4f0', 100: '#ffe4d9', 200: '#ffcab5', 300: '#ffa285', 400: '#f4845f', 500: '#e8663d', 600: '#d44d22', 700: '#b03c19', 800: '#8f3218', 900: '#75291a' },
        amber: { 50: '#fffbf0', 100: '#fef3d0', 200: '#fde89f', 300: '#fbd86a', 400: '#f7c948', 500: '#f7b267', 600: '#e49020', 700: '#c07515', 800: '#9a5f14', 900: '#7d4e14' },
        cream: { 50: '#fffffe', 100: '#fff8f0', 200: '#fdeee0', 300: '#fae0c8', 400: '#f5ccac', 500: '#eeb88a' },
        brown: { 800: '#3d2b1f', 900: '#2a1a10' },
        sage: { 100: '#e8f5e4', 200: '#c8e8c0', 300: '#a8d5a2', 400: '#80bb78', 500: '#5a9e52' },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Lato', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FFF8F0 0%, #FFE4D9 50%, #FFF0E0 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,248,240,0.8) 100%)',
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(61, 43, 31, 0.08), 0 1px 4px rgba(61, 43, 31, 0.04)',
        'warm-lg': '0 12px 48px rgba(61, 43, 31, 0.12), 0 4px 12px rgba(61, 43, 31, 0.06)',
        'warm-xl': '0 24px 64px rgba(61, 43, 31, 0.16)',
      }
    },
  },
  plugins: [],
}
