import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, radius, typography } from '../theme';

const PRESETS = [
    { id: '1/3', label: '1/3 Marking', sublabel: 'Deduct ⅓ per block', value: 1 / 3 },
    { id: '1/4', label: '1/4 Marking', sublabel: 'Deduct ¼ per block', value: 1 / 4 },
];

/**
 * Props:
 *  selected        – '1/3' | '1/4' | 'custom'
 *  onSelect        – (id: string) => void
 *  customValue     – string (the raw text in the input, e.g. '0.5')
 *  onCustomChange  – (text: string) => void
 */
export default function NegativeMarkingSelector({ selected, onSelect, customValue, onCustomChange }) {
    const { colors, shadow } = useTheme();

    const isCustom = selected === 'custom';
    const customNum = parseFloat(customValue);
    const customValid = !isNaN(customNum) && customNum >= 0 && customNum <= 1;

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>⚙  Negative Marking</Text>

            {/* ── Preset cards row ── */}
            <View style={styles.optionsRow}>
                {PRESETS.map((opt) => {
                    const isSelected = selected === opt.id;
                    return (
                        <TouchableOpacity
                            key={opt.id}
                            style={[
                                styles.card,
                                { backgroundColor: colors.background, borderColor: isSelected ? colors.primary : colors.border },
                                isSelected && { backgroundColor: colors.accentRipple },
                            ]}
                            onPress={() => onSelect(opt.id)}
                            activeOpacity={0.75}
                        >
                            <View style={[
                                styles.dot,
                                { borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : colors.surface },
                            ]} />
                            <Text style={[styles.fraction, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                                {opt.id}
                            </Text>
                            <Text style={[styles.label, { color: isSelected ? colors.primaryDark : colors.textPrimary }]}>
                                {opt.label}
                            </Text>
                            <Text style={[styles.sublabel, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                                {opt.sublabel}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* ── Custom card ── */}
                <TouchableOpacity
                    style={[
                        styles.card,
                        { backgroundColor: colors.background, borderColor: isCustom ? colors.primary : colors.border },
                        isCustom && { backgroundColor: colors.accentRipple },
                    ]}
                    onPress={() => onSelect('custom')}
                    activeOpacity={0.75}
                >
                    <View style={[
                        styles.dot,
                        { borderColor: isCustom ? colors.primary : colors.border, backgroundColor: isCustom ? colors.primary : colors.surface },
                    ]} />
                    <Text style={[styles.fraction, { color: isCustom ? colors.primary : colors.textSecondary }]}>
                        {isCustom && customValid ? `−${customNum}` : '±?'}
                    </Text>
                    <Text style={[styles.label, { color: isCustom ? colors.primaryDark : colors.textPrimary }]}>
                        Custom
                    </Text>
                    <Text style={[styles.sublabel, { color: isCustom ? colors.primary : colors.textSecondary }]}>
                        Set your own value
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Custom value input (only shown when custom is selected) ── */}
            {isCustom && (
                <View style={[
                    styles.customInputCard,
                    {
                        backgroundColor: colors.background,
                        borderColor: customValid ? colors.primary : colors.danger,
                    },
                ]}>
                    <View style={styles.customInputRow}>
                        <View style={styles.customLabelGroup}>
                            <Text style={[styles.customLabel, { color: colors.textPrimary }]}>
                                Negative Mark per Wrong Answer
                            </Text>
                            <Text style={[styles.customHint, { color: colors.textSecondary }]}>
                                Enter a decimal between 0.01 and 1.00
                            </Text>
                        </View>

                        <View style={styles.customInputWrapper}>
                            <Text style={[styles.minusSign, { color: colors.danger }]}>−</Text>
                            <TextInput
                                style={[
                                    styles.customInput,
                                    {
                                        borderColor: customValid || customValue === '' ? colors.primary : colors.danger,
                                        backgroundColor: colors.primaryLight,
                                        color: colors.primary,
                                    },
                                ]}
                                value={customValue}
                                onChangeText={(t) => {
                                    // Allow digits and one decimal point only
                                    const cleaned = t.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                    onCustomChange(cleaned);
                                }}
                                placeholder="e.g. 0.5"
                                placeholderTextColor={colors.border}
                                keyboardType="decimal-pad"
                                maxLength={5}
                                returnKeyType="done"
                            />
                        </View>
                    </View>

                    {/* Validation feedback */}
                    {customValue !== '' && !customValid && (
                        <Text style={[styles.validationMsg, { color: colors.danger }]}>
                            ⚠  Value must be between 0.01 and 1.00
                        </Text>
                    )}
                    {customValue !== '' && customValid && (
                        <Text style={[styles.validationMsg, { color: colors.success }]}>
                            ✓  Deducting {customNum.toFixed(4)} mark per wrong answer
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semiBold,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
    },
    optionsRow: { flexDirection: 'row', gap: spacing.sm },
    card: {
        flex: 1,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 2,
        alignItems: 'flex-start',
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        marginBottom: spacing.sm,
    },
    fraction: { fontSize: typography.sizes.lg, fontWeight: typography.weights.extraBold, marginBottom: 2 },
    label: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, marginBottom: 2 },
    sublabel: { fontSize: typography.sizes.xs },

    // ── Custom input card ────────────────────────────────────────
    customInputCard: {
        borderRadius: radius.lg,
        borderWidth: 2,
        padding: spacing.md,
        marginTop: spacing.sm,
    },
    customInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    customLabelGroup: { flex: 1 },
    customLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.semiBold },
    customHint: { fontSize: typography.sizes.xs, marginTop: 2 },
    customInputWrapper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    minusSign: { fontSize: typography.sizes.xl, fontWeight: typography.weights.extraBold },
    customInput: {
        width: 76,
        height: 44,
        borderRadius: radius.md,
        borderWidth: 2,
        textAlign: 'center',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        paddingHorizontal: spacing.xs,
    },
    validationMsg: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
});
