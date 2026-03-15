/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // noalimony.com — blues/greens
        'brand-no': {
          primary: '#1e40af',    // deep blue
          secondary: '#059669',  // emerald green
          accent: '#0ea5e9',     // sky blue
          dark: '#0f172a',
          light: '#eff6ff',
          text: '#1e293b',
        },
        // knowalimony.com — purples/golds
        'brand-know': {
          primary: '#7c3aed',    // violet
          secondary: '#d97706',  // amber gold
          accent: '#a855f7',     // purple
          dark: '#1e1b4b',
          light: '#faf5ff',
          text: '#1e1b4b',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
