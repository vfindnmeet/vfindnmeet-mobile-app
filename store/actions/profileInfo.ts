export const TYPE_FETCH_PROFILE_INFO = 'fetch_profile_info2';
export const TYPE_SET_PROFILE_INFO = 'set_profile_info2';
export const TYPE_CLEAR_PROFILE_INFO = 'clear_profile_info';

export function fetchProfileInfo() {
  return {
    type: TYPE_FETCH_PROFILE_INFO,
    payload: {}
  };
}

export function setProfileInfo(info: any) {
  return {
    type: TYPE_SET_PROFILE_INFO,
    payload: info
  };
}

export function clearProfileInfo() {
  return {
    type: TYPE_CLEAR_PROFILE_INFO,
    payload: {}
  };
}
