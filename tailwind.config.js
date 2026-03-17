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
        // knowalimony.com — Tiffany blue
        'brand-know': {
          primary: '#0ABAB5',    // Tiffany blue
          secondary: '#0f766e',  // deep teal
          accent: '#5eead4',     // light teal
          dark: '#042f2e',
          light: '#f0fdfa',
          text: '#042f2e',
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
