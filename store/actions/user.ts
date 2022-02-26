export const TYPE_FETCH_USER = 'fetch_user';
export const TYPE_CLEAR_USER = 'clear_user';
export const TYPE_SET_USER = 'set_user';
export const TYPE_SET_PROFILE_IMAGE = 'set_profile_image';
export const TYPE_USER_UNMATCHED = 'set_user';
export const TYPE_USER_NOT_FOUND = 'user_not_found';

export const fetchUser = () => ({
  type: TYPE_FETCH_USER,
  payload: {}
});

export const clearUser = () => ({
  type: TYPE_CLEAR_USER,
  payload: {}
});

export const setUser = (user: any) => ({
  type: TYPE_SET_USER,
  payload: { user }
});

// : {
//   imageId: string,
//   uri_small: string,
//   uri_big: string
// }
export const setNewProfileImage = (image: any) => ({
  type: TYPE_SET_PROFILE_IMAGE,
  payload: image
});

export const userUnmatched = (userId: string) => ({
  type: TYPE_USER_UNMATCHED,
  payload: { userId }
});

export const userNotFound = (userId: string) => ({
  type: TYPE_USER_NOT_FOUND,
  payload: { userId }
});
