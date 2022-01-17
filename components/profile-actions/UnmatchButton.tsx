import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { unmatchUser } from '../../services/api';
import { userUnmatched } from '../../store/actions/user';
import { getTokenSelector } from '../../store/selectors/auth';

export default function UnmatchButton({ userId }: any) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
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
        unmatchUser(userId, token)
          .then(() => {
            dispatch(userUnmatched(userId));
            setLoading(false);
          });
      }}
    >{t('Unmatch')}</Button>
  );
}
