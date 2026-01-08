// Apple Human Interface Guidelines - Core Design Principles
export const designPrinciples = {
  foundational: {
    aestheticIntegrity: {
      title: 'Aesthetic Integrity',
      description: 'Design should complement app functionality. Visual elements should enhance, not distract.',
      guidelines: [
        'Match visual style to content and purpose',
        'Use appropriate metaphors for the context',
        'Maintain consistency between form and function',
        'Let aesthetics support user goals',
      ],
      doThis: [
        'Use restrained, purposeful visual design',
        'Choose colors and graphics that reinforce content',
        'Create visual hierarchy that guides users',
      ],
      avoidThis: [
        'Decorative elements that don\'t serve a purpose',
        'Visual complexity that distracts from tasks',
        'Inconsistent styling within the same app',
      ],
    },

    consistency: {
      title: 'Consistency',
      description: 'Use standard UI elements and patterns. Follow platform conventions.',
      guidelines: [
        'Use system-provided controls and patterns',
        'Follow platform conventions for navigation',
        'Maintain consistent behavior throughout the app',
        'Familiar interactions reduce cognitive load',
      ],
      doThis: [
        'Use standard gestures for common actions',
        'Place navigation elements in expected locations',
        'Use system fonts and colors appropriately',
      ],
      avoidThis: [
        'Custom controls that behave unexpectedly',
        'Non-standard navigation patterns',
        'Reinventing standard interactions',
      ],
    },

    directManipulation: {
      title: 'Direct Manipulation',
      description: 'Users should feel they are directly interacting with content.',
      guidelines: [
        'Content should respond immediately to input',
        'Gestures should feel natural and intuitive',
        'Provide continuous visual feedback during interactions',
        'Enable users to see results of actions immediately',
      ],
      doThis: [
        'Allow direct interaction with content',
        'Show real-time feedback during drags and gestures',
        'Use physics-based animations for natural feel',
      ],
      avoidThis: [
        'Abstract controls that feel disconnected',
        'Delayed responses to user input',
        'Interactions that feel mechanical or robotic',
      ],
    },

    feedback: {
      title: 'Feedback',
      description: 'Every action should have a clear response.',
      guidelines: [
        'Acknowledge every user action',
        'Use visual, auditory, and haptic feedback appropriately',
        'Indicate progress for longer operations',
        'Confirm destructive actions before proceeding',
      ],
      doThis: [
        'Highlight interactive elements on touch',
        'Use subtle animations to confirm actions',
        'Provide haptic feedback for important moments',
        'Show loading states for async operations',
      ],
      avoidThis: [
        'Silent failures without user notification',
        'Actions that happen without visible response',
        'Overwhelming feedback for minor actions',
      ],
    },

    metaphors: {
      title: 'Metaphors',
      description: 'Use familiar concepts from the physical world.',
      guidelines: [
        'Make interactions feel natural and intuitive',
        'Virtual objects should behave predictably',
        'Use real-world physics for animations',
        'Balance familiarity with digital advantages',
      ],
      doThis: [
        'Use gestures that mirror physical actions',
        'Apply realistic physics to movements',
        'Create recognizable visual representations',
      ],
      avoidThis: [
        'Skeuomorphism that limits functionality',
        'Metaphors that don\'t translate well to touch',
        'Overly literal interpretations that feel dated',
      ],
    },

    userControl: {
      title: 'User Control',
      description: 'Users should initiate and control actions.',
      guidelines: [
        'Put users in charge of their experience',
        'Provide undo/cancel options',
        'Never make destructive changes without confirmation',
        'Allow customization where appropriate',
      ],
      doThis: [
        'Enable undo for reversible actions',
        'Ask before deleting or overwriting data',
        'Let users control notification frequency',
        'Provide escape routes from modal states',
      ],
      avoidThis: [
        'Automatic actions users didn\'t request',
        'Forced flows with no way out',
        'Hidden settings that affect behavior',
      ],
    },
  },

  visualDesign: {
    clarity: {
      title: 'Clarity',
      description: 'Text must be legible at every size. Icons should be precise and understandable.',
      guidelines: [
        'Use sufficient font size and weight',
        'Ensure adequate color contrast',
        'Create clear visual hierarchy',
        'Use whitespace generously',
      ],
      doThis: [
        'Use body text at 17pt or larger',
        'Maintain 4.5:1 contrast ratio minimum',
        'Group related elements visually',
        'Use consistent spacing patterns',
      ],
      avoidThis: [
        'Small, low-contrast text',
        'Cluttered, cramped layouts',
        'Ambiguous icons without labels',
        'Visual noise that obscures content',
      ],
    },

    deference: {
      title: 'Deference',
      description: 'UI should not compete with content.',
      guidelines: [
        'Keep chrome minimal and unobtrusive',
        'Use translucency and blur thoughtfully',
        'Let content be the hero',
        'Use subtle, contextual controls',
      ],
      doThis: [
        'Use full-bleed content where appropriate',
        'Apply blur to create depth without distraction',
        'Show controls contextually',
        'Use neutral colors for UI elements',
      ],
      avoidThis: [
        'Heavy borders and shadows',
        'Bright, saturated UI chrome',
        'Always-visible toolbars that crowd content',
        'Decorative elements that compete with content',
      ],
    },

    depth: {
      title: 'Depth',
      description: 'Use layers to convey hierarchy.',
      guidelines: [
        'Establish clear spatial relationships',
        'Use shadows and blur for elevation',
        'Motion should reinforce depth perception',
        'Translucent layers provide context',
      ],
      doThis: [
        'Layer content meaningfully',
        'Use subtle shadows for elevation',
        'Animate transitions in 3D space',
        'Blur background when presenting overlays',
      ],
      avoidThis: [
        'Flat design with no hierarchy',
        'Confusing layer ordering',
        'Heavy shadows that look dated',
        'Depth effects that obscure content',
      ],
    },
  },

  interaction: {
    responsiveness: {
      title: 'Responsiveness',
      description: 'Respond to user input immediately.',
      guidelines: [
        'Touch response should be instantaneous',
        'Never block the main thread',
        'Show optimistic UI updates',
        'Prioritize perceived performance',
      ],
      targets: {
        immediate: '< 100ms - Feels instant',
        responsive: '100-300ms - Noticeable but acceptable',
        slow: '> 300ms - Requires loading indicator',
        loading: '> 1s - Show progress indicator',
      },
    },

    gestures: {
      title: 'Gestures',
      description: 'Use standard gestures consistently.',
      standard: {
        tap: 'Select, activate',
        longPress: 'Context menu, edit mode',
        swipe: 'Navigate, reveal actions',
        pinch: 'Zoom',
        rotate: 'Rotate content',
        pan: 'Scroll, move',
        edgeSwipe: 'System navigation',
      },
      guidelines: [
        'Don\'t override system gestures',
        'Provide visual affordances for custom gestures',
        'Support both touch and pointer input',
        'Make gestures discoverable',
      ],
    },

    navigation: {
      title: 'Navigation',
      description: 'Navigation should be clear and predictable.',
      patterns: {
        hierarchical: 'Drill down into content (Settings)',
        flat: 'Switch between categories (Music)',
        contentDriven: 'Navigate through content items (Photos)',
        hybrid: 'Combine patterns as needed',
      },
      guidelines: [
        'Always provide a clear way back',
        'Show current location in hierarchy',
        'Use consistent navigation throughout',
        'Don\'t nest tab bars',
      ],
    },
  },

  accessibility: {
    title: 'Accessibility',
    description: 'Design for everyone.',
    guidelines: [
      'Support VoiceOver and screen readers',
      'Provide sufficient color contrast',
      'Support Dynamic Type',
      'Respect reduced motion preferences',
      'Ensure touch targets are 44pt minimum',
      'Don\'t rely on color alone to convey information',
    ],
    contrast: {
      normalText: 4.5,
      largeText: 3.0,
      uiComponents: 3.0,
    },
    dynamicType: {
      support: 'Scale text with user preferences',
      minimum: 'Never smaller than 11pt',
      truncation: 'Allow text to wrap, don\'t truncate important content',
    },
    motion: {
      respectPreference: 'Check prefers-reduced-motion',
      alternatives: 'Replace with fades or instant transitions',
    },
  },

  branding: {
    title: 'Branding',
    description: 'Integrate brand identity subtly.',
    guidelines: [
      'Use brand colors sparingly as accents',
      'Maintain readability over brand expression',
      'Don\'t override system fonts for body text',
      'Defer to system controls for familiar interactions',
    ],
    doThis: [
      'Apply brand color to key interactive elements',
      'Use custom icons that match iOS style',
      'Create a distinctive but native-feeling experience',
    ],
    avoidThis: [
      'Custom fonts that harm readability',
      'Branded splash screens that delay access',
      'Non-native navigation patterns',
      'Branded controls that confuse users',
    ],
  },
};

export type PrincipleCategory = keyof typeof designPrinciples;
