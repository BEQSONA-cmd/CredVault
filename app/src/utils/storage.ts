import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { Credential } from '../types';

const STORAGE_KEY = 'passvault_credentials';
const THEME_KEY = '@theme';


class StorageService {
    private isAvailable: boolean | null = null;

    constructor() {
        this.checkAvailability();
    }

    private async checkAvailability(): Promise<boolean> {
        if (this.isAvailable !== null) return this.isAvailable;

        try {
            // Test AsyncStorage with a simple operation
            await AsyncStorage.setItem('__test', 'test');
            const value = await AsyncStorage.getItem('__test');
            await AsyncStorage.removeItem('__test');

            this.isAvailable = value === 'test';
            return this.isAvailable;
        } catch (error) {
            this.isAvailable = false;
            return false;
        }
    }

    async getAll(): Promise<Credential[]> {
        const available = await this.checkAvailability();

        if (!available) {
            Alert.alert(
                'Storage Error',
                'Unable to access device storage. Please make sure you have granted storage permissions and try restarting the app.'
            );
            return [];
        }

        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load credentials. Please try again.'
            );
            return [];
        }
    }

    async search(query: string): Promise<Credential[]> {
        try {
            const credentials = await this.getAll();
            const lowerQuery = query.toLowerCase();
            return credentials.filter(c =>
                c.name.toLowerCase().includes(lowerQuery) ||
                c.fields.some(f => f.value.toLowerCase().includes(lowerQuery))
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to search credentials. Please try again.'
            );
            return [];
        }
    }

    async get(id: string): Promise<Credential | null> {
        try {
            const credentials = await this.getAll();
            return credentials.find(c => c.id === id) || null;
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load credential. Please try again.'
            );
            return null;
        }
    }

    async save(credentials: Credential[]): Promise<boolean> {
        const available = await this.checkAvailability();

        if (!available) {
            Alert.alert(
                'Storage Error',
                'Unable to access device storage. Please make sure your device has available storage space and try again.'
            );
            return false;
        }

        try {
            const jsonValue = JSON.stringify(credentials);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

            // Verify the save was successful
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            return saved === jsonValue;
        } catch (error) {
            console.error('Error saving credentials:', error);
            return false;
        }
    }

    async addList(credentials: Credential[]): Promise<boolean> {
        try {
            const existing = await this.getAll();
            const combined = [...existing, ...credentials];
            return this.save(combined);
        } catch (error) {
            console.error('Error adding credentials:', error);
            return false;
        }
    }

    async add(credential: Credential): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            credentials.push(credential);
            return this.save(credentials);
        } catch (error) {
            console.error('Error adding credential:', error);
            return false;
        }
    }

    async update(id: string, updatedCredential: Credential): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            const index = credentials.findIndex(c => c.id === id);
            if (index !== -1) {
                credentials[index] = updatedCredential;
                return this.save(credentials);
            }
            return false;
        } catch (error) {
            console.error('Error updating credential:', error);
            return false;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const credentials = await this.getAll();
            const filtered = credentials.filter(c => c.id !== id);
            return this.save(filtered);
        } catch (error) {
            console.error('Error deleting credential:', error);
            return false;
        }
    }

    async clearAll(): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    async setPin(value: string): Promise<void> {
        try {
            await AsyncStorage.setItem('pinCode', value);
        } catch (error) {
            console.error('Error setting pin code:', error);
        }
    }

    async getPin(): Promise<string | null> {
        try {
            const pin = await AsyncStorage.getItem('pinCode');
            return pin;
        } catch (error) {
            console.error('Error getting pin code:', error);
            return null;
        }
    }

    async removePin(): Promise<void> {
        try {
            await AsyncStorage.removeItem('pinCode');
        } catch (error) {
            console.error('Error removing pin code:', error);
        }
    }

    async saveTheme(theme: 'light' | 'dark'): Promise<void> {
        try {
            await AsyncStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    async getTheme(): Promise<'light' | 'dark' | null> {
        try {
            const theme = await AsyncStorage.getItem(THEME_KEY);
            return theme as 'light' | 'dark' | null;
        } catch (error) {
            console.error('Error getting theme:', error);
            return null;
        }
    }
}

export const storage = new StorageService();