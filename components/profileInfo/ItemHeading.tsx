import React from 'react';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors, IconButton } from 'react-native-paper';

const styles = EStyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    fontSize: '20rem',
    fontWeight: 'bold',
  },
});

function HeadingText({ children, size, color, marginBottom, style }: any) {
  return (
    <Text style={[styles.text, {
      // fontSize: size ?? 20,
      // fontWeight: 'bold',
      color: color ?? Colors.black,
      // marginBottom,
      // ...(style ?? {}),
    }, style]}>{children}</Text>
    // <Text style={{
    //   fontSize: size ?? 20,
    //   fontWeight: 'bold',
    //   color: color ?? Colors.black,
    //   marginBottom,
    //   ...(style ?? {}),
    // }}>{children}</Text>
  );
}

export default function ItemHeading({
  children,
  size,
  color,
  marginBottom,
  style,
  onHide,
  disabled,
}: any) {
  if (onHide) {
    return (
      <View style={styles.container}>
        <HeadingText
          size={size}
          color={color}
          style={[{ flex: 1 }, style]}
          marginBottom={marginBottom}
        >{children}</HeadingText>
        <IconButton
          icon="close"
          style={{
            backgroundColor: Colors.grey300,
          }}
          disabled={disabled}
          onPress={onHide}
        />
      </View>
    );
  }

  return (
    <HeadingText
      size={size}
      color={color}
      style={style}
      marginBottom={marginBottom}
    >{children}</HeadingText>
  );
}
