import React from 'react';
import { View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM_ICON_SIZE } from '../../constants';

const styles = EStyleSheet.create({
  container: {
    marginTop: '10rem',
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: '10rem',
    // backgroundColor: '#fff',
    borderRadius: '5rem'
  },
  innerContainer2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});

export default function EditItem({ children, onPress, style }: any) {
  return (
    <TouchableRipple
      style={[styles.container, style ?? {}]}
      onPress={onPress}
    >
      <View style={styles.innerContainer}>
        <View style={styles.innerContainer2}>
          <View>{children}</View>
          <MaterialCommunityIcons name="pencil-outline" size={MEDIUM_ICON_SIZE} />
        </View>
      </View>
    </TouchableRipple>
  );
}
