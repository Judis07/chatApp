import { ChatActionTypes } from './chatsActionTypes';

const INITIAL_STATE = {
  chats: [],
  loading: false,
  error: false,
  selectedChatIndex: null,
};

const chatsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ChatActionTypes.GET_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false,
        error: false,
      };
    case ChatActionTypes.GETTING_CHAT:
      return {
        ...state,
        chats: [],
        loading: true,
        errror: false,
      };
    case ChatActionTypes.ERROR_GETTING_CHAT:
      return {
        ...state,
        chats: [],
        loading: false,
        error: true,
      };
    case ChatActionTypes.SEND_MESSAGE:
      return {
        ...state,
      };
    case ChatActionTypes.CHAT_SELECTED:
      return {
        ...state,
        selectedChatIndex: action.payload,
      };

    default:
      return state;
  }
};

export default chatsReducer;
