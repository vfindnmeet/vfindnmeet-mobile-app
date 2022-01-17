export const TYPE_SET_LOGGED_USER = 'set_logged_user';
export const TYPE_LOGOUT = 'logout';

export function setLoggedUser(userInfo: {
  id: string;
  token: string;
  status: string;
  name?: string;
  email?: string;
  gender?: string;
  verificationStatus?: string;
}) {
  return {
    type: TYPE_SET_LOGGED_USER,
    payload: userInfo
  };
}

export function logOutUser() {
  return {
    type: TYPE_LOGOUT,
    payload: {}
  };
}
