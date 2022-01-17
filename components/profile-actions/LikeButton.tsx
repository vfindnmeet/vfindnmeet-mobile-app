import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { likeUser } from '../../services/api';
import { userLiked } from '../../store/actions/like';
import { showMatchModal } from '../../store/actions/modal';
import { setLikesCount } from '../../store/actions/notification';
import { getTokenSelector } from '../../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../../utils';

export default function LikeButton({ userId, disabled }: any) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  return (
    <Button
      style={{
        width: '100%',
        borderColor: 'gray',
      }}
      color="pink"
      icon="heart"
      mode="outlined"
      disabled={disabled || loading}
      uppercase={false}
      loading={loading}
      onPress={() => {
        if (loading) return;

        // dispatch(userLiked(userId));
        // return;

        setLoading(true);
        likeUser(userId, token)
          .then(throwErrorIfErrorStatusCode)
          .then(result => result.json())
          .then(({ status, me, user, likesCount }: any) => {
            dispatch(userLiked(userId));

            if (status === 'matched') {
              console.log('ONE MATCHED MODAL..', me, user);
              dispatch(setLikesCount(likesCount));
              dispatch(showMatchModal({ me, user }));
            }

            if (!isMounted.current) return;

            setLoading(false);
          });
      }}
    >{t('Like')}</Button>
  );
}
