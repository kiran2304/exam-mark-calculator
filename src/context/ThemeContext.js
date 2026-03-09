import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, makeShadow, typography, spacing, radius } from '../theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const scheme = useColorScheme(); // 'light' | 'dark' | null
    const isDark = scheme === 'dark';
    const colors = isDark ? darkColors : lightColors;
    const shadow = makeShadow(colors);

    return (
        <ThemeContext.Provider value={{ colors, shadow, isDark, typography, spacing, radius }}>
            {children}
        </ThemeContext.Provider>
    );
}

/** Use inside any component to get the current theme tokens */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}
