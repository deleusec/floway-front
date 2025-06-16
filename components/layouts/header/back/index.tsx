import { Colors, FontFamily, FontSize, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


interface BackHeaderProps {
    text: string;
    onClose: () => void;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
}

export default function BackHeader(props: BackHeaderProps) {
    const { text, onClose, icon, iconSize, iconColor } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{text || ''} <Text style={{ fontSize: iconSize || FontSize.xl, color: iconColor || Colors.textPrimary }}>{icon || ''}</Text></Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={28} color={Colors.gray[700]} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: FontSize.lg,
        fontFamily: FontFamily.semiBold,
    },
    closeBtn: {
        padding: Spacing.sm,
    },
});