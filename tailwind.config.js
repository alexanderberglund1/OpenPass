module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1c1c1e',
          sidebar: '#2c2c2e',
          card: '#2c2c2e',
          text: '#ffffff',
          'text-secondary': '#8e8e93',
          'button-primary': '#0A84FF',
          'button-secondary': '#3a3a3c',
        },
        light: {
          bg: '#f2f2f7',
          sidebar: '#ffffff',
          card: '#ffffff',
          text: '#000000',
          'text-secondary': '#3a3a3c',
          'button-primary': '#007AFF',
          'button-secondary': '#e5e5ea',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}