import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { passUser } from '../../services/api';
import { userPassed } from '../../store/actions/like';
import { getTokenSelector } from '../../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../../utils';

export default function DislikeButton({ userId }: any) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const {t} = useTranslation();

  return (
    <Button
      style={{
        width: '100%',
        borderColor: 'gray',
      }}
      color="gray"
      icon="close-octagon-outline"
      mode="outlined"
      uppercase={false}
      loading={loading}
      onPress={() => {
        if (loading) return;

        setLoading(true);
        passUser(userId, token)
          .then(throwErrorIfErrorStatusCode)
          .then(() => {
            dispatch(userPassed(userId));

            if (!isMounted.current) return;

            setLoading(false);
          });
      }}
    >{t('Pass')}</Button>
  );
}
