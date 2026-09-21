/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          dark: '#1565C0',
          light: '#42A5F5',
        },
        surface: '#FFFFFF',
        background: '#F5F5F5',
        error: '#D32F2F',
        success: '#388E3C',
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
      },
    },
  },
  plugins: [],
};
