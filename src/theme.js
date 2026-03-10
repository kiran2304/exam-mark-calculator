// Design system tokens for ExamMark Calculator
// Supports Light and Dark modes

export const lightColors = {
    primary: '#2d6cdf',
    primaryLight: '#E8F0FE',
    primaryDark: '#1A56C4',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    warningBorder: '#FDE68A',
    warningText: '#92400E',
    white: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.05)',
    scoreBg: '#F3F4F6', // Subtle gray instead of blue-tint
    accentRipple: 'rgba(45, 108, 223, 0.15)',
};

export const darkColors = {
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    primaryDark: '#60A5FA',
    background: '#111827',
    surface: '#1F2937',
    surfaceElevated: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FCD34D',
    warningBg: '#78350F',
    warningBorder: '#92400E',
    warningText: '#FDE68A',
    white: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.3)',
    scoreBg: '#1F2937',
    accentRipple: 'rgba(59, 130, 246, 0.25)',
};

// Backward-compat default export (light = default)
export const colors = lightColors;

export const typography = {
    fontFamily: 'System',
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
        hero: 40,
    },
    weights: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 16, // Dashboard rounded corners (12-16px)
    full: 100,
};

export const layout = {
    desktopMaxWidth: 1200, // Dashboard container max width
    desktopGridGap: 24,
    desktopPaddingRoot: 24,
    tabletPaddingRoot: 20,
    mobilePaddingRoot: 16,
};

export const makeShadow = (colors) => ({
    card: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 3,
    },
    button: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
});

// Static shadows (backward compat)
export const shadow = makeShadow(lightColors);
