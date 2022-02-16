import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Colors, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ErrorSnackBar({ message, show, onHide }: any) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  // console.log('ErrorSnackBar visible:', visible, 'show:', show);

  // const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => {
    // setVisible(false);
    onHide();
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'space-between'
    }}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        
        action={{
          color: Colors.yellowA700,
          label: 'Ok',
          // onPress: () => {
          //   setVisible(false);
          // },
        }}>
        {/* <View style={{
          display: 'flex',
          flexDirection: 'row',
          // alignContent: 'flex-start'
          justifyContent: 'flex-start'
        }}> */}
          {/* <MaterialCommunityIcons name="alert-circle" size={ICON_SIZE} color={Colors.yellowA700} /> */}
          <Text>{message}</Text>
        {/* </View> */}
      </Snackbar>
    </View>
  );
};
