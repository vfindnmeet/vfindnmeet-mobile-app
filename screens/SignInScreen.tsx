import React, { useState, useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  TextInput as MatTextInput,
  Colors,
  HelperText,
  Button,
} from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import NotFoundError from '../errors/NotFoundError';
import UnauthorizedError from '../errors/UnauthorizedError';
import { login } from '../services/api';
import { setLoggedUser } from '../store/actions/auth';
import { arrayToOptions, DEFAULT_LANG, getStorageItem, setStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import ItemHeading from '../components/profileInfo/ItemHeading';
import EditOptions from '../components/profileInfo/EditOptions';
import BottomModal from '../components/BottomModal';
import EditItem from '../components/profileInfo/EditItem';
import LanguageBottomModal from '../components/LanguageBottomModal';

export default function SignInScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [lang, setLang] = useState<string | null>('');
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    getStorageItem('vi-item')
      .then(lang => {
        setLang(lang || DEFAULT_LANG);
      });
  }, []);

  const onLogin = () => {
    login(email, password)
      .then(throwErrorIfErrorStatusCode)
      .then(result => result.json())
      .then((result: {
        token: string;
        id: string;
        name: string;
        email: string;
        status: string;
        gender: string;
        verificationStatus: string;
      }) => {
        // console.log('login result:');
        // console.log(result);

        return setStorageItem('vi-user-data', JSON.stringify(result))
          .then(() => result);
        // setLoading(false);
      })
      .then((result) => dispatch(setLoggedUser(result)))
      .catch(e => {
        // console.log('login err =>', e.message);
        // setErrorMessage(e.getMessage());

        if (e instanceof UnauthorizedError || e instanceof NotFoundError) {
          setError('Invalid email or password.');
        } else {
          setError(e.message);
        }

        // setLoading(false);
      });
  }

  return (
    <View style={{ padding: 25, flex: 1 }}>
      <SafeAreaView>
        <View style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row-reverse'
        }}>
          <Button
            onPress={() => {
              setShowLangModal(true);
            }}
          >{lang}</Button>
        </View>
        <Text style={{
          marginTop: 30,
          marginBottom: 60,
          textAlign: 'center'
        }}>
          APP_LOGO
        </Text>
      </SafeAreaView>

      <MatTextInput
        // autoComplete={false}
        disabled={loading}
        label={t('Email')}
        mode="outlined"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        error={!!error} />

      <MatTextInput
        // autoComplete={false}
        disabled={loading}
        label={t('Password')}
        mode="outlined"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError('');
        }}
        secureTextEntry
        style={{ marginTop: 15 }}
        error={!!error} />

      {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

      <MatButton
        disabled={loading}
        style={{ width: '100%', marginTop: 15 }}
        uppercase={false}
        mode="contained"
        onPress={onLogin}
      >{t('Login')}</MatButton>

      <Text style={{ textAlign: 'center', marginTop: 10 }}>{t('Or')}</Text>

      <MatButton
        disabled={loading}
        icon="google"
        uppercase={false}
        style={{ width: '100%', marginTop: 15 }}
        mode="contained"
        onPress={onLogin}
      >{t('Login With Google')}</MatButton>

      <MatButton style={{ marginTop: 15 }} mode="text" uppercase={false} onPress={() => navigation.navigate('SignUp')}>
        {t('You don\'t have an account?')}
      </MatButton>

      <LanguageBottomModal
        lang={lang}
        show={showLangModal}
        onHide={() => setShowLangModal(false)}
        setLang={setLang}
      />
    </View>
  );
};
