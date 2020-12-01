import { auth, firestore, FieldValue } from '../../firebase';
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

export const getChatsFn = (userEmail) => {
  return (dispatch) => {
    dispatch(gettingChats());
    const getData = async () => {
      try {
        await firestore
          .collection('chats')
          .where('users', 'array-contains', userEmail)
          .onSnapshot(async (res) => {
            const userChats = res.docs.map((doc) => doc.data());
            await dispatch(getChats(userChats));
          });
      } catch (err) {
        dispatch(errGettingChats());
      }
    };

    getData();

    // auth.onAuthStateChanged(async (user) => {

    // });
  };
};

export const sendMsgFn = (docKey, userEmail, msg) => {
  return (dispatch) => {
    firestore
      .collection('chats')
      .doc(docKey)
      .update({
        messages: FieldValue.arrayUnion({
          sender: userEmail,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
        createdAt: Date.now(),
      });
    dispatch({ type: ChatActionTypes.SEND_MESSAGE });
    dispatch({ type: ChatActionTypes.CHAT_SELECTED, payload: 0 });
  };
};

export const chatSelectFn = (chatIndex) => {
  return (dispatch) => {
    dispatch({ type: ChatActionTypes.CHAT_SELECTED, payload: chatIndex });
  };
};

export const createNewChat = (docKey, friendEmail, msg) => {
  return (dispatch) => {
    dispatch({ type: ChatActionTypes.NEW_CHAT });

    const newChat = async () => {
      await firestore
        .collection('chats')
        .doc(docKey)
        .set({
          receiverHasRead: false,
          users: [auth.currentUser.email, friendEmail],
          messages: [
            {
              message: msg,
              sender: auth.currentUser.email,
              timestamp: Date.now(),
            },
          ],
          createdAt: Date.now(),
        });
    };

    newChat();
    dispatch({ type: ChatActionTypes.CHAT_SELECTED, payload: 0 });
  };
};

export const clearChatStoreFn = () => ({
  type: ChatActionTypes.CLEAR_CHAT_STORE,
});
