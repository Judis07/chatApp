import { ChatActionTypes } from './chatsActionTypes';

const INITIAL_STATE = {
  chats: [],
  loading: false,
  error: false,
};

const chatsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ChatActionTypes.GET_CHATS:
      return {
        chats: action.payload,
        loading: false,
        error: false,
      };
    case ChatActionTypes.GETTING_CHAT:
      return {
        chats: [],
        loading: true,
        errror: false,
      };
    case ChatActionTypes.ERROR_GETTING_CHAT:
      return {
        chats: [],
        loading: false,
        error: true,
      };
    case ChatActionTypes.SEND_MESSAGE:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default chatsReducer;
