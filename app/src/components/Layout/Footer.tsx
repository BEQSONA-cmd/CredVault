import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Footer() {
    const router = useRouter();

    const handleAddCredential = () => {
        router.push('/addCredential');
    }

    return (
        <TouchableOpacity
            onPress={handleAddCredential}
            className="absolute bottom-20 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
            <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
    );
}
