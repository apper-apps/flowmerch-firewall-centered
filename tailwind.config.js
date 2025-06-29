/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5C6AC4',
        secondary: '#202E78',
        accent: '#00848E',
        surface: '#F4F5F7',
        background: '#FAFBFC',
        success: '#50B83C',
        warning: '#F49342',
        error: '#DE3618',
        info: '#5C6AC4',
        shopify: '#5C6AC4'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '0.875rem',
        'lg': '1rem',
        'xl': '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '1.875rem',
        '5xl': '2.25rem'
      }
    },
  },
  plugins: [],
}