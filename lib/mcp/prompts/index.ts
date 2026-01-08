export interface Prompt {
  name: string;
  description: string;
  arguments: PromptArgument[];
  getPrompt: (args: Record<string, string>) => string;
}

export interface PromptArgument {
  name: string;
  description: string;
  required: boolean;
}

export const reviewComponentPrompt: Prompt = {
  name: 'review_component',
  description: 'Review a UI component for Apple design compliance',
  arguments: [
    {
      name: 'componentCode',
      description: 'The component code to review',
      required: true,
    },
    {
      name: 'componentType',
      description: 'Type of component (button, card, modal, etc.)',
      required: true,
    },
    {
      name: 'platform',
      description: 'Target platform (ios, macos, web)',
      required: true,
    },
  ],
  getPrompt: (args) => `You are an Apple design expert reviewing a UI component for compliance with Human Interface Guidelines.

## Component Type
${args.componentType}

## Target Platform
${args.platform}

## Code to Review
\`\`\`
${args.componentCode}
\`\`\`

Please analyze this component and provide:

1. **Overall Apple Design Compliance Score** (0-100)
   - Consider visual design, interactions, and accessibility

2. **Visual Design Analysis**
   - Colors: Are system colors being used? Is there proper dark mode support?
   - Typography: Is the type scale correct? Are weights appropriate?
   - Spacing: Does it follow the 8pt grid? Are touch targets adequate?
   - Shadows/Depth: Are elevation levels appropriate?

3. **Interaction Design Analysis**
   - Feedback: Does it provide proper touch/hover feedback?
   - Animations: Are they smooth and purposeful?
   - Gestures: Are standard gestures respected?

4. **Accessibility Considerations**
   - Contrast ratios
   - Touch target sizes
   - Screen reader support
   - Reduced motion support

5. **Specific Improvements**
   For each issue found, provide:
   - Current code snippet
   - Suggested fix with code
   - Reference to relevant HIG section

6. **Positive Patterns**
   Highlight what the component does well

Focus on actionable, specific feedback that will make this component feel more "Apple-like."`,
};

export const createDesignSystemPrompt: Prompt = {
  name: 'create_design_system',
  description: 'Create a complete Apple-inspired design system for a project',
  arguments: [
    {
      name: 'projectType',
      description: 'Type of project (mobile app, web app, desktop app)',
      required: true,
    },
    {
      name: 'brandColors',
      description: 'Primary brand colors to incorporate (optional)',
      required: false,
    },
    {
      name: 'platforms',
      description: 'Target platforms (ios, macos, web)',
      required: true,
    },
  ],
  getPrompt: (args) => `You are creating an Apple-inspired design system for a ${args.projectType}.

## Target Platforms
${args.platforms}

${args.brandColors ? `## Brand Colors\n${args.brandColors}\n` : ''}

Please create a comprehensive design system including:

## 1. Color Tokens
- Primary/accent colors (incorporating brand colors if provided)
- System colors (following Apple's palette)
- Semantic colors (background, label, fill, separator)
- Light and dark mode variants

## 2. Typography Scale
- Font family stack (SF Pro for Apple feel)
- Complete type scale (largeTitle through caption)
- Font weights and when to use them
- Line heights and letter spacing

## 3. Spacing System
- Base unit (8pt grid)
- Spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- Component-specific spacing
- Touch target guidelines

## 4. Shadow/Elevation System
- 4-5 elevation levels
- Light and dark mode shadow values
- When to use each level

## 5. Animation System
- Spring configurations for different contexts
- Timing curves
- Reduced motion alternatives

## 6. Component Specifications
For each core component (Button, Card, Input, Toggle, Modal):
- Visual styling
- States (default, hover, pressed, disabled, focused)
- Spacing and sizing
- Accessibility requirements

## 7. Accessibility Guidelines
- Color contrast requirements
- Touch target minimums
- Screen reader considerations
- Dynamic type support

Provide all values in formats usable for ${args.platforms} development.
Ensure the design system creates a cohesive, Apple-like experience while accommodating the brand identity.`,
};

export const accessibilityAuditPrompt: Prompt = {
  name: 'accessibility_audit',
  description: 'Audit a design or component for Apple accessibility guidelines',
  arguments: [
    {
      name: 'code',
      description: 'The code to audit',
      required: true,
    },
    {
      name: 'platform',
      description: 'Target platform (ios, macos, web)',
      required: true,
    },
  ],
  getPrompt: (args) => `You are an accessibility expert auditing a ${args.platform} component for Apple accessibility compliance.

## Code to Audit
\`\`\`
${args.code}
\`\`\`

Please evaluate the following accessibility criteria:

## 1. Color Contrast
- Check text contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text)
- Verify UI component contrast (minimum 3:1)
- Ensure information isn't conveyed by color alone

## 2. Touch/Click Targets
- Minimum size: 44x44 points
- Adequate spacing between targets
- Visual affordance for interactivity

## 3. Screen Reader Compatibility
${args.platform === 'ios' || args.platform === 'macos' ?
`- VoiceOver labels for all interactive elements
- Proper accessibility traits/roles
- Logical reading order
- Accessibility containers for grouped content` :
`- ARIA labels and roles
- Semantic HTML elements
- Logical tab order
- Focus management`}

## 4. Dynamic Type Support
- Text scales with user preferences
- Layout adapts to larger text
- No text truncation of essential information

## 5. Reduced Motion Support
- Check for prefers-reduced-motion
- Alternative animations for motion-sensitive users
- No auto-playing animations

## 6. High Contrast Support
- Works with increased contrast settings
- Visual elements remain distinguishable

## Audit Results

For each issue found:
1. **Issue**: Description of the problem
2. **Impact**: High/Medium/Low and who is affected
3. **Current Code**: The problematic snippet
4. **Fix**: Corrected code with explanation
5. **Testing**: How to verify the fix

## Summary
- Total issues found by severity
- Priority order for fixes
- Quick wins vs. larger efforts`,
};

export const platformAdaptationPrompt: Prompt = {
  name: 'adapt_for_platform',
  description: 'Adapt a design from one platform to another following Apple guidelines',
  arguments: [
    {
      name: 'sourceCode',
      description: 'The source platform code',
      required: true,
    },
    {
      name: 'sourcePlatform',
      description: 'Source platform (ios, macos, web, react, swiftui)',
      required: true,
    },
    {
      name: 'targetPlatform',
      description: 'Target platform (ios, macos, web, react, swiftui)',
      required: true,
    },
  ],
  getPrompt: (args) => `You are adapting a UI component from ${args.sourcePlatform} to ${args.targetPlatform} following Apple design guidelines.

## Source Code (${args.sourcePlatform})
\`\`\`
${args.sourceCode}
\`\`\`

## Adaptation Guidelines

### Platform-Specific Considerations

${args.targetPlatform === 'ios' || args.targetPlatform === 'swiftui' ? `
**iOS/SwiftUI Target:**
- Use SwiftUI's built-in components and modifiers
- Apply .tint() for accent colors
- Use system materials for blur
- Follow iOS navigation patterns (NavigationStack, TabView)
- Support Dynamic Type
- Add accessibility modifiers
` : ''}

${args.targetPlatform === 'macos' ? `
**macOS Target:**
- Adapt for pointer interaction (hover states)
- Consider window management
- Use sidebar navigation pattern
- Support keyboard shortcuts
- Adjust sizing for desktop (smaller touch targets OK)
` : ''}

${args.targetPlatform === 'web' || args.targetPlatform === 'react' ? `
**Web/React Target:**
- Use CSS custom properties for theming
- Add keyboard navigation support
- Include ARIA attributes
- Use media queries for dark mode
- Support reduced motion preference
- Ensure touch target sizes on mobile web
` : ''}

## Adaptation Tasks

1. **Identify Platform Patterns**
   - List patterns specific to ${args.sourcePlatform}
   - Map to equivalent patterns on ${args.targetPlatform}

2. **Visual Adaptations**
   - Typography scale adjustments
   - Spacing modifications
   - Color token mapping
   - Shadow/elevation differences

3. **Interaction Adaptations**
   - Input method differences (touch vs pointer)
   - Gesture mappings
   - Feedback mechanisms

4. **Code Transformation**
   Provide the adapted code with:
   - Equivalent component structure
   - Platform-appropriate styling
   - Accessibility features
   - Animation adjustments

5. **Explanation**
   For each significant change, explain:
   - Why the adaptation was made
   - Platform convention being followed
   - Any trade-offs or alternatives

## Output

Provide the complete adapted code ready for use on ${args.targetPlatform}, maintaining visual consistency while respecting platform idioms.`,
};

export const allPrompts: Prompt[] = [
  reviewComponentPrompt,
  createDesignSystemPrompt,
  accessibilityAuditPrompt,
  platformAdaptationPrompt,
];

export function getPrompt(name: string): Prompt | undefined {
  return allPrompts.find(p => p.name === name);
}
