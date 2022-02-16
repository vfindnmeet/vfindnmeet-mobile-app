import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { getExpoPushNotificationToken, retryHttpRequest } from '../utils';
import { registerPushNotificationToken } from '../services/api';
import { useIsMounted } from './useIsMounted';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const registerPushToken = (token: string, isMounted: any) => {
  getExpoPushNotificationToken()
    .then((pushToken: string | null) => {
      console.log('pushToken', pushToken);
      if (pushToken) {
        return retryHttpRequest(() => {
          if (!isMounted.current) return null;

          return registerPushNotificationToken(pushToken, token)
        })
          .then(() => true);
      }

      return false;
    });
}

export default function usePushNotification() {
  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);
  const responseListener = useRef<any>();

  useEffect(() => {
    if (!token) {
      // if (responseListener.current) {
      //   Notifications.removeNotificationSubscription(responseListener.current);
      // }

      return;
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('====>', JSON.stringify(remoteMessage));
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;

    // responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
    //   console.log('PN received:', response);
    // });

    // return () => {
    //   console.log('--------------2');
    //   Notifications.removeNotificationSubscription(responseListener.current);
    //   responseListener.current = null;
    // };
  }, [token]);
}

// export default function usePushNotification() {
//   const isMounted = useIsMounted();

//   const token = useSelector(getTokenSelector);
//   const responseListener = useRef<any>();

//   useEffect(() => {
//     if (!token) {
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }

//       return;
//     }

//     // registerPushToken(token, isMounted);

//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
//       console.log('PN received:', response);
//     });

//     return () => {
//       console.log('--------------2');
//       Notifications.removeNotificationSubscription(responseListener.current);
//       responseListener.current = null;
//     };
//   }, [token]);
// }
