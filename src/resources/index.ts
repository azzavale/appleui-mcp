import { colorTokens, typographyTokens, spacingTokens, animationTokens, shadowTokens, materialTokens } from '@/lib/mcp-data';

export interface Resource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  getData: () => string;
}

// Color Resources
export const colorResources: Resource[] = [
  {
    uri: 'appleui://colors/system',
    name: 'Apple System Colors',
    description: 'Apple system colors with light and dark mode variants',
    mimeType: 'application/json',
    getData: () => JSON.stringify(colorTokens.system, null, 2),
  },
  {
    uri: 'appleui://colors/semantic',
    name: 'Apple Semantic Colors',
    description: 'Semantic colors for backgrounds, labels, fills, and separators',
    mimeType: 'application/json',
    getData: () => JSON.stringify(colorTokens.semantic, null, 2),
  },
  {
    uri: 'appleui://colors/gradients',
    name: 'Apple Gradient Presets',
    description: 'Pre-defined gradient color combinations',
    mimeType: 'application/json',
    getData: () => JSON.stringify(colorTokens.gradients, null, 2),
  },
  {
    uri: 'appleui://colors/all',
    name: 'Complete Color System',
    description: 'All Apple color tokens including system, semantic, and gradients',
    mimeType: 'application/json',
    getData: () => JSON.stringify(colorTokens, null, 2),
  },
];

// Typography Resources
export const typographyResources: Resource[] = [
  {
    uri: 'appleui://typography/ios',
    name: 'iOS Typography Scale',
    description: 'iOS typography scale with sizes, weights, and line heights',
    mimeType: 'application/json',
    getData: () => JSON.stringify({
      fontFamily: typographyTokens.fontFamily,
      scale: typographyTokens.ios,
      weights: typographyTokens.weights,
    }, null, 2),
  },
  {
    uri: 'appleui://typography/macos',
    name: 'macOS Typography Scale',
    description: 'macOS typography scale with sizes, weights, and line heights',
    mimeType: 'application/json',
    getData: () => JSON.stringify({
      fontFamily: typographyTokens.fontFamily,
      scale: typographyTokens.macos,
      weights: typographyTokens.weights,
    }, null, 2),
  },
  {
    uri: 'appleui://typography/web',
    name: 'Web Typography Scale',
    description: 'Web-optimized typography scale in pixels',
    mimeType: 'application/json',
    getData: () => JSON.stringify({
      fontFamily: typographyTokens.fontFamily,
      scale: typographyTokens.web,
      weights: typographyTokens.weights,
    }, null, 2),
  },
  {
    uri: 'appleui://typography/all',
    name: 'Complete Typography System',
    description: 'All typography tokens for all platforms',
    mimeType: 'application/json',
    getData: () => JSON.stringify(typographyTokens, null, 2),
  },
];

// Spacing Resources
export const spacingResources: Resource[] = [
  {
    uri: 'appleui://spacing',
    name: 'Apple Spacing System',
    description: '8pt grid spacing system with layout and component values',
    mimeType: 'application/json',
    getData: () => JSON.stringify(spacingTokens, null, 2),
  },
  {
    uri: 'appleui://spacing/scale',
    name: 'Spacing Scale',
    description: 'Base spacing scale values (xxs to xxxl)',
    mimeType: 'application/json',
    getData: () => JSON.stringify(spacingTokens.scale, null, 2),
  },
  {
    uri: 'appleui://spacing/components',
    name: 'Component Spacing',
    description: 'Spacing values for common UI components',
    mimeType: 'application/json',
    getData: () => JSON.stringify(spacingTokens.components, null, 2),
  },
];

// Animation Resources
export const animationResources: Resource[] = [
  {
    uri: 'appleui://animations',
    name: 'Apple Animation System',
    description: 'Spring animations, timing curves, and motion patterns',
    mimeType: 'application/json',
    getData: () => JSON.stringify(animationTokens, null, 2),
  },
  {
    uri: 'appleui://animations/springs',
    name: 'Spring Animations',
    description: 'Spring animation configurations for natural motion',
    mimeType: 'application/json',
    getData: () => JSON.stringify(animationTokens.springs, null, 2),
  },
  {
    uri: 'appleui://animations/curves',
    name: 'Bezier Curves',
    description: 'CSS cubic-bezier timing functions',
    mimeType: 'application/json',
    getData: () => JSON.stringify(animationTokens.bezierCurves, null, 2),
  },
  {
    uri: 'appleui://animations/patterns',
    name: 'Animation Patterns',
    description: 'Common UI animation patterns with timing',
    mimeType: 'application/json',
    getData: () => JSON.stringify(animationTokens.patterns, null, 2),
  },
];

// Shadow Resources
export const shadowResources: Resource[] = [
  {
    uri: 'appleui://shadows',
    name: 'Apple Shadow System',
    description: 'Elevation levels and shadow specifications',
    mimeType: 'application/json',
    getData: () => JSON.stringify(shadowTokens, null, 2),
  },
  {
    uri: 'appleui://shadows/css',
    name: 'CSS Shadow Values',
    description: 'Pre-computed CSS box-shadow values',
    mimeType: 'application/json',
    getData: () => JSON.stringify(shadowTokens.css, null, 2),
  },
];

// Material Resources
export const materialResources: Resource[] = [
  {
    uri: 'appleui://materials',
    name: 'Apple Materials',
    description: 'Blur and vibrancy material specifications',
    mimeType: 'application/json',
    getData: () => JSON.stringify(materialTokens, null, 2),
  },
  {
    uri: 'appleui://materials/css',
    name: 'CSS Material Values',
    description: 'CSS backdrop-filter values for materials',
    mimeType: 'application/json',
    getData: () => JSON.stringify(materialTokens.css, null, 2),
  },
];

// Combined resources export
export const allResources: Resource[] = [
  ...colorResources,
  ...typographyResources,
  ...spacingResources,
  ...animationResources,
  ...shadowResources,
  ...materialResources,
];

// Resource lookup function
export function getResource(uri: string): Resource | undefined {
  return allResources.find(r => r.uri === uri);
}

// List resources by category
export function listResources(category?: string): Resource[] {
  if (!category) return allResources;

  switch (category) {
    case 'colors':
      return colorResources;
    case 'typography':
      return typographyResources;
    case 'spacing':
      return spacingResources;
    case 'animations':
      return animationResources;
    case 'shadows':
      return shadowResources;
    case 'materials':
      return materialResources;
    default:
      return allResources;
  }
}
