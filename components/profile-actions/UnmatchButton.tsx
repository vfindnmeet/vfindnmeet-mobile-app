import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Colors, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { BIG_ICON_SIZE } from '../../constants';
import { unmatchUser } from '../../services/api';
import { userUnmatched } from '../../store/actions/user';
import { getTokenSelector } from '../../store/selectors/auth';
import { BUTTON_SIZE } from './common';

export default function UnmatchButton({ userId }: any) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  return (
    <IconButton
      // style={{
      //   borderColor: Colors.black,
      //   borderWidth: 2
      // }}
      // size={35}
      // color={Colors.black}
      // icon="close-octagon-outline"
      style={{
        // width: '100%',
        // borderColor: '#000',
        // borderWidth: .1,
        padding: 5,
        // borderEndColor: '#000',
        // borderBottomColor: '#000'

        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: {
          width: 4,
          height: 0,
        },
        shadowOpacity: 1.0,
        shadowRadius: 4,
        elevation: 14,
      }}
      size={BIG_ICON_SIZE}
      color={Colors.black}
      // icon="close-octagon-outline"
      icon="account-remove"

      disabled={loading}
      onPress={() => {
        if (loading) return;

        setLoading(true);
        unmatchUser(userId, token)
          .then(() => {
            dispatch(userUnmatched(userId));
            setLoading(false);
          });
      }}
    />
  );
}
