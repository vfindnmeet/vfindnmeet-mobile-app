import {
  TYPE_CLEAR_LIKE_USERS,
  TYPE_FETCH_LIKE_USERS,
  TYPE_SET_LIKE_USERS,
  TYPE_UNLIKE_USER,
  TYPE_USER_INTRO_UPDATED
} from "../actions/like";

const INITIAL_STATE: any = {};

export default function likeReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_LIKE_USERS:
      return {
        ...state,
        loading: true,
        users: action.payload.newTab ? [] : state.users
      };
    case TYPE_SET_LIKE_USERS:
      return {
        loading: false,
        users: action.payload
      };
    case TYPE_USER_INTRO_UPDATED:
      if (!state.users) return state;

      return {
        ...state,
        users: state.users.map((user: any) => {
          if (user.id !== action.payload.userId) {
            return { ...user };
          }

          const result: { [key: string]: any } = {
            ...user,
            canSendIntroMessage: false,
            like: {
              ...(user.like ?? {}),
              message: action.payload.message,
              fromUserId: action.payload.fromUserId
            }
          };

          return result;
        })
      };
    case TYPE_UNLIKE_USER:
      return {
        ...state,
        users: state.users.filter((user: any) => action.payload.userId === user.id)
      };
    case TYPE_CLEAR_LIKE_USERS:
      return {
        ...state,
        loading: true
      };
  }

  return state;
}
