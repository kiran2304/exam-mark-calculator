// Native platform storage adapter — uses AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'exammark_results';

export const StorageAdapter = {
    async getItem() {
        return AsyncStorage.getItem(STORAGE_KEY);
    },
    async setItem(value) {
        return AsyncStorage.setItem(STORAGE_KEY, value);
    },
    async removeItem() {
        return AsyncStorage.removeItem(STORAGE_KEY);
    },
};
