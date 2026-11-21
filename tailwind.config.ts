import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d2d9',
          300: '#f4adc0',
          400: '#ec7b9e',
          500: '#df4b7c',
          600: '#cb3165',
          700: '#aa2151',
          800: '#8e1f46',
          900: '#781f3e',
        },
        roseGold: {
          100: '#FDF6F0',
          200: '#F7E7CE',
          300: '#E8C5B0',
          400: '#D4A373',
          500: '#B87D4B',
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
