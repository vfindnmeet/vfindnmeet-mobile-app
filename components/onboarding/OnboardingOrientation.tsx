import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Button as MatButton,
  Colors,
  RadioButton
} from "react-native-paper";
import CRadioButton from '../CRadioButton';

const styles = EStyleSheet.create({
  container: {
    padding: '15rem'
  },
  titleText: {
    textAlign: 'center',
    fontSize: '20rem'
  },
  button: {
    width: '100%',
    marginTop: '15rem',
    borderRadius: '20rem'
  },
  buttonLabel: {
    color: Colors.white
  }
});

export default function OnboardingOrientation(props: any) {
  const { t } = useTranslation();
  const [interestedIn, setInterestedIn] = useState<string | null>(null);

  const onNextStep = () => {
    props.setInterestedIn(interestedIn);
    props.nextStep();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('What are you interested in?')}</Text>
      <View>
        <CRadioButton
          value="male"
          checked={interestedIn === 'male'}
          onCheck={() => setInterestedIn('male')}
          label={t('Male')}
        ></CRadioButton>
        <CRadioButton
          value="female"
          checked={interestedIn === 'female'}
          onCheck={() => setInterestedIn('female')}
          label={t('Female')}
        ></CRadioButton>
        <CRadioButton
          value="both"
          checked={interestedIn === 'both'}
          onCheck={() => setInterestedIn('both')}
          label={t('Both')}
        ></CRadioButton>
        {/* <View style={{
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
        </View> */}
      </View>

      <MatButton
        disabled={interestedIn === null}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
