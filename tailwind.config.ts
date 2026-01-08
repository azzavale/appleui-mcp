import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Apple System Colors
        apple: {
          blue: { light: '#007AFF', dark: '#0A84FF' },
          green: { light: '#34C759', dark: '#30D158' },
          red: { light: '#FF3B30', dark: '#FF453A' },
          orange: { light: '#FF9500', dark: '#FF9F0A' },
          yellow: { light: '#FFCC00', dark: '#FFD60A' },
          pink: { light: '#FF2D55', dark: '#FF375F' },
          purple: { light: '#AF52DE', dark: '#BF5AF2' },
          indigo: { light: '#5856D6', dark: '#5E5CE6' },
          teal: { light: '#5AC8FA', dark: '#64D2FF' },
          gray: { light: '#8E8E93', dark: '#98989D' },
        },
        // Semantic Colors
        background: {
          primary: { light: '#FFFFFF', dark: '#000000' },
          secondary: { light: '#F2F2F7', dark: '#1C1C1E' },
          tertiary: { light: '#FFFFFF', dark: '#2C2C2E' },
        },
        label: {
          primary: { light: '#000000', dark: '#FFFFFF' },
          secondary: { light: 'rgba(60, 60, 67, 0.6)', dark: 'rgba(235, 235, 245, 0.6)' },
          tertiary: { light: 'rgba(60, 60, 67, 0.3)', dark: 'rgba(235, 235, 245, 0.3)' },
        },
        fill: {
          primary: { light: 'rgba(120, 120, 128, 0.2)', dark: 'rgba(120, 120, 128, 0.36)' },
          secondary: { light: 'rgba(120, 120, 128, 0.16)', dark: 'rgba(120, 120, 128, 0.32)' },
          tertiary: { light: 'rgba(118, 118, 128, 0.12)', dark: 'rgba(118, 118, 128, 0.24)' },
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      fontSize: {
        // Apple iOS Typography Scale
        'apple-largeTitle': ['34px', { lineHeight: '41px', fontWeight: '700' }],
        'apple-title1': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'apple-title2': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'apple-title3': ['20px', { lineHeight: '25px', fontWeight: '600' }],
        'apple-headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'apple-body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
        'apple-callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
        'apple-subheadline': ['15px', { lineHeight: '20px', fontWeight: '400' }],
        'apple-footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'apple-caption1': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'apple-caption2': ['11px', { lineHeight: '13px', fontWeight: '400' }],
      },
      spacing: {
        // Apple 8pt Grid System
        'apple-xxs': '4px',
        'apple-xs': '8px',
        'apple-sm': '12px',
        'apple-md': '16px',
        'apple-lg': '20px',
        'apple-xl': '24px',
        'apple-2xl': '32px',
        'apple-3xl': '40px',
        'apple-4xl': '48px',
      },
      borderRadius: {
        'apple-sm': '6px',
        'apple-md': '10px',
        'apple-lg': '12px',
        'apple-xl': '16px',
        'apple-2xl': '20px',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'apple-md': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 4px 16px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 8px 32px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'apple-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'apple-thin': '10px',
        'apple-regular': '20px',
        'apple-thick': '30px',
      },
    },
  },
  plugins: [],
};

export default config;
