// Apple Animation & Motion Tokens
export const animationTokens = {
  // Standard timing curves
  timing: {
    instant: { duration: 0.1, curve: 'ease-out' },
    fast: { duration: 0.2, curve: 'ease-out' },
    default: { duration: 0.35, curve: 'ease-in-out' },
    slow: { duration: 0.5, curve: 'ease-in-out' },
    deliberate: { duration: 0.7, curve: 'ease-in-out' },
  },

  // Spring animations (preferred in Apple design)
  springs: {
    snappy: {
      response: 0.3,
      dampingFraction: 0.825,
      description: 'Quick, responsive feel for button presses',
    },
    default: {
      response: 0.55,
      dampingFraction: 0.825,
      description: 'Standard spring for most UI animations',
    },
    bouncy: {
      response: 0.5,
      dampingFraction: 0.7,
      description: 'Playful bounce for fun interactions',
    },
    stiff: {
      response: 0.3,
      dampingFraction: 1.0,
      description: 'No overshoot, precise stopping',
    },
    gentle: {
      response: 0.8,
      dampingFraction: 0.9,
      description: 'Slow, graceful movements',
    },
    smooth: {
      response: 0.5,
      dampingFraction: 1.0,
      description: 'Smooth without bounce',
    },
  },

  // CSS bezier curves
  bezierCurves: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1.0)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1.0)',
    // Apple-specific curves
    appleEase: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    appleEaseIn: 'cubic-bezier(0.42, 0, 1, 1)',
    appleEaseOut: 'cubic-bezier(0, 0, 0.58, 1)',
    appleEaseInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    // For spring-like CSS (approximate)
    springLike: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Common animation patterns
  patterns: {
    viewTransition: {
      duration: 0.35,
      curve: 'easeInOut',
      description: 'Standard view push/pop transition',
    },
    modalPresent: {
      duration: 0.5,
      spring: 'default',
      description: 'Modal sheet presentation',
    },
    modalDismiss: {
      duration: 0.35,
      curve: 'easeIn',
      description: 'Modal sheet dismissal',
    },
    buttonPress: {
      duration: 0.1,
      curve: 'easeOut',
      scale: 0.97,
      description: 'Button press feedback',
    },
    buttonRelease: {
      duration: 0.2,
      spring: 'snappy',
      description: 'Button release spring back',
    },
    listReorder: {
      duration: 0.3,
      spring: 'bouncy',
      description: 'List item reordering',
    },
    fadeIn: {
      duration: 0.25,
      curve: 'easeOut',
      description: 'Content fade in',
    },
    fadeOut: {
      duration: 0.2,
      curve: 'easeIn',
      description: 'Content fade out',
    },
    scaleUp: {
      duration: 0.3,
      spring: 'default',
      fromScale: 0.95,
      description: 'Scale up appearance',
    },
  },

  // Reduced motion alternatives
  reducedMotion: {
    replaceWithFade: true,
    maxDuration: 0.2,
    disableSprings: true,
    disableScale: true,
    css: '@media (prefers-reduced-motion: reduce) { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }',
    notes: [
      'Always provide reduced motion alternatives',
      'Replace complex animations with simple fades',
      'Disable spring bounces and scale transforms',
      'Keep duration under 200ms',
    ],
  },

  // Haptic feedback timing (iOS)
  haptics: {
    impact: {
      light: 'For subtle feedback',
      medium: 'For moderate feedback',
      heavy: 'For strong feedback',
      rigid: 'For rigid, solid feedback',
      soft: 'For soft, flexible feedback',
    },
    notification: {
      success: 'For successful actions',
      warning: 'For warning states',
      error: 'For error states',
    },
    selection: 'For selection changes',
  },

  notes: [
    'Prefer spring animations over timing curves for natural feel',
    'Keep animations under 500ms for responsiveness',
    'Use ease-out for elements entering the screen',
    'Use ease-in for elements leaving the screen',
    'Always respect prefers-reduced-motion',
    'Pair animations with haptic feedback on iOS',
    'Animations should feel purposeful, not decorative',
  ],
};

export type SpringType = keyof typeof animationTokens.springs;
export type TimingType = keyof typeof animationTokens.timing;
