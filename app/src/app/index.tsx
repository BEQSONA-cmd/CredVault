import { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TextInput } from "react-native";
import { storage } from '../utils/storage';
import { useStatic } from '../components/shared/useStatic';
import { Credential } from '../types';
import CredentialsList from '../components/CredentialsList';
import { useTheme } from '../context/ThemeContext';
import { usePinCode } from '../context/PinCodeContext';

export function PinCodeModal({
    visible,
    onSuccess
}: {
    visible: boolean;
    onSuccess: () => void;
}) {
    const { isDark } = useTheme();
    const { pinCode } = usePinCode();

    const [digits, setDigits] = useState(["", "", "", ""]);
    const [error, setError] = useState("");

    const refs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const reset = () => {
        setDigits(["", "", "", ""]);
        setError("");
        refs[0].current?.focus();
    };

    const verifyPin = (digitsArr: string[]) => {
        const entered = digitsArr.join("");

        if (entered === pinCode) {
            onSuccess();
            reset();
        } else {
            setError("Incorrect PIN code");
            setTimeout(() => reset(), 700);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 3) {
            refs[index + 1].current?.focus();
        }

        if (newDigits.every(d => d !== "")) {
            verifyPin(newDigits);
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === "Backspace" && !digits[index] && index > 0) {
            refs[index - 1].current?.focus();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/60 justify-center items-center px-6">

                <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} w-full max-w-sm rounded-3xl p-7 shadow-xl`}>

                    {/* TITLE */}
                    <Text className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Unlock Vault
                    </Text>

                    <Text className={`text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter your 4-digit PIN
                    </Text>

                    {/* INPUTS */}
                    <View className="flex-row justify-between mt-8">

                        {digits.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={refs[index]}
                                value={digit}
                                onChangeText={v => handleChange(index, v)}
                                onKeyPress={({ nativeEvent }) =>
                                    handleKeyPress(index, nativeEvent.key)
                                }
                                keyboardType="number-pad"
                                maxLength={1}
                                autoFocus={index === 0}
                                className={`w-16 h-16 text-center text-2xl font-bold rounded-xl border
                                ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300 text-gray-900'
                                    }`}
                            />
                        ))}
                    </View>

                    {/* ERROR MESSAGE */}
                    {error !== "" && (
                        <Text className="text-red-500 text-center mt-4 font-medium">
                            {error}
                        </Text>
                    )}
                </View>

            </View>
        </Modal>
    );
}

export default function HomePage() {
    const { state, setState } = usePinCode();
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');
    const { isDark } = useTheme();

    useEffect(() => {
        if (state !== 'unlocked' && state !== "noPin") return;

        const loadCredentials = async () => {
            const creds = await storage.getAll();
            setCredentials(creds);
        };

        loadCredentials();
    }, [state]);

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>

            <PinCodeModal
                visible={state === "locked"}
                onSuccess={() => setState("unlocked")}
            />

            {(state === "noPin" || state === "unlocked") && (
                <CredentialsList credentialList={credentials} />
            )}
        </View>
    );
}