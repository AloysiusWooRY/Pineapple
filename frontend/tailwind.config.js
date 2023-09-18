/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "var(--theme-primary)",
        "theme-background": "var(--theme-background)",
        "theme-placeholder": "var(--theme-placeholder)"
      },
      borderWidth: {
        "1": "1px"
      }
    },
  },
  plugins: [],
}

