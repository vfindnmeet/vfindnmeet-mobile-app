import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { passUser } from '../../services/api';
import { userPassed } from '../../store/actions/like';
import { getTokenSelector } from '../../store/selectors/auth';
import { handleError, throwErrorIfErrorStatusCode } from '../../utils';
import { BUTTON_SIZE } from './common';

export default function DislikeButton({ userId }: any) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  return (
    <IconButton
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
      size={BUTTON_SIZE}
      color={Colors.grey800}
      // icon="close-octagon-outline"
      icon="close"
      // mode="outlined"
      // uppercase={false}
      // loading={loading}
      disabled={loading}
      onPress={() => {
        if (loading) return;

        setLoading(true);

        passUser(userId, token)
          .then(throwErrorIfErrorStatusCode)
          .then(() => {
            dispatch(userPassed(userId));
          })
          .catch(err => {
            handleError(err, dispatch);
          })
          .finally(() => {
            if (!isMounted.current) return;

            setLoading(false);
          });
      }}
    />
    // >{t('Pass')}</Button>
  );
}
