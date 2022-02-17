import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Button as MatButton,
  Colors
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
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('What\'s your gender?')}</Text>
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
        style={styles.button}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
