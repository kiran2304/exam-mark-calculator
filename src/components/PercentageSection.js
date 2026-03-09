import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

/**
 * Percentage section — only rendered when totalQuestions is provided.
 * Formula: (totalScore / totalQuestions) × 100
 */
export default function PercentageSection({ totalScore, totalQuestions }) {
    const { colors, shadow } = useTheme();

    if (!totalQuestions || totalQuestions <= 0) return null;

    const pct = (totalScore / totalQuestions) * 100;
    // Clamp display at 0 for negative scores
    const displayPct = pct.toFixed(2);
    const pctColor = pct >= 50 ? colors.success : pct >= 33 ? colors.warning : colors.danger;

    // Grade label
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 75) grade = 'A';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 33) grade = 'D';

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: pctColor }, shadow.card]}>
            {/* Header row */}
            <View style={styles.headerRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>PERCENTAGE</Text>
                <View style={[styles.gradeBadge, { backgroundColor: pctColor + '22', borderColor: pctColor }]}>
                    <Text style={[styles.gradeText, { color: pctColor }]}>Grade {grade}</Text>
                </View>
            </View>

            {/* Big percentage */}
            <View style={styles.pctRow}>
                <Text style={[styles.pctValue, { color: pctColor }]}>{displayPct}</Text>
                <Text style={[styles.pctSymbol, { color: pctColor }]}>%</Text>
            </View>

            {/* Progress bar */}
            <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`, backgroundColor: pctColor },
                    ]}
                />
            </View>

            <Text style={[styles.formula, { color: colors.textSecondary }]}>
                ({totalScore.toFixed(2)} ÷ {totalQuestions}) × 100
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    label: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    gradeBadge: {
        borderRadius: radius.full,
        borderWidth: 1.5,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
    },
    gradeText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
        letterSpacing: 0.5,
    },
    pctRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.sm,
    },
    pctValue: {
        fontSize: 52,
        fontWeight: typography.weights.extraBold,
        letterSpacing: -2,
        lineHeight: 56,
    },
    pctSymbol: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        marginBottom: 6,
        marginLeft: 4,
    },
    barTrack: {
        height: 8,
        borderRadius: radius.full,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    barFill: {
        height: '100%',
        borderRadius: radius.full,
    },
    formula: {
        fontSize: typography.sizes.xs,
        textAlign: 'center',
    },
});
