/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f4f0',
        surface: '#ffffff',
        surface2: '#eeecea',
        ink: '#0f0e0c',
        ink2: '#6b6860',
        ink3: '#b5b3ae',
        red: '#e63027',
        green: '#1a7a4a',
        amber: '#c97a00',
        blue: '#1a4fe8',
        line: '#dddbd6',
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

