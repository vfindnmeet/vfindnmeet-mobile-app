import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import useRouteTrack from '../hooks/useRouteTrack';
import BaseHeader from '../navigation/BaseHeader';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomHeader from '../navigation/CustomHeader';
import { logout } from '../services/api';
import { logOutUser } from '../store/actions/auth';
import { showDeactivateModal } from '../store/actions/modal';
import { clearRoute, setRoute } from '../store/actions/route';
import { getTokenSelector } from '../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../utils';

export default function GeneralSettingsScreen(props: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
            loading={loggingOut}
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
              setLoggingOut(true);

              logout(token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(logOutUser());
                });
            }}
          >{t('Logout')}</Button>
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
