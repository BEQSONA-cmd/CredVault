import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { storage } from '../utils/storage';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import CredentialsList from '../components/CredentialsList';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const { isDark } = useTheme();

    useEffect(() => {
        const loadCredentials = async () => {
            const creds = await storage.getAll();
            setCredentials(creds);
        };
        loadCredentials();
    }, []);

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <CredentialsList
                credentialList={credentials}
            />
        </View>
    );
}