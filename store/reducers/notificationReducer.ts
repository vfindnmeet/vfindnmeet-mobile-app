import { TYPE_INCR_NOT_SEEN_MESSAGES_COUNT, TYPE_SEE_CHAT, TYPE_SET_CHAT_NOT_SEEN, TYPE_SET_LIKES_COUNT, TYPE_SET_NOTIFS_COUNT, TYPE_SET_NOT_SEEN_MESSAGES_COUNT } from "../actions/notification";

const INITIAL_STATE: any = {};

export default function notificationReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SET_CHAT_NOT_SEEN:
      return {
        ...state,
        chat: true
      };
    case TYPE_SET_NOTIFS_COUNT:
      return {
        ...action.payload
      };
    case TYPE_SET_LIKES_COUNT:
      return {
        ...state,
        likesCount: action.payload
      };
    case TYPE_SET_NOT_SEEN_MESSAGES_COUNT:
      return {
        ...state,
        notSeenMessagesCount: action.payload
      };
    case TYPE_INCR_NOT_SEEN_MESSAGES_COUNT:
      return {
        ...state,
        notSeenMessagesCount: (state.notSeenMessagesCount ?? 0) + 1
      };
    case TYPE_SEE_CHAT:
      return {
        ...state,
        notSeenMessagesCount: action.payload.notSeenMessagesCount
      };
  }

  return state;
}
