// Apple Shadow System - Elevation Levels
export const shadowTokens = {
  levels: {
    0: {
      offset: { x: 0, y: 0 },
      blur: 0,
      spread: 0,
      opacity: 0,
      description: 'No elevation',
    },
    1: {
      offset: { x: 0, y: 1 },
      blur: 3,
      spread: 0,
      opacity: 0.12,
      description: 'Subtle elevation for cards and list items',
    },
    2: {
      offset: { x: 0, y: 2 },
      blur: 8,
      spread: 0,
      opacity: 0.15,
      description: 'Medium elevation for dropdowns and popovers',
    },
    3: {
      offset: { x: 0, y: 4 },
      blur: 16,
      spread: 0,
      opacity: 0.18,
      description: 'High elevation for modals and sheets',
    },
    4: {
      offset: { x: 0, y: 8 },
      blur: 32,
      spread: 0,
      opacity: 0.22,
      description: 'Maximum elevation for focused dialogs',
    },
  },

  // Pre-computed CSS values
  css: {
    light: {
      level0: 'none',
      level1: '0 1px 3px rgba(0, 0, 0, 0.12)',
      level2: '0 2px 8px rgba(0, 0, 0, 0.15)',
      level3: '0 4px 16px rgba(0, 0, 0, 0.18)',
      level4: '0 8px 32px rgba(0, 0, 0, 0.22)',
    },
    dark: {
      level0: 'none',
      level1: '0 1px 3px rgba(0, 0, 0, 0.3)',
      level2: '0 2px 8px rgba(0, 0, 0, 0.4)',
      level3: '0 4px 16px rgba(0, 0, 0, 0.5)',
      level4: '0 8px 32px rgba(0, 0, 0, 0.6)',
    },
  },

  // SwiftUI shadow values
  swiftui: {
    level1: '.shadow(color: .black.opacity(0.12), radius: 3, x: 0, y: 1)',
    level2: '.shadow(color: .black.opacity(0.15), radius: 8, x: 0, y: 2)',
    level3: '.shadow(color: .black.opacity(0.18), radius: 16, x: 0, y: 4)',
    level4: '.shadow(color: .black.opacity(0.22), radius: 32, x: 0, y: 8)',
  },

  // Semantic mapping
  semantic: {
    card: 1,
    listItem: 0,
    dropdown: 2,
    popover: 2,
    modal: 3,
    sheet: 3,
    dialog: 4,
    tooltip: 1,
    floatingButton: 2,
    navigation: 1,
  },

  // Additional Apple-specific shadows
  specialized: {
    // Inner shadow for inset effects
    inset: {
      css: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      description: 'Subtle inset shadow for text fields and wells',
    },
    // Glow effect for focus states
    focusRing: {
      css: '0 0 0 4px rgba(0, 122, 255, 0.4)',
      description: 'Focus ring shadow for accessibility',
    },
    // Colored shadow for buttons
    coloredButton: {
      template: (color: string) => `0 4px 16px ${color}40`,
      description: 'Colored shadow matching button color',
    },
  },

  notes: [
    'Use subtle shadows - Apple design favors understated elevation',
    'Shadows should be more prominent in dark mode',
    'Combine shadows with background blur for depth',
    'Never use harsh black shadows - always use transparency',
    'Shadows should indicate interactivity and hierarchy',
    'Consider removing shadows on elements with blur backgrounds',
  ],
};

export type ShadowLevel = 0 | 1 | 2 | 3 | 4;
