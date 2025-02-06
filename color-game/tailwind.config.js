module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 2s',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 rgba(0, 0, 0, 0.5)' },
          '50%': { boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)' },
          '100%': { boxShadow: '0 0 0 rgba(0, 0, 0, 0.5)' },
        }
      },
      fontFamily: {
        pressStart: ['"Press Start 2P"', 'cursive'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
