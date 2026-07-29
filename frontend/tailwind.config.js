/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9dff8e',
        secondary: '#a4afb5',
        dark: '#161616',
        danger: '#fdd2d2',
        muted: '#6c757d',
        
        'base-bg': '#0c0c0c',
        'base-bg-light': '#181818',
        'base-bg-dark': '#090909',
        
        texts: '#EEEEEE',
        'texts-inverted': '#111111',
        
        'base-container-bg': '#191919',
        'base-popover-bg': '#0e0e0e',
        'base-boards': '#1c1c1c',
        'base-info-badges': '#1a1a1a',
        empty: '#161616',
        'empty-accent': '#131313',
        
        borders: '#1D1D1D',
        'scrollbar-track': '#101010',
        'scrollbar-thumb': '#32343a',
      },
      fontFamily: {
        sans: ['Saira', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}