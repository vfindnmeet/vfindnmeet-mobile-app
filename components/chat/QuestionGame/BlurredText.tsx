import React from 'react';
import { Text } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  text: {
    color: "#fff0",
    // textShadowColor: "rgba(255,255,255,0.9)",

    textShadowColor: "rgba(0, 0 ,0, 0.9)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: '10rem',
    fontSize: '16rem',
    fontWeight: "600",
    textTransform: "capitalize",
    padding: '5rem'
  }
})

export default function BlurredText({ text }: { text?: string }) {
  return (
    <Text style={styles.text}>{text ?? 'dsa dadaflkg osk ffk lsfsdl kads jdka sjdkas das dasm s'}</Text>
  );
}
