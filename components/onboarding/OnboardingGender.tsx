import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  RadioButton
} from "react-native-paper";

export default function OnboardingGender(props: any) {
  const { t } = useTranslation();
  const [gender, setGender] = useState<string | null>(null);

  const onNextStep = () => {
    props.setGender(gender);
    props.nextStep();
  };

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('What\'s your gender?')}</Text>
      <View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
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
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>{t('Female')}</Text>
        </View>
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
