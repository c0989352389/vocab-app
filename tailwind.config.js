/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58CC02',
          greenDark: '#58A700',
          greenLight: '#89E219',
          blue: '#1CB0F6',
          purple: '#CE82FF',
          gold: '#FFC800',
          red: '#FF4B4B',
          ink: '#3C3C3C',
          gray: '#AFAFAF',
          bg: '#F7F7F7',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['"Nunito"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
        phonetic: ['"Noto Serif"', '"Charis SIL"', '"Doulos SIL"', '"Lucida Sans Unicode"', '"Arial Unicode MS"', 'serif'],
      },
      borderRadius: {
        duo: '16px',
      },
      boxShadow: {
        duo: '0 4px 0 0 rgba(0,0,0,0.1)',
        'duo-green': '0 4px 0 0 #58A700',
      },
    },
  },
  plugins: [],
}
