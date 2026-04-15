/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        xcmg: '#0057B8',
        'xcmg-soft': '#E8F1FF'
      },
      boxShadow: {
        panel: '0 10px 30px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
};
