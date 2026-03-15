import { TouchableOpacity, View, Text, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { storage } from '../../utils/storage';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStatic } from "../../components/shared/useStatic";
import { Credential } from "../../types";
import CustomAlert from "../../components/shared/CustomAlert";
import { useState, useRef } from "react";
import { usePinCode } from "../../context/PinCodeContext";
import PinCodeModal from "./PinCodeModal";

async function getNewCredentials(importedCredentials: Credential[]) {
    const allCredentials = await storage.getAll();
    const newCredentials = importedCredentials.filter(cred => {
        return !allCredentials.some((existingCred) => existingCred.id === cred.id);
    });
    return newCredentials;
}

export default function Settings() {
    const router = useRouter();
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [pinCodeModal, setPinCodeModal] = useState(false);

    const { toggleTheme, isDark } = useTheme();
    const { removePinCode, state } = usePinCode();
    const [credentials, setCredentials] = useStatic<Credential[]>('credentials');

    const handleDeleteAll = async () => {
        await storage.clearAll();
        setCredentials([]);
        setDeleteAlert(false);
    }

    const handleDownloadCredentials = async () => {
        try {
            const credentials = await storage.getAll();

            if (!credentials.length) {
                Alert.alert("No data", "You have no credentials to export.");
                return;
            }

            const json = JSON.stringify(credentials, null, 2);
            const fileUri = FileSystem.documentDirectory + "credentials-backup.json";

            await FileSystem.writeAsStringAsync(fileUri, json, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            await Sharing.shareAsync(fileUri);

        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to export credentials.");
        }
    };

    const handleUploadCredentials = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;

            const content = await FileSystem.readAsStringAsync(fileUri);

            const importedCredentials = JSON.parse(content);

            if (!Array.isArray(importedCredentials)) {
                Alert.alert("Invalid file", "This is not a valid credentials backup.");
                return;
            }

            const newCredentials = await getNewCredentials(importedCredentials);
            await storage.addList(newCredentials);
            setCredentials([...credentials, ...newCredentials]);

            Alert.alert("Success", "Credentials imported successfully.");

        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to import credentials.");
        }
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <CustomAlert
                visible={deleteAlert}
                title="Confirm Deletion"
                message="Are you sure you want to delete all your data?"
                buttons={[
                    { text: 'Cancel', style: 'cancel', onPress: () => setDeleteAlert(false) },
                    { text: 'Delete', style: 'destructive', onPress: () => handleDeleteAll() },
                ]}
                onClose={() => setDeleteAlert(false)}
            />
            <PinCodeModal visible={pinCodeModal} onClose={() => setPinCodeModal(false)} />

            <View className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} px-6 py-4 border-b flex-row justify-between items-center`}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                    <Ionicons name="close" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Settings
                </Text>
                <View className="w-10" />
            </View>
            <View className="px-6 pt-10">

                {/* APPEARANCE SECTION */}
                <Text className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Appearance
                </Text>

                <View className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border`}>

                    <TouchableOpacity
                        onPress={toggleTheme}
                        className={`flex-row items-center justify-between px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name={isDark ? "moon" : "sunny"}
                                size={20}
                                color="#3B82F6"
                            />
                            <Text className={`ml-3 text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Dark Mode
                            </Text>
                        </View>

                        <View
                            className={`w-12 h-6 rounded-full ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <View
                                className={`w-6 h-6 bg-white border border-gray-300 rounded-full transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (state == 'unlocked') {
                                removePinCode();
                            } else {
                                setPinCodeModal(true);
                            }
                        }}
                        className={`flex-row items-center justify-between px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name={state == 'unlocked' ? "lock-closed" : "lock-open"}
                                size={20}
                                color="#3B82F6"
                            />
                            <Text className={`ml-3 text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Pin Code
                            </Text>
                        </View>

                        <View
                            className={`w-12 h-6 rounded-full ${state == 'unlocked' ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <View
                                className={`w-6 h-6 bg-white border border-gray-300 rounded-full transform ${state == 'unlocked' ? 'translate-x-6' : 'translate-x-0'}`}
                            />
                        </View>
                    </TouchableOpacity>

                </View>


                {/* DATA SECTION */}
                <Text className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Data
                </Text>

                <View className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

                    {/* EXPORT */}
                    <TouchableOpacity
                        onPress={handleDownloadCredentials}
                        className={`flex-row items-center justify-between px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="download-outline" size={20} color="#3B82F6" />
                            <Text className={`ml-3 text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Export Credentials
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* IMPORT */}
                    <TouchableOpacity
                        onPress={handleUploadCredentials}
                        className={`flex-row items-center justify-between px-4 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="cloud-upload-outline" size={20} color="#3B82F6" />
                            <Text className={`ml-3 text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Import Credentials
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* CLEAR ALL DATA */}
                    <TouchableOpacity
                        onPress={() => setDeleteAlert(true)}
                        className="flex-row items-center justify-between px-4 py-4"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="trash-outline" size={20} color="#3B82F6" />
                            <Text className={`ml-3 text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Clear All Data
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
}
