/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf4ff',
          100: '#dceaff',
          200: '#bfd7ff',
          300: '#93bbff',
          400: '#5f95ff',
          500: '#356ef5',
          600: '#1d52db',
          700: '#173fad',
          800: '#19388a',
          900: '#1b326f'
        },
        ink: '#0f1720',
        sand: '#eef3ff',
        clay: '#c9d6ff',
        mist: '#edf3ff'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 32, 0.08)',
        float: '0 24px 70px rgba(15, 23, 32, 0.12)'
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at top left, rgba(53, 110, 245, 0.28), transparent 30%), radial-gradient(circle at bottom right, rgba(201, 214, 255, 0.32), transparent 22%)'
      }
    }
  },
  plugins: []
};
