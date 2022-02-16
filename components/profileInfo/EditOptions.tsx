import React from 'react';
import { useTranslation } from 'react-i18next';
import CRadioButton from '../CRadioButton';

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
        <CRadioButton
          key={option.value}
          value={option.value}
          checked={option.value === selected}
          onCheck={() => setSelected(option.value)}
          label={t(option.label)}
        ></CRadioButton>
        // <View
        //   key={option.value}
        //   style={{
        //     display: 'flex',
        //     flexDirection: 'row',
        //     alignItems: 'center'
        //   }}
        // >
        //   <RadioButton
        //     value="regularly"
        //     status={option.value === selected ? 'checked' : 'unchecked'}
        //     onPress={() => setSelected(option.value)}
        //   />
        //   <Text>{t(option.label)}</Text>
        // </View>
      ))}
      {showDefault && (
        <CRadioButton
          value=""
          checked={!selected}
          onCheck={() => setSelected('')}
          label={t('I rather not say')}
        ></CRadioButton>
        // <View style={{
        //   display: 'flex',
        //   flexDirection: 'row',
        //   alignItems: 'center'
        // }}>
        //   <RadioButton
        //     value=""
        //     status={!selected ? 'checked' : 'unchecked'}
        //     onPress={() => setSelected('')}
        //   />
        //   <Text>{t('I rather not say')}</Text>
        // </View>
      )}
    </>
  );
}