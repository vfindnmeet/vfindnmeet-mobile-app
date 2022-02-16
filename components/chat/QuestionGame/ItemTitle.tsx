import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';

const styles = EStyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem',
    color: Colors.white,
    borderRadius: '10rem',
    padding: '5rem',
    paddingLeft: '10rem',
    paddingRight: '10rem',
    backgroundColor: Colors.black,
    flexShrink: 1,
  },
});

export default function ItemTitle({ text, textStyle }: { text?: string, textStyle?: any }) {
  const { t } = useTranslation();

  return (
    <View style={styles.styles}>
      <Text style={[styles.text, textStyle ?? {}]}>{t(text ?? 'Answer questions ...')}</Text>
    </View>
  );
}
