// Web platform storage adapter — uses localStorage
const STORAGE_KEY = 'exammark_results';

export const StorageAdapter = {
    async getItem() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    },
    async setItem(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch { /* storage full, ignore */ }
    },
    async removeItem() {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch { /* ignore */ }
    },
};
