import { Stack, usePathname, useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { PinCodeProvider } from '../context/PinCodeContext';

function RootLayoutWrapper() {
    const { isDark } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        NavigationBar.setStyle("dark");
    }, [isDark]);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} className="bg-gray-900">
                {pathname === '/' ? (
                    <>
                        <Header />
                        <Stack screenOptions={{ headerShown: false }} />
                        <Footer />
                    </>
                ) : (
                    <Stack screenOptions={{ headerShown: false }} />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <PinCodeProvider>
                <RootLayoutWrapper />
            </PinCodeProvider>
        </ThemeProvider>
    );
}