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
          base: '#050809',
          panel: '#081012',
          line: '#172529',
          green: '#48ff6a',
          blue: '#22d3ee',
          ink: '#e7fff0',
          muted: '#8b9b9e',
        },
      },
      boxShadow: {
        glow: '0 0 35px rgba(72, 255, 106, 0.18)',
        blueglow: '0 0 28px rgba(34, 211, 238, 0.16)',
      },
    },
  },
  plugins: [],
};
