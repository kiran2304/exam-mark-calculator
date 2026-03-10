import React, { useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

export default function CounterSection({ label, count, onIncrement, onDecrement, accentColor, limitReached }) {
    const { colors, shadow } = useTheme();
    const accent = accentColor || colors.primary;

    // Animation Values
    const numScale = useRef(new Animated.Value(1)).current;
    const incScale = useRef(new Animated.Value(1)).current;
    const decScale = useRef(new Animated.Value(1)).current;

    const pulseNum = () => {
        Animated.sequence([
            Animated.spring(numScale, { toValue: 1.25, speed: 40, bounciness: 12, useNativeDriver: true }),
            Animated.spring(numScale, { toValue: 1, speed: 20, bounciness: 8, useNativeDriver: true }),
        ]).start();
    };

    const handleIncrement = () => { pulseNum(); onIncrement(); };
    const handleDecrement = () => { if (count > 0) { pulseNum(); onDecrement(); } };
    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderTopColor: accent }, shadow.card]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <View style={styles.counterRow}>
                {/* Decrement */}
                <Pressable
                    onPress={handleDecrement}
                    onPressIn={() => Animated.spring(decScale, { toValue: 0.85, useNativeDriver: true }).start()}
                    onPressOut={() => Animated.spring(decScale, { toValue: 1, useNativeDriver: true }).start()}
                    disabled={count === 0}
                >
                    <Animated.View style={[
                        styles.btn,
                        { backgroundColor: colors.surface, borderColor: count === 0 ? colors.border : colors.border },
                        count === 0 && { backgroundColor: colors.background },
                        { transform: [{ scale: decScale }] }
                    ]}>
                        <Text style={[styles.btnText, { color: count === 0 ? colors.border : colors.textPrimary }]}>−</Text>
                    </Animated.View>
                </Pressable>

                {/* Count */}
                <Animated.View style={[styles.countBox, { transform: [{ scale: numScale }] }]}>
                    <Text style={[styles.countText, { color: accent }]}>{count}</Text>
                </Animated.View>

                {/* Increment */}
                <Pressable
                    onPress={handleIncrement}
                    onPressIn={() => !limitReached && Animated.spring(incScale, { toValue: 0.85, useNativeDriver: true }).start()}
                    onPressOut={() => Animated.spring(incScale, { toValue: 1, useNativeDriver: true }).start()}
                    disabled={limitReached}
                >
                    <Animated.View style={[
                        styles.btn,
                        limitReached
                            ? { backgroundColor: colors.border }
                            : { backgroundColor: accent, ...shadow.button },
                        { transform: [{ scale: incScale }] }
                    ]}>
                        <Text style={[styles.btnText, { color: limitReached ? colors.textSecondary : '#FFFFFF' }]}>
                            {limitReached ? '⊘' : '+'}
                        </Text>
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        paddingVertical: spacing.lg,
        paddingHorizontal: 20,
        marginBottom: spacing.md,
        borderTopWidth: 4,
    },
    label: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        marginBottom: spacing.md,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btn: {
        width: 56,
        height: 56,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    btnText: {
        fontSize: 26,
        fontWeight: typography.weights.bold,
        lineHeight: 30,
    },
    countBox: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: typography.sizes.hero,
        fontWeight: typography.weights.extraBold,
        letterSpacing: -1,
    },
});
