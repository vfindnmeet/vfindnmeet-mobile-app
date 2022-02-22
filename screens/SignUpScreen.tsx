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
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    padding: '25rem',
    flex: 1
  },
  langContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  logoContainer: {
    marginTop: '30rem',
    marginBottom: '60rem',
    textAlign: 'center'
  },
  marginTop: {
    marginTop: '15rem'
  },
  button: {
    width: '100%',
    borderRadius: 1000,
  },
  buttonLabel: {
    color: Colors.white
  },
  input: {
    marginTop: '5rem'
  }
});


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
        if (!isMounted.current) return;

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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.langContainer}>
          <Button
            onPress={() => {
              setShowLangModal(true);
            }}
          >{lang}</Button>
        </View>
        <Text style={styles.logoContainer}>
          APP_LOGO
        </Text>
      </SafeAreaView>

      <MatTextInput
        disabled={loading}
        label={t('Email')}
        keyboardType="email-address"
        mode="outlined"
        value={email}
        style={styles.input}
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
        style={styles.input}
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
        style={styles.input}
        error={confirmPasswordTouched && !!confirmPasswordError} />

      {confirmPasswordTouched && !!confirmPasswordError && <HelperText type="error">{t(confirmPasswordError)}</HelperText>}

      {!!error && (<HelperText type="error">{error}</HelperText>)}

      <MatButton
        disabled={loading}
        labelStyle={styles.buttonLabel}
        style={[styles.marginTop, styles.button]}
        uppercase={false}
        mode="contained"
        onPress={onSignup}
      >
        {t('Sign up')}
      </MatButton>

      {/* <Text style={{ textAlign: 'center', marginTop: 10 }}>{t('Or')}</Text>

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
      </MatButton> */}

      <MatButton
        style={styles.marginTop}
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
