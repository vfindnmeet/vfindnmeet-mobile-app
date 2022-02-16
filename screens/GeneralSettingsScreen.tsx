import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../hooks/useIsMounted';
import useRouteTrack from '../hooks/useRouteTrack';
import BaseHeader from '../navigation/BaseHeader';
import CBottomTabs from '../navigation/CBottomTabs';
import { logout } from '../services/api';
import { logOutUser } from '../store/actions/auth';
import { showDeactivateModal } from '../store/actions/modal';
import { getTokenSelector } from '../store/selectors/auth';
import { handleError, throwErrorIfErrorStatusCode } from '../utils';

export default function GeneralSettingsScreen(props: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  useRouteTrack();
  // const route = useRoute();
  // useEffect(() => {
  //   dispatch(setRoute({
  //     routeName: route.name,
  //     params: route.params
  //   }));

  //   return () => {
  //     dispatch(clearRoute());
  //   };
  // }, []);

  const token = useSelector(getTokenSelector);

  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <View style={{
      flex: 1
    }}>
      <BaseHeader text={t('General Settings')} />
      <View style={{
        flex: 1
      }}>
        <View>
          <Button
            color={Colors.red400}
            uppercase={false}
            disabled={loggingOut}
            // loading={loggingOut}
            onPress={() => {
              dispatch(showDeactivateModal());
            }}
          >{t('Deactivate')}</Button>
        </View>
        <View>
          <Button
            uppercase={false}
            disabled={loggingOut}
            loading={loggingOut}
            onPress={() => {
              if (loggingOut) return;

              setLoggingOut(true);

              logout(token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(logOutUser());
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setLoggingOut(false);
                });
            }}
          >{t('Logout')}</Button>
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
