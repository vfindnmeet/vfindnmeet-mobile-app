import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppScreen, AuthScreen } from './navigation/Navigator1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import OnboardingScreen from './screens/OnboardingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLatLng, getStorageItem, parseJson, removeStorageItem, retryHttpRequest, throwErrorIfErrorStatusCode } from './utils';
import { getOnboardingStep, registerPushNotificationToken, updatePosition } from './services/api';
import UnauthorizedError from './errors/UnauthorizedError';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from './store/selectors/auth';
import { logOutUser, setLoggedUser } from './store/actions/auth';
import { fetchOnboardingData, setOnboardingData } from './store/actions/onboarding';
import { getOnboardingLoadingSelector, getOnboardingSelector } from './store/selectors/onboarding';
import WsContextProvider, { WsContext } from './store/WsContext';
import { useRoute } from '@react-navigation/native';
import { getRouteSelector } from './store/selectors/route';
import { incrNotSeenMessagesCount, seeChat, setNotSeenMessagesCount } from './store/actions/notification';
import usePushNotification from './hooks/usePushNotification';
import useOnMessage from './hooks/useOnMessage';

export default function Main() {
  const dispatch = useDispatch();
  // const route = useRoute();

  const onboardingData = useSelector(getOnboardingSelector);
  const onboardingDataLoading = useSelector(getOnboardingLoadingSelector);
  const route = useSelector(getRouteSelector);
  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const [loadingToken, setLoadingToken] = useState(true);

  const { sendMessage } = useContext(WsContext);

  usePushNotification();

  useOnMessage((msg: any) => {
    !['ping', 'pong'].includes(msg.type) && console.log('===2', msg.type);

    if (msg.type === 'msg') {
      const isFromLoggedUser = msg.payload.userId === loggedUserId;
      if (isFromLoggedUser) return;

      // console.log('isFromLoggedUser', isFromLoggedUser);
      // console.log('isOnUserChatScreen', isOnUserChatScreen);

      const isOnUserChatScreen = route?.route === 'UserChat' && route?.params?.userId === msg.payload.userId;
      if (isOnUserChatScreen) {
        // see chat message
        sendMessage('see_msg');
      } else {
        // notification..
        dispatch(incrNotSeenMessagesCount());
      }
    } else if (msg.type === 'see_msg') {
      // console.log('====>NOT SEENS MSGS', msg.payload);
      // dispatch(setNotSeenMessagesCount(msg.payload.notSeenMessagesCount));
      dispatch(seeChat(msg.payload));
    }
  }, [route?.route, route?.params?.userId, loggedUserId]);

  // useEffect(() => {
  //   if (route?.route !== 'UserChat') return;

  //   console.log('ROUTE:', route);
  // }, [route?.route, route?.params?.userId]);

  // const [msg, setMsg] = useState<any>(null);
  // const { lastMessage, sendMessage } = useContext(WsContext);

  // useEffect(() => {
  //   if (!lastMessage) return;
  //   // if (lastMessage.type !== 'msg') return;

  //   setMsg(lastMessage);
  // }, [lastMessage]);

  // useEffect(() => {
  //   // console.log('===1');
  //   if (!msg) return;

  //   !['ping', 'pong'].includes(msg.type) && console.log('===2', msg.type);

  //   if (msg.type === 'msg') {
  //     const isFromLoggedUser = msg.payload.userId === loggedUserId;
  //     if (isFromLoggedUser) return;

  //     // console.log('isFromLoggedUser', isFromLoggedUser);
  //     // console.log('isOnUserChatScreen', isOnUserChatScreen);

  //     const isOnUserChatScreen = route?.route === 'UserChat' && route?.params?.userId === msg.payload.userId;
  //     if (isOnUserChatScreen) {
  //       // see chat message
  //       sendMessage('see_msg');
  //     } else {
  //       // notification..
  //       dispatch(incrNotSeenMessagesCount());
  //     }
  //   } else if (msg.type === 'see_msg') {
  //     console.log('====>NOT SEENS MSGS', msg.payload);
  //     // dispatch(setNotSeenMessagesCount(msg.payload.notSeenMessagesCount));
  //     dispatch(seeChat(msg.payload));
  //   }

  //   setMsg(null);
  // }, [msg, route?.route, route?.params?.userId, loggedUserId]);

  useEffect(() => {
    if (!token) return;

    let timeout: any;

    const scheduleTimeout = () => {
      timeout = setTimeout(() => {
        sendLocation();
      }, 60 * 1000);
    };

    const sendLocation = async () => {
      const location = await getLatLng();
      // console.log(location);

      if (location) {
        try {
          await updatePosition(location.lat, location.lon, token).then(throwErrorIfErrorStatusCode);
        } catch (e) {
          if (e instanceof UnauthorizedError) {
            clearTimeout(timeout);

            return;
          }

          console.error(e);
        }

        scheduleTimeout();
      } else {
        scheduleTimeout();
      }
    };

    sendLocation();

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [token]);

  useEffect(() => {
    getStorageItem('vi-user-data')
      .then(json => {
        if (!json) {
          dispatch(logOutUser());
        } else {
          dispatch(setLoggedUser(parseJson(json)));
        }
        setLoadingToken(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchOnboardingData());

    retryHttpRequest(getOnboardingStep.bind(null, token))
      .then((result: any) => result.json())
      .then((result: {
        step: number;
        completed_at: number;
      }) => {
        dispatch(setOnboardingData(result));
      })
      .catch(e => {
        if (e instanceof UnauthorizedError) {
          removeStorageItem('vi-user-data').then(() => dispatch(logOutUser()))
        }
      });
  }, [token]);

  if (loadingToken) {
    return (
      <SafeAreaView style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ActivityIndicator />
      </SafeAreaView>
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
    return (
      <SafeAreaView style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ActivityIndicator />
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
