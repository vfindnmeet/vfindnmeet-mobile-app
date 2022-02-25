import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_COLOR, STORAGE_SHOW_INTRO_MODAL } from '../../constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import { likeUser } from '../../services/api';
import { userLiked } from '../../store/actions/like';
import { showIntroModal, showMatchModal } from '../../store/actions/modal';
import { setLikesCount } from '../../store/actions/notification';
import { getTokenSelector } from '../../store/selectors/auth';
import { getStorageItem, handleError, setStorageItem, throwErrorIfErrorStatusCode } from '../../utils';
import { BUTTON_SIZE } from './common';

export default function LikeButton({ userId, user, disabled, styles }: any) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  // const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<null | boolean>(null);
  // setStorageItem(STORAGE_SHOW_INTRO_MODAL, 'false');
  useEffect(() => {
    getStorageItem(STORAGE_SHOW_INTRO_MODAL)
      .then((checked) => {
        setChecked(checked === 'true');
      });
  }, []);

  return (
    <IconButton
      style={{
        // width: '100%',
        // borderColor: Colors.black,
        // borderWidth: .1,
        // borderWidth: 2,
        padding: 5,

        ...(styles ?? {}),
        // borderEndColor: '#000',
        // borderBottomColor: '#000',

        // backgroundColor: disabled ? 'rgba(189, 189, 189, 0.7)' : Colors.white,
        backgroundColor: disabled ? Colors.grey300 : Colors.white,
        // backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: {
          width: 4,
          height: 0,
        },
        shadowOpacity: 1.0,
        shadowRadius: 4,
        elevation: 14,

        opacity: 1
      }}
      size={BUTTON_SIZE}
      color={disabled ? 'rgba(255, 122, 112, 0.7)' : MAIN_COLOR} //Colors.red500
      // color={disabled ? 'rgba(244, 67, 54, 0.7)' : MAIN_COLOR} //Colors.red500
      // icon="heart-outline"
      icon={disabled ? 'heart-outline' : 'heart'}
      // mode="outlined"
      disabled={disabled || loading}
      // uppercase={false}
      // loading={loading}
      onPress={() => {
        if (loading) return;

        // dispatch(userLiked(userId));
        // return;

        // dispatch(showIntroModal({
        //   userId,
        //   name: user?.name,
        //   liked: true,
        // }));
        // // dispatch(userLiked(userId));

        setLoading(true);

        likeUser(userId, token)
          .then(throwErrorIfErrorStatusCode)
          .then(result => result.json())
          .then(({
            likeId,
            hasMessage,
            status,
            me,
            user,
            likesCount
          }: any) => {
            if (status === 'matched') {
              console.log('ONE MATCHED MODAL..', me, user);
              dispatch(userLiked(userId));
              dispatch(setLikesCount(likesCount));
              dispatch(showMatchModal({ me, user }));
            } else if (status === 'liked') {
              if (checked || hasMessage) {
                dispatch(userLiked(userId));
              } else {
                dispatch(showIntroModal({
                  userId,
                  likeId,
                  name: 'un1',
                  liked: true,
                }));
              }
            }

            // already_matched, matched, liked
            // dispatch(userLiked(userId));

            // if (!isMounted.current) return;

            // setLoading(false);
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
  );
}
