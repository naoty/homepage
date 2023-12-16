import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-jp)'],
        mono: ['var(--font-source-code-pro)'],
      },
      gridTemplateColumns: {
        'mobile': '1rem minmax(0, auto) 1rem',
        'desktop': '1fr 40rem 1fr',
        'shogi-note-desktop': '1fr 60rem 1fr',
      },
      gridTemplateRows: {
        'mobile': '1rem minmax(0, auto) 1fr minmax(0, auto) 1rem',
        'desktop': '5rem minmax(0, auto) 1fr minmax(0, auto) 5rem',
      },
    },
  },
  plugins: [],
}
export default config
