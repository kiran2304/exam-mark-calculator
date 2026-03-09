import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    useWindowDimensions,
    Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import NegativeMarkingSelector from '../components/NegativeMarkingSelector';
import CounterSection from '../components/CounterSection';
import ScoreSection from '../components/ScoreSection';
import PercentageSection from '../components/PercentageSection';
import StatsSection from '../components/StatsSection';
import QuestionLimitField from '../components/QuestionLimitField';
import ResultsHistory from '../components/ResultsHistory';
import { useResultsStorage } from '../hooks/useResultsStorage';
import { buildShareText, shareResult } from '../utils/share';
import { spacing, radius, typography } from '../theme';

export default function HomeScreen() {
    const { colors, shadow, isDark } = useTheme();
    const [negativeMarking, setNegativeMarking] = useState('1/3');
    const [rightAnswers, setRightAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [totalQuestionsStr, setTotalQuestionsStr] = useState('');
    const [customNegStr, setCustomNegStr] = useState('');
    const [limitWarning, setLimitWarning] = useState(false);
    const [shareStatus, setShareStatus] = useState(null);

    // ── PWA Install State ──
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setDeferredPrompt(null);
            console.log("ExamMark Calculator installed successfully");
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            setIsAppInstalled(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const { width } = useWindowDimensions();
    const isWide = width >= 768;

    // ── Derived values ────────────────────────────────────────────
    const totalQuestions = totalQuestionsStr === '' ? null : parseInt(totalQuestionsStr, 10);
    const attempted = rightAnswers + wrongAnswers;

    // Resolve the actual numeric neg value + display label
    const PRESETS = { '1/3': { value: 1 / 3, label: '1/3' }, '1/4': { value: 1 / 4, label: '1/4' } };
    const customNegNum = parseFloat(customNegStr);
    const customValid = !isNaN(customNegNum) && customNegNum >= 0.01 && customNegNum <= 1;
    const negValue = negativeMarking === 'custom'
        ? (customValid ? customNegNum : 0)          // 0 = no deduction until user enters valid value
        : (PRESETS[negativeMarking]?.value ?? 1 / 3);
    const negLabel = negativeMarking === 'custom'
        ? (customValid ? String(customNegNum) : 'Custom')
        : (PRESETS[negativeMarking]?.label ?? '1/3');

    const totalScore = rightAnswers * 1 - wrongAnswers * negValue;
    const percentage = totalQuestions ? (totalScore / totalQuestions) * 100 : null;

    const { results, saveResult, deleteResult, clearAll, loading } = useResultsStorage();

    // ── Helpers ───────────────────────────────────────────────────
    const showWarning = useCallback(() => {
        setLimitWarning(true);
        const t = setTimeout(() => setLimitWarning(false), 3000);
        return () => clearTimeout(t);
    }, []);

    const canIncrement = () => totalQuestions === null || attempted < totalQuestions;

    const handleRightIncrement = () => {
        if (!canIncrement()) { showWarning(); return; }
        setRightAnswers((c) => c + 1);
    };

    const handleWrongIncrement = () => {
        if (!canIncrement()) { showWarning(); return; }
        setWrongAnswers((c) => c + 1);
    };

    const handleReset = () => {
        setRightAnswers(0);
        setWrongAnswers(0);
        setLimitWarning(false);
    };

    const handleSave = () => {
        saveResult({ rightAnswers, wrongAnswers, negativeMarking: negLabel, totalScore, attempted, percentage });
    };

    const handleShare = async () => {
        const text = buildShareText({ rightAnswers, wrongAnswers, negativeMarking: negLabel, totalScore, attempted, percentage });
        const result = await shareResult(text);
        if (result.success) {
            if (result.method === 'clipboard') {
                setShareStatus('copied');
                setTimeout(() => setShareStatus(null), 2500);
            }
        }
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    // ── Styles (dynamic, theme-aware) ─────────────────────────────
    const s = buildStyles(colors, shadow);

    return (
        <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
            <ScrollView
                contentContainerStyle={[s.scroll, isWide && s.scrollWide]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Header ── */}
                <View style={s.headerRow}>
                    <View style={s.headerText}>
                        <View style={[s.badgePill, { backgroundColor: colors.primaryLight }]}>
                            <Text style={[s.badgeText, { color: colors.primary }]}>EXAM TOOLS</Text>
                        </View>
                        <Text style={[s.title, { color: colors.textPrimary }]}>Government Exam{'\n'}Mark Calculator</Text>
                    </View>

                    {/* Reset button */}
                    <TouchableOpacity
                        style={[s.resetBtn, { backgroundColor: colors.surface, borderColor: colors.border }, shadow.card]}
                        onPress={handleReset}
                        activeOpacity={0.75}
                    >
                        <Text style={[s.resetIcon, { color: colors.textPrimary }]}>↺</Text>
                        <Text style={[s.resetLabel, { color: colors.textSecondary }]}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                    Select negative marking, track your answers, and save your results.
                </Text>

                {/* ── Install App Banner (PWA) ── */}
                {deferredPrompt && !isAppInstalled && (
                    <TouchableOpacity
                        style={[s.installBanner, { backgroundColor: colors.success + '15', borderColor: colors.success }]}
                        onPress={handleInstallClick}
                        activeOpacity={0.8}
                    >
                        <Text style={[s.installIcon, { color: colors.success }]}>⬇️</Text>
                        <View style={s.installTextGroup}>
                            <Text style={[s.installTitle, { color: colors.success }]}>Install App</Text>
                            <Text style={[s.installSub, { color: colors.textSecondary }]}>Add to Home Screen for instant offline access</Text>
                        </View>
                    </TouchableOpacity>
                )}

                <View style={[s.divider, { backgroundColor: colors.border }]} />

                {/* ── Negative Marking ── */}
                <NegativeMarkingSelector
                    selected={negativeMarking}
                    onSelect={setNegativeMarking}
                    customValue={customNegStr}
                    onCustomChange={setCustomNegStr}
                />

                {/* ── Question Limit ── */}
                <QuestionLimitField value={totalQuestionsStr} onChange={setTotalQuestionsStr} />

                {/* ── Limit warning ── */}
                {limitWarning && (
                    <View style={[s.warningBanner, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
                        <Text style={[s.warningText, { color: colors.warningText }]}>
                            ⚠️  Attempted answers cannot exceed total questions.
                        </Text>
                    </View>
                )}

                {/* ── Right & Wrong counters ── */}
                <CounterSection
                    label="✓  Right Answers"
                    count={rightAnswers}
                    onIncrement={handleRightIncrement}
                    onDecrement={() => setRightAnswers((c) => Math.max(0, c - 1))}
                    accentColor={colors.success}
                    limitReached={!canIncrement()}
                />
                <CounterSection
                    label="✗  Wrong Answers"
                    count={wrongAnswers}
                    onIncrement={handleWrongIncrement}
                    onDecrement={() => setWrongAnswers((c) => Math.max(0, c - 1))}
                    accentColor={colors.danger}
                    limitReached={!canIncrement()}
                />

                {/* ── Attempted / Remaining ── */}
                <StatsSection rightAnswers={rightAnswers} wrongAnswers={wrongAnswers} totalQuestions={totalQuestions} />

                <View style={[s.divider, { backgroundColor: colors.border }]} />

                {/* ── Total Score ── */}
                <ScoreSection
                    rightAnswers={rightAnswers}
                    wrongAnswers={wrongAnswers}
                    negValue={negValue}
                    negLabel={negLabel}
                />

                {/* ── Percentage (only when total questions is set) ── */}
                <PercentageSection totalScore={totalScore} totalQuestions={totalQuestions} />

                {/* ── Action buttons row ── */}
                <View style={s.actionsRow}>
                    {/* Save Result */}
                    <TouchableOpacity style={[s.saveBtn, { backgroundColor: colors.primary }, shadow.button]} onPress={handleSave} activeOpacity={0.82}>
                        <Text style={s.saveBtnIcon}>💾</Text>
                        <Text style={s.saveBtnText}>Save Result</Text>
                    </TouchableOpacity>

                    {/* Share Result */}
                    <TouchableOpacity
                        style={[s.shareBtn, { backgroundColor: colors.surface, borderColor: colors.primary }, shadow.card]}
                        onPress={handleShare}
                        activeOpacity={0.82}
                    >
                        <Text style={s.shareBtnIcon}>📤</Text>
                        <Text style={[s.shareBtnText, { color: colors.primary }]}>
                            {shareStatus === 'copied' ? 'Copied! ✓' : 'Share'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[s.divider, { backgroundColor: colors.border }]} />

                {/* ── Saved Results History ── */}
                <ResultsHistory results={results} onDelete={deleteResult} onClearAll={clearAll} loading={loading} />
            </ScrollView>
        </SafeAreaView>
    );
}

function buildStyles(colors, shadow) {
    return StyleSheet.create({
        safe: { flex: 1 },
        scroll: { flexGrow: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
        scrollWide: { maxWidth: 480, alignSelf: 'center', width: '100%' },

        headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.sm },
        headerText: { flex: 1, paddingRight: spacing.sm },
        badgePill: { alignSelf: 'flex-start', borderRadius: 100, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm },
        badgeText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, letterSpacing: 1.2 },
        title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extraBold, lineHeight: 36 },
        subtitle: { fontSize: typography.sizes.sm, lineHeight: 20, marginBottom: spacing.lg },

        resetBtn: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1.5, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.sm, minWidth: 64 },
        resetIcon: { fontSize: 18, lineHeight: 22 },
        resetLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semiBold, marginTop: 2 },

        warningBanner: { borderRadius: radius.md, borderWidth: 1, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
        warningText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, textAlign: 'center' },

        installBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1.5, padding: spacing.md, marginBottom: spacing.lg },
        installIcon: { fontSize: 24, marginRight: spacing.md },
        installTextGroup: { flex: 1 },
        installTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, marginBottom: 2 },
        installSub: { fontSize: typography.sizes.xs },

        divider: { height: 1, marginBottom: spacing.lg },

        actionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, marginBottom: spacing.lg },
        saveBtn: { flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, paddingVertical: spacing.md, gap: spacing.sm },
        saveBtnIcon: { fontSize: 18 },
        saveBtnText: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: '#FFFFFF', letterSpacing: 0.2 },
        shareBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, paddingVertical: spacing.md, borderWidth: 2, gap: spacing.sm },
        shareBtnIcon: { fontSize: 18 },
        shareBtnText: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
    });
}
