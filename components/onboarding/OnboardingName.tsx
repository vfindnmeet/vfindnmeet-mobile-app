import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  Button as MatButton,
  TextInput as MatTextInput,
  HelperText,
  Colors
} from "react-native-paper";

const styles = EStyleSheet.create({
  container: {
    padding: '15rem'
  },
  titleText: {
    textAlign: 'center',
    fontSize: '20rem'
  },
  input: {
    marginTop: '5rem'
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

export default function OnboardingName(props: any) {
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const onNextStep = () => {
    props.setName(name);
    props.nextStep();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('What\'s your name?')}</Text>
      <View>
        <MatTextInput
          // autoComplete={false}
          label={t('Your name')}
          mode="flat"
          value={name}
          style={styles.input}
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </View>

      <HelperText type="error" visible={name.length === 0} >
        {t('Name cannot be empty.')}
      </HelperText>

      <MatButton
        disabled={name.length === 0}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
