export const TYPE_FETCH_SEARCH_PREF = 'fetch_search_pref';
export const TYPE_SET_SEARCH_PREF = 'set_search_pref';

export function fetchSearchPref() {
  return {
    type: TYPE_FETCH_SEARCH_PREF,
    payload: {}
  };
}

export function setSearchPref(searchPref: any) {
  return {
    type: TYPE_SET_SEARCH_PREF,
    payload: searchPref
  };
}
