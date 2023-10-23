/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "var(--theme-primary)",
        "theme-background": "var(--theme-background)",
        "theme-placeholder": "var(--theme-placeholder)",

        'background-major': '#000000', // black
        'background-minor': '#18181b', // zinc-900
        'background-blue': '#082f49', // blue-950
        'background-transparent': '#00000000',

        'text-yellow-pineapple': '#fbbf24', // amber-400
        'text-green-pineapple': '#a3e635', // lime-400
        'text-warn': '#dc2626', // red-600
        'text-warn-light': '#f87171', // red-400
        'text-disabled': '#a3a3a3', // neutral-400
        'text-primary': '#ffffff', // white
        'text-secondary': '#a3a3a3', // neutral-400

        'input-background-neutral': '#262626', // neutral-800
        'input-disabled-border': '#d6d3d1', // neutral-300
        'input-selected': '#0891b2', // cyan-600

        'button-red': '#dc2626', // red-600
        'button-green': '#15803d', // green-700
        'button-blue': '#0891b2', // cyan-600
        'button-neutral': '#262626', // neutral-800
        'button-white': '#e5e5e5', // neutral-200
        
        'divider-color': '#334155', // slate-700

        'role-user': '#252A34',
        'role-moderator': '#FF2E63',
        'role-administrator': '#176B87',

        'post-discussion': '#86198f', // fuchsia-800
        'post-event': '#854d0e', // amber-800
        'post-donation': '#3f6212', // lime-800
      },
      borderWidth: {
        "1": "1px"
      }
    },
  },
  plugins: [],
}

