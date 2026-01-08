// Apple Typography Scale - Based on Human Interface Guidelines
export const typographyTokens = {
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
    mono: '"SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace',
    rounded: '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    serif: '"New York", "Times New Roman", Times, serif',
  },

  // iOS Typography Scale (in points)
  ios: {
    largeTitle: { size: 34, weight: 700, lineHeight: 41, tracking: 0.37 },
    title1: { size: 28, weight: 700, lineHeight: 34, tracking: 0.36 },
    title2: { size: 22, weight: 700, lineHeight: 28, tracking: 0.35 },
    title3: { size: 20, weight: 600, lineHeight: 25, tracking: 0.38 },
    headline: { size: 17, weight: 600, lineHeight: 22, tracking: -0.41 },
    body: { size: 17, weight: 400, lineHeight: 22, tracking: -0.41 },
    callout: { size: 16, weight: 400, lineHeight: 21, tracking: -0.32 },
    subheadline: { size: 15, weight: 400, lineHeight: 20, tracking: -0.24 },
    footnote: { size: 13, weight: 400, lineHeight: 18, tracking: -0.08 },
    caption1: { size: 12, weight: 400, lineHeight: 16, tracking: 0 },
    caption2: { size: 11, weight: 400, lineHeight: 13, tracking: 0.07 },
  },

  // macOS Typography Scale (slightly different sizing)
  macos: {
    largeTitle: { size: 26, weight: 700, lineHeight: 32, tracking: 0.36 },
    title1: { size: 22, weight: 700, lineHeight: 26, tracking: 0.35 },
    title2: { size: 17, weight: 700, lineHeight: 22, tracking: 0 },
    title3: { size: 15, weight: 600, lineHeight: 20, tracking: 0 },
    headline: { size: 13, weight: 700, lineHeight: 16, tracking: 0 },
    body: { size: 13, weight: 400, lineHeight: 16, tracking: 0 },
    callout: { size: 12, weight: 400, lineHeight: 15, tracking: 0 },
    subheadline: { size: 11, weight: 400, lineHeight: 14, tracking: 0 },
    footnote: { size: 10, weight: 400, lineHeight: 13, tracking: 0 },
    caption1: { size: 10, weight: 500, lineHeight: 13, tracking: 0 },
    caption2: { size: 10, weight: 400, lineHeight: 13, tracking: 0 },
  },

  // Web Typography Scale (in pixels, for CSS)
  web: {
    largeTitle: { size: 34, weight: 700, lineHeight: 1.2, tracking: '0.37px' },
    title1: { size: 28, weight: 700, lineHeight: 1.2, tracking: '0.36px' },
    title2: { size: 22, weight: 700, lineHeight: 1.27, tracking: '0.35px' },
    title3: { size: 20, weight: 600, lineHeight: 1.25, tracking: '0.38px' },
    headline: { size: 17, weight: 600, lineHeight: 1.29, tracking: '-0.41px' },
    body: { size: 17, weight: 400, lineHeight: 1.47, tracking: '-0.41px' },
    callout: { size: 16, weight: 400, lineHeight: 1.31, tracking: '-0.32px' },
    subheadline: { size: 15, weight: 400, lineHeight: 1.33, tracking: '-0.24px' },
    footnote: { size: 13, weight: 400, lineHeight: 1.38, tracking: '-0.08px' },
    caption1: { size: 12, weight: 400, lineHeight: 1.33, tracking: '0' },
    caption2: { size: 11, weight: 400, lineHeight: 1.18, tracking: '0.07px' },
  },

  weights: {
    ultralight: 100,
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
    black: 900,
  },

  accessibility: {
    minimumBodySize: 17,
    minimumButtonSize: 15,
    dynamicTypeScales: ['xSmall', 'Small', 'Medium', 'Large', 'xLarge', 'xxLarge', 'xxxLarge'],
    notes: [
      'Avoid ultralight, thin, and light weights for body text',
      'Use regular, medium, semibold, or bold for accessibility',
      'Support Dynamic Type for iOS apps',
      'Minimum touch target text should be readable at 44pt touch area',
      'Line height should be at least 1.5x font size for readability',
    ],
  },
};

export type TypographyStyle = keyof typeof typographyTokens.ios;
export type Platform = 'ios' | 'macos' | 'web';
