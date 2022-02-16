import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors, IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showIntroModal } from '../../store/actions/modal';
import { BUTTON_SIZE } from './common';

export default function SendIntroButton({ user }: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <IconButton
      style={{
        // borderColor: Colors.black,
        // borderWidth: .1,
        padding: 5,

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
      color={Colors.blue300}
      // icon="comment-text-outline"
      icon="comment-text"
      onPress={() => {
        dispatch(showIntroModal({
          likeId: user.like?.id,
          userId: user.id,
          name: user.name
        }));
      }}
    />
  );

  return (
    <IconButton
      style={{
        // width: '100%',
        borderColor: Colors.blue300,
        borderWidth: 2
      }}
      size={BUTTON_SIZE}
      color={Colors.blue300}
      icon="comment-text-outline"
      // mode="outlined"
      // uppercase={false}
      onPress={() => {
        dispatch(showIntroModal({
          likeId: user.like?.id,
          userId: user.id,
          name: user.name
        }));
      }}
    />
    // <Button
    //   style={{
    //     width: '100%',
    //     borderColor: 'gray',
    //   }}
    //   color={Colors.blue300}
    //   icon="comment-text-outline"
    //   mode="outlined"
    //   uppercase={false}
    //   onPress={() => {
    //     dispatch(showIntroModal({
    //       likeId: user.like?.id,
    //       userId: user.id,
    //       name: user.name
    //     }));
    //   }}
    // >{t('Send intro')}</Button>
  );
}
