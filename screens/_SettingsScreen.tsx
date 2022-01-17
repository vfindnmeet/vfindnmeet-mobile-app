import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomHeader from '../navigation/CustomHeader';
import { logout } from '../services/api';
import { logOutUser } from '../store/actions/auth';
import { showDeactivateModal } from '../store/actions/modal';
import { getTokenSelector } from '../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../utils';

export default function _SettingsScreen(props: any) {
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);

  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <View style={{
      flex: 1
    }}>
      <CustomHeader />
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
          >Deactivate</Button>
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
                  dispatch(logOutUser())
                })
            }}
          >Logout</Button>
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
