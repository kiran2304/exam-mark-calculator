import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

export default function StatsSection({ rightAnswers, wrongAnswers, totalQuestions }) {
    const { colors, shadow } = useTheme();
    const attempted = rightAnswers + wrongAnswers;
    const hasLimit = totalQuestions !== null && totalQuestions > 0;
    const remaining = hasLimit ? totalQuestions - attempted : null;

    return (
        <View style={styles.row}>
            {/* Attempted */}
            <View style={[styles.pill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }, shadow.card]}>
                <Text style={styles.pillIcon}>📝</Text>
                <Text style={[styles.pillValue, { color: colors.primary }]}>{attempted}</Text>
                <Text style={[styles.pillLabel, { color: colors.textSecondary }]}>Attempted</Text>
            </View>

            {/* Remaining */}
            {hasLimit ? (
                <View style={[
                    styles.pill,
                    { backgroundColor: colors.surface, borderColor: remaining >= 0 ? colors.border : colors.danger },
                    remaining < 0 && { backgroundColor: colors.danger + '15' },
                    shadow.card,
                ]}>
                    <Text style={styles.pillIcon}>{remaining >= 0 ? '⏳' : '⚠️'}</Text>
                    <Text style={[styles.pillValue, { color: remaining >= 0 ? colors.textPrimary : colors.danger }]}>
                        {remaining >= 0 ? remaining : 0}
                    </Text>
                    <Text style={[styles.pillLabel, { color: colors.textSecondary }]}>Remaining</Text>
                </View>
            ) : (
                <View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.45 }, shadow.card]}>
                    <Text style={styles.pillIcon}>⏳</Text>
                    <Text style={[styles.pillValue, { color: colors.border }]}>—</Text>
                    <Text style={[styles.pillLabel, { color: colors.border }]}>Remaining</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    pill: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.xl,
        borderWidth: 1.5,
    },
    pillIcon: { fontSize: 20, marginBottom: 6 },
    pillValue: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extraBold, letterSpacing: -0.5 },
    pillLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, marginTop: 4, letterSpacing: 0.3 },
});
