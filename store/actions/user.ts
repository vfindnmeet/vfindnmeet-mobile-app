export const TYPE_FETCH_USER = 'fetch_user';
export const TYPE_CLEAR_USER = 'clear_user';
export const TYPE_SET_USER = 'set_user';
export const TYPE_SET_PROFILE_IMAGE = 'set_profile_image';
export const TYPE_USER_UNMATCHED = 'set_user';

export function fetchUser() {
  return {
    type: TYPE_FETCH_USER,
    payload: {}
  };
}

export function clearUser() {
  return {
    type: TYPE_CLEAR_USER,
    payload: {}
  };
}

export function setUser(user: any) {
  return {
    type: TYPE_SET_USER,
    payload: { user }
  };
}

// : {
//   imageId: string,
//   uri_small: string,
//   uri_big: string
// }
export function setNewProfileImage(image: any) {
  console.log('==============================!!!!!!!', image);
  return {
    type: TYPE_SET_PROFILE_IMAGE,
    payload: image
  };
}

export function userUnmatched(userId: string) {
  return {
    type: TYPE_USER_UNMATCHED,
    payload: { userId }
  };
}
