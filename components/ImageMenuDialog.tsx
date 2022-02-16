import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';

const styles = EStyleSheet.create({
  backdrop: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'relative',
    padding: '15rem'
  },
  modal: {
    backgroundColor: Colors.white
  }
});

export default function ImageMenuDialog({ noOverlay, overlay, show, onHide, children }: any) {
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   setVisible(show);
  // }, [show]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        // console.log('ON DISMISS');
      }}
    >
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onHide}>
        <View style={[styles.backdrop, {
          backgroundColor: noOverlay ? undefined : `rgba(0, 0, 0, ${overlay ?? '0.6'})`,
        }]}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
