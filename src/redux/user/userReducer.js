import { UserActionTypes } from './userActionTypes';

const INITIAL_STATE = {
  currentUser: null,
  docKey: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.BUILT_DOCKEY:
      return {
        ...state,
        docKey: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
