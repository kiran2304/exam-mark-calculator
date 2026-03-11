import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

function formatDate(isoString) {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${date} · ${time}`;
}

function formatScore(value) {
    if (Number.isInteger(value)) return String(value);
    return Number(value).toFixed(2);
}

function ResultCard({ item, onDelete }) {
    const { colors, shadow } = useTheme();
    const score = parseFloat(item.totalScore);
    const scoreColor = score > 0 ? colors.success : score < 0 ? colors.danger : colors.textSecondary;

    const confirmDelete = () => {
        Alert.alert(
            'Delete Result',
            'Remove this saved result?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) },
            ],
        );
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderLeftColor: colors.primary }, shadow.card]}>
            <View style={styles.cardHeader}>
                <View style={[styles.scoreBox, { borderRightColor: colors.border }]}>
                    <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>SCORE</Text>
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>{formatScore(score)}</Text>
                </View>
                <View style={styles.cardMeta}>
                    <View style={styles.metaRow}>
                        <Text style={[styles.metaIcon, { color: colors.success }]}>✓</Text>
                        <Text style={[styles.metaValue, { color: colors.success }]}>{item.rightAnswers}</Text>
                        <Text style={[styles.metaSep, { color: colors.border }]}>  |  </Text>
                        <Text style={[styles.metaIcon, { color: colors.danger }]}>✗</Text>
                        <Text style={[styles.metaValue, { color: colors.danger }]}>{item.wrongAnswers}</Text>
                    </View>
                    <Text style={[styles.metaLine, { color: colors.textSecondary }]}>
                        Marking: <Text style={[styles.metaHighlight, { color: colors.primary }]}>{item.negativeMarking}</Text>
                        {'   '}Attempted: <Text style={[styles.metaHighlight, { color: colors.primary }]}>{item.attempted}</Text>
                    </Text>
                    {item.percentage != null && (
                        <Text style={[styles.metaLine, { color: colors.textSecondary }]}>
                            Percentage: <Text style={[styles.metaHighlight, { color: colors.primary }]}>{Number(item.percentage).toFixed(2)}%</Text>
                        </Text>
                    )}
                    <Text style={[styles.metaDate, { color: colors.textSecondary }]}>{formatDate(item.savedAt)}</Text>
                </View>
                <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.danger + '18' }]} onPress={confirmDelete} hitSlop={8}>
                    <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function ResultsHistory({ results, onDelete, onClearAll, loading }) {
    const { colors } = useTheme();
    const isEmpty = results.length === 0;

    const confirmClearAll = () => {
        Alert.alert(
            'Clear History',
            'Delete all saved results? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: onClearAll },
            ],
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Saved Results</Text>
                {!isEmpty && (
                    <TouchableOpacity
                        style={[styles.clearBtn, { backgroundColor: colors.danger + '18', borderColor: colors.danger }]}
                        onPress={confirmClearAll}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.clearBtnText, { color: colors.danger }]}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>Loading history…</Text>
                </View>
            ) : isEmpty ? (
                <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={styles.emptyIcon}>📋</Text>
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No saved results yet</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Tap "Save Result" above to store your score.</Text>
                </View>
            ) : (
                results.map((item) => <ResultCard key={item.id} item={item} onDelete={onDelete} />)
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginTop: spacing.sm },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    sectionTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold, letterSpacing: 0.5, textTransform: 'uppercase' },
    clearBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1 },
    clearBtnText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semiBold },
    card: {
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    scoreBox: { alignItems: 'center', minWidth: 64, paddingRight: spacing.sm, borderRightWidth: 1 },
    scoreLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, letterSpacing: 1, marginBottom: 2 },
    scoreValue: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extraBold, letterSpacing: -0.5 },
    cardMeta: { flex: 1, gap: 3 },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    metaIcon: { fontSize: 12, marginRight: 2 },
    metaValue: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
    metaSep: { fontWeight: '400' },
    metaLine: { fontSize: typography.sizes.xs },
    metaHighlight: { fontWeight: typography.weights.semiBold },
    metaDate: { fontSize: typography.sizes.xs, marginTop: 2 },
    deleteBtn: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
    deleteIcon: { fontSize: 16 },
    emptyCard: { borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed' },
    emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
    emptyTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold, marginBottom: spacing.xs },
    emptySubtitle: { fontSize: typography.sizes.sm, textAlign: 'center' },
});
