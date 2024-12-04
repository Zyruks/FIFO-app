import type { Config } from 'tailwindcss';
import tailwindcssAnimated from 'tailwindcss-animated';

export default {
  darkMode: 'class',
  content: ['index.html', './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
    extend: {
      colors: {
        // Here goes your color palette
      },
      fontSize: {
        'fluid-base': 'clamp(0.75rem, 2vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 4vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 6vw, 2.5rem)',
        'fluid-2xl': 'clamp(2rem, 9vw, 3.5rem)',
      },
      screens: {
        '2xs': '375px',
        xs: '500px',
      },
      container: {
        center: true,
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
        padding: {
          DEFAULT: '1rem',
          md: '6rem',
        },
      },
    },
  },
  plugins: [tailwindcssAnimated],
} satisfies Config;
