import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ChatWindow from '../../components/ChatWindow/chatWindow';
import SideBar from '../../components/Sidebar/sidebar';
import { auth, firestore, FieldValue } from '../../firebase';
import { setCurrentUser } from '../../redux/user/userAction';

const Dashboard = (props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState(null);
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        props.history.push('/login');
      } else {
        await firestore
          .collection('chats')
          .where('users', 'array-contains', user.email)
          .onSnapshot(async (res) => {
            const userChats = res.docs.map((doc) => doc.data());
            setEmail(user.email);
            await setChats(userChats);
          });
      }
    });
  }, []);

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
      // console.log('friend msg');
    } else {
      // console.log('latest msg was of me');
    }
  };

  const signout = () => {
    dispatch(setCurrentUser(null));

    auth.signOut();
  };

  const buildDocKey = (friend) => {
    return [email, friend].sort().join(':');
  };

  const sumbitMsg = (msg) => {
    const docKey = buildDocKey(
      chats[selectedChat].users.filter((user) => user !== email)[0]
    );
    // console.log(docKey);

    firestore
      .collection('chats')
      .doc(docKey)
      .update({
        messages: FieldValue.arrayUnion({
          sender: email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  return (
    <div className="dashboardContainer">
      <SideBar
        chats={chats}
        userEmail={email}
        selectedChat={selectedChat}
        selectChatFn={selectChatFn}
      />
      <ChatWindow
        userEmail={email}
        chat={chats[selectedChat]}
        newChatFormVisible={newChatFormVisible}
        sumbitMsgFn={sumbitMsg}
        signoutFn={signout}
        selectedChat={selectedChat}
        messageReadFn={messageRead}
      />
    </div>
  );
};

export default Dashboard;
