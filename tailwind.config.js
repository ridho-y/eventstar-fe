/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-green': '#B5E48C',
        'medium-green': '#99D98C',
        'emerald-green': '#76C893',
        'secondary-light': '#52B69A',
        secondary: '#34A0A4',
        'secondary-dark': '#168AAD',
        'primary-light': '#1A759F',
        primary: '#1E6091',
        'primary-dark': '#184E77',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite'
      }
    },
    fontSize: {
      title: ['18px', {
        fontWeight: '500',
      }],
      'title-md': ['25px', {
        fontWeight: '500',
      }],
      h1: ['27px', {
        fontWeight: '500',
      }],
      'h1-md': ['34px', {
        fontWeight: '500',
      }],
      h2: ['18px', {
        fontWeight: '300',
      }],
      'h2-md': ['25px', {
        fontWeight: '300',
      }],
      h3: ['15px', {
        fontWeight: '500',
      }],
      'h3-md': ['20px', {
        fontWeight: '500',
      }],
      h4: ['12px', {
        fontWeight: '400',
      }],
      'h4-md': ['16px', {
        fontWeight: '400',
      }],
      h5: ['11px', {
        fontWeight: '300',
      }],
      'h5-md': ['14px', {
        fontWeight: '300',
      }],
      h6: ['9px', {
        fontWeight: '300',
      }],
      'h6-md': ['12px', {
        fontWeight: '300',
      }],
      p: ['12px', {
        fontWeight: '300',
      }],
      'p-md': ['16px', {
        fontWeight: '300',
      }],
    }
  },
  plugins: [],
}
