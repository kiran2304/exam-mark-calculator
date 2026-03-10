import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

export default function QuestionLimitField({ value, onChange }) {
    const { colors, shadow } = useTheme();
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.labelGroup}>
                    <Text style={[styles.label, { color: colors.textPrimary }]}>Total Questions in Exam</Text>
                    <Text style={[styles.hint, { color: colors.textSecondary }]}>Tracks remaining &amp; percentage</Text>
                </View>
                <TextInput
                    style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.primaryLight, color: colors.primary }]}
                    value={value}
                    onChangeText={(t) => {
                        const cleaned = t.replace(/[^0-9]/g, '');
                        const parsed = cleaned === '' ? '' : String(parseInt(cleaned, 10));
                        onChange(parsed);
                    }}
                    keyboardType="number-pad"
                    placeholder="e.g. 100"
                    placeholderTextColor={colors.border}
                    maxLength={4}
                    returnKeyType="done"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingTop: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    labelGroup: { flex: 1 },
    label: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
    hint: { fontSize: typography.sizes.sm, marginTop: 4 },
    input: {
        width: 80,
        height: 48,
        borderRadius: radius.md,
        borderWidth: 2,
        textAlign: 'center',
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.extraBold,
        paddingHorizontal: spacing.sm,
    },
});
