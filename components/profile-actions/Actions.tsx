import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import ActionItemCont from './ActionItemCont';
import ActionsCont from './ActionsCont';
import DislikeButton from './DislikeButton';
import LikeButton from './LikeButton';
import MessageButton from './MessageButton';
import SendIntroButton from './SendIntroButton';
import UnmatchButton from './UnmatchButton';

const styles = EStyleSheet.create({
  actionsContainer: {
    // marginTop: '-35rem'
    marginTop: -35
  },
});

export default function Actions({ user }: any) {
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const [disabled, setDisabled] = useState(false);
  const userId = user?.id;

  if (loggedUserId === userId) {
    return null;
  }

  if (user.matched) {
    return (
      <ActionsCont style={styles.actionsContainer}>
        <UnmatchButton userId={userId} disabled={disabled} setDisabled={setDisabled} />
        <MessageButton userId={userId} />
        {/* <ActionItemCont>
        </ActionItemCont>
        <ActionItemCont>
        </ActionItemCont> */}
      </ActionsCont>
    );
  }

  if (!user.like?.liked) {
    return (
      <ActionsCont style={styles.actionsContainer}>
        <DislikeButton userId={userId} />
        <LikeButton userId={userId} />
        {/* <ActionItemCont>
        </ActionItemCont>
        <ActionItemCont>
        </ActionItemCont> */}
      </ActionsCont>
    );
  }

  return (
    <ActionsCont style={styles.actionsContainer}>
      {/* <UnlikeButton userId={userId} /> */}

      <LikeButton userId={userId} disabled={true} styles={{ backgroundColor: 'pink' }} />
      {!user.like.introSent && <SendIntroButton user={user} />}
      {/* {user.like.introSent && <LikeButton userId={userId} disabled={true} />} */}
      {/* <ActionItemCont>
      </ActionItemCont>
      <ActionItemCont>
      </ActionItemCont> */}
    </ActionsCont>
  );
}
