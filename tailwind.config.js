/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    extend:{
      colors:{
        ground:"#1b1b1f",
        grounddarker:"#141416",

        element:"#202127",
        elementdarker:"#101117",
        secondary: "#909090"
      }
    }

  },
  plugins: [],
}

