/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // or wherever your components are
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#1FB6FF',
        'dark-steel': '#0a0f1c',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 8px #1FB6FF, 0 0 16px #1FB6FF',
      },
    },
  },
  plugins: [],
}
