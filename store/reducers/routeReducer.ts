import { TYPE_CLEAR_ROUTE, TYPE_SET_ROUTE } from '../actions/route';

const INITIAL_STATE: any = {};

export default function routeReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SET_ROUTE:
      return {
        ...action.payload
      };
    case TYPE_CLEAR_ROUTE:
      return {};
  }

  return state;
}
