/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SFMono-Regular"', 'Consolas', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        terminal: {
          base: 'rgb(var(--bg-page-rgb) / <alpha-value>)',
          panel: 'rgb(var(--panel-rgb) / <alpha-value>)',
          line: 'rgb(var(--border-rgb) / <alpha-value>)',
          green: 'rgb(var(--accent-green-rgb) / <alpha-value>)',
          blue: 'rgb(var(--accent-blue-rgb) / <alpha-value>)',
          ink: 'rgb(var(--text-ink-rgb) / <alpha-value>)',
          muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        },
      },
      boxShadow: {
        glow: 'var(--shadow-green)',
        blueglow: 'var(--shadow-blue)',
      },
    },
  },
  plugins: [],
};
