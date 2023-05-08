/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: {
        50: '#5617DD',
        100: '#501EBD',
        200: '#4F25A9',
      },
      secondary: {
        50: '#0DCDAA',
        100: '#23BEA2',
        200: '#12A68B',
      },
      red: {
        50: '#B76177',
        100: '#B55F7F',
        200: '#B25E86',
      },
      gray: {
        50: '#151826',
        100: '#121624',
        200: '#101321',
        300: '#0D111F',
        400: '#0B0F1C',
      },
      neutral: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0A0A0A',
      },
    },
  },
  plugins: [],
};
