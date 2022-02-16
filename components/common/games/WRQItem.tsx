import React, { useState } from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { Image, TouchableWithoutFeedback, View } from "react-native";
import { Colors, Text } from "react-native-paper";
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    borderRadius: '5rem',
  },
  gradient: {
    borderRadius: '5rem',
    padding: '5rem',
    width: '100%',
  },
  text: {
    padding: '5rem',
    fontSize: '15rem',
    color: '#fff',
    fontWeight: 'bold',
  },
});

const shadowStyle = {
  shadowColor: Colors.black,
  shadowOffset: {
    width: 4,
    height: 0,
  },
  shadowOpacity: 1.0,
  shadowRadius: 4,
  elevation: 4,
};

export default function WRQItem({ answer, rotateDeg, colors, selected, onSelect, textStyle, uri }: {
  answer: {
    answerId: string;
    text: string;
  },
  rotateDeg: string;
  colors: string[];
  selected?: string;
  onSelect?: (answerId: string | undefined) => void;
  textStyle?: any;
  uri?: string;
}) {
  return (
    <View style={{
      transform: [{ rotate: rotateDeg }],

      position: 'relative',
      flexShrink: 1

      // borderColor: 'green',
      // borderWidth: 1,
      // width: '100%'
    }}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (!onSelect) return;

          onSelect(selected === answer.answerId ? undefined : answer.answerId);
        }}
      >
        <View style={[styles.container, shadowStyle]}>
          <LinearGradient
            colors={selected !== answer?.answerId ? colors : ['gray', 'gray']}
            style={styles.gradient}
          >
            <Text style={[styles.text, textStyle]}>{answer?.text}</Text>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
