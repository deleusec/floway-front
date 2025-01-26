import React, { ReactNode } from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import ThemedButton from '../button/ThemedButton';
import { Ionicons } from '@expo/vector-icons';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  cancelButton?: boolean;
  confirmButton?: boolean;
  cancelAction?: () => void;
  confirmAction?: () => void;
  bordered?: boolean;
  cross?: boolean;
}

const CustomModal = ({
  visible,
  onClose,
  children,
  header,
  body,
  footer,
  cancelButton,
  confirmButton,
  cancelAction,
  confirmAction,
  bordered = false,
  cross = false,
}: CustomModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modal, bordered && styles.modalBordered]}
          onPress={(e) => e.stopPropagation()}>
          <Ionicons
            name="close"
            size={24}
            color={Colors.light.white}
            style={{ position: 'absolute', top: 10, right: 10 }}
            onPress={onClose}
          />
          {/* Slot Header */}
          {header && <View style={styles.modalHeader}>{header}</View>}

          {/* Slot Body */}
          {body && <View style={styles.modalBody}>{body}</View>}

          {/* Children */}
          {children && <View style={styles.modalChildren}>{children}</View>}

          {/* Slot Footer */}
          {footer && <View style={styles.modalFooter}>{footer}</View>}
          {(cancelButton || confirmButton || cross) && confirmButton && (
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
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: Colors.dark.primaryDark,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalBordered: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  modalHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  modalChildren: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  modalFooter: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 20,
  },
});

export default CustomModal;
