import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import SvgSearch from '@/components/icons/Search';

/**
 * SearchInput
 *
 * Champ de recherche personnalisable avec icône de loupe, inspiré du design fourni.
 * Utilise les variables de theme.ts pour les couleurs, radius, etc.
 *
 * Props principales :
 * - value, onChangeText : gestion du texte
 * - placeholder : texte d'exemple
 * - containerStyle, inputStyle : styles personnalisés
 * - iconColor, borderColor, backgroundColor : couleurs custom
 *
 * Exemple d'utilisation :
 * <SearchInput value={search} onChangeText={setSearch} />
 */

interface SearchInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  containerStyle,
  inputStyle,
  iconColor = Colors.gray[400],
  borderColor = Colors.border,
  backgroundColor = Colors.surface,
  placeholder = "Nom d'utilisateur...",
  ...props
}) => {
  return (
    <View style={[styles.container, { borderColor, backgroundColor }, containerStyle]}>
      <SvgSearch size={20} color={iconColor} style={styles.icon} />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});

export { SearchInput };
