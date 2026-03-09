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
    const prevScore = useRef(rawScore);

    useEffect(() => {
        if (prevScore.current !== rawScore) {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.06, duration: 90, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
            ]).start();
            prevScore.current = rawScore;
        }
    }, [rawScore]);

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: scoreColor }, shadow.card]}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 2,
        marginBottom: spacing.sm,
    },
    formulaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    formulaItem: { alignItems: 'center', minWidth: 56 },
    formulaValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extraBold },
    formulaLabel: { fontSize: typography.sizes.xs, marginTop: 2 },
    formulaOp: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, marginHorizontal: spacing.xs },
    scoreValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extraBold },
    innerDivider: { height: 1 },
    scoreBig: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
    scoreBigLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, letterSpacing: 2, marginBottom: spacing.sm },
    scoreBigValue: { fontSize: 56, fontWeight: typography.weights.extraBold, letterSpacing: -2, lineHeight: 60 },
    schemeTag: { fontSize: typography.sizes.xs, marginTop: spacing.sm, opacity: 0.8 },
});
