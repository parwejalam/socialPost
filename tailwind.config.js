/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Custom theme colors
        'theme-bg-start': {
          light: '#c7ddeb',
          dark: '#394553',
        },
        'theme-bg-end': {
          light: '#a0b3c1',
          dark: '#0d1f31',
        },
        'theme-text': {
          light: '#1f2937',
          dark: '#f9fafb',
        },
        'theme-text-secondary': {
          light: '#6b7280',
          dark: '#d1d5db',
        },
        'theme-border': {
          light: '#e5e7eb',
          dark: '#374151',
        },
        'theme-card': {
          light: '#ffffff',
          dark: '#1f2937',
        },
        'theme-hover': {
          light: '#f3f4f6',
          dark: '#374151',
        },
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #c7ddeb 0%, #a0b3c1 100%)',
        'gradient-dark': 'linear-gradient(135deg, #394553 0%, #0d1f31 100%)',
      },
      // Add support for CSS custom properties
      textColor: {
        'theme': 'var(--theme-text)',
        'theme-secondary': 'var(--theme-text-secondary)',
      },
      backgroundColor: {
        'theme-card': 'var(--theme-card)',
        'theme-hover': 'var(--theme-hover)',
      },
      borderColor: {
        'theme': 'var(--theme-border)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

