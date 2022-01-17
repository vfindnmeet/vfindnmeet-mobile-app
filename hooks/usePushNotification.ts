import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { retryHttpRequest } from '../utils';
import { registerPushNotificationToken } from '../services/api';
import { getExpoPushNotificationToken } from '../PushNotifications';
import * as Notifications from 'expo-notifications';

export default function usePushNotification() {
  const token = useSelector(getTokenSelector);
  const responseListener = useRef<any>();

  useEffect(() => {
    if (!token) {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }

      return;
    }

    getExpoPushNotificationToken()
      .then((pushToken: string | null) => {
        if (pushToken) {
          return retryHttpRequest(registerPushNotificationToken.bind(null, pushToken, token))
            .then(() => true);
        }

        return false;
      });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log('PN received:', response);
    });

    return () => {
      console.log('--------------2');
      Notifications.removeNotificationSubscription(responseListener.current);
      responseListener.current = null;
    };
  }, [token]);
}
