/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#F2994A',
          50: '#f8cca4',
          100: '#f7c192',
          200: '#f5b780',
          300: '#f4ad6e',
          400: '#f3a35c',
          500: '#d98942',
          600: '#c17a3b',
          700: '#a96b33',
          800: '#915b2c',
          900: '#794c25'

        },
        'secondary': {
          DEFAULT: '#9D8F8F',
          50: '#cec7c7',
          100: '#c4bbbb',
          200: '#bab0b0',
          300: '#b0a5a5',
          400: '#a69a9a',
          500: '#8d8080',
          600: '#7d7272',
          700: '#6d6464',
          800: '#5e5555',
          900: '#4e4747'
        },
        'shade': {
          DEFAULT: '#D8D3D1',
          50: '#ebe9e8',
          100: '#e7e4e3',
          200: '#e3e0de',
          300: '#dfdbda',
          400: '#dbd7d5',
          500: '#c2bdbc',
          600: '#aca8a7',
          700: '#979392',
          800: '#817e7d',
          900: '#6c6968'
        },
        'light': '#F6F4F3'
      }
    },
  },
  plugins: [],
}
