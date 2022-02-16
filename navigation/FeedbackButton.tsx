import React from 'react';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ICON_SIZE } from '../constants';
import { showFeedbackModal } from '../store/actions/modal';

export default function FeedbackButton() {
  // const navigation: any = useNavigation();
  const dispatch = useDispatch();

  return (
    <IconButton
      // icon="dots-vertical"
      icon="comment-quote-outline"
      size={ICON_SIZE}
      onPress={() => {
        dispatch(showFeedbackModal({}));
      }}
    />
  );
}
