import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import {
  Button as MatButton,
  TextInput as MatTextInput,
  HelperText
} from "react-native-paper";

export default function OnboardingName(props: any) {
  const [name, setName] = useState('');
  const { t } = useTranslation();

  const onNextStep = () => {
    props.setName(name);
    props.nextStep();
  };

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('What\'s your name?')}</Text>
      <View>
        <MatTextInput
          // autoComplete={false}
          label={t('Your name')}
          mode="outlined"
          value={name}
          style={{ marginTop: 5 }}
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
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
