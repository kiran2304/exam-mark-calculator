import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    useWindowDimensions,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import NegativeMarkingSelector from '../components/NegativeMarkingSelector';
import CounterSection from '../components/CounterSection';
import ScoreSection from '../components/ScoreSection';
import PercentageSection from '../components/PercentageSection';
import StatsSection from '../components/StatsSection';
import QuestionLimitField from '../components/QuestionLimitField';
import ResultsHistory from '../components/ResultsHistory';
import HoverCard from '../components/HoverCard';
import { useResultsStorage } from '../hooks/useResultsStorage';
import { buildShareText, shareResult } from '../utils/share';
import { spacing, radius, typography, layout } from '../theme';

export default function HomeScreen() {
    const { colors, shadow, isDark } = useTheme();
    const [negativeMarking, setNegativeMarking] = useState('1/3');
    const [rightAnswers, setRightAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [totalQuestionsStr, setTotalQuestionsStr] = useState('');
    const [customNegStr, setCustomNegStr] = useState('');
    const [limitWarning, setLimitWarning] = useState(false);
    const [shareStatus, setShareStatus] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    // ── Animations ──
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // ── PWA Install State ──
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    useEffect(() => {
        // Subtle loading delay to let resources load, then animate
        const timer = setTimeout(() => {
            setIsAppLoading(false);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 40,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]).start();
        }, 150);
        return () => clearTimeout(timer);
    }, []);

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
    const isTablet = width >= 768 && width < 1024;
    const isWide = width >= 1024;

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
    const s = buildStyles(colors, shadow, isWide, isTablet);

    if (isAppLoading) {
        return (
            <SafeAreaView style={[s.safe, s.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
            <ScrollView
                contentContainerStyle={[s.scroll, isWide && s.scrollWide]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    {/* ── Header ── */}
                    <View style={s.headerRow}>
                        <View style={s.headerText}>
                            <Text style={[s.title, { color: colors.textPrimary }]}>ExamMark Calculator</Text>
                            <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>Government Exam Marks Calculator</Text>
                        </View>

                        {/* Install App Banner (Desktop header right / Mobile stacked) */}
                        {deferredPrompt && !isAppInstalled && (
                            <TouchableOpacity
                                style={[s.installBanner, { backgroundColor: colors.background, borderColor: colors.primary }]}
                                onPress={handleInstallClick}
                                activeOpacity={0.8}
                            >
                                <Text style={[s.installIcon, { color: colors.primary }]}>📱</Text>
                                <View style={s.installTextGroup}>
                                    <Text style={[s.installTitle, { color: colors.primary }]}>Install App</Text>
                                    {!isWide && <Text style={[s.installSub, { color: colors.textSecondary }]}>Add wrapper to home screen</Text>}
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* ── Limit warning ── */}
                    {limitWarning && (
                        <View style={[s.warningBanner, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
                            <Text style={[s.warningText, { color: colors.warningText }]}>
                                ⚠️  Attempted answers cannot exceed total questions.
                            </Text>
                        </View>
                    )}

                    <View style={s.gridWrapper}>
                        {/* ── 1. Exam Settings ── */}
                        <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>Exam Settings</Text>
                        <View style={s.gridRow}>
                            <HoverCard style={s.gridCellFull}>
                                <View style={[s.settingsCard, { backgroundColor: colors.surface }, shadow.card]}>
                                    <NegativeMarkingSelector
                                        selected={negativeMarking}
                                        onSelect={setNegativeMarking}
                                        customValue={customNegStr}
                                        onCustomChange={setCustomNegStr}
                                    />
                                    <QuestionLimitField value={totalQuestionsStr} onChange={setTotalQuestionsStr} />
                                </View>
                            </HoverCard>
                        </View>

                        {/* ── 2. Answer Inputs ── */}
                        <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>Answer Inputs</Text>
                        <View style={s.inputsContainer}>
                            <View style={s.inputsCardWrapper}>
                                <HoverCard>
                                    <CounterSection
                                        label="✅  Right Answers"
                                        count={rightAnswers}
                                        onIncrement={handleRightIncrement}
                                        onDecrement={() => setRightAnswers((c) => Math.max(0, c - 1))}
                                        accentColor={colors.success}
                                        limitReached={!canIncrement()}
                                    />
                                </HoverCard>
                                <View style={{ height: 20 }} />
                                <HoverCard>
                                    <CounterSection
                                        label="❌  Wrong Answers"
                                        count={wrongAnswers}
                                        onIncrement={handleWrongIncrement}
                                        onDecrement={() => setWrongAnswers((c) => Math.max(0, c - 1))}
                                        accentColor={colors.danger}
                                        limitReached={!canIncrement()}
                                    />
                                </HoverCard>
                            </View>
                        </View>

                        {/* ── 3. Exam Progress ── */}
                        <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>Exam Progress</Text>
                        <View style={s.gridRow}>
                            <HoverCard style={s.gridCellFull}>
                                <StatsSection rightAnswers={rightAnswers} wrongAnswers={wrongAnswers} totalQuestions={totalQuestions} />
                            </HoverCard>
                        </View>

                        {/* ── 4. Result Section ── */}
                        <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>Result Section</Text>
                        <View style={s.gridRow}>
                            <HoverCard style={s.gridCell}>
                                <ScoreSection
                                    rightAnswers={rightAnswers}
                                    wrongAnswers={wrongAnswers}
                                    negValue={negValue}
                                    negLabel={negLabel}
                                />
                            </HoverCard>
                            <HoverCard style={s.gridCell}>
                                <PercentageSection totalScore={totalScore} totalQuestions={totalQuestions} />
                            </HoverCard>
                        </View>

                        {/* ── 5. Action Buttons ── */}
                        <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>Actions</Text>
                        <View style={isWide ? s.gridRow : s.actionsColumn}>
                            <HoverCard style={s.gridCell}>
                                <TouchableOpacity
                                    style={[s.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={handleReset}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[s.actionBtnIcon, { color: colors.textPrimary }]}>↺</Text>
                                    <Text style={[s.actionBtnLabel, { color: colors.textPrimary }]}>Reset</Text>
                                </TouchableOpacity>
                            </HoverCard>
                            <HoverCard style={s.gridCell}>
                                <TouchableOpacity
                                    style={[s.actionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }, shadow.button]}
                                    onPress={handleSave}
                                    activeOpacity={0.85}
                                >
                                    <Text style={[s.actionBtnIcon, { color: '#FFFFFF' }]}>💾</Text>
                                    <Text style={[s.actionBtnLabel, { color: '#FFFFFF' }]}>Save Result</Text>
                                </TouchableOpacity>
                            </HoverCard>
                            <HoverCard style={s.gridCell}>
                                <TouchableOpacity
                                    style={[s.actionBtn, { backgroundColor: colors.surface, borderColor: colors.primary }, shadow.card]}
                                    onPress={handleShare}
                                    activeOpacity={0.85}
                                >
                                    <Text style={s.actionBtnIcon}>📤</Text>
                                    <Text style={[s.actionBtnLabel, { color: colors.primary }]}>
                                        {shareStatus === 'copied' ? 'Copied! ✓' : 'Share'}
                                    </Text>
                                </TouchableOpacity>
                            </HoverCard>
                        </View>
                    </View>

                    <View style={[s.divider, { backgroundColor: colors.border }]} />

                    {/* ── Saved Results History ── */}
                    <View style={[s.card, { backgroundColor: colors.surface }, shadow.card]}>
                        <ResultsHistory results={results} onDelete={deleteResult} onClearAll={clearAll} loading={loading} />
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

function buildStyles(colors, shadow, isWide, isTablet) {
    const padContent = isWide ? layout.desktopPaddingRoot : (isTablet ? layout.tabletPaddingRoot : layout.mobilePaddingRoot);

    return StyleSheet.create({
        safe: { flex: 1 },
        loadingContainer: { justifyContent: 'center', alignItems: 'center' },
        scroll: { flexGrow: 1, paddingHorizontal: padContent, paddingTop: padContent, paddingBottom: spacing.xxl },
        scrollWide: { maxWidth: layout.desktopMaxWidth, alignSelf: 'center', width: '100%' },

        headerRow: {
            flexDirection: isWide ? 'row' : 'column',
            alignItems: isWide ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            marginBottom: spacing.xl,
            gap: spacing.lg,
        },
        headerText: { flex: 1 },
        title: { fontSize: isWide ? typography.sizes.hero : typography.sizes.xxl, fontWeight: typography.weights.extraBold, letterSpacing: -0.5 },
        headerSubtitle: { fontSize: typography.sizes.md, marginTop: spacing.xs, fontWeight: typography.weights.medium },

        warningBanner: { borderRadius: radius.md, borderWidth: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md, marginBottom: spacing.md },
        warningText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semiBold, textAlign: 'center' },

        installBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: radius.full,
            borderWidth: 2,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
            alignSelf: isWide ? 'flex-end' : 'auto',
            marginBottom: isWide ? 0 : spacing.sm
        },
        installIcon: { fontSize: 20, marginRight: spacing.sm, fontWeight: '900' },
        installTextGroup: { justifyContent: 'center' },
        installTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
        installSub: { fontSize: typography.sizes.xs, opacity: 0.9, fontWeight: typography.weights.medium },

        // ── Grid Layout ──
        sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, letterSpacing: 0.5, marginTop: spacing.md, marginBottom: spacing.xs },
        gridWrapper: { display: 'flex', flexDirection: 'column', gap: isWide ? layout.desktopGridGap : spacing.md, marginBottom: spacing.xl },
        gridRow: { flexDirection: isWide ? 'row' : 'column', alignItems: 'stretch', gap: isWide ? layout.desktopGridGap : spacing.md },
        gridCell: isWide ? { flex: 1 } : { width: '100%' },
        gridCellFull: { width: '100%' },

        settingsCard: { borderRadius: radius.xl, padding: spacing.lg, overflow: 'hidden', height: '100%' },

        // ── Answer Inputs ──
        inputsContainer: { justifyContent: 'center', alignItems: 'center', width: '100%' },
        inputsCardWrapper: { width: '100%', maxWidth: 1100 },

        // ── Result Section ──

        // ── Action Buttons ──
        actionsColumn: { flexDirection: 'column', gap: spacing.md },
        actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radius.xl, borderWidth: 2, height: '100%', justifyContent: 'center', gap: spacing.sm },
        actionBtnIcon: { fontSize: 20 },
        actionBtnLabel: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, letterSpacing: 0.5 },

        divider: { height: 1, marginVertical: spacing.xl, opacity: 0.5 },
    });
}
