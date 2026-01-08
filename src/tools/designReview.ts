import { z } from 'zod';
import { colorTokens, typographyTokens, spacingTokens, designPrinciples } from '../../lib/mcp-data';

export const designReviewSchema = z.object({
  code: z.string().describe('The code to analyze (CSS, React, SwiftUI, HTML, or Tailwind)'),
  codeType: z.enum(['css', 'react', 'swiftui', 'html', 'tailwind']).describe('Type of code'),
  platform: z.enum(['ios', 'macos', 'web', 'cross-platform']).describe('Target platform'),
  focusAreas: z.array(
    z.enum(['colors', 'typography', 'spacing', 'shadows', 'animations', 'layout', 'accessibility', 'navigation'])
  ).optional().describe('Specific areas to focus the review on'),
  strictMode: z.boolean().optional().default(false).describe('Enforce strict HIG compliance'),
});

export type DesignReviewInput = z.infer<typeof designReviewSchema>;

interface Issue {
  severity: 'critical' | 'warning' | 'suggestion';
  category: string;
  description: string;
  line?: number;
  currentCode?: string;
  suggestedFix: string;
  higReference?: string;
}

interface ReviewResult {
  overallScore: number;
  issues: Issue[];
  positives: string[];
  recommendations: string[];
}

export function reviewDesign(input: DesignReviewInput): ReviewResult {
  const issues: Issue[] = [];
  const positives: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  const { code, codeType, platform, focusAreas, strictMode } = input;
  const shouldCheck = (area: string) => !focusAreas || focusAreas.length === 0 || focusAreas.includes(area as any);

  // Color Analysis
  if (shouldCheck('colors')) {
    const colorIssues = analyzeColors(code, codeType);
    issues.push(...colorIssues);
    score -= colorIssues.filter(i => i.severity === 'critical').length * 15;
    score -= colorIssues.filter(i => i.severity === 'warning').length * 5;
  }

  // Typography Analysis
  if (shouldCheck('typography')) {
    const typographyIssues = analyzeTypography(code, codeType);
    issues.push(...typographyIssues);
    score -= typographyIssues.filter(i => i.severity === 'critical').length * 15;
    score -= typographyIssues.filter(i => i.severity === 'warning').length * 5;
  }

  // Spacing Analysis
  if (shouldCheck('spacing')) {
    const spacingIssues = analyzeSpacing(code, codeType);
    issues.push(...spacingIssues);
    score -= spacingIssues.filter(i => i.severity === 'warning').length * 3;
  }

  // Accessibility Analysis
  if (shouldCheck('accessibility')) {
    const a11yIssues = analyzeAccessibility(code, codeType, platform);
    issues.push(...a11yIssues);
    score -= a11yIssues.filter(i => i.severity === 'critical').length * 20;
    score -= a11yIssues.filter(i => i.severity === 'warning').length * 8;
  }

  // Detect positive patterns
  positives.push(...detectPositivePatterns(code, codeType));

  // Generate recommendations
  recommendations.push(...generateRecommendations(code, codeType, platform, strictMode));

  return {
    overallScore: Math.max(0, Math.min(100, score)),
    issues,
    positives,
    recommendations,
  };
}

function analyzeColors(code: string, codeType: string): Issue[] {
  const issues: Issue[] = [];

  // Check for hardcoded colors instead of system colors
  const hardcodedColorPatterns = [
    { pattern: /#[0-9a-fA-F]{6}\b/, description: 'Hardcoded hex color' },
    { pattern: /rgb\(\s*\d+/, description: 'Hardcoded RGB color' },
    { pattern: /rgba\(\s*\d+/, description: 'Hardcoded RGBA color' },
  ];

  for (const { pattern, description } of hardcodedColorPatterns) {
    const matches = code.match(new RegExp(pattern, 'g'));
    if (matches) {
      // Check if these are Apple system colors
      const nonSystemColors = matches.filter(match => {
        const isSystemColor = Object.values(colorTokens.system).some(
          c => match.toLowerCase() === c.light.toLowerCase() || match.toLowerCase() === c.dark.toLowerCase()
        );
        return !isSystemColor;
      });

      if (nonSystemColors.length > 0) {
        issues.push({
          severity: 'warning',
          category: 'colors',
          description: `Found ${nonSystemColors.length} hardcoded color(s). Consider using Apple system colors for consistency and dark mode support.`,
          currentCode: nonSystemColors.slice(0, 3).join(', '),
          suggestedFix: 'Use system colors like var(--system-blue) or Color.blue in SwiftUI',
          higReference: 'Human Interface Guidelines > Color',
        });
      }
    }
  }

  // Check for pure black/white (too harsh)
  if (code.includes('#000000') || code.includes('#ffffff') || code.includes('#FFFFFF')) {
    issues.push({
      severity: 'suggestion',
      category: 'colors',
      description: 'Pure black (#000000) or pure white (#FFFFFF) detected. Apple recommends softer alternatives.',
      suggestedFix: 'Use semantic colors like background.primary or label.primary for automatic dark mode handling',
      higReference: 'Human Interface Guidelines > Color > Semantic Colors',
    });
  }

  return issues;
}

function analyzeTypography(code: string, codeType: string): Issue[] {
  const issues: Issue[] = [];

  // Check for small font sizes
  const fontSizePattern = /font-size:\s*(\d+)px/g;
  let match;
  while ((match = fontSizePattern.exec(code)) !== null) {
    const size = parseInt(match[1]);
    if (size < 11) {
      issues.push({
        severity: 'critical',
        category: 'typography',
        description: `Font size ${size}px is too small. Minimum readable size is 11px.`,
        currentCode: match[0],
        suggestedFix: 'Use at least 11px for caption text, 17px for body text',
        higReference: 'Human Interface Guidelines > Typography',
      });
    } else if (size < 15 && size > 11) {
      issues.push({
        severity: 'suggestion',
        category: 'typography',
        description: `Font size ${size}px is quite small. Consider 17px for body text.`,
        currentCode: match[0],
        suggestedFix: 'Use 17px for body text, 13px for footnotes, 11-12px for captions',
        higReference: 'Human Interface Guidelines > Typography',
      });
    }
  }

  // Check for non-system fonts
  const fontFamilyPattern = /font-family:\s*([^;]+)/g;
  while ((match = fontFamilyPattern.exec(code)) !== null) {
    const fontFamily = match[1].toLowerCase();
    if (!fontFamily.includes('-apple-system') &&
        !fontFamily.includes('sf pro') &&
        !fontFamily.includes('system-ui')) {
      issues.push({
        severity: 'warning',
        category: 'typography',
        description: 'Non-system font detected. System fonts ensure consistency with iOS/macOS.',
        currentCode: match[0],
        suggestedFix: `Use font-family: ${typographyTokens.fontFamily.system}`,
        higReference: 'Human Interface Guidelines > Typography > System Fonts',
      });
    }
  }

  // Check for light font weights
  const lightWeightPatterns = ['font-weight: 100', 'font-weight: 200', 'font-weight: 300', 'ultralight', 'thin', 'light'];
  for (const pattern of lightWeightPatterns) {
    if (code.toLowerCase().includes(pattern)) {
      issues.push({
        severity: 'warning',
        category: 'typography',
        description: 'Light font weight detected. Light weights can be hard to read.',
        suggestedFix: 'Use regular (400), medium (500), or semibold (600) for better readability',
        higReference: 'Human Interface Guidelines > Typography > Font Weight',
      });
      break;
    }
  }

  return issues;
}

function analyzeSpacing(code: string, codeType: string): Issue[] {
  const issues: Issue[] = [];

  // Check for non-8pt-grid spacing
  const spacingPattern = /(?:padding|margin|gap):\s*(\d+)px/g;
  const oddSpacings: number[] = [];
  let match;

  while ((match = spacingPattern.exec(code)) !== null) {
    const value = parseInt(match[1]);
    if (value > 0 && value % 4 !== 0) {
      oddSpacings.push(value);
    }
  }

  if (oddSpacings.length > 0) {
    issues.push({
      severity: 'suggestion',
      category: 'spacing',
      description: `Found spacing values not on the 4pt/8pt grid: ${[...new Set(oddSpacings)].join(', ')}px`,
      suggestedFix: 'Use multiples of 4 or 8 for consistent spacing (4, 8, 12, 16, 24, 32, 48, 64)',
      higReference: 'Human Interface Guidelines > Layout > Spacing',
    });
  }

  // Check for very small touch targets
  const sizePattern = /(?:width|height|min-width|min-height):\s*(\d+)px/g;
  const smallSizes: string[] = [];

  while ((match = sizePattern.exec(code)) !== null) {
    const value = parseInt(match[1]);
    if (value > 0 && value < 44) {
      smallSizes.push(match[0]);
    }
  }

  if (smallSizes.length > 0) {
    issues.push({
      severity: 'warning',
      category: 'spacing',
      description: `Potential small touch targets detected. Minimum should be 44x44 points.`,
      currentCode: smallSizes.slice(0, 3).join(', '),
      suggestedFix: 'Ensure interactive elements are at least 44x44 points',
      higReference: 'Human Interface Guidelines > Accessibility > Touch Targets',
    });
  }

  return issues;
}

function analyzeAccessibility(code: string, codeType: string, platform: string): Issue[] {
  const issues: Issue[] = [];

  // Check for missing accessibility labels (React)
  if (codeType === 'react') {
    if (code.includes('<button') && !code.includes('aria-label') && !code.includes('aria-labelledby')) {
      issues.push({
        severity: 'warning',
        category: 'accessibility',
        description: 'Button elements may be missing accessibility labels.',
        suggestedFix: 'Add aria-label or aria-labelledby to buttons without visible text',
        higReference: 'Human Interface Guidelines > Accessibility > Labels',
      });
    }

    if (code.includes('<img') && !code.includes('alt=')) {
      issues.push({
        severity: 'critical',
        category: 'accessibility',
        description: 'Image elements missing alt text.',
        suggestedFix: 'Add alt="" for decorative images, descriptive alt text for informative images',
        higReference: 'Human Interface Guidelines > Accessibility > Images',
      });
    }
  }

  // Check for SwiftUI accessibility
  if (codeType === 'swiftui') {
    if ((code.includes('Button') || code.includes('Image')) &&
        !code.includes('.accessibilityLabel') &&
        !code.includes('accessibilityLabel')) {
      issues.push({
        severity: 'warning',
        category: 'accessibility',
        description: 'Consider adding accessibility labels for VoiceOver support.',
        suggestedFix: 'Add .accessibilityLabel("Description") to interactive or informative elements',
        higReference: 'Human Interface Guidelines > Accessibility > VoiceOver',
      });
    }
  }

  // Check for reduced motion support
  if (!code.includes('prefers-reduced-motion') &&
      !code.includes('reducedMotion') &&
      (code.includes('animation') || code.includes('transition') || code.includes('.animation'))) {
    issues.push({
      severity: 'suggestion',
      category: 'accessibility',
      description: 'Animations detected without reduced motion check.',
      suggestedFix: 'Respect prefers-reduced-motion media query or UIAccessibility.isReduceMotionEnabled',
      higReference: 'Human Interface Guidelines > Accessibility > Motion',
    });
  }

  return issues;
}

function detectPositivePatterns(code: string, codeType: string): string[] {
  const positives: string[] = [];

  // System fonts
  if (code.includes('-apple-system') || code.includes('SF Pro') || code.includes('system-ui')) {
    positives.push('Uses Apple system fonts for native feel');
  }

  // System colors
  if (code.includes('--system-') || code.includes('Color.blue') || code.includes('Color.primary')) {
    positives.push('Uses Apple system colors');
  }

  // Dark mode support
  if (code.includes('prefers-color-scheme') || code.includes('@Environment(\\.colorScheme)') || code.includes('colorScheme')) {
    positives.push('Supports dark mode');
  }

  // Blur/Material
  if (code.includes('backdrop-filter') || code.includes('.blur') || code.includes('Material')) {
    positives.push('Uses Apple-style blur/material effects');
  }

  // Semantic sizing
  if (code.includes('44px') || code.includes('44pt') || code.includes('minHeight: 44')) {
    positives.push('Uses proper touch target sizing (44pt)');
  }

  // Safe area
  if (code.includes('safe-area') || code.includes('safeAreaInset') || code.includes('env(safe-area')) {
    positives.push('Respects safe area insets');
  }

  // Spring animations
  if (code.includes('.spring') || code.includes('spring(') || code.includes('withAnimation(.spring')) {
    positives.push('Uses spring animations for natural feel');
  }

  // Accessibility
  if (code.includes('accessibilityLabel') || code.includes('aria-label') || code.includes('VoiceOver')) {
    positives.push('Includes accessibility support');
  }

  return positives;
}

function generateRecommendations(code: string, codeType: string, platform: string, strictMode: boolean): string[] {
  const recommendations: string[] = [];

  // General recommendations
  if (!code.includes('prefers-color-scheme') && !code.includes('colorScheme') && codeType !== 'swiftui') {
    recommendations.push('Add dark mode support using @media (prefers-color-scheme: dark)');
  }

  if (!code.includes('backdrop-filter') && !code.includes('.blur') && !code.includes('Material')) {
    recommendations.push('Consider using blur/material effects for depth and hierarchy');
  }

  if (!code.includes('border-radius') && !code.includes('cornerRadius') && !code.includes('rounded')) {
    recommendations.push('Use rounded corners (10-16px radius) for Apple aesthetic');
  }

  // Platform-specific recommendations
  if (platform === 'ios' && codeType === 'react') {
    recommendations.push('Consider using iOS-specific patterns like sheets, tab bars, and navigation bars');
  }

  if (platform === 'web') {
    recommendations.push('Use -webkit-font-smoothing: antialiased for crisp text rendering');
    recommendations.push('Consider using SF Pro font from Apple for authentic Apple feel');
  }

  // Strict mode additional checks
  if (strictMode) {
    recommendations.push('Audit all colors against Apple HIG color specifications');
    recommendations.push('Verify all spacing uses the 8pt grid system');
    recommendations.push('Ensure all interactive elements have proper feedback states');
  }

  return recommendations;
}
