import { z } from 'zod';
import {
  colorTokens,
  typographyTokens,
  spacingTokens,
  animationTokens,
  shadowTokens,
  materialTokens,
  designPrinciples,
  componentPatterns
} from '../../lib/mcp-data';

export const styleGuideSchema = z.object({
  topic: z.enum([
    'colors', 'typography', 'spacing', 'shadows', 'blur',
    'animations', 'gestures', 'haptics', 'navigation',
    'accessibility', 'layout', 'iconography', 'buttons',
    'forms', 'modals', 'lists', 'dark-mode', 'principles'
  ]).describe('Topic to get guidance on'),
  platform: z.enum(['ios', 'macos', 'web', 'all']).optional().default('all').describe('Target platform'),
  includeExamples: z.boolean().optional().default(true).describe('Include code examples'),
  includeCodeSnippets: z.boolean().optional().default(true).describe('Include code snippets'),
  format: z.enum(['detailed', 'summary']).optional().default('detailed').describe('Response format'),
});

export type StyleGuideInput = z.infer<typeof styleGuideSchema>;

interface Guideline {
  title: string;
  description: string;
  do: string[];
  dont: string[];
}

interface CodeExample {
  platform: string;
  code: string;
  description: string;
}

interface StyleGuideResult {
  topic: string;
  principles: string[];
  guidelines: Guideline[];
  tokens?: object;
  codeExamples?: CodeExample[];
  higReferences: string[];
}

export function getStyleGuide(input: StyleGuideInput): StyleGuideResult {
  const { topic, platform, includeExamples, format } = input;

  switch (topic) {
    case 'colors':
      return getColorGuide(platform, includeExamples, format);
    case 'typography':
      return getTypographyGuide(platform, includeExamples, format);
    case 'spacing':
      return getSpacingGuide(platform, includeExamples, format);
    case 'shadows':
      return getShadowGuide(platform, includeExamples, format);
    case 'blur':
      return getBlurGuide(platform, includeExamples, format);
    case 'animations':
      return getAnimationGuide(platform, includeExamples, format);
    case 'accessibility':
      return getAccessibilityGuide(platform, includeExamples, format);
    case 'buttons':
      return getButtonGuide(platform, includeExamples, format);
    case 'forms':
      return getFormGuide(platform, includeExamples, format);
    case 'modals':
      return getModalGuide(platform, includeExamples, format);
    case 'navigation':
      return getNavigationGuide(platform, includeExamples, format);
    case 'dark-mode':
      return getDarkModeGuide(platform, includeExamples, format);
    case 'principles':
      return getPrinciplesGuide(format);
    default:
      return getColorGuide(platform, includeExamples, format);
  }
}

function getColorGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Colors',
    principles: [
      'Use system colors to ensure consistency across iOS/macOS',
      'Semantic colors automatically adapt to light/dark mode',
      'Avoid hardcoded hex values when possible',
      'Maintain sufficient contrast for accessibility (4.5:1 for text)',
      'Use vibrant colors sparingly as accents',
    ],
    guidelines: [
      {
        title: 'System Colors',
        description: 'Apple provides a set of system colors that are optimized for both light and dark modes.',
        do: [
          'Use system blue (#007AFF) for primary actions and links',
          'Use system red (#FF3B30) for destructive actions',
          'Use system green (#34C759) for success states',
          'Let colors adapt automatically with semantic naming',
        ],
        dont: [
          'Hardcode colors that clash with system UI',
          'Use pure black (#000000) on pure white (#FFFFFF) for text',
          'Override system colors without good reason',
          'Use too many different colors in one view',
        ],
      },
      {
        title: 'Semantic Colors',
        description: 'Semantic colors have meaning and adapt to context.',
        do: [
          'Use label.primary for main text content',
          'Use background.primary/secondary for surfaces',
          'Use separator colors for divider lines',
          'Use fill colors for UI element backgrounds',
        ],
        dont: [
          'Use semantic colors for decorative purposes',
          'Mix semantic and hardcoded colors inconsistently',
          'Ignore the built-in opacity variants',
        ],
      },
    ],
    tokens: format === 'detailed' ? colorTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Color',
      'Human Interface Guidelines > Color > System Colors',
      'Human Interface Guidelines > Color > Dark Mode',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `:root {
  --system-blue: #007AFF;
  --background-primary: #FFFFFF;
  --label-primary: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --system-blue: #0A84FF;
    --background-primary: #000000;
    --label-primary: #FFFFFF;
  }
}`,
        description: 'CSS custom properties for Apple system colors',
      },
      {
        platform: 'SwiftUI',
        code: `Text("Hello")
    .foregroundColor(.primary) // Adapts to light/dark

Button("Action") { }
    .tint(.blue) // System blue`,
        description: 'SwiftUI semantic color usage',
      },
      {
        platform: 'React',
        code: `const colors = {
  systemBlue: 'var(--system-blue, #007AFF)',
  labelPrimary: 'var(--label-primary, #000000)',
};`,
        description: 'React color tokens with fallbacks',
      },
    ];
  }

  return result;
}

function getTypographyGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Typography',
    principles: [
      'Use San Francisco (SF Pro) as the primary typeface',
      'Follow the iOS/macOS type scale for consistent hierarchy',
      'Body text should be at least 17pt for readability',
      'Support Dynamic Type for accessibility',
      'Use font weight to create hierarchy, not just size',
    ],
    guidelines: [
      {
        title: 'Font Family',
        description: 'San Francisco is Apple\'s system font, optimized for screens.',
        do: [
          'Use -apple-system or SF Pro for web',
          'Use the system font in SwiftUI/UIKit',
          'Use SF Mono for code and numbers',
          'Use SF Pro Rounded for playful contexts',
        ],
        dont: [
          'Use custom fonts for body text without good reason',
          'Mix multiple font families in one app',
          'Use font weights lighter than Regular for body text',
        ],
      },
      {
        title: 'Type Scale',
        description: 'Apple defines specific text styles for different purposes.',
        do: [
          'Use Large Title (34pt) for screen headers',
          'Use Title 1-3 for section headers',
          'Use Body (17pt) for main content',
          'Use Caption (11-12pt) for supplementary info',
        ],
        dont: [
          'Create custom sizes outside the type scale',
          'Use font sizes smaller than 11pt',
          'Skip hierarchy levels arbitrarily',
        ],
      },
    ],
    tokens: format === 'detailed' ? typographyTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Typography',
      'Human Interface Guidelines > Typography > Font Weights',
      'Human Interface Guidelines > Typography > Dynamic Type',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: -0.41px;
  -webkit-font-smoothing: antialiased;
}

.large-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.37px;
}`,
        description: 'CSS typography following Apple type scale',
      },
      {
        platform: 'SwiftUI',
        code: `Text("Large Title")
    .font(.largeTitle)

Text("Body text")
    .font(.body)

Text("Caption")
    .font(.caption)
    .foregroundColor(.secondary)`,
        description: 'SwiftUI text styles',
      },
    ];
  }

  return result;
}

function getSpacingGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Spacing',
    principles: [
      'Use an 8pt grid system for consistent spacing',
      'Minimum touch target size is 44x44 points',
      'Group related elements with tighter spacing',
      'Use larger spacing to create visual separation',
      'Maintain consistent margins within screens',
    ],
    guidelines: [
      {
        title: '8pt Grid System',
        description: 'All spacing should be multiples of 4 or 8 points.',
        do: [
          'Use 4, 8, 12, 16, 24, 32, 48, 64 for spacing',
          'Use 16-20pt margins for screen edges',
          'Use 8pt gaps between related items',
          'Use 32pt or more between sections',
        ],
        dont: [
          'Use arbitrary spacing values like 13px or 27px',
          'Create cramped layouts with minimal spacing',
          'Use different margins on different screens',
        ],
      },
      {
        title: 'Touch Targets',
        description: 'Interactive elements need adequate touch area.',
        do: [
          'Make buttons at least 44pt tall',
          'Ensure tappable area extends beyond visible element',
          'Use 48pt or more for comfortable interaction',
        ],
        dont: [
          'Create touch targets smaller than 44pt',
          'Place interactive elements too close together',
          'Rely solely on visual size for touch area',
        ],
      },
    ],
    tokens: format === 'detailed' ? spacingTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Layout',
      'Human Interface Guidelines > Layout > Spacing',
      'Human Interface Guidelines > Accessibility > Touch Targets',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}

.button {
  min-height: 44px;
  padding: 12px 20px;
}

.card {
  padding: var(--space-md);
  margin: var(--space-md);
}`,
        description: 'CSS spacing system based on 8pt grid',
      },
    ];
  }

  return result;
}

function getShadowGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Shadows',
    principles: [
      'Use shadows sparingly to indicate elevation',
      'Shadows should be subtle, not harsh',
      'Higher elements cast larger, softer shadows',
      'Dark mode needs different shadow treatment',
      'Combine shadows with blur for depth',
    ],
    guidelines: [
      {
        title: 'Elevation Levels',
        description: 'Use consistent shadow levels for UI hierarchy.',
        do: [
          'Use Level 1 for cards and list items',
          'Use Level 2 for dropdowns and popovers',
          'Use Level 3 for modals and sheets',
          'Increase shadow intensity in dark mode',
        ],
        dont: [
          'Use harsh black shadows',
          'Apply shadows to every element',
          'Mix inconsistent shadow styles',
          'Use spread radius (keep it at 0)',
        ],
      },
    ],
    tokens: format === 'detailed' ? shadowTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Materials',
      'Human Interface Guidelines > Visual Design > Depth',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `.shadow-1 { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12); }
.shadow-2 { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
.shadow-3 { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18); }
.shadow-4 { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22); }`,
        description: 'CSS shadow levels',
      },
      {
        platform: 'SwiftUI',
        code: `Card()
    .shadow(color: .black.opacity(0.12), radius: 3, x: 0, y: 1)`,
        description: 'SwiftUI shadow modifier',
      },
    ];
  }

  return result;
}

function getBlurGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Blur & Materials',
    principles: [
      'Blur creates depth and context awareness',
      'Materials combine blur, saturation, and tint',
      'Use appropriate material thickness for context',
      'Ensure text remains readable over blur',
      'Provide fallbacks for older browsers/devices',
    ],
    guidelines: [
      {
        title: 'Material Types',
        description: 'Apple provides different material thicknesses for various UI contexts.',
        do: [
          'Use chrome/bar material for navigation bars',
          'Use regular material for sheets and popovers',
          'Use thin material for sidebars',
          'Increase saturation (180%) for vibrancy',
        ],
        dont: [
          'Overuse blur effects (performance impact)',
          'Place low-contrast text on blur backgrounds',
          'Use blur without fallback colors',
        ],
      },
    ],
    tokens: format === 'detailed' ? materialTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Materials',
      'Human Interface Guidelines > iOS > Bars > Navigation Bars',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `.blur-material {
  backdrop-filter: blur(30px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.8);
}

@supports not (backdrop-filter: blur(10px)) {
  .blur-material {
    background-color: rgba(255, 255, 255, 0.95);
  }
}`,
        description: 'CSS blur with fallback',
      },
      {
        platform: 'SwiftUI',
        code: `Text("Content")
    .background(.regularMaterial)

NavigationStack {
    // content
}
.toolbarBackground(.visible, for: .navigationBar)`,
        description: 'SwiftUI materials',
      },
    ];
  }

  return result;
}

function getAnimationGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Animations',
    principles: [
      'Animations should feel natural and purposeful',
      'Prefer spring animations over linear timing',
      'Keep animations under 500ms for responsiveness',
      'Always respect reduced motion preferences',
      'Use animation to provide feedback and context',
    ],
    guidelines: [
      {
        title: 'Spring Animations',
        description: 'Spring animations feel more natural than bezier curves.',
        do: [
          'Use springs for interactive element responses',
          'Apply bouncy springs for playful interactions',
          'Use stiff springs for precise movements',
          'Match spring intensity to action importance',
        ],
        dont: [
          'Use linear animations for UI elements',
          'Create animations longer than 500ms',
          'Animate multiple properties asynchronously',
          'Use animation purely for decoration',
        ],
      },
      {
        title: 'Reduced Motion',
        description: 'Some users are sensitive to motion.',
        do: [
          'Check prefers-reduced-motion media query',
          'Replace complex animations with fades',
          'Keep reduced animations under 200ms',
          'Disable spring bounces when reduced motion is on',
        ],
        dont: [
          'Ignore accessibility preferences',
          'Remove all feedback in reduced motion mode',
        ],
      },
    ],
    tokens: format === 'detailed' ? animationTokens : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Motion',
      'Human Interface Guidelines > Accessibility > Motion',
      'WWDC23 > Animate with Springs',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `.button {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}`,
        description: 'CSS spring-like animation with reduced motion support',
      },
      {
        platform: 'SwiftUI',
        code: `withAnimation(.spring(response: 0.55, dampingFraction: 0.825)) {
    isExpanded.toggle()
}

// Bouncy spring
withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
    // ...
}`,
        description: 'SwiftUI spring animations',
      },
    ];
  }

  return result;
}

function getAccessibilityGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Accessibility',
    principles: [
      'Design for everyone from the start',
      'Support VoiceOver and screen readers',
      'Maintain 4.5:1 contrast ratio for text',
      'Touch targets must be 44x44pt minimum',
      'Support Dynamic Type for adjustable text sizes',
      'Respect reduced motion preferences',
    ],
    guidelines: [
      {
        title: 'Color Contrast',
        description: 'Ensure text is readable for users with visual impairments.',
        do: [
          'Use 4.5:1 contrast ratio for normal text',
          'Use 3:1 contrast ratio for large text (18pt+)',
          'Use 3:1 contrast ratio for UI components',
          'Test with color blindness simulators',
        ],
        dont: [
          'Rely on color alone to convey information',
          'Use low-contrast placeholder text',
          'Use thin font weights with low contrast',
        ],
      },
      {
        title: 'Screen Readers',
        description: 'Make content accessible to VoiceOver users.',
        do: [
          'Add accessibility labels to all interactive elements',
          'Use semantic HTML elements',
          'Group related content with accessibility containers',
          'Provide alternative text for images',
        ],
        dont: [
          'Use images of text',
          'Create custom controls without accessibility',
          'Hide content from screen readers unless decorative',
        ],
      },
      {
        title: 'Dynamic Type',
        description: 'Support user-adjustable text sizes.',
        do: [
          'Use system text styles that scale',
          'Test at all Dynamic Type sizes',
          'Allow text to wrap instead of truncating',
          'Adjust layouts for larger text sizes',
        ],
        dont: [
          'Use fixed font sizes',
          'Truncate important information',
          'Break layouts at larger sizes',
        ],
      },
    ],
    higReferences: [
      'Human Interface Guidelines > Foundations > Accessibility',
      'Human Interface Guidelines > Accessibility > Color and Contrast',
      'Human Interface Guidelines > Accessibility > VoiceOver',
      'Human Interface Guidelines > Accessibility > Dynamic Type',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'React',
        code: `<button
  aria-label="Delete item"
  aria-describedby="delete-description"
>
  <TrashIcon />
</button>

<img
  src="chart.png"
  alt="Sales increased 25% in Q4"
/>`,
        description: 'React accessibility attributes',
      },
      {
        platform: 'SwiftUI',
        code: `Button(action: deleteItem) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete item")

Image("chart")
    .accessibilityLabel("Sales chart showing 25% increase")`,
        description: 'SwiftUI accessibility modifiers',
      },
    ];
  }

  return result;
}

function getButtonGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Buttons',
    principles: [
      'Buttons should look tappable/clickable',
      'Use system button styles when possible',
      'Provide clear visual feedback on interaction',
      'Minimum touch target is 44x44 points',
      'Use appropriate button styles for context',
    ],
    guidelines: [
      {
        title: 'Button Styles',
        description: 'Different button styles for different purposes.',
        do: [
          'Use filled buttons for primary actions',
          'Use tinted/gray buttons for secondary actions',
          'Use text buttons for tertiary actions',
          'Use destructive style for dangerous actions',
        ],
        dont: [
          'Use too many prominent buttons in one view',
          'Create custom buttons that look non-interactive',
          'Use different styles for the same action type',
        ],
      },
      {
        title: 'Button Feedback',
        description: 'Buttons need clear interaction feedback.',
        do: [
          'Scale down slightly on press (0.97)',
          'Use spring animation for release',
          'Show loading state for async actions',
          'Disable button during loading',
        ],
        dont: [
          'Have buttons with no press feedback',
          'Use harsh color changes on press',
          'Allow multiple taps during loading',
        ],
      },
    ],
    tokens: format === 'detailed' ? componentPatterns.buttons : undefined,
    higReferences: [
      'Human Interface Guidelines > Components > Buttons',
      'Human Interface Guidelines > Inputs > Buttons',
    ],
  };

  return result;
}

function getFormGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  return {
    topic: 'Forms',
    principles: [
      'Use clear labels for all form fields',
      'Provide immediate validation feedback',
      'Group related fields together',
      'Use appropriate keyboard types',
      'Make error states obvious but not alarming',
    ],
    guidelines: [
      {
        title: 'Form Layout',
        description: 'Organize forms for easy completion.',
        do: [
          'Use single-column layouts on mobile',
          'Group related fields with section headers',
          'Place labels above or beside inputs consistently',
          'Use inset grouped list style for iOS settings-like forms',
        ],
        dont: [
          'Create overly long forms without progress indication',
          'Mix inline and stacked labels',
          'Hide required field indicators',
        ],
      },
      {
        title: 'Input Fields',
        description: 'Style inputs consistently with system patterns.',
        do: [
          'Use 44pt minimum height for touch targets',
          'Show focus state with focus ring',
          'Use appropriate input types (email, phone, etc.)',
          'Provide clear placeholder text',
        ],
        dont: [
          'Use placeholder as the only label',
          'Style inputs to look non-editable',
          'Use custom keyboards when system keyboards work',
        ],
      },
    ],
    tokens: format === 'detailed' ? componentPatterns.inputs : undefined,
    higReferences: [
      'Human Interface Guidelines > Components > Text Fields',
      'Human Interface Guidelines > Patterns > Entering Data',
    ],
  };
}

function getModalGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  return {
    topic: 'Modals & Sheets',
    principles: [
      'Use sheets for supplementary content',
      'Use alerts for critical decisions',
      'Always provide a way to dismiss',
      'Dim background to focus attention',
      'Use appropriate sheet detents',
    ],
    guidelines: [
      {
        title: 'Sheets',
        description: 'iOS-style bottom sheets for content and actions.',
        do: [
          'Use medium detent (50%) for brief interactions',
          'Use large detent for complex content',
          'Include grabber for swipe dismissal',
          'Blur background content',
        ],
        dont: [
          'Overuse full-screen modals',
          'Nest sheets within sheets',
          'Block dismissal without reason',
        ],
      },
      {
        title: 'Alerts',
        description: 'Alerts for important decisions.',
        do: [
          'Use sparingly for critical decisions',
          'Keep message concise',
          'Put destructive action on the left',
          'Make safe action the default/prominent one',
        ],
        dont: [
          'Use alerts for non-critical information',
          'Include more than 3 buttons',
          'Make alerts dismissable by tapping outside',
        ],
      },
    ],
    tokens: format === 'detailed' ? componentPatterns.modals : undefined,
    higReferences: [
      'Human Interface Guidelines > Components > Sheets',
      'Human Interface Guidelines > Components > Alerts',
      'Human Interface Guidelines > Patterns > Modality',
    ],
  };
}

function getNavigationGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  return {
    topic: 'Navigation',
    principles: [
      'Navigation should be predictable',
      'Always provide a way back',
      'Show current location clearly',
      'Use standard navigation patterns',
      'Don\'t nest tab bars',
    ],
    guidelines: [
      {
        title: 'Tab Bar',
        description: 'Bottom tab bar for top-level navigation.',
        do: [
          'Use 3-5 tabs maximum',
          'Use SF Symbols for tab icons',
          'Keep tab labels short (1 word)',
          'Highlight selected tab with tint color',
        ],
        dont: [
          'Use more than 5 tabs',
          'Hide the tab bar on subpages',
          'Use tab bar for actions (use toolbar instead)',
        ],
      },
      {
        title: 'Navigation Bar',
        description: 'Top bar for hierarchical navigation.',
        do: [
          'Show back button for drill-down navigation',
          'Use large title for top-level screens',
          'Collapse to small title on scroll',
          'Use blur material for background',
        ],
        dont: [
          'Remove the back button',
          'Use custom back gestures',
          'Overcrowd the navigation bar',
        ],
      },
    ],
    tokens: format === 'detailed' ? componentPatterns.navigation : undefined,
    higReferences: [
      'Human Interface Guidelines > Components > Tab Bars',
      'Human Interface Guidelines > Components > Navigation Bars',
      'Human Interface Guidelines > Patterns > Navigation',
    ],
  };
}

function getDarkModeGuide(platform: string, includeExamples: boolean, format: string): StyleGuideResult {
  const result: StyleGuideResult = {
    topic: 'Dark Mode',
    principles: [
      'Support both light and dark appearance',
      'Use semantic colors that adapt automatically',
      'Dark mode is not just inverted colors',
      'Maintain visual hierarchy in both modes',
      'Test your app in both modes',
    ],
    guidelines: [
      {
        title: 'Color Adaptation',
        description: 'Colors need adjustment for dark mode.',
        do: [
          'Use semantic system colors',
          'Increase vibrancy of accent colors in dark mode',
          'Use darker shadows with higher opacity',
          'Reduce overall contrast slightly',
        ],
        dont: [
          'Use pure black (#000000) backgrounds',
          'Simply invert all colors',
          'Forget to update shadows for dark mode',
          'Use the same image assets without consideration',
        ],
      },
      {
        title: 'Implementation',
        description: 'How to implement dark mode correctly.',
        do: [
          'Use CSS custom properties with media query',
          'Use SwiftUI/UIKit dynamic colors',
          'Provide both light and dark image variants',
          'Test at night with dark mode enabled',
        ],
        dont: [
          'Force one mode or the other',
          'Ignore user system preference',
          'Use different layouts for each mode',
        ],
      },
    ],
    higReferences: [
      'Human Interface Guidelines > Foundations > Dark Mode',
      'Human Interface Guidelines > Color > Specifications',
    ],
  };

  if (includeExamples) {
    result.codeExamples = [
      {
        platform: 'CSS',
        code: `@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --background-secondary: #1C1C1E;
    --label-primary: #FFFFFF;
    --system-blue: #0A84FF;
  }
}`,
        description: 'CSS dark mode media query',
      },
      {
        platform: 'SwiftUI',
        code: `// Automatic adaptation
Color.primary // Adapts automatically
Color(.systemBackground) // System background

// Manual check
@Environment(\\.colorScheme) var colorScheme
if colorScheme == .dark { }`,
        description: 'SwiftUI dark mode handling',
      },
    ];
  }

  return result;
}

function getPrinciplesGuide(format: string): StyleGuideResult {
  return {
    topic: 'Design Principles',
    principles: [
      'Aesthetic Integrity - Design should complement app functionality',
      'Consistency - Use standard UI elements and patterns',
      'Direct Manipulation - Users should feel directly connected to content',
      'Feedback - Every action should have a clear response',
      'Metaphors - Use familiar concepts from the physical world',
      'User Control - Users should initiate and control actions',
    ],
    guidelines: [
      {
        title: 'Clarity',
        description: designPrinciples.visualDesign.clarity.description,
        do: designPrinciples.visualDesign.clarity.guidelines,
        dont: ['Use small, low-contrast text', 'Create cluttered layouts'],
      },
      {
        title: 'Deference',
        description: designPrinciples.visualDesign.deference.description,
        do: designPrinciples.visualDesign.deference.guidelines,
        dont: ['Let UI compete with content', 'Use heavy borders and bright chrome'],
      },
      {
        title: 'Depth',
        description: designPrinciples.visualDesign.depth.description,
        do: designPrinciples.visualDesign.depth.guidelines,
        dont: ['Create flat designs with no hierarchy', 'Use confusing layer ordering'],
      },
    ],
    tokens: format === 'detailed' ? designPrinciples : undefined,
    higReferences: [
      'Human Interface Guidelines > Foundations > Design Principles',
      'Human Interface Guidelines > Platforms > iOS > Interface Essentials',
    ],
  };
}
