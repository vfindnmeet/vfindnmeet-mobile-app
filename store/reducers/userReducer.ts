import { TYPE_LIKE_USER, TYPE_UNLIKE_USER, TYPE_USER_INTRO_UPDATED } from "../actions/like";
import { TYPE_CLEAR_USER, TYPE_FETCH_USER, TYPE_SET_USER, TYPE_USER_UNMATCHED } from "../actions/user";

const INITIAL_STATE: any = {};

export default function userReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_USER:
      return {
        ...state,
        loading: true,
        user: null
      };
    case TYPE_CLEAR_USER:
      return {};
    case TYPE_SET_USER:
      return {
        ...state,
        loading: false,
        user: action.payload.user
      };
    case TYPE_USER_UNMATCHED: {
      const user = { ...state.user };

      if (action.payload.userId === user.id) {
        delete user.matched;
      }

      return {
        ...state,
        user
      };
    }
    case TYPE_UNLIKE_USER: {
      const user = { ...state.user };

      if (action.payload.userId === user.id) {
        delete user.like;
      }

      return {
        ...state,
        user
      };
    }
    case TYPE_USER_INTRO_UPDATED: {
      const user = { ...state.user };

      if (action.payload.userId === user.id) {
        user.like = {
          ...user.like,
          introSent: true
        };
      }

      return {
        ...state,
        user
      };
    }
    case TYPE_LIKE_USER: {
      const user = { ...state.user };

      if (action.payload.userId === user.id) {
        user.like = {
          liked: true,
          introSent: false
        };
      }

      return {
        ...state,
        user
      };
    }
  }

  return state;
}
