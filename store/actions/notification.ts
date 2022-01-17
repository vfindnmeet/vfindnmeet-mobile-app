export const TYPE_SET_CHAT_NOT_SEEN = 'set_chat_not_seen';
export const TYPE_SET_NOTIFS_COUNT = 'set_notifs_count';
export const TYPE_SET_LIKES_COUNT = 'set_likes_count';
export const TYPE_SET_NOT_SEEN_MESSAGES_COUNT = 'set_not_seen_messages_count';
export const TYPE_INCR_NOT_SEEN_MESSAGES_COUNT = 'incr_not_seen_messages_count';
export const TYPE_SEE_CHAT = 'see_chat';

export function setChatNotSeen() {
  return {
    type: TYPE_SET_CHAT_NOT_SEEN,
    payload: {}
  };
}

export function setNotifsCount(notifsCount: {
  notSeenMessagesCount: number;
  likesCount: number;
}) {
  return {
    type: TYPE_SET_NOTIFS_COUNT,
    payload: notifsCount
  };
}

export function setLikesCount(likesCount: number) {
  return {
    type: TYPE_SET_LIKES_COUNT,
    payload: likesCount ?? 0
  };
}

export function setNotSeenMessagesCount(notSeenMessagesCount: number) {
  return {
    type: TYPE_SET_NOT_SEEN_MESSAGES_COUNT,
    payload: notSeenMessagesCount ?? 0
  };
}

export function incrNotSeenMessagesCount() {
  return {
    type: TYPE_INCR_NOT_SEEN_MESSAGES_COUNT,
    payload: {}
  };
}

export const seeChat = ({ chatId, notSeenMessagesCount }: { chatId: string; notSeenMessagesCount: number }) => ({
  type: TYPE_SEE_CHAT,
  payload: {
    chatId,
    notSeenMessagesCount: notSeenMessagesCount ?? 0
  }
});