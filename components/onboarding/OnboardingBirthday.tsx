import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import {
  Button as MatButton,
  HelperText
} from "react-native-paper";
import { useIsMounted } from '../../hooks/useIsMounted';

export default function OnboardingBirthday(props: any) {
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const [day, setDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const allFieldsSet = () => day !== null && month !== null && year !== null;

  const calculateAge = (birthday: Date) => {
    const ageDifMs = Date.now() - +birthday;
    const ageDate = new Date(ageDifMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const getError = (): string | null => {
    if (day === null || month === null || year === null) {
      return 'Invalid date.';
    }

    const d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(day);

    if (
      d.getDate() !== day ||
      d.getMonth() + 1 !== month ||
      d.getFullYear() !== year
    ) {
      return 'Invalid date.';
    }

    const age = calculateAge(d);
    if (age < 18) {
      return 'Must be 18 years or older.'
    } else if (age >= 70) {
      return 'Must be 70 years or younger.'
    }

    return null;
  }

  // const validateDate = () => {
  //   setError(getError());
  // }

  useEffect(() => {
    const error = getError();
    setError(error);
    // validateDate();
    // if (error) {
    //   props.setBirthday();
    // }

    if (day === null || month === null || year === null) {
      return;
    }

    props.setBirthday(`${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`);
  }, [day, month, year]);

  const onNextStep = () => {
    if (day === null || month === null || year === null) {
      return;
    }

    // console.log('====>!', `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`);
    // console.log('!!!', day, month, year);

    // props.setBirthday(`${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`);
    setLoading(true);
    props.nextStep()
      .finally(() => {
        if (!isMounted.current) return;

        setLoading(false);
      });
  };

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{t('What\'s your birthday?')}</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
      }}>
        <View style={{
          width: '70%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TextInput style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            flex: 1
          }} ref={dayRef} placeholder={t('Day')} keyboardType="numeric" maxLength={2} onChangeText={(text) => {
            // console.log(`DAY CHANGED: |${text}| ${typeof text}`);
            setDay(parseInt(text, 10));
            if (text.length === 2) {
              monthRef?.current && (monthRef.current as any).focus();
            }
          }}></TextInput>
          <Text style={{ marginLeft: 5, marginRight: 5 }}>-</Text>
          <TextInput style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            flex: 1
          }} ref={monthRef} placeholder={t('Month')} keyboardType="numeric" maxLength={2} onChangeText={(text) => {
            setMonth(parseInt(text, 10));

            if (text.length === 2) {
              yearRef?.current && (yearRef.current as any).focus();
            }
          }}></TextInput>
          <Text style={{ marginLeft: 5, marginRight: 5 }}>-</Text>
          <TextInput style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            flex: 1
          }} ref={yearRef} placeholder={t('Year')} keyboardType="numeric" maxLength={4} onChangeText={(text) => {
            setYear(parseInt(text, 10));
          }}></TextInput>
        </View>
      </View>

      {allFieldsSet() && (
        <HelperText type="error" visible={error !== null} >
          {t(error as string)}
        </HelperText>
      )}

      <MatButton
        loading={loading}
        disabled={error !== null || loading}
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onNextStep}
      >{t('Next')}</MatButton>
    </View>
  );
}
