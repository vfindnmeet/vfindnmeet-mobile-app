import React, { useEffect, useRef, useState } from 'react';
import VerifyHeader from '../navigation/VerifyHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getVerifyImage } from '../components/DefaultImages';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Colors, Headline, Subheading } from 'react-native-paper';
import { getProfileInfo } from '../services/api';
import { handleError, requestCameraPermissions, retryHttpRequest } from '../utils';
import { useIsMounted } from '../hooks/useIsMounted';
import { useTranslation } from 'react-i18next';
import PageLoader from '../components/common/PageLoader';
import Verify from '../components/verify/Verify';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: '5rem'
  },
  step1Container: {
    padding: '15rem'
  },
  textContainer: {
    // paddingLeft: '15rem',
    // paddingRight: '15rem'
  },
  button: {
    marginTop: '15rem'
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
});

export default function VerificationScreen({ }: any) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    (async () => {
      setHasPermission(await requestCameraPermissions());
    })();
  }, []);

  useEffect(() => {
    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getProfileInfo(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        setData(result);
        setLoading(false);
      })
      .catch(e => {
        handleError(e, dispatch);
      });;
  }, []);

  if (loading || hasPermission === null) {
    return (
      <VerifyPage>
        <PageLoader />
      </VerifyPage>
    );
  }

  if (!data?.profile_image_id) {
    return (
      <VerifyPage>
        <Text>{t('You must upload a profile image before you request verification.')}</Text>
      </VerifyPage>
    );
  }

  if (hasPermission === false) {
    return (
      <VerifyPage>
        <Text>{t('No access to camera.')}</Text>
      </VerifyPage>
    );
  }

  return (
    <VerifyPage>
      {verifying ? (
        <Verify />
      ) : (
        step === 1 ? (
          <View style={styles.step1Container}>
            <View style={styles.textContainer}>
              <Headline>{t('Why should I verify my profile?')}</Headline>
              <Subheading>{t('You show people that it\'s really you')}</Subheading>
              <Headline>{t('How does verification work?')}</Headline>
              <Subheading>- {t('Take a photo with the target gesture and submit it')}</Subheading>
              <Subheading>- {t('The verification photo will be compared to your profile picture')}</Subheading>
            </View>

            <Button
              uppercase={false}
              mode="contained"
              labelStyle={{ color: Colors.white }}
              onPress={() => {
                // setVerifying(true);
                setStep(2);
              }}
              style={styles.button}
            >{t('Start verification')}</Button>
          </View>
        ) : (
          <View  style={styles.step1Container}>
            <View style={styles.textContainer}>
              <Headline>{t('How does verification work?')}</Headline>
              <Subheading>- {t('Take a photo with the target gesture bellow')}:</Subheading>
              <TouchableOpacity
                onPress={() => {
                  setVerifying(true);
                }}
              >
                <Image
                  source={{
                    uri: getVerifyImage(data.gender).uri
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
              <Subheading>- {t('Click on photo or \'Start verification\' button to start')}</Subheading>
              <Subheading>- {t('Submit for verification after photo is taken')}</Subheading>
            </View>

            <Button
              uppercase={false}
              mode="contained"
              labelStyle={{ color: Colors.white }}
              onPress={() => {
                setVerifying(true);
              }}
              style={styles.button}
            >{t('Start verification')}</Button>
          </View>
        )
      )}
    </VerifyPage>
  );
};

function VerifyPage({ children }: any) {
  return (
    <View style={styles.pageContainer}>
      <VerifyHeader />
      <ScrollView style={styles.container}>
        {children}
      </ScrollView>
      {/* <CBottomTabs /> */}
    </View>
  );
}
