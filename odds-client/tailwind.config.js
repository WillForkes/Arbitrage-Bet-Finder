/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",

    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js"
  ],
  theme: {
    extend: {
        colors: {
            primary: {
                '50': '#ebfaff',
                '100': '#d1f5ff',
                '200': '#aeeeff',
                '300': '#76e6ff',
                '400': '#35d5ff',
                '500': '#07b5ff',
                '600': '#0090ff',
                '700': '#0077ff',
                '800': '#0062d7',
                '900': '#004f99'
            }
        }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
