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
          base: 'var(--bg-page)',
          panel: 'var(--panel)',
          line: 'var(--border)',
          green: 'var(--accent-green)',
          blue: 'var(--accent-blue)',
          ink: 'var(--text-ink)',
          muted: 'var(--text-muted)',
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
