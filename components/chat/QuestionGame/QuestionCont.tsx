import React from 'react';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';

const styles = EStyleSheet.create({
  container: {
    padding: '5rem',
    backgroundColor: Colors.black,
    borderRadius: '5rem',
  }
});

export default function QuestionCont({ children }: any) {
  return (
    <View style={styles.container}>
      <Text style={{
        color: Colors.white
      }}>{children}</Text>
    </View>
  );
}
