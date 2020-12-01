import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector, use } from 'react-redux';

import ChatWindow from '../../components/ChatWindow/chatWindow';
import SideBar from '../../components/Sidebar/sidebar';
import { auth, firestore } from '../../firebase';
import { setCurrentUser } from '../../redux/user/userAction';
import { getChatsFn } from '../../redux/chats/chatsAction';

const Dashboard = (props) => {
  const dispatch = useDispatch();

  const chats = useSelector((state) => state.chats.chats);
  const loading = useSelector((state) => state.chats.loading);
  const userEmail = useSelector((state) => state.user.currentUser);

  const [email, setEmail] = useState(null);
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  // const [chats, setChats] = useState([]);

  const stableDispatch = useCallback(dispatch, [dispatch]);

  useEffect(() => {
    setEmail(userEmail);
    console.log('executing this ');

    const getChats = () => {
      if (userEmail) {
        stableDispatch(getChatsFn(userEmail));
      }
    };

    getChats();
  }, [stableDispatch, userEmail]);

  // const newMsg = () => {
  //   console.log('new msg btn clicked');
  // };

  const selectChatFn = async (index) => {
    // console.log('select chat func clicked', index);
    setSelectedChat(index);
    setNewChatFormVisible(true);
    messageRead(index);
  };

  const isUserTheSender = (chatIndex) => {
    return (
      chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !==
      email
    );
  };

  const messageRead = (index) => {
    const docKey = buildDocKey(
      chats[index].users.filter((user) => user !== email)[0]
    );

    if (isUserTheSender(index)) {
      firestore.collection('chats').doc(docKey).update({
        receiverHasRead: true,
      });
      console.log('friend msg', isUserTheSender(index));
    } else {
      console.log('latest msg was of me');
    }
  };

  const signout = () => {
    dispatch(setCurrentUser(null));

    auth.signOut();
  };

  const buildDocKey = (friend) => {
    return [email, friend].sort().join(':');
  };

  return (
    <div className="dashboardContainer">
      <SideBar
        chats={chats}
        loading={loading}
        userEmail={email}
        selectedChat={selectedChat}
        selectChatFn={selectChatFn}
        // sumbitMsgFn={sumbitMsg}
      />
      <ChatWindow
        userEmail={email}
        chat={chats[selectedChat]}
        newChatFormVisible={newChatFormVisible}
        signoutFn={signout}
        selectedChat={selectedChat}
        messageReadFn={messageRead}
      />
    </div>
  );
};

export default Dashboard;
