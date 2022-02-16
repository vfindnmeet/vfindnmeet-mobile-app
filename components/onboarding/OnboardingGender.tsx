import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import {
  Button as MatButton,
  RadioButton
} from "react-native-paper";
import CRadioButton from '../CRadioButton';

export default function OnboardingGender(props: any) {
  const { t } = useTranslation();
  const [gender, setGender] = useState<string | null>(null);

  const onNextStep = () => {
    props.setGender(gender);
    props.nextStep();
  };

  const setMale = useCallback(() => setGender('male'), []);
  const setFemale = useCallback(() => setGender('female'), []);

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('What\'s your gender?')}</Text>
      <View>
        <CRadioButton
          value="male"
          checked={gender === 'male'}
          onCheck={setMale}
          label={t('Male')}
        ></CRadioButton>
        <CRadioButton
          value="female"
          checked={gender === 'female'}
          onCheck={setFemale}
          label={t('Female')}
        ></CRadioButton>
        {/* <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
          />
          <Text>{t('Male')}</Text>
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <CRadioButton
            value="female"
            checked={gender === 'female'}
            onCheck={setFemale}
          />
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>{t('Female')}</Text>
        </View> */}
      </View>

      <MatButton
        disabled={gender === null}
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
