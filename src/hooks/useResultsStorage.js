import { useState, useEffect, useCallback } from 'react';
// Metro automatically resolves to storage.web.js on web, storage.js on native
import { StorageAdapter } from '../storage/storage';

/**
 * Custom hook for persisted exam result history.
 * Works on both web (localStorage via storage.web.js) and
 * Android (AsyncStorage via storage.js).
 */
export function useResultsStorage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Load on mount ──────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const raw = await StorageAdapter.getItem();
                if (raw) setResults(JSON.parse(raw));
            } catch (e) {
                console.warn('ExamMark: failed to load history', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ── Persist helper ─────────────────────────────────────────
    const persist = useCallback(async (newList) => {
        setResults(newList);
        try {
            await StorageAdapter.setItem(JSON.stringify(newList));
        } catch (e) {
            console.warn('ExamMark: failed to save history', e);
        }
    }, []);

    // ── Save a new result ──────────────────────────────────────
    const saveResult = useCallback(
        ({ rightAnswers, wrongAnswers, negativeMarking, totalScore, attempted }) => {
            const now = new Date();
            const entry = {
                id: now.getTime().toString(),
                rightAnswers,
                wrongAnswers,
                negativeMarking,
                totalScore,
                attempted,
                savedAt: now.toISOString(),
            };
            const updated = [entry, ...results];
            persist(updated);
        },
        [results, persist],
    );

    // ── Delete one entry ───────────────────────────────────────
    const deleteResult = useCallback(
        (id) => {
            persist(results.filter((r) => r.id !== id));
        },
        [results, persist],
    );

    // ── Clear all ──────────────────────────────────────────────
    const clearAll = useCallback(async () => {
        setResults([]);
        try {
            await StorageAdapter.removeItem();
        } catch (e) {
            console.warn('ExamMark: failed to clear history', e);
        }
    }, []);

    return { results, saveResult, deleteResult, clearAll, loading };
}
