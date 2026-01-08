// Apple Materials & Blur Effects - Vibrancy System
export const materialTokens = {
  // Material blur levels
  materials: {
    ultraThin: {
      blur: 10,
      saturation: 1.8,
      opacity: { light: 0.7, dark: 0.65 },
      description: 'Very subtle blur, mostly transparent',
    },
    thin: {
      blur: 20,
      saturation: 1.8,
      opacity: { light: 0.75, dark: 0.7 },
      description: 'Light blur with good transparency',
    },
    regular: {
      blur: 30,
      saturation: 1.8,
      opacity: { light: 0.8, dark: 0.75 },
      description: 'Standard material for most UI elements',
    },
    thick: {
      blur: 40,
      saturation: 1.8,
      opacity: { light: 0.85, dark: 0.8 },
      description: 'Denser material for overlays',
    },
    chrome: {
      blur: 50,
      saturation: 1.8,
      opacity: { light: 0.9, dark: 0.85 },
      description: 'Maximum blur for navigation bars',
    },
  },

  // Pre-computed CSS values
  css: {
    light: {
      ultraThin: 'backdrop-filter: blur(10px) saturate(180%); background-color: rgba(255, 255, 255, 0.7);',
      thin: 'backdrop-filter: blur(20px) saturate(180%); background-color: rgba(255, 255, 255, 0.75);',
      regular: 'backdrop-filter: blur(30px) saturate(180%); background-color: rgba(255, 255, 255, 0.8);',
      thick: 'backdrop-filter: blur(40px) saturate(180%); background-color: rgba(255, 255, 255, 0.85);',
      chrome: 'backdrop-filter: blur(50px) saturate(180%); background-color: rgba(255, 255, 255, 0.9);',
    },
    dark: {
      ultraThin: 'backdrop-filter: blur(10px) saturate(180%); background-color: rgba(28, 28, 30, 0.65);',
      thin: 'backdrop-filter: blur(20px) saturate(180%); background-color: rgba(28, 28, 30, 0.7);',
      regular: 'backdrop-filter: blur(30px) saturate(180%); background-color: rgba(28, 28, 30, 0.75);',
      thick: 'backdrop-filter: blur(40px) saturate(180%); background-color: rgba(28, 28, 30, 0.8);',
      chrome: 'backdrop-filter: blur(50px) saturate(180%); background-color: rgba(28, 28, 30, 0.85);',
    },
  },

  // SwiftUI material values
  swiftui: {
    ultraThin: '.ultraThinMaterial',
    thin: '.thinMaterial',
    regular: '.regularMaterial',
    thick: '.thickMaterial',
    chrome: '.bar',
  },

  // Vibrancy styles (text/icons on blur)
  vibrancy: {
    label: {
      description: 'For primary text on blur backgrounds',
      css: { light: 'rgba(0, 0, 0, 0.85)', dark: 'rgba(255, 255, 255, 0.85)' },
    },
    secondaryLabel: {
      description: 'For secondary text on blur backgrounds',
      css: { light: 'rgba(0, 0, 0, 0.6)', dark: 'rgba(255, 255, 255, 0.6)' },
    },
    fill: {
      description: 'For filled UI elements over blur',
      css: { light: 'rgba(120, 120, 128, 0.2)', dark: 'rgba(120, 120, 128, 0.3)' },
    },
    separator: {
      description: 'For divider lines over blur',
      css: { light: 'rgba(60, 60, 67, 0.3)', dark: 'rgba(84, 84, 88, 0.6)' },
    },
  },

  // Semantic material usage
  semantic: {
    navigationBar: 'chrome',
    tabBar: 'chrome',
    sheet: 'thick',
    popover: 'regular',
    notification: 'regular',
    widget: 'regular',
    sidebar: 'thin',
    contextMenu: 'thick',
  },

  // Fallbacks for browsers without backdrop-filter
  fallback: {
    css: `
      @supports not (backdrop-filter: blur(10px)) {
        .material-regular {
          background-color: rgba(255, 255, 255, 0.95);
        }
        @media (prefers-color-scheme: dark) {
          .material-regular {
            background-color: rgba(28, 28, 30, 0.95);
          }
        }
      }
    `,
    note: 'Provide solid color fallbacks for older browsers',
  },

  notes: [
    'Blur effects are signature Apple design elements',
    'Always pair blur with slight transparency',
    'Saturation boost (180%) enhances vibrancy',
    'Consider performance impact of blur on mobile',
    'Provide fallbacks for browsers without backdrop-filter',
    'Use lighter blur values on older/slower devices',
    'Text on blur should have sufficient contrast',
  ],
};

export type MaterialType = keyof typeof materialTokens.materials;
