import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { unlikeUser } from '../../services/api';
import { userUnliked } from '../../store/actions/like';
import { getTokenSelector } from '../../store/selectors/auth';

export default function UnlikeButton({ userId }: any) {
  const [loading, setLoading] = useState(false);

  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

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
        unlikeUser(userId, token)
          .then(() => {
            dispatch(userUnliked(userId));

            if (!isMounted.current) return;

            setLoading(false);
          });
      }}
    >{t('Unlike')}</Button>
  );
}
