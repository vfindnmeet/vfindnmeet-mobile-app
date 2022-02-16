import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  TextInput as MatTextInput,
  Colors,
  HelperText,
  Button,
} from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorSnackBar from '../components/ErrorSnackBar';
import { DEFAULT_LANG, getLang, getStorageItem, throwErrorIfErrorStatusCode } from '../utils';
import { signUp } from '../services/api';
import { useDispatch } from 'react-redux';
import { setLoggedUser } from '../store/actions/auth';
import { useTranslation } from 'react-i18next';
import LanguageBottomModal from '../components/LanguageBottomModal';
import { STORAGE_LANG_KEY } from '../constants';
import { useIsMounted } from '../hooks/useIsMounted';

export default function SignUpScreen({ navigation }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState<boolean>(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState<boolean>(false);

  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [lang, setLang] = useState<string | null>('');
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
      .then(lang => {
        setLang(getLang(lang));
      });
  }, []);

  const onSignup = () => {
    if (!!emailError || !!passwordError || !!confirmPasswordError) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setConfirmPasswordTouched(true);

      return;
    }

    if (loading) return;

    setLoading(true);

    signUp(email, password)
      .then(throwErrorIfErrorStatusCode)
      .then(result => result.json())
      .then((result: {
        id: string;
        token: string;
        status: string;
      }) => {
        console.log('result:');
        console.log(result);

        dispatch(setLoggedUser(result));
      })
      .catch(e => {
        setErrorMessage(e.message);
        // setLoading(false);
      })
      .finally(() => {
        if (!isMounted.current) return;

        setLoading(false);
      });
  };

  useEffect(() => {
    if (!email?.trim()) {
      setEmailError('Email cannot be empty.');
    } else if (email.indexOf('@') === -1) {
      setEmailError('Invalid email.');
    } else {
      setEmailError(null);
    }
  }, [email]);

  useEffect(() => {
    if (!password?.trim()) {
      setPasswordError('Password cannot be empty.');
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError(null);
    }
  }, [password]);

  useEffect(() => {
    if (!confirmPassword?.trim()) {
      setConfirmPasswordError('Password not confirmed.');
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords don\'t match.');
    } else {
      setConfirmPasswordError(null);
    }
  }, [password, confirmPassword]);

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
        disabled={loading}
        label={t('Email')}
        keyboardType="email-address"
        mode="outlined"
        value={email}
        style={{ marginTop: 5 }}
        onFocus={() => setEmailTouched(true)}
        onChangeText={(text) => {
          setEmail(text);
        }}
        error={emailTouched && !!emailError} />

      {emailTouched && !!emailError && <HelperText type="error">{t(emailError)}</HelperText>}

      <MatTextInput
        disabled={loading}
        label={t('Password')}
        mode="outlined"
        value={password}
        onFocus={() => setPasswordTouched(true)}
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry
        style={{ marginTop: 5 }}
        error={passwordTouched && !!passwordError} />

      {passwordTouched && !!passwordError && <HelperText type="error">{t(passwordError)}</HelperText>}

      <MatTextInput
        disabled={loading}
        label={t('Confirm Password')}
        mode="outlined"
        value={confirmPassword}
        onFocus={() => setConfirmPasswordTouched(true)}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError('');
        }}
        secureTextEntry
        style={{ marginTop: 5 }}
        error={confirmPasswordTouched && !!confirmPasswordError} />

      {confirmPasswordTouched && !!confirmPasswordError && <HelperText type="error">{t(confirmPasswordError)}</HelperText>}

      {!!error && (<Text style={{ color: Colors.red900 }}>{error}</Text>)}

      <MatButton
        disabled={loading}
        labelStyle={{
          color: Colors.white
        }}
        style={{
          width: '100%',
          marginTop: 15,
          borderRadius: 1000,
        }}
        uppercase={false}
        mode="contained"
        onPress={onSignup}
      >
        {t('Sign up')}
      </MatButton>

      <Text style={{ textAlign: 'center', marginTop: 10 }}>{t('Or')}</Text>

      <MatButton
        disabled={loading}
        icon="google"
        uppercase={false}
        labelStyle={{
          color: Colors.white
        }}
        style={{
          width: '100%',
          marginTop: 15,
          borderRadius: 1000,
        }}
        mode="contained"
        onPress={onSignup}
      >
        {t('Join With Google')}
      </MatButton>

      <MatButton
        style={{ marginTop: 15 }}
        mode="text"
        disabled={loading}
        loading={loading}
        uppercase={false}
        onPress={() => {
          if (loading) return;

          navigation.navigate('SignIn');
        }}
      >
        {t('Already have an account?')}
      </MatButton>

      <ErrorSnackBar message={errorMessage} show={!!errorMessage} />

      <LanguageBottomModal
        lang={lang}
        show={showLangModal}
        onHide={() => setShowLangModal(false)}
        setLang={setLang}
      />
    </View>
  );
};
