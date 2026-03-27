/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ef',
          100: '#e7edd7',
          200: '#d0ddae',
          300: '#b4ca7f',
          400: '#97b458',
          500: '#7b9840',
          600: '#607631',
          700: '#495826',
          800: '#313c1b',
          900: '#171f0f'
        },
        ink: '#0f1720',
        sand: '#f6f1e7'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 32, 0.08)'
      }
    }
  },
  plugins: []
};

