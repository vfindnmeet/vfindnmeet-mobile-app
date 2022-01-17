import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showIntroModal } from '../../store/actions/modal';

export default function SendIntroButton({ user }: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Button
      style={{
        width: '100%',
        borderColor: 'gray',
      }}
      color={Colors.blue300}
      icon="comment-text-outline"
      mode="outlined"
      uppercase={false}
      onPress={() => {
        dispatch(showIntroModal({
          likeId: user.like?.id,
          userId: user.id,
          name: user.name
        }));
      }}
    >{t('Send intro')}</Button>
  );
}
