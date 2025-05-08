<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1f2937', // gray-800
          DEFAULT: '#374151', // gray-700
          dark: '#4b5563'     // gray-600
        }
      },
      boxShadow: {
        btn: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.btn'),
          transition: 'background-color 0.2s ease-in-out',
        },
        '.btn:hover': {
          backgroundColor: theme('colors.gray.200'),
        },
        '.dark .btn:hover': {
          backgroundColor: theme('colors.gray.800'),
        },
      });
    }
  ],
};
=======
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1f2937', // gray-800
          DEFAULT: '#374151', // gray-700
          dark: '#4b5563'     // gray-600
        }
      },
      boxShadow: {
        btn: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.btn'),
          transition: 'background-color 0.2s ease-in-out',
        },
        '.btn:hover': {
          backgroundColor: theme('colors.gray.200'),
        },
        '.dark .btn:hover': {
          backgroundColor: theme('colors.gray.800'),
        },
      });
    }
  ],
};
>>>>>>> 5582115 (veamos que sale)
