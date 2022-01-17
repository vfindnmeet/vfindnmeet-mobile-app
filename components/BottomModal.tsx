import React, { useEffect, useState } from 'react';
import { Alert, Modal, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
// import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';
// import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function BottomModal({ show, onHide, children }: any) {
  const [visible, setVisible] = useState(false);
  // const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        // console.log('ON DISMISS');
      }}
      onRequestClose={() => {
        // console.log('----ON-CLOSE-----');
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onHide}>
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          // borderRadius: 15,
          overflow: 'hidden',
          // borderTopRightRadius: 15,
          // borderTopLeftRadius: 15,
          // padding: 5,
          // opacity: 1
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff',
              padding: 5,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
