/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'up-maroon': '#76090c',
        'up-green': '#014421',
        'up-gold': '#F3AA2C',
      },
    },
  },
  plugins: [],
};
