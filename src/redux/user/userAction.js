import { auth } from '../../firebase';
import { UserActionTypes } from './userActionTypes';

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const buildUserDocKey = (key) => ({
  type: UserActionTypes.BUILT_DOCKEY,
  payload: key,
});

export const logOutUser = () => {
  return (dispatch) => {
    dispatch(setCurrentUser(null));
    auth.signOut();
  };
};

export const buildUserDocKeyFn = (userEmail, friendEmail) => {
  return (dispatch) => {
    const key = [userEmail, friendEmail].sort().join(':');
    dispatch(buildUserDocKey(key));
  };
};
