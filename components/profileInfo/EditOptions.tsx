import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

export default function EditOptions({
  selected,
  setSelected,
  options,
  showDefault = true
}: {
  selected: any;
  setSelected(value: any): void;
  options: {
    value: string;
    label: string;
  }[];
  showDefault?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <>
      {options.map((option: any) => (
        <View
          key={option.value}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <RadioButton
            value="regularly"
            status={option.value === selected ? 'checked' : 'unchecked'}
            onPress={() => setSelected(option.value)}
          />
          <Text>{t(option.label)}</Text>
        </View>
      ))}
      {showDefault && (
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <RadioButton
            value=""
            status={!selected ? 'checked' : 'unchecked'}
            onPress={() => setSelected('')}
          />
          <Text>{t('I rather not say')}</Text>
        </View>
      )}
    </>
  );
}