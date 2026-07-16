// Eigen Design System
// The visual language of the studio.
// No emojis. No fluff. Just signal.

export const colors = {
  // Core
  black: '#0A0A0F',
  white: '#FFFFFF',

  // Primary — Electric Blue
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#0066FF',
    600: '#0052CC',
    700: '#003D99',
    800: '#002966',
    900: '#001433',
  },

  // Accent — Warm Amber
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#FFB800',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutrals
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Team agent colors
  agent: {
    vex: '#0066FF',
    flux: '#8B5CF6',
    prism: '#EC4899',
    bastion: '#DC2626',
    echo: '#6B7280',
    verse: '#10B981',
    beacon: '#FFB800',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgb(0 102 255 / 0.3)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Design tokens for CSS custom properties
export const cssVariables = `
  :root {
    --color-black: ${colors.black};
    --color-white: ${colors.white};
    --color-blue: ${colors.blue[500]};
    --color-blue-light: ${colors.blue[400]};
    --color-blue-dark: ${colors.blue[600]};
    --color-amber: ${colors.amber[500]};
    --color-amber-light: ${colors.amber[400]};
    --color-gray-50: ${colors.gray[50]};
    --color-gray-100: ${colors.gray[100]};
    --color-gray-200: ${colors.gray[200]};
    --color-gray-300: ${colors.gray[300]};
    --color-gray-400: ${colors.gray[400]};
    --color-gray-500: ${colors.gray[500]};
    --color-gray-600: ${colors.gray[600]};
    --color-gray-700: ${colors.gray[700]};
    --color-gray-800: ${colors.gray[800]};
    --color-gray-900: ${colors.gray[900]};

    --font-sans: ${typography.fontFamily.sans};
    --font-mono: ${typography.fontFamily.mono};

    --shadow-glow: ${shadows.glow};
    --transition-fast: ${transitions.fast};
    --transition-base: ${transitions.base};
    --transition-slow: ${transitions.slow};
  }
`;
