// Apple Spacing System - Based on 8pt Grid
export const spacingTokens = {
  baseUnit: 8,

  scale: {
    xxs: 2,   // 0.25 * baseUnit
    xs: 4,    // 0.5 * baseUnit
    sm: 8,    // 1 * baseUnit
    md: 16,   // 2 * baseUnit
    lg: 24,   // 3 * baseUnit
    xl: 32,   // 4 * baseUnit
    xxl: 48,  // 6 * baseUnit
    xxxl: 64, // 8 * baseUnit
  },

  layout: {
    screenMargin: {
      compact: 16,  // iPhone in portrait, smaller iPads
      regular: 20,  // Larger iPads, Mac
    },
    safeArea: {
      top: 44,      // Status bar area
      bottom: 34,   // Home indicator area
    },
    sectionSpacing: 32,
    componentGap: 8,
    inlineGap: 4,
  },

  components: {
    listItem: {
      paddingVertical: 11,
      paddingHorizontal: 16,
      minHeight: 44,
    },
    card: {
      padding: 16,
      borderRadius: 12,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      minHeight: 44,
      borderRadius: 12,
    },
    input: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 44,
      borderRadius: 10,
    },
    navigationBar: {
      height: 44,
      largeTitleHeight: 96,
    },
    tabBar: {
      height: 49,
      heightWithLabels: 83,
    },
    toolbar: {
      height: 44,
    },
  },

  touchTargets: {
    minimum: 44,      // Absolute minimum touch target size
    recommended: 48,  // Recommended for better accessibility
    comfortable: 56,  // Generous touch targets
  },

  cornerRadius: {
    none: 0,
    small: 6,
    medium: 10,
    large: 12,
    xlarge: 16,
    xxlarge: 20,
    full: 9999,
    // Continuous (squircle) corners
    continuous: {
      small: 'border-radius: 6px; -webkit-mask-image: url("data:image/svg+xml,...");',
      note: 'Use CSS mask or SVG for true Apple-style continuous corners',
    },
  },

  notes: [
    'Always use multiples of 4 or 8 for consistent spacing',
    'Touch targets should never be smaller than 44x44 points',
    'Maintain consistent margins within a screen',
    'Use larger spacing to create visual hierarchy',
    'Group related content with smaller internal spacing',
  ],
};

export type SpacingScale = keyof typeof spacingTokens.scale;
