import React, { useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';

export default function ImageMenuDialog({ show, onHide, children }: any) {
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
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          padding: 15
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff'
            }}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
