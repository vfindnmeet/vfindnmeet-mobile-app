import { TYPE_FETCH_SEARCH_PREF, TYPE_SET_SEARCH_PREF } from "../actions/searchPref";

const INITIAL_STATE: any = {};

export default function searchPrefReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_SEARCH_PREF:
      return {
        loading: true
      };
    case TYPE_SET_SEARCH_PREF:
      return {
        ...action.payload,
        loading: false
      };
  }

  return state;
}
