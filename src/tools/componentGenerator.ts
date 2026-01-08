import { z } from 'zod';
import { colorTokens, typographyTokens, spacingTokens, animationTokens, shadowTokens, materialTokens } from '../../lib/mcp-data/index';

export const componentGeneratorSchema = z.object({
  componentType: z.enum([
    // Original 18 components
    'button', 'card', 'modal', 'navigation-bar', 'tab-bar',
    'sidebar', 'list', 'form-input', 'toggle', 'slider',
    'alert', 'sheet', 'menu', 'toolbar', 'search-bar',
    'segmented-control', 'stepper', 'picker',
    // New 12 components
    'avatar', 'badge', 'tooltip', 'checkbox', 'radio-group',
    'textarea', 'progress-ring', 'skeleton', 'toast',
    'accordion', 'divider', 'breadcrumb'
  ]).describe('Type of component to generate'),
  platform: z.enum(['react', 'swiftui', 'react-native', 'tailwind', 'css']).describe('Target platform/framework'),
  variant: z.enum(['default', 'prominent', 'subtle', 'destructive']).optional().default('default').describe('Visual variant'),
  darkModeSupport: z.boolean().optional().default(true).describe('Include dark mode styles'),
  includeAnimations: z.boolean().optional().default(true).describe('Include Apple-style animations'),
  accessibilityOptions: z.object({
    reducedMotion: z.boolean().optional(),
    highContrast: z.boolean().optional(),
    dynamicType: z.boolean().optional(),
  }).optional(),
  customizations: z.object({
    primaryColor: z.string().optional(),
    roundedCorners: z.enum(['none', 'small', 'medium', 'large', 'full']).optional(),
    useBlur: z.boolean().optional(),
    shadowLevel: z.number().min(0).max(4).optional(),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  }).optional(),
});

export type ComponentGeneratorInput = z.infer<typeof componentGeneratorSchema>;

interface GeneratedComponent {
  code: string;
  styles?: string;
  usage: string;
  tokens: {
    colors: string[];
    spacing: string[];
    typography: string[];
  };
  notes: string[];
}

export function generateComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType, platform } = input;

  switch (platform) {
    case 'react':
      return generateReactComponent(input);
    case 'swiftui':
      return generateSwiftUIComponent(input);
    case 'tailwind':
      return generateTailwindComponent(input);
    case 'css':
      return generateCSSComponent(input);
    case 'react-native':
      return generateReactNativeComponent(input);
    default:
      return generateReactComponent(input);
  }
}

function generateReactComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType, variant, darkModeSupport, includeAnimations, customizations } = input;

  const cornerRadius = customizations?.roundedCorners === 'small' ? '6px' :
                       customizations?.roundedCorners === 'medium' ? '10px' :
                       customizations?.roundedCorners === 'large' ? '16px' :
                       customizations?.roundedCorners === 'full' ? '9999px' : '12px';

  const shadowLevel = customizations?.shadowLevel ?? 1;
  const shadow = shadowTokens.css.light[`level${shadowLevel}` as keyof typeof shadowTokens.css.light];

  const size = customizations?.size || 'md';

  switch (componentType) {
    case 'button':
      return generateReactButton(variant, cornerRadius, shadow, includeAnimations, darkModeSupport);
    case 'card':
      return generateReactCard(cornerRadius, shadow, customizations?.useBlur, darkModeSupport);
    case 'modal':
    case 'sheet':
      return generateReactSheet(darkModeSupport);
    case 'form-input':
      return generateReactInput(darkModeSupport);
    case 'toggle':
      return generateReactToggle(darkModeSupport);
    case 'search-bar':
      return generateReactSearchBar(darkModeSupport);
    // New components
    case 'avatar':
      return generateReactAvatar(size, darkModeSupport);
    case 'badge':
      return generateReactBadge(variant, darkModeSupport);
    case 'tooltip':
      return generateReactTooltip(darkModeSupport);
    case 'checkbox':
      return generateReactCheckbox(darkModeSupport);
    case 'radio-group':
      return generateReactRadioGroup(darkModeSupport);
    case 'textarea':
      return generateReactTextarea(darkModeSupport);
    case 'progress-ring':
      return generateReactProgressRing(size, darkModeSupport);
    case 'skeleton':
      return generateReactSkeleton(darkModeSupport);
    case 'toast':
      return generateReactToast(variant, darkModeSupport);
    case 'accordion':
      return generateReactAccordion(darkModeSupport);
    case 'divider':
      return generateReactDivider(darkModeSupport);
    case 'breadcrumb':
      return generateReactBreadcrumb(darkModeSupport);
    default:
      return generateReactButton(variant, cornerRadius, shadow, includeAnimations, darkModeSupport);
  }
}

function generateReactButton(
  variant: string = 'default',
  cornerRadius: string,
  shadow: string,
  includeAnimations: boolean = true,
  darkModeSupport: boolean = true
): GeneratedComponent {
  const variantStyles = {
    default: { bg: '#007AFF', bgDark: '#0A84FF', text: '#FFFFFF' },
    prominent: { bg: '#007AFF', bgDark: '#0A84FF', text: '#FFFFFF' },
    subtle: { bg: 'rgba(120, 120, 128, 0.12)', bgDark: 'rgba(120, 120, 128, 0.24)', text: '#007AFF' },
    destructive: { bg: '#FF3B30', bgDark: '#FF453A', text: '#FFFFFF' },
  };

  const style = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;

  const code = `import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'prominent' | 'subtle' | 'destructive';
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = '${variant}',
  disabled = false,
  fullWidth = false
}: ButtonProps) {
  return (
    <button
      className={\`\${styles.button} \${styles[variant]} \${fullWidth ? styles.fullWidth : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`;

  const styles = `.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  border: none;
  border-radius: ${cornerRadius};
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  ${includeAnimations ? `transition: all 0.2s ${animationTokens.bezierCurves.appleEase};` : ''}
  -webkit-font-smoothing: antialiased;
}

.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

${includeAnimations ? `.button:active {
  transform: scale(0.97);
}` : ''}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.default, .prominent {
  background-color: ${style.bg};
  color: ${style.text};
}

.default:hover:not(:disabled), .prominent:hover:not(:disabled) {
  background-color: ${style.bg}dd;
}

.subtle {
  background-color: rgba(120, 120, 128, 0.12);
  color: #007AFF;
}

.subtle:hover:not(:disabled) {
  background-color: rgba(120, 120, 128, 0.2);
}

.destructive {
  background-color: #FF3B30;
  color: white;
}

.destructive:hover:not(:disabled) {
  background-color: #FF3B30dd;
}

.fullWidth {
  width: 100%;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .default, .prominent {
    background-color: #0A84FF;
  }

  .subtle {
    background-color: rgba(120, 120, 128, 0.24);
    color: #0A84FF;
  }

  .destructive {
    background-color: #FF453A;
  }
}` : ''}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }

  .button:active {
    transform: none;
  }
}`;

  return {
    code,
    styles,
    usage: `<Button variant="${variant}" onClick={() => console.log('clicked')}>
  Click me
</Button>`,
    tokens: {
      colors: ['systemBlue (#007AFF)', 'systemRed (#FF3B30)'],
      spacing: ['padding: 12px 20px', 'min-height: 44px'],
      typography: ['fontSize: 17px', 'fontWeight: 600'],
    },
    notes: [
      'Uses SF Pro system font stack',
      'Minimum 44px touch target',
      'Includes focus ring for accessibility',
      'Supports reduced motion',
      darkModeSupport ? 'Automatically adapts to dark mode' : '',
    ].filter(Boolean),
  };
}

function generateReactCard(
  cornerRadius: string,
  shadow: string,
  useBlur: boolean = false,
  darkModeSupport: boolean = true
): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  className = '',
  padding = 'medium'
}: CardProps) {
  return (
    <div className={\`\${styles.card} \${styles[padding]} \${className}\`}>
      {children}
    </div>
  );
}`;

  const blurStyles = useBlur ? `
  backdrop-filter: blur(30px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.8);` : `
  background-color: #FFFFFF;`;

  const blurStylesDark = useBlur ? `
    backdrop-filter: blur(30px) saturate(180%);
    background-color: rgba(28, 28, 30, 0.75);` : `
    background-color: #1C1C1E;`;

  const styles = `.card {
  border-radius: ${cornerRadius};
  box-shadow: ${shadow};${blurStyles}
}

.none { padding: 0; }
.small { padding: 8px; }
.medium { padding: 16px; }
.large { padding: 24px; }

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .card {${blurStylesDark}
    box-shadow: ${shadowTokens.css.dark.level1};
  }
}` : ''}`;

  return {
    code,
    styles,
    usage: `<Card padding="medium">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>`,
    tokens: {
      colors: ['background.secondary (#F2F2F7)'],
      spacing: ['padding: 16px', 'border-radius: 12px'],
      typography: [],
    },
    notes: [
      'Uses Apple-style rounded corners',
      'Subtle shadow for depth',
      useBlur ? 'Includes blur material effect' : '',
      darkModeSupport ? 'Adapts to dark mode' : '',
    ].filter(Boolean),
  };
}

function generateReactSheet(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React, { useEffect } from 'react';
import styles from './Sheet.module.css';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'medium' | 'large' | 'fullscreen';
}

export function Sheet({
  isOpen,
  onClose,
  children,
  size = 'medium'
}: SheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={\`\${styles.sheet} \${styles[size]}\`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.grabber} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}`;

  const stylesCode = `.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ${animationTokens.bezierCurves.appleEase};
}

.sheet {
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  border-radius: 12px 12px 0 0;
  backdrop-filter: blur(40px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.85);
  animation: slideUp 0.5s ${animationTokens.bezierCurves.springLike};
}

.medium { max-height: 50vh; }
.large { max-height: 95vh; }
.fullscreen { max-height: 100vh; border-radius: 0; }

.grabber {
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  background-color: rgba(60, 60, 67, 0.3);
  margin: 8px auto 16px;
}

.content {
  padding: 0 16px 34px;
  overflow-y: auto;
  max-height: calc(100% - 40px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .sheet {
    background-color: rgba(28, 28, 30, 0.8);
  }

  .grabber {
    background-color: rgba(235, 235, 245, 0.3);
  }
}` : ''}

@media (prefers-reduced-motion: reduce) {
  .overlay, .sheet {
    animation: none;
  }
}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
<Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="medium">
  <h2>Sheet Content</h2>
  <p>Your content here</p>
</Sheet>`,
    tokens: {
      colors: ['overlay: rgba(0, 0, 0, 0.4)', 'material: thick'],
      spacing: ['padding: 16px', 'bottom safe area: 34px'],
      typography: [],
    },
    notes: [
      'iOS-style bottom sheet with grabber',
      'Uses blur material effect',
      'Spring animation for natural feel',
      'Respects reduced motion preference',
    ],
  };
}

function generateReactInput(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  disabled?: boolean;
}

export function Input({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  error,
  disabled = false,
}: InputProps) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={\`\${styles.input} \${error ? styles.error : ''}\`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}`;

  const stylesCode = `.container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 15px;
  font-weight: 500;
  color: #000000;
}

.input {
  min-height: 44px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background-color: rgba(118, 118, 128, 0.12);
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
  outline: none;
  transition: box-shadow 0.2s ${animationTokens.bezierCurves.appleEase};
}

.input::placeholder {
  color: rgba(60, 60, 67, 0.3);
}

.input:focus {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

.input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.error {
  box-shadow: 0 0 0 2px #FF3B30;
}

.errorText {
  font-size: 13px;
  color: #FF3B30;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .label {
    color: #FFFFFF;
  }

  .input {
    background-color: rgba(118, 118, 128, 0.24);
    color: #FFFFFF;
  }

  .input::placeholder {
    color: rgba(235, 235, 245, 0.3);
  }

  .error {
    box-shadow: 0 0 0 2px #FF453A;
  }

  .errorText {
    color: #FF453A;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [email, setEmail] = useState('');

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  placeholder="Enter your email"
/>`,
    tokens: {
      colors: ['fill.tertiary', 'label.primary', 'systemRed'],
      spacing: ['padding: 12px 16px', 'min-height: 44px', 'border-radius: 10px'],
      typography: ['fontSize: 17px (input)', 'fontSize: 15px (label)'],
    },
    notes: [
      '44px minimum touch target',
      'Focus ring for accessibility',
      'Error state with red border',
    ],
  };
}

function generateReactToggle(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label
}: ToggleProps) {
  return (
    <label className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={\`\${styles.toggle} \${checked ? styles.checked : ''}\`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
}`;

  const stylesCode = `.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
}

.toggle {
  position: relative;
  width: 51px;
  height: 31px;
  border: none;
  border-radius: 15.5px;
  background-color: rgba(120, 120, 128, 0.16);
  cursor: pointer;
  transition: background-color 0.2s ${animationTokens.bezierCurves.appleEase};
}

.toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

.toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.checked {
  background-color: #34C759;
}

.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background-color: #FFFFFF;
  box-shadow: ${shadowTokens.css.light.level2};
  transition: transform 0.2s ${animationTokens.bezierCurves.springLike};
}

.checked .thumb {
  transform: translateX(20px);
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .label {
    color: #FFFFFF;
  }

  .toggle {
    background-color: rgba(120, 120, 128, 0.32);
  }

  .checked {
    background-color: #30D158;
  }
}` : ''}

@media (prefers-reduced-motion: reduce) {
  .toggle, .thumb {
    transition: none;
  }
}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [isEnabled, setIsEnabled] = useState(false);

<Toggle
  label="Enable notifications"
  checked={isEnabled}
  onChange={setIsEnabled}
/>`,
    tokens: {
      colors: ['systemGreen (#34C759)', 'fill.secondary'],
      spacing: ['width: 51px', 'height: 31px', 'thumb: 27px'],
      typography: ['fontSize: 17px'],
    },
    notes: [
      'Exact iOS toggle dimensions',
      'Uses role="switch" for accessibility',
      'Spring animation for thumb movement',
    ],
  };
}

function generateReactSearchBar(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onClear,
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={styles.container}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button className={styles.clearButton} onClick={handleClear} aria-label="Clear search">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      )}
    </div>
  );
}`;

  const stylesCode = `.container {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 12px;
  width: 17px;
  height: 17px;
  color: rgba(60, 60, 67, 0.6);
  pointer-events: none;
}

.input {
  width: 100%;
  height: 36px;
  padding: 8px 36px;
  border: none;
  border-radius: 10px;
  background-color: rgba(118, 118, 128, 0.12);
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
  outline: none;
}

.input::placeholder {
  color: rgba(60, 60, 67, 0.6);
}

.input:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.4);
}

.clearButton {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: rgba(60, 60, 67, 0.3);
  cursor: pointer;
}

.clearButton svg {
  width: 18px;
  height: 18px;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .icon {
    color: rgba(235, 235, 245, 0.6);
  }

  .input {
    background-color: rgba(118, 118, 128, 0.24);
    color: #FFFFFF;
  }

  .input::placeholder {
    color: rgba(235, 235, 245, 0.6);
  }

  .clearButton {
    color: rgba(235, 235, 245, 0.3);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [query, setQuery] = useState('');

<SearchBar
  value={query}
  onChange={setQuery}
  placeholder="Search..."
/>`,
    tokens: {
      colors: ['fill.tertiary', 'label.secondary'],
      spacing: ['height: 36px', 'border-radius: 10px', 'padding: 8px 36px'],
      typography: ['fontSize: 17px'],
    },
    notes: [
      'iOS-style search bar',
      'Includes search icon and clear button',
      'Uses native search input for keyboard optimization',
    ],
  };
}

function generateSwiftUIComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType, variant } = input;

  switch (componentType) {
    case 'button':
      return generateSwiftUIButton(variant);
    case 'card':
      return generateSwiftUICard();
    default:
      return generateSwiftUIButton(variant);
  }
}

function generateSwiftUIButton(variant: string = 'default'): GeneratedComponent {
  const code = `import SwiftUI

struct AppleButton: View {
    let title: String
    let action: () -> Void
    var variant: ButtonVariant = .primary

    enum ButtonVariant {
        case primary
        case secondary
        case destructive

        var backgroundColor: Color {
            switch self {
            case .primary: return .blue
            case .secondary: return Color(.systemGray5)
            case .destructive: return .red
            }
        }

        var foregroundColor: Color {
            switch self {
            case .primary, .destructive: return .white
            case .secondary: return .primary
            }
        }
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.body.weight(.semibold))
                .frame(maxWidth: .infinity)
                .frame(minHeight: 44)
        }
        .buttonStyle(AppleButtonStyle(variant: variant))
    }
}

struct AppleButtonStyle: ButtonStyle {
    let variant: AppleButton.ButtonVariant

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(variant.foregroundColor)
            .background(variant.backgroundColor)
            .cornerRadius(12)
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}`;

  return {
    code,
    usage: `AppleButton(title: "Continue", action: { print("Tapped") })
    .padding(.horizontal)

AppleButton(title: "Delete", action: { }, variant: .destructive)
    .padding(.horizontal)`,
    tokens: {
      colors: ['Color.blue', 'Color.red', 'Color(.systemGray5)'],
      spacing: ['minHeight: 44', 'cornerRadius: 12'],
      typography: ['.body.weight(.semibold)'],
    },
    notes: [
      'Uses SwiftUI spring animation',
      'Minimum 44pt touch target',
      'Supports primary, secondary, and destructive variants',
    ],
  };
}

function generateSwiftUICard(): GeneratedComponent {
  const code = `import SwiftUI

struct AppleCard<Content: View>: View {
    let content: Content
    var padding: CGFloat = 16
    var useMaterial: Bool = false

    init(padding: CGFloat = 16, useMaterial: Bool = false, @ViewBuilder content: () -> Content) {
        self.content = content()
        self.padding = padding
        self.useMaterial = useMaterial
    }

    var body: some View {
        content
            .padding(padding)
            .background(cardBackground)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.12), radius: 3, x: 0, y: 1)
    }

    @ViewBuilder
    private var cardBackground: some View {
        if useMaterial {
            RoundedRectangle(cornerRadius: 12)
                .fill(.regularMaterial)
        } else {
            Color(.secondarySystemBackground)
        }
    }
}`;

  return {
    code,
    usage: `AppleCard {
    VStack(alignment: .leading, spacing: 8) {
        Text("Card Title")
            .font(.headline)
        Text("Card description goes here")
            .font(.body)
            .foregroundColor(.secondary)
    }
}

// With blur material
AppleCard(useMaterial: true) {
    Text("Blur background")
}`,
    tokens: {
      colors: ['Color(.secondarySystemBackground)', '.regularMaterial'],
      spacing: ['padding: 16', 'cornerRadius: 12'],
      typography: ['.headline', '.body'],
    },
    notes: [
      'Uses system background colors',
      'Optional blur material effect',
      'Subtle shadow for depth',
    ],
  };
}

function generateTailwindComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType, variant, darkModeSupport } = input;

  switch (componentType) {
    case 'button':
      return generateTailwindButton(variant, darkModeSupport);
    case 'card':
      return generateTailwindCard(darkModeSupport);
    default:
      return generateTailwindButton(variant, darkModeSupport);
  }
}

function generateTailwindButton(variant: string = 'default', darkModeSupport: boolean = true): GeneratedComponent {
  const darkClasses = darkModeSupport ? 'dark:bg-blue-500 dark:hover:bg-blue-400' : '';
  const code = `interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const variants = {
    primary: \`bg-blue-500 hover:bg-blue-600 text-white ${darkClasses}\`,
    secondary: \`bg-gray-100 hover:bg-gray-200 text-blue-500 dark:bg-gray-800 dark:text-blue-400\`,
    destructive: \`bg-red-500 hover:bg-red-600 text-white dark:bg-red-600\`,
  };

  return (
    <button
      onClick={onClick}
      className={\`
        inline-flex items-center justify-center
        min-h-[44px] px-5 py-3
        rounded-xl
        font-semibold text-[17px]
        transition-all duration-200 ease-out
        active:scale-[0.97]
        focus:outline-none focus:ring-4 focus:ring-blue-500/40
        disabled:opacity-40 disabled:cursor-not-allowed
        motion-reduce:transition-none motion-reduce:active:scale-100
        \${variants[variant]}
      \`}
    >
      {children}
    </button>
  );
}`;

  return {
    code,
    usage: `<Button variant="primary" onClick={() => console.log('clicked')}>
  Continue
</Button>`,
    tokens: {
      colors: ['blue-500 (systemBlue)', 'red-500 (systemRed)'],
      spacing: ['min-h-[44px]', 'px-5 py-3', 'rounded-xl'],
      typography: ['text-[17px]', 'font-semibold'],
    },
    notes: [
      'Uses Tailwind arbitrary values for Apple-exact sizing',
      'Includes motion-reduce for accessibility',
      'Focus ring for keyboard navigation',
    ],
  };
}

function generateTailwindCard(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={\`
        p-4 rounded-xl
        bg-white dark:bg-gray-900
        shadow-sm dark:shadow-gray-950/50
        \${className}
      \`}
    >
      {children}
    </div>
  );
}

// With blur effect
export function BlurCard({ children, className = '' }: CardProps) {
  return (
    <div
      className={\`
        p-4 rounded-xl
        backdrop-blur-xl backdrop-saturate-150
        bg-white/80 dark:bg-gray-900/75
        shadow-sm
        \${className}
      \`}
    >
      {children}
    </div>
  );
}`;

  return {
    code,
    usage: `<Card>
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Card content</p>
</Card>

<BlurCard>
  <p>Content with blur background</p>
</BlurCard>`,
    tokens: {
      colors: ['bg-white', 'bg-gray-900'],
      spacing: ['p-4', 'rounded-xl'],
      typography: [],
    },
    notes: [
      'Standard and blur variants',
      'Uses Tailwind backdrop-filter for blur',
      'Dark mode support included',
    ],
  };
}

function generateCSSComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType } = input;

  const code = `:root {
  /* Apple System Colors */
  --system-blue: #007AFF;
  --system-green: #34C759;
  --system-red: #FF3B30;
  --system-orange: #FF9500;

  /* Semantic Colors */
  --background-primary: #FFFFFF;
  --background-secondary: #F2F2F7;
  --label-primary: #000000;
  --label-secondary: rgba(60, 60, 67, 0.6);
  --fill-tertiary: rgba(118, 118, 128, 0.12);
  --separator: rgba(60, 60, 67, 0.36);

  /* Typography */
  --font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Corners */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.18);

  /* Animations */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --system-blue: #0A84FF;
    --system-green: #30D158;
    --system-red: #FF453A;
    --system-orange: #FF9F0A;

    --background-primary: #000000;
    --background-secondary: #1C1C1E;
    --label-primary: #FFFFFF;
    --label-secondary: rgba(235, 235, 245, 0.6);
    --fill-tertiary: rgba(118, 118, 128, 0.24);
    --separator: rgba(84, 84, 88, 0.65);

    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.5);
  }
}

/* Apple Button */
.apple-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-lg);
  background-color: var(--system-blue);
  color: white;
  font-family: var(--font-system);
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--ease-default);
  -webkit-font-smoothing: antialiased;
}

.apple-button:hover {
  filter: brightness(1.1);
}

.apple-button:active {
  transform: scale(0.97);
}

.apple-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

/* Apple Card */
.apple-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background-color: var(--background-secondary);
  box-shadow: var(--shadow-sm);
}

/* Apple Input */
.apple-input {
  min-height: 44px;
  padding: 12px 16px;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--fill-tertiary);
  font-family: var(--font-system);
  font-size: 17px;
  color: var(--label-primary);
  outline: none;
  transition: box-shadow 0.2s var(--ease-default);
}

.apple-input::placeholder {
  color: var(--label-secondary);
}

.apple-input:focus {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

/* Blur Material */
.apple-material {
  backdrop-filter: blur(30px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.8);
}

@media (prefers-color-scheme: dark) {
  .apple-material {
    background-color: rgba(28, 28, 30, 0.75);
  }
}

@media (prefers-reduced-motion: reduce) {
  .apple-button {
    transition: none;
  }
  .apple-button:active {
    transform: none;
  }
}`;

  return {
    code,
    usage: `<button class="apple-button">Continue</button>

<div class="apple-card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<input class="apple-input" placeholder="Enter text...">

<div class="apple-material">
  Blur background content
</div>`,
    tokens: {
      colors: ['All system colors as CSS variables'],
      spacing: ['All spacing as CSS variables'],
      typography: ['System font stack'],
    },
    notes: [
      'Complete CSS design system',
      'Uses CSS custom properties for theming',
      'Automatic dark mode via media query',
      'Includes button, card, input, and material classes',
    ],
  };
}

function generateReactNativeComponent(input: ComponentGeneratorInput): GeneratedComponent {
  const { componentType } = input;

  const code = `import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  useColorScheme,
  Pressable,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export function AppleButton({ title, onPress, variant = 'primary' }: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    primary: { bg: isDark ? '#0A84FF' : '#007AFF', text: '#FFFFFF' },
    secondary: { bg: isDark ? 'rgba(120,120,128,0.24)' : 'rgba(120,120,128,0.12)', text: isDark ? '#0A84FF' : '#007AFF' },
    destructive: { bg: isDark ? '#FF453A' : '#FF3B30', text: '#FFFFFF' },
  };

  const style = colors[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: style.bg },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, { color: style.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
  },
});`;

  return {
    code,
    usage: `<AppleButton
  title="Continue"
  onPress={() => console.log('pressed')}
/>

<AppleButton
  title="Delete"
  onPress={() => {}}
  variant="destructive"
/>`,
    tokens: {
      colors: ['#007AFF (systemBlue)', '#FF3B30 (systemRed)'],
      spacing: ['minHeight: 44', 'paddingHorizontal: 20', 'borderRadius: 12'],
      typography: ['fontSize: 17', 'fontWeight: 600'],
    },
    notes: [
      'Uses Pressable for press animation',
      'Detects dark mode with useColorScheme',
      'Follows iOS button sizing guidelines',
    ],
  };
}

// ========== NEW COMPONENT GENERATORS ==========

function generateReactAvatar(size: string = 'md', darkModeSupport: boolean = true): GeneratedComponent {
  const sizes = {
    xs: { container: '24px', fontSize: '10px' },
    sm: { container: '32px', fontSize: '12px' },
    md: { container: '40px', fontSize: '14px' },
    lg: { container: '56px', fontSize: '18px' },
    xl: { container: '80px', fontSize: '24px' },
  };
  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.md;

  const code = `import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, alt, name, size = '${size}' }: AvatarProps) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className={\`\${styles.avatar} \${styles[size]}\`}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
}`;

  const stylesCode = `.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background-color: #007AFF;
  color: white;
  font-family: ${typographyTokens.fontFamily.system};
  font-weight: 600;
  flex-shrink: 0;
}

.xs { width: 24px; height: 24px; font-size: 10px; }
.sm { width: 32px; height: 32px; font-size: 12px; }
.md { width: 40px; height: 40px; font-size: 14px; }
.lg { width: 56px; height: 56px; font-size: 18px; }
.xl { width: 80px; height: 80px; font-size: 24px; }

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  user-select: none;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .avatar {
    background-color: #0A84FF;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<Avatar name="John Doe" size="${size}" />
<Avatar src="/profile.jpg" alt="Profile" size="${size}" />`,
    tokens: {
      colors: ['systemBlue (#007AFF)'],
      spacing: Object.entries(sizes).map(([k, v]) => `${k}: ${v.container}`),
      typography: ['fontWeight: 600'],
    },
    notes: [
      'Displays image or initials fallback',
      '5 size variants available',
      'Circular shape with overflow hidden',
    ],
  };
}

function generateReactBadge(variant: string = 'default', darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'prominent' | 'subtle' | 'destructive';
}

export function Badge({ children, variant = '${variant}' }: BadgeProps) {
  return (
    <span className={\`\${styles.badge} \${styles[variant]}\`}>
      {children}
    </span>
  );
}`;

  const stylesCode = `.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.default {
  background-color: rgba(120, 120, 128, 0.12);
  color: #000000;
}

.prominent {
  background-color: #007AFF;
  color: white;
}

.subtle {
  background-color: rgba(0, 122, 255, 0.12);
  color: #007AFF;
}

.destructive {
  background-color: #FF3B30;
  color: white;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .default {
    background-color: rgba(120, 120, 128, 0.24);
    color: #FFFFFF;
  }

  .prominent {
    background-color: #0A84FF;
  }

  .subtle {
    background-color: rgba(10, 132, 255, 0.2);
    color: #0A84FF;
  }

  .destructive {
    background-color: #FF453A;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<Badge>Default</Badge>
<Badge variant="prominent">New</Badge>
<Badge variant="destructive">Error</Badge>`,
    tokens: {
      colors: ['systemBlue', 'systemRed', 'fill.tertiary'],
      spacing: ['padding: 2px 8px', 'border-radius: 9999px'],
      typography: ['fontSize: 12px', 'fontWeight: 600'],
    },
    notes: [
      'Pill-shaped status indicator',
      '4 color variants',
      'Compact inline display',
    ],
  };
}

function generateReactTooltip(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={\`\${styles.tooltip} \${styles[position]}\`} role="tooltip">
          {content}
          <div className={styles.arrow} />
        </div>
      )}
    </div>
  );
}`;

  const stylesCode = `.container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  padding: 6px 10px;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 13px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 1000;
  animation: fadeIn 0.15s ${animationTokens.bezierCurves.appleEase};
}

.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.75);
  transform: rotate(45deg);
}

.top .arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.bottom .arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .tooltip {
    background-color: rgba(60, 60, 67, 0.9);
  }
  .arrow {
    background-color: rgba(60, 60, 67, 0.9);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<Tooltip content="More information">
  <button>Hover me</button>
</Tooltip>`,
    tokens: {
      colors: ['rgba(0, 0, 0, 0.75)'],
      spacing: ['padding: 6px 10px', 'border-radius: 6px'],
      typography: ['fontSize: 13px'],
    },
    notes: [
      '4 position options (top, bottom, left, right)',
      'Accessible with focus states',
      'Fade-in animation',
    ],
  };
}

function generateReactCheckbox(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
  return (
    <label className={\`\${styles.container} \${disabled ? styles.disabled : ''}\`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.input}
      />
      <span className={\`\${styles.checkbox} \${checked ? styles.checked : ''}\`}>
        {checked && (
          <svg viewBox="0 0 12 12" className={styles.checkmark}>
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}`;

  const stylesCode = `.container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.container.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(120, 120, 128, 0.32);
  border-radius: 6px;
  background-color: transparent;
  transition: all 0.15s ${animationTokens.bezierCurves.appleEase};
}

.checkbox.checked {
  background-color: #007AFF;
  border-color: #007AFF;
}

.checkmark {
  width: 12px;
  height: 12px;
  color: white;
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
}

.input:focus-visible + .checkbox {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .checkbox {
    border-color: rgba(120, 120, 128, 0.48);
  }

  .checkbox.checked {
    background-color: #0A84FF;
    border-color: #0A84FF;
  }

  .label {
    color: #FFFFFF;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [isChecked, setIsChecked] = useState(false);

<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Accept terms"
/>`,
    tokens: {
      colors: ['systemBlue (#007AFF)', 'fill.secondary'],
      spacing: ['width: 22px', 'height: 22px', 'border-radius: 6px'],
      typography: ['fontSize: 17px'],
    },
    notes: [
      'Custom styled checkbox with checkmark SVG',
      'Focus ring for accessibility',
      'Disabled state support',
    ],
  };
}

function generateReactRadioGroup(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './RadioGroup.module.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({ name, options, value, onChange, disabled = false }: RadioGroupProps) {
  return (
    <div className={styles.group} role="radiogroup">
      {options.map((option) => (
        <label
          key={option.value}
          className={\`\${styles.container} \${disabled ? styles.disabled : ''}\`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
          <span className={\`\${styles.radio} \${value === option.value ? styles.checked : ''}\`}>
            {value === option.value && <span className={styles.dot} />}
          </span>
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}`;

  const stylesCode = `.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.container.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid rgba(120, 120, 128, 0.32);
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.15s ${animationTokens.bezierCurves.appleEase};
}

.radio.checked {
  border-color: #007AFF;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #007AFF;
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
}

.input:focus-visible + .radio {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .radio {
    border-color: rgba(120, 120, 128, 0.48);
  }

  .radio.checked {
    border-color: #0A84FF;
  }

  .dot {
    background-color: #0A84FF;
  }

  .label {
    color: #FFFFFF;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [selected, setSelected] = useState('option1');

<RadioGroup
  name="options"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
  value={selected}
  onChange={setSelected}
/>`,
    tokens: {
      colors: ['systemBlue (#007AFF)', 'fill.secondary'],
      spacing: ['width: 22px', 'height: 22px', 'gap: 12px'],
      typography: ['fontSize: 17px'],
    },
    notes: [
      'Proper radiogroup ARIA role',
      'Keyboard accessible',
      'Animated selection state',
    ],
  };
}

function generateReactTextarea(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  label,
  rows = 4,
  maxLength,
  error,
  disabled = false,
}: TextareaProps) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={\`\${styles.textarea} \${error ? styles.error : ''}\`}
      />
      <div className={styles.footer}>
        {error && <span className={styles.errorText}>{error}</span>}
        {maxLength && (
          <span className={styles.counter}>{value.length}/{maxLength}</span>
        )}
      </div>
    </div>
  );
}`;

  const stylesCode = `.container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 15px;
  font-weight: 500;
  color: #000000;
}

.textarea {
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background-color: rgba(118, 118, 128, 0.12);
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  color: #000000;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: box-shadow 0.2s ${animationTokens.bezierCurves.appleEase};
}

.textarea::placeholder {
  color: rgba(60, 60, 67, 0.3);
}

.textarea:focus {
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.4);
}

.textarea:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  resize: none;
}

.textarea.error {
  box-shadow: 0 0 0 2px #FF3B30;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.errorText {
  font-size: 13px;
  color: #FF3B30;
}

.counter {
  font-size: 13px;
  color: rgba(60, 60, 67, 0.6);
  margin-left: auto;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .label {
    color: #FFFFFF;
  }

  .textarea {
    background-color: rgba(118, 118, 128, 0.24);
    color: #FFFFFF;
  }

  .textarea::placeholder {
    color: rgba(235, 235, 245, 0.3);
  }

  .textarea.error {
    box-shadow: 0 0 0 2px #FF453A;
  }

  .errorText {
    color: #FF453A;
  }

  .counter {
    color: rgba(235, 235, 245, 0.6);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [text, setText] = useState('');

<Textarea
  label="Description"
  value={text}
  onChange={setText}
  placeholder="Enter your description..."
  maxLength={500}
/>`,
    tokens: {
      colors: ['fill.tertiary', 'label.primary', 'systemRed'],
      spacing: ['padding: 12px 16px', 'border-radius: 10px'],
      typography: ['fontSize: 17px (input)', 'fontSize: 15px (label)'],
    },
    notes: [
      'Resizable textarea with min-height',
      'Character counter support',
      'Error state with message',
    ],
  };
}

function generateReactProgressRing(size: string = 'md', darkModeSupport: boolean = true): GeneratedComponent {
  const sizes = {
    xs: { size: 24, stroke: 2 },
    sm: { size: 32, stroke: 3 },
    md: { size: 48, stroke: 4 },
    lg: { size: 64, stroke: 5 },
    xl: { size: 96, stroke: 6 },
  };
  const sizeConfig = sizes[size as keyof typeof sizes] || sizes.md;

  const code = `import React from 'react';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export function ProgressRing({ progress, size = '${size}', showLabel = false }: ProgressRingProps) {
  const sizes = {
    xs: { size: 24, stroke: 2 },
    sm: { size: 32, stroke: 3 },
    md: { size: 48, stroke: 4 },
    lg: { size: 64, stroke: 5 },
    xl: { size: 96, stroke: 6 },
  };
  const config = sizes[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.container} style={{ width: config.size, height: config.size }}>
      <svg className={styles.svg} viewBox={\`0 0 \${config.size} \${config.size}\`}>
        <circle
          className={styles.background}
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={config.stroke}
        />
        <circle
          className={styles.progress}
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span className={styles.label}>{Math.round(progress)}%</span>
      )}
    </div>
  );
}`;

  const stylesCode = `.container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg {
  transform: rotate(-90deg);
}

.background {
  fill: none;
  stroke: rgba(120, 120, 128, 0.12);
}

.progress {
  fill: none;
  stroke: #007AFF;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ${animationTokens.bezierCurves.appleEase};
}

.label {
  position: absolute;
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 12px;
  font-weight: 600;
  color: #000000;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .background {
    stroke: rgba(120, 120, 128, 0.24);
  }

  .progress {
    stroke: #0A84FF;
  }

  .label {
    color: #FFFFFF;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<ProgressRing progress={75} size="${size}" showLabel />`,
    tokens: {
      colors: ['systemBlue (#007AFF)', 'fill.tertiary'],
      spacing: Object.entries(sizes).map(([k, v]) => `${k}: ${v.size}px`),
      typography: ['fontSize: 12px', 'fontWeight: 600'],
    },
    notes: [
      'SVG-based circular progress',
      '5 size variants',
      'Smooth animation on value change',
    ],
  };
}

function generateReactSkeleton(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.textGroup}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={\`\${styles.skeleton} \${styles.text}\`}
            style={{
              width: i === lines - 1 ? '60%' : width || '100%',
              height: height || '16px',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={\`\${styles.skeleton} \${styles[variant]}\`}
      style={{
        width: width || (variant === 'circular' ? '48px' : '100%'),
        height: height || (variant === 'circular' ? '48px' : variant === 'text' ? '16px' : '100px'),
      }}
    />
  );
}`;

  const stylesCode = `.skeleton {
  background: linear-gradient(
    90deg,
    rgba(120, 120, 128, 0.12) 0%,
    rgba(120, 120, 128, 0.2) 50%,
    rgba(120, 120, 128, 0.12) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.text {
  border-radius: 4px;
}

.circular {
  border-radius: 50%;
}

.rectangular {
  border-radius: 8px;
}

.textGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(120, 120, 128, 0.24) 0%,
      rgba(120, 120, 128, 0.36) 50%,
      rgba(120, 120, 128, 0.24) 100%
    );
    background-size: 200% 100%;
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `{/* Text skeleton */}
<Skeleton variant="text" lines={3} />

{/* Avatar skeleton */}
<Skeleton variant="circular" width={48} height={48} />

{/* Card skeleton */}
<Skeleton variant="rectangular" height={200} />`,
    tokens: {
      colors: ['fill.tertiary'],
      spacing: ['border-radius: 4px/8px/50%', 'gap: 8px'],
      typography: [],
    },
    notes: [
      '3 variants: text, circular, rectangular',
      'Shimmer animation effect',
      'Multi-line text support',
    ],
  };
}

function generateReactToast(variant: string = 'default', darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  variant?: 'default' | 'prominent' | 'subtle' | 'destructive';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, variant = '${variant}', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={\`\${styles.toast} \${styles[variant]} \${isVisible ? styles.visible : styles.hidden}\`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={() => { setIsVisible(false); setTimeout(onClose, 200); }}>
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// Toast container for multiple toasts
export function ToastContainer({ toasts, onRemove }: { toasts: Array<{ id: string; message: string; variant?: string }>; onRemove: (id: string) => void }) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} variant={toast.variant as any} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}`;

  const stylesCode = `.container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: ${shadowTokens.css.light.level2};
  min-width: 280px;
  max-width: 420px;
  font-family: ${typographyTokens.fontFamily.system};
}

.visible {
  animation: slideIn 0.2s ${animationTokens.bezierCurves.springLike};
}

.hidden {
  animation: slideOut 0.2s ${animationTokens.bezierCurves.appleEase} forwards;
}

.default {
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
}

.prominent {
  background-color: rgba(0, 122, 255, 0.95);
  color: white;
}

.subtle {
  background-color: rgba(242, 242, 247, 0.95);
  color: #000000;
}

.destructive {
  background-color: rgba(255, 59, 48, 0.95);
  color: white;
}

.message {
  flex: 1;
  font-size: 15px;
}

.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
}

.close:hover {
  opacity: 1;
}

.close svg {
  width: 12px;
  height: 12px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .default {
    background-color: rgba(44, 44, 46, 0.95);
    color: #FFFFFF;
  }

  .subtle {
    background-color: rgba(28, 28, 30, 0.95);
    color: #FFFFFF;
  }

  .prominent {
    background-color: rgba(10, 132, 255, 0.95);
  }

  .destructive {
    background-color: rgba(255, 69, 58, 0.95);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `const [toasts, setToasts] = useState([]);

const addToast = (message: string, variant = 'default') => {
  const id = Date.now().toString();
  setToasts(prev => [...prev, { id, message, variant }]);
};

const removeToast = (id: string) => {
  setToasts(prev => prev.filter(t => t.id !== id));
};

<button onClick={() => addToast('Changes saved!')}>Show Toast</button>
<ToastContainer toasts={toasts} onRemove={removeToast} />`,
    tokens: {
      colors: ['systemBlue', 'systemRed', 'background.secondary'],
      spacing: ['padding: 12px 16px', 'border-radius: 12px'],
      typography: ['fontSize: 15px'],
    },
    notes: [
      'Auto-dismiss with configurable duration',
      'Slide-in/out animations',
      'Container for managing multiple toasts',
    ],
  };
}

function generateReactAccordion(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React, { useState } from 'react';
import styles from './Accordion.module.css';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <button
              className={styles.trigger}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className={styles.title}>{item.title}</span>
              <svg
                className={\`\${styles.chevron} \${isOpen ? styles.open : ''}\`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={\`\${styles.content} \${isOpen ? styles.expanded : ''}\`}>
              <div className={styles.inner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}`;

  const stylesCode = `.accordion {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background-color: rgba(118, 118, 128, 0.12);
}

.item {
  border-bottom: 1px solid rgba(60, 60, 67, 0.12);
}

.item:last-child {
  border-bottom: none;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.trigger:hover {
  background-color: rgba(120, 120, 128, 0.08);
}

.title {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 17px;
  font-weight: 600;
  color: #000000;
}

.chevron {
  width: 12px;
  height: 12px;
  color: rgba(60, 60, 67, 0.6);
  transition: transform 0.2s ${animationTokens.bezierCurves.appleEase};
}

.chevron.open {
  transform: rotate(180deg);
}

.content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ${animationTokens.bezierCurves.appleEase};
}

.content.expanded {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
  padding: 0 16px;
}

.content.expanded .inner {
  padding: 0 16px 16px;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .accordion {
    background-color: rgba(118, 118, 128, 0.24);
  }

  .item {
    border-bottom-color: rgba(84, 84, 88, 0.36);
  }

  .title {
    color: #FFFFFF;
  }

  .chevron {
    color: rgba(235, 235, 245, 0.6);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<Accordion
  items={[
    { id: '1', title: 'Section 1', content: <p>Content for section 1</p> },
    { id: '2', title: 'Section 2', content: <p>Content for section 2</p> },
    { id: '3', title: 'Section 3', content: <p>Content for section 3</p> },
  ]}
  allowMultiple={false}
/>`,
    tokens: {
      colors: ['fill.tertiary', 'label.primary', 'separator'],
      spacing: ['padding: 16px', 'border-radius: 12px'],
      typography: ['fontSize: 17px', 'fontWeight: 600'],
    },
    notes: [
      'Single or multiple expansion modes',
      'Smooth CSS grid animation',
      'Accessible with aria-expanded',
    ],
  };
}

function generateReactDivider(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function Divider({ orientation = 'horizontal', label }: DividerProps) {
  if (label) {
    return (
      <div className={\`\${styles.divider} \${styles.withLabel}\`}>
        <span className={styles.line} />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} />
      </div>
    );
  }

  return (
    <div
      className={\`\${styles.divider} \${styles[orientation]}\`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}`;

  const stylesCode = `.divider {
  background-color: rgba(60, 60, 67, 0.18);
}

.horizontal {
  height: 1px;
  width: 100%;
}

.vertical {
  width: 1px;
  height: 100%;
}

.withLabel {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: transparent;
}

.line {
  flex: 1;
  height: 1px;
  background-color: rgba(60, 60, 67, 0.18);
}

.label {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 13px;
  color: rgba(60, 60, 67, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .divider {
    background-color: rgba(84, 84, 88, 0.36);
  }

  .line {
    background-color: rgba(84, 84, 88, 0.36);
  }

  .label {
    color: rgba(235, 235, 245, 0.6);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `{/* Simple divider */}
<Divider />

{/* Vertical divider */}
<Divider orientation="vertical" />

{/* Divider with label */}
<Divider label="or" />`,
    tokens: {
      colors: ['separator'],
      spacing: ['height: 1px', 'gap: 12px'],
      typography: ['fontSize: 13px'],
    },
    notes: [
      'Horizontal and vertical orientations',
      'Optional centered label',
      'Proper ARIA separator role',
    ],
  };
}

function generateReactBreadcrumb(darkModeSupport: boolean = true): GeneratedComponent {
  const code = `import React from 'react';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumb({ items, separator }: BreadcrumbProps) {
  const defaultSeparator = (
    <svg className={styles.separator} viewBox="0 0 8 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.breadcrumb}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.href ? (
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (separator || defaultSeparator)}
          </li>
        ))}
      </ol>
    </nav>
  );
}`;

  const stylesCode = `.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 15px;
  color: #007AFF;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.current {
  font-family: ${typographyTokens.fontFamily.system};
  font-size: 15px;
  color: rgba(60, 60, 67, 0.6);
}

.separator {
  width: 8px;
  height: 12px;
  color: rgba(60, 60, 67, 0.3);
  flex-shrink: 0;
}

${darkModeSupport ? `@media (prefers-color-scheme: dark) {
  .link {
    color: #0A84FF;
  }

  .current {
    color: rgba(235, 235, 245, 0.6);
  }

  .separator {
    color: rgba(235, 235, 245, 0.3);
  }
}` : ''}`;

  return {
    code,
    styles: stylesCode,
    usage: `<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Current Page' },
  ]}
/>`,
    tokens: {
      colors: ['systemBlue (#007AFF)', 'label.secondary'],
      spacing: ['gap: 4px'],
      typography: ['fontSize: 15px'],
    },
    notes: [
      'Semantic nav with aria-label',
      'Current page with aria-current',
      'Custom separator support',
    ],
  };
}
