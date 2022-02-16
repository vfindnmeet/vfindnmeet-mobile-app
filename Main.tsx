import React, { useEffect } from 'react';
import { AppScreen, AuthScreen } from './navigation/Navigator1';
import { ActivityIndicator } from 'react-native-paper';
import OnboardingScreen from './screens/OnboardingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { getTokenSelector } from './store/selectors/auth';
import { getOnboardingLoadingSelector, getOnboardingSelector } from './store/selectors/onboarding';
import usePushNotification from './hooks/usePushNotification';
import { LOADER_SIZE } from './constants';
import PageLoader from './components/common/PageLoader';
import useSyncLocation from './hooks/useSyncLocation';
import useHandleWsMessage from './hooks/useHandleWsMessage';
import useFetchOnboardingState from './hooks/useFetchOnboardingState';
import useGetStorageUser from './hooks/useGetStorageUser';

import messaging from '@react-native-firebase/messaging';
import { getExpoPushNotificationToken, retryHttpRequest } from './utils';
import { registerPushNotificationToken } from './services/api';

function usePushToken() {
  const token = useSelector(getTokenSelector);

  const registerPushToken = (token: string, pushToken: string) => {
    console.log('pushToken:', pushToken);
    return retryHttpRequest(() => {
      // if (!isMounted.current) return null;

      return registerPushNotificationToken(pushToken, token)
    })
      .then(() => true);
  }

  useEffect(() => {
    if (!token) return;

    // messaging()
    //   .getToken()
    //   .then(pushToken => {
    //     return registerPushToken(token, pushToken);
    //   });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(pushToken => {
      registerPushToken(token, pushToken);
    });
  }, [token]);
}

export default function Main() {
  const onboardingData = useSelector(getOnboardingSelector);
  const onboardingDataLoading = useSelector(getOnboardingLoadingSelector);
  const token = useSelector(getTokenSelector);
  const loadingToken = useGetStorageUser();

  usePushNotification();
  useHandleWsMessage();
  useSyncLocation(token);
  useFetchOnboardingState(token);

  usePushToken();

  if (loadingToken) {
    return (
      <PageLoader />
    );
  }

  if (!token) {
    return (
      <AuthScreen></AuthScreen>
    );
  }

  // const onboardingDataLoading = onboardingData === null;
  // console.log('onboardingDataLoading:', onboardingDataLoading);
  if (onboardingDataLoading) {
    // console.log('onboardingDataLoading');
    return (
      <SafeAreaView style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ActivityIndicator size={LOADER_SIZE} />
      </SafeAreaView>
    );
  }

  const isOnboarding = !onboardingData.completed_at;
  // console.log('isOnboarding:', isOnboarding);
  if (isOnboarding) {
    return (
      <OnboardingScreen curStep={onboardingData?.step ?? 1} />
    );
  }

  return (
    <AppScreen />
  );
}
