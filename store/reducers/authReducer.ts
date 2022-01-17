import { TYPE_LOGOUT, TYPE_SET_LOGGED_USER } from '../actions/auth';

const INITIAL_STATE: any = {};

export default function authReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SET_LOGGED_USER:
      return {
        ...action.payload
      };
    case TYPE_LOGOUT:
      return {};
  }

  return state;
}
