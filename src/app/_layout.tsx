import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootLayoutWrapper() {
    const { isDark } = useTheme();
    useEffect(() => {
        NavigationBar.setStyle("dark");
    }, [isDark]);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} className="bg-gray-900">
                <Header />
                <Stack screenOptions={{ headerShown: false }} />
                <Footer />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <RootLayoutWrapper />
        </ThemeProvider>
    );
}