import { z } from 'zod';
import { colorTokens, typographyTokens, spacingTokens, animationTokens, shadowTokens, materialTokens } from '../data/index.js';

export const componentGeneratorSchema = z.object({
  componentType: z.enum([
    'button', 'card', 'modal', 'navigation-bar', 'tab-bar',
    'sidebar', 'list', 'form-input', 'toggle', 'slider',
    'alert', 'sheet', 'menu', 'toolbar', 'search-bar',
    'segmented-control', 'stepper', 'picker'
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
