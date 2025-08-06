/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'var(--color-border)',
      },
      outlineColor: {
        ring: 'var(--color-ring)',
      },
      backgroundColor: {
        background: 'var(--color-background)',
      },
    },
  },
  plugins: [],
};
