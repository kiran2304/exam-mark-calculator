// Design system tokens for ExamMark Calculator
// Supports Light and Dark modes

export const lightColors = {
    primary: '#1A73E8',
    primaryLight: '#E8F0FE',
    primaryDark: '#1557B0',
    background: '#F4F6FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    success: '#34A853',
    danger: '#EA4335',
    warning: '#F9AB00',
    warningBg: '#FFF3CD',
    warningBorder: '#FFCA28',
    warningText: '#7A5C00',
    white: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.10)',
    // Score
    scoreBg: '#FAFBFF',
};

export const darkColors = {
    primary: '#4E9EF5',
    primaryLight: '#1A2F4A',
    primaryDark: '#7BB8FA',
    background: '#0F1117',
    surface: '#1C1F2E',
    surfaceElevated: '#262A3C',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4050',
    success: '#46C66A',
    danger: '#F28B82',
    warning: '#FDD663',
    warningBg: '#2A2200',
    warningBorder: '#5A4900',
    warningText: '#FDD663',
    white: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.40)',
    scoreBg: '#16192A',
};

// Backward-compat default export (light = default)
export const colors = lightColors;

export const typography = {
    fontFamily: 'System',
    sizes: {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 18,
        xl: 22,
        xxl: 28,
        hero: 34,
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
    xl: 24,
    full: 100,
};

export const makeShadow = (colors) => ({
    card: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    button: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 8,
        elevation: 4,
    },
});

// Static shadows (backward compat)
export const shadow = makeShadow(lightColors);
