import { auth, firestore } from '../../firebase';
import { ChatActionTypes } from './chatsActionTypes';

export const getChats = (chats) => ({
  type: ChatActionTypes.GET_CHATS,
  payload: chats,
});

export const gettingChats = () => ({
  type: ChatActionTypes.GETTING_CHAT,
});

export const errGettingChats = () => ({
  type: ChatActionTypes.ERROR_GETTING_CHAT,
});

export const getChatsFn = () => {
  return (dispatch) => {
    dispatch(gettingChats());
    auth.onAuthStateChanged(async (user) => {
      try {
        await firestore
          .collection('chats')
          .where('users', 'array-contains', user.email)
          .onSnapshot(async (res) => {
            const userChats = res.docs.map((doc) => doc.data());
            await dispatch(getChats(userChats));
          });
      } catch (err) {
        dispatch(errGettingChats());
      }
    });
  };
};
