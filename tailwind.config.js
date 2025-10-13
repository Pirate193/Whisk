/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:{
          light:'#fade55',
          dark:'#fade55'
        },
        text:{
          light:'#000000',
          dark:'#ffffff'
        },
        background:{
          light:'#ffffff',
          dark:'#000000'
        },
        secondary:{
          light:'#D9D9D9',
          dark:'#30302c'
        }
      }
    },
  },
  plugins: [],
}