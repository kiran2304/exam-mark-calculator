import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

function formatScore(value) {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(2);
}

export default function ScoreSection({ rightAnswers, wrongAnswers, negValue, negLabel }) {
    const { colors, shadow } = useTheme();
    const rawScore = rightAnswers * 1 - wrongAnswers * negValue;
    const displayScore = formatScore(rawScore);
    const scoreColor = rawScore === 0 ? colors.textSecondary : rawScore > 0 ? colors.success : colors.danger;

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;
    const prevScore = useRef(rawScore);

    useEffect(() => {
        if (prevScore.current !== rawScore) {
            // Spring scale for the number
            Animated.sequence([
                Animated.spring(scaleAnim, { toValue: 1.15, speed: 40, bounciness: 10, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, speed: 20, bounciness: 8, useNativeDriver: true }),
            ]).start();

            // Flash background slightly
            Animated.sequence([
                Animated.timing(bgAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
                Animated.timing(bgAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start();

            prevScore.current = rawScore;
        }
    }, [rawScore]);

    const animatedBg = bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.surface, colors.primaryLight]
    });

    return (
        <Animated.View style={[styles.card, { backgroundColor: colors.primaryLight, borderColor: colors.primary, borderWidth: 3 }, shadow.card]}>
            {/* Formula row */}
            <View style={[styles.formulaRow, { backgroundColor: colors.scoreBg }]}>
                <View style={styles.formulaItem}>
                    <Text style={[styles.formulaValue, { color: colors.success }]}>{rightAnswers}</Text>
                    <Text style={[styles.formulaLabel, { color: colors.textSecondary }]}>Correct</Text>
                </View>
                <Text style={[styles.formulaOp, { color: colors.textSecondary }]}>−</Text>
                <View style={styles.formulaItem}>
                    <Text style={[styles.formulaValue, { color: colors.danger }]}>
                        {(wrongAnswers * negValue).toFixed(2)}
                    </Text>
                    <Text style={[styles.formulaLabel, { color: colors.textSecondary }]}>
                        {wrongAnswers} × {negLabel}
                    </Text>
                </View>
                <Text style={[styles.formulaOp, { color: colors.textSecondary }]}>=</Text>
                <Animated.View style={[styles.formulaItem, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>{displayScore}</Text>
                    <Text style={[styles.formulaLabel, { color: colors.textSecondary }]}>Score</Text>
                </Animated.View>
            </View>

            <View style={[styles.innerDivider, { backgroundColor: colors.border }]} />

            {/* Big display */}
            <Animated.View style={[styles.scoreBig, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={[styles.scoreBigLabel, { color: colors.textSecondary }]}>TOTAL SCORE</Text>
                <Text style={[styles.scoreBigValue, { color: scoreColor }]}>{displayScore}</Text>
                <Text style={[styles.schemeTag, { color: scoreColor }]}>
                    {negLabel} negative marking · {rightAnswers + wrongAnswers} answered
                </Text>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.xl,
        overflow: 'hidden',
        borderWidth: 2,
        padding: 24,
        height: '100%',
    },
    formulaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    formulaItem: { alignItems: 'center', minWidth: 56 },
    formulaValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extraBold, textAlign: 'center' },
    formulaLabel: { fontSize: typography.sizes.sm, marginTop: 2, fontWeight: typography.weights.medium, textAlign: 'center' },
    formulaOp: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, marginHorizontal: spacing.sm, textAlign: 'center' },
    scoreValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extraBold, textAlign: 'center' },
    innerDivider: { height: 1, opacity: 0.5 },
    scoreBig: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.md },
    scoreBigLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, letterSpacing: 2, marginBottom: spacing.sm, textAlign: 'center' },
    scoreBigValue: { fontSize: 96, fontWeight: typography.weights.extraBold, letterSpacing: -3, lineHeight: 100, textAlign: 'center' },
    schemeTag: { fontSize: typography.sizes.md, marginTop: spacing.md, fontWeight: typography.weights.medium, opacity: 0.9, textAlign: 'center' },
});
