export const TYPE_FETCH_PROFILE_SCREEN_INFO = 'fetch_profile_screen_info';
export const TYPE_SET_PROFILE_SCREEN_INFO = 'set_profile_screen_info';
export const TYPE_CLEAR_PROFILE_SCREEN_INFO = 'clear_profile_info';

export function fetchProfileScreenInfo() {
  return {
    type: TYPE_FETCH_PROFILE_SCREEN_INFO,
    payload: {}
  };
}

export function setProfileScreenInfo(info: any) {
  return {
    type: TYPE_SET_PROFILE_SCREEN_INFO,
    payload: info
  };
}

export function clearProfileScreenInfo() {
  return {
    type: TYPE_CLEAR_PROFILE_SCREEN_INFO,
    payload: {}
  };
}
