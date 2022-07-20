module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#38bdf8',
          secondary: '#6ee7b7',
          accent: '#818cf8',
          neutral: '#1c1917',
          'base-100': '#e8f2fe',
          info: '#2563eb',
          success: '#22c55e',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
      'dark',
    ],
  },
}
