import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  RadioButton
} from "react-native-paper";

export default function OnboardingOrientation(props: any) {
  const { t } = useTranslation();
  const [interestedIn, setInterestedIn] = useState<string | null>(null);

  const onNextStep = () => {
    props.setInterestedIn(interestedIn);
    props.nextStep();
  };

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('What are you interested in?')}</Text>
      <View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <RadioButton
            value="male"
            status={interestedIn === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setInterestedIn('male')}
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
            status={interestedIn === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setInterestedIn('female')}
          />
          <Text>{t('Female')}</Text>
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <RadioButton
            value="both"
            status={interestedIn === 'both' ? 'checked' : 'unchecked'}
            onPress={() => setInterestedIn('both')}
          />
          <Text>{t('Both')}</Text>
        </View>
      </View>

      <MatButton
        disabled={interestedIn === null}
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
