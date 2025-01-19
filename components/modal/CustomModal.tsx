import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import ThemedButton from '../button/ThemedButton';

const CustomModal = ({
  visible,
  onClose,
  children,
  cancelButton,
  confirmButton,
  cancelAction,
  confirmAction,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  cancelButton?: boolean;
  confirmButton?: boolean;
  cancelAction?: () => void;
  confirmAction?: () => void;
  style?: 'default' | 'bordered';
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.modal, style === 'bordered' && styles.modalBordered]} onPress={(e) => e.stopPropagation()}>
          {/* Contenu de la modale passé par props */}
          {children}

          {/* Boutons d'action */}
          <View style={styles.buttonGroup}>
            {cancelButton && (
              <ThemedButton
                title="Annuler"
                buttonSize="small"
                buttonType="cancel"
                onPress={cancelAction || onClose}
                style={styles.cancelButton}
              />
            )}
            {confirmButton && (
              <ThemedButton
                title="Confirmer"
                buttonSize="small"
                buttonType="confirm"
                onPress={confirmAction || onClose}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Style de l'overlay sombre (fond de la modale)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Conteneur principal de la modale
  modal: {
    width: '90%',
    backgroundColor: Colors.dark.primaryDark,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  // Style de la modale bordée
  modalBordered: {
    borderWidth: 1,
    borderColor: Colors.light.primary
  },

  // Groupe de boutons (Annuler / Confirmer)
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },

  // Style pour le bouton Annuler (optionnel)
  cancelButton: {
    marginRight: 20,
  },
});

export default CustomModal;
