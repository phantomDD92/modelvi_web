import colors from 'tailwindcss/colors'
import prelinePlugin from 'preline/plugin'
import tailwindForms from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import { createThemes } from 'tw-colors'

/** @type {import('tailwindcss').Config} */
export default {
  important: false,
  content: [
    './index.html',
    './src/**/*.{css,js,ts,jsx,tsx}',
    './node_modules/preline/preline.js',
  ],
  darkMode: ['class'],
  safelist: [
    {
      pattern: /border-(sky|pink|purple)-500\/40/,
    },
    {
      pattern: /text-(sky|pink|purple)-500/,
    },
    {
      pattern: /bg-(sky|pink|purple)-500\/20/,
    },
    {
      pattern: /border-(sky|pink|purple)-500\/20/,
      variants: ['hover'],
    },
    {
      pattern: /bg-(sky|pink|purple)-500\/5/,
      variants: ['hover'],
    },
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },

    fontFamily: {
      body: ['REM', 'sans-serif'],
    },

    extend: {
      colors: {
        primary: {
          ...colors.blue,
          DEFAULT: colors.blue['600'],
        },
      },

      zIndex: {
        60: '60',
        70: '70',
      },

      keyframes: {
        load: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },

  plugins: [
    prelinePlugin,
    tailwindForms,
    tailwindTypography,
    createThemes(
      {
        light: {
          default: colors.zinc,
        },

        dark: {
          default: {
            50: '#09090b',
            100: '#18181b',
            200: '#27272a',
            300: '#3f3f46',
            400: '#52525b',
            500: '#71717a',
            600: '#a1a1aa',
            700: '#d4d4d8',
            800: '#e4e4e7',
            900: '#f4f4f5',
            950: '#fafafa',
          },
        },
      },
      {
        defaultTheme: 'light',
      }
    ),
  ],
  corePlugins: {
    preflight: true,
  }
}
