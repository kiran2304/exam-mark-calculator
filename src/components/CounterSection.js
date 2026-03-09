import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

export default function CounterSection({ label, count, onIncrement, onDecrement, accentColor, limitReached }) {
    const { colors, shadow } = useTheme();
    const accent = accentColor || colors.primary;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const pulse = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.12, duration: 70, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 70, useNativeDriver: true }),
        ]).start();
    };

    const handleIncrement = () => { pulse(); onIncrement(); };
    const handleDecrement = () => { if (count > 0) { pulse(); onDecrement(); } };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderTopColor: accent }, shadow.card]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <View style={styles.counterRow}>
                {/* Decrement */}
                <TouchableOpacity
                    style={[
                        styles.btn,
                        { backgroundColor: colors.surface, borderColor: count === 0 ? colors.border : colors.border },
                        count === 0 && { backgroundColor: colors.background },
                    ]}
                    onPress={handleDecrement}
                    activeOpacity={0.7}
                    disabled={count === 0}
                >
                    <Text style={[styles.btnText, { color: count === 0 ? colors.border : colors.textPrimary }]}>−</Text>
                </TouchableOpacity>

                {/* Count */}
                <Animated.View style={[styles.countBox, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={[styles.countText, { color: accent }]}>{count}</Text>
                </Animated.View>

                {/* Increment */}
                <TouchableOpacity
                    style={[
                        styles.btn,
                        limitReached
                            ? { backgroundColor: colors.border }
                            : { backgroundColor: accent, ...shadow.button },
                    ]}
                    onPress={handleIncrement}
                    activeOpacity={limitReached ? 0.5 : 0.8}
                >
                    <Text style={[styles.btnText, { color: limitReached ? colors.textSecondary : '#FFFFFF' }]}>
                        {limitReached ? '⊘' : '+'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
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
        width: 54,
        height: 54,
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: typography.sizes.hero,
        fontWeight: typography.weights.extraBold,
        letterSpacing: -1,
    },
});
