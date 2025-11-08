/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ground: '#141414',
        grounddarker: '#141416',

        element: '#222',
        elementdarker: '#101117',
        secondary: '#909090',
        highsec: '#575757',

        groundl: '#EEEEEE',
        elementl: '#979797',
      },
    },
  },
  plugins: [],
}
