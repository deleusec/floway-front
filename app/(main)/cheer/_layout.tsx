import BackFooter from '@/components/layouts/footer/back';
import BackHeader from '@/components/layouts/header/back';
import { Colors, FontSize } from '@/constants/theme';
import { useCheerStore } from '@/stores/cheer';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

export default function CheerLayout() {
    const cheerStore = useCheerStore();
    const { friendName, reset } = cheerStore;
    return (
        <View style={styles.container}>
            {/* Header */}
            <BackHeader text={`Encourage ${friendName || 'Edgar'}`} onClose={reset} icon="💪" iconSize={FontSize.xl} iconColor={Colors.textPrimary} />
            {/* Content */}
            <Slot />
            {/* Footer */}
            <BackFooter
                actions={[
                    {
                        label: 'Annuler',
                        onPress: reset,
                        variant: 'outline',
                    },
                    {
                        label: 'Envoyer',
                        onPress: () => { },
                        variant: 'primary',
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
});
