export const TYPE_FETCH_LIKE_USERS = 'fetch_like_users';
export const TYPE_SET_LIKE_USERS = 'set_like_users';
export const TYPE_LIKE_USER = 'like_user';
export const TYPE_PASS_USER = 'pass_user';
export const TYPE_UNLIKE_USER = 'unlike_user';
export const TYPE_USER_INTRO_UPDATED = 'user_intro_updated';
export const TYPE_CLEAR_LIKE_USERS = 'clear_like_users';

export function fetchLikeUsers() {
  return {
    type: TYPE_FETCH_LIKE_USERS,
    payload: {}
  };
}

export function setLikeUsers(users: any[]) {
  return {
    type: TYPE_SET_LIKE_USERS,
    payload: users
  };
}

export function userLiked(userId: string) {
  return {
    type: TYPE_LIKE_USER,
    payload: { userId }
  };
}

export function userPassed(userId: string) {
  return {
    type: TYPE_PASS_USER,
    payload: { userId }
  };
}

export function userUnliked(userId: string) {
  return {
    type: TYPE_UNLIKE_USER,
    payload: { userId }
  };
}

export function userIntoUpdated(data: {
  userId: string;
  fromUserId: string;
  message: string;
}) {
  return {
    type: TYPE_USER_INTRO_UPDATED,
    payload: data
  };
}

export const clearLikeUsers = () => ({
  type: TYPE_CLEAR_LIKE_USERS,
  payload: {}
});
