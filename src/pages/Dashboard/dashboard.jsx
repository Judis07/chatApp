import { useEffect, useState } from 'react';
import ChatWindow from '../../components/ChatWindow/chatWindow';
import SideBar from '../../components/Sidebar/sidebar';
import { auth, firestore, FieldValue } from '../../firebase';

const Dashboard = (props) => {
  const [email, setEmail] = useState(null);
  const [newChatFormVisible, setNewChatFormVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    console.log('my props', props);
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

  const selectChatFn = (index) => {
    console.log('select chat func clicked', index);
    setSelectedChat(index);
    setNewChatFormVisible(true);
  };

  const signout = () => auth.signOut();

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
      {console.log(chats)}
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
      />
    </div>
  );
};

export default Dashboard;
