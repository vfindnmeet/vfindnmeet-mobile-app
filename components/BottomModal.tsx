import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '5rem',
    borderTopRightRadius: '10rem',
    borderTopLeftRadius: '10rem',
  },
});

export default function BottomModal({ show, onHide, children, style }: any) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => { }}
      onRequestClose={() => { }}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onHide}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modal, style ?? {}]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
