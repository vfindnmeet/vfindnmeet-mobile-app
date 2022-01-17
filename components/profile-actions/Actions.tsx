import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import ActionItemCont from './ActionItemCont';
import ActionsCont from './ActionsCont';
import DislikeButton from './DislikeButton';
import LikeButton from './LikeButton';
import MessageButton from './MessageButton';
import SendIntroButton from './SendIntroButton';
import UnlikeButton from './UnlikeButton';
import UnmatchButton from './UnmatchButton';

export default function Actions({ user }: any) {
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const [disabled, setDisabled] = useState(false);
  const userId = user?.id;

  if (loggedUserId === userId) {
    return null;
  }

  if (user.matched) {
    return (
      <ActionsCont>
        <ActionItemCont>
          <UnmatchButton userId={userId} disabled={disabled} setDisabled={setDisabled} />
        </ActionItemCont>
        <ActionItemCont>
          <MessageButton userId={userId} />
        </ActionItemCont>
      </ActionsCont>
    );
  }

  if (!user.like?.liked) {
    return (
      <ActionsCont>
        <ActionItemCont>
          <DislikeButton userId={userId} />
        </ActionItemCont>
        <ActionItemCont>
          <LikeButton userId={userId} />
        </ActionItemCont>
      </ActionsCont>
    );
  }

  return (
    <ActionsCont>
      <ActionItemCont>
        <UnlikeButton userId={userId} />
      </ActionItemCont>
      <ActionItemCont>
        {!user.like.introSent && <SendIntroButton user={user} />}
        {user.like.introSent && <LikeButton userId={userId} disabled={true} />}
      </ActionItemCont>
    </ActionsCont>
  );
}
