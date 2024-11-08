import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { useSession } from '@/app/context/ctx';

export default function SignIn() {
    const { signIn } = useSession();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}
                onPress={() => {
                    signIn();
                    router.replace('/');
                }}>
                Sign In
            </Text>
        </View>
    );
}
