// Apple System Colors - Based on Human Interface Guidelines
export const colorTokens = {
  system: {
    blue: { light: '#007AFF', dark: '#0A84FF' },
    green: { light: '#34C759', dark: '#30D158' },
    indigo: { light: '#5856D6', dark: '#5E5CE6' },
    orange: { light: '#FF9500', dark: '#FF9F0A' },
    pink: { light: '#FF2D55', dark: '#FF375F' },
    purple: { light: '#AF52DE', dark: '#BF5AF2' },
    red: { light: '#FF3B30', dark: '#FF453A' },
    teal: { light: '#5AC8FA', dark: '#64D2FF' },
    yellow: { light: '#FFCC00', dark: '#FFD60A' },
    gray: { light: '#8E8E93', dark: '#8E8E93' },
    gray2: { light: '#AEAEB2', dark: '#636366' },
    gray3: { light: '#C7C7CC', dark: '#48484A' },
    gray4: { light: '#D1D1D6', dark: '#3A3A3C' },
    gray5: { light: '#E5E5EA', dark: '#2C2C2E' },
    gray6: { light: '#F2F2F7', dark: '#1C1C1E' },
  },

  semantic: {
    background: {
      primary: { light: '#FFFFFF', dark: '#000000' },
      secondary: { light: '#F2F2F7', dark: '#1C1C1E' },
      tertiary: { light: '#FFFFFF', dark: '#2C2C2E' },
      grouped: { light: '#F2F2F7', dark: '#000000' },
      groupedSecondary: { light: '#FFFFFF', dark: '#1C1C1E' },
    },
    label: {
      primary: { light: '#000000', dark: '#FFFFFF' },
      secondary: { light: 'rgba(60, 60, 67, 0.6)', dark: 'rgba(235, 235, 245, 0.6)' },
      tertiary: { light: 'rgba(60, 60, 67, 0.3)', dark: 'rgba(235, 235, 245, 0.3)' },
      quaternary: { light: 'rgba(60, 60, 67, 0.18)', dark: 'rgba(235, 235, 245, 0.16)' },
    },
    fill: {
      primary: { light: 'rgba(120, 120, 128, 0.2)', dark: 'rgba(120, 120, 128, 0.36)' },
      secondary: { light: 'rgba(120, 120, 128, 0.16)', dark: 'rgba(120, 120, 128, 0.32)' },
      tertiary: { light: 'rgba(118, 118, 128, 0.12)', dark: 'rgba(118, 118, 128, 0.24)' },
      quaternary: { light: 'rgba(116, 116, 128, 0.08)', dark: 'rgba(118, 118, 128, 0.18)' },
    },
    separator: {
      opaque: { light: '#C6C6C8', dark: '#38383A' },
      nonOpaque: { light: 'rgba(60, 60, 67, 0.36)', dark: 'rgba(84, 84, 88, 0.65)' },
    },
    link: { light: '#007AFF', dark: '#0A84FF' },
    placeholder: { light: 'rgba(60, 60, 67, 0.3)', dark: 'rgba(235, 235, 245, 0.3)' },
  },

  gradients: {
    vibrantBlue: ['#007AFF', '#00C6FF'],
    sunset: ['#FF9500', '#FF2D55'],
    purple: ['#5856D6', '#AF52DE'],
    green: ['#34C759', '#30D158'],
  },

  accessible: {
    minimumContrast: 4.5,
    largeTextContrast: 3.0,
    notes: [
      'System colors are designed to meet WCAG contrast requirements',
      'Use semantic colors for automatic dark mode support',
      'Avoid pure black (#000000) on pure white (#FFFFFF) for body text - too harsh',
    ],
  },
};

export type ColorCategory = 'system' | 'semantic' | 'gradients' | 'accessible';
