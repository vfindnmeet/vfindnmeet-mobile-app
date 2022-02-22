import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  Button as MatButton,
  TextInput as MatTextInput,
  HelperText,
  Button,
  Colors,
} from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import NotFoundError from '../errors/NotFoundError';
import UnauthorizedError from '../errors/UnauthorizedError';
import { login } from '../services/api';
import { setLoggedUser } from '../store/actions/auth';
import {
  DEFAULT_LANG,
  getExpoPushNotificationToken,
  getLang,
  getLatLng,
  getStorageItem,
  setStorageItem,
  throwErrorIfErrorStatusCode
} from '../utils';
import { useTranslation } from 'react-i18next';
import LanguageBottomModal from '../components/LanguageBottomModal';
import { STORAGE_LANG_KEY, STORAGE_LOGIN_DATA_KEY } from '../constants';
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
  }
});

export default function SignInScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [lang, setLang] = useState<string | null>('');
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
      .then(lang => {
        setLang(getLang(lang));
      });
  }, []);

  const loginReq = (lat?: number, lon?: number, pushToken?: string | null) => {
    return login({ email, password, lat, lon, pushToken })
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
        // setLoading(false);

        return setStorageItem(STORAGE_LOGIN_DATA_KEY, JSON.stringify(result))
          .then(() => result);
      })
      .then((result) => dispatch(setLoggedUser(result)))
      .catch(err => {
        // console.log('login err =>', e.message);
        // setErrorMessage(e.getMessage());
        if (!isMounted.current) return;

        if (err instanceof UnauthorizedError || err instanceof NotFoundError) {
          setError('Invalid email or password.');
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!isMounted.current) return;

        setLoading(false);
      });
  }

  const onLogin = () => {
    // const location = ;
    setLoading(true);

    Promise.all([
      getLatLng()
        .then(location => ({
          lat: location?.lat,
          lon: location?.lon,
        }))
        .catch(() => ({ lat: undefined, lon: undefined })),
      getExpoPushNotificationToken()
        .catch((e) => {
          console.error(e);
          return null;
        })
    ])
      .then(([{ lat, lon }, pushToken]) => {
        loginReq(lat, lon, pushToken);
      });

    // getLatLng()
    //   .then(location => ({
    //     lat: location?.lat,
    //     lon: location?.lon,
    //   }))
    //   .then(({ lat, lon }) => loginReq(lat, lon))
    //   .catch(() => loginReq());
  }

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
        style={styles.marginTop}
        error={!!error} />

      {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

      <MatButton
        disabled={loading}
        loading={loading}
        labelStyle={styles.buttonLabel}
        style={[styles.marginTop, styles.button]}
        uppercase={false}
        mode="contained"
        onPress={onLogin}
      >{t('Login')}</MatButton>

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
        onPress={onLogin}
      >{t('Login With Google')}</MatButton> */}

      <MatButton
        style={styles.marginTop}
        mode="text"
        uppercase={false}
        disabled={loading}
        onPress={() => {
          if (loading) return;

          navigation.navigate('SignUp')
        }}
      >
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
