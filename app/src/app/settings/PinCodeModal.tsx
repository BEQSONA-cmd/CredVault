import { TouchableOpacity, View, Text, Modal, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from "react";
import { usePinCode } from "../../context/PinCodeContext";

export default function PinCodeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { isDark } = useTheme();
    const { setPinCode } = usePinCode();

    const [digits, setDigits] = useState(["", "", "", ""]);

    const refs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 3) {
            refs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key === "Backspace" && !digits[index] && index > 0) {
            refs[index - 1].current?.focus();
        }
    };

    const handleSetPin = () => {
        if (digits.some(d => !d)) return;
        const pin = digits.join("");
        setPinCode(pin);
        setDigits(["", "", "", ""]);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl w-full max-w-sm p-6 shadow-lg`}>
                    <Text className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Set Pin Code
                    </Text>

                    {/* 4-digit PIN inputs */}
                    <View className="flex-row justify-between mt-8">
                        {digits.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={refs[index]}
                                value={digit}
                                onChangeText={v => handleChange(index, v)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                                keyboardType="number-pad"
                                maxLength={1}
                                className={`w-16 h-16 text-center text-2xl font-semibold rounded-xl ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border shadow-sm`}
                            />
                        ))}
                    </View>

                    {/* Buttons */}
                    <View className="mt-10 flex-row justify-between gap-4">
                        {/* Cancel */}
                        <TouchableOpacity
                            onPress={() => {
                                setDigits(["", "", "", ""]);
                                onClose();
                            }}
                            className={`flex-1 py-3 rounded-xl items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-200'} shadow`}
                        >
                            <Text className={`${isDark ? 'text-gray-200' : 'text-gray-800'} text-lg font-semibold`}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Save */}
                        <TouchableOpacity
                            onPress={handleSetPin}
                            className={`flex-1 py-3 rounded-xl items-center justify-center ${digits.some(d => !d) ? 'bg-green-400' : 'bg-green-600'} shadow`}
                            disabled={digits.some(d => !d)}
                        >
                            <Text className="text-white text-lg font-semibold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}