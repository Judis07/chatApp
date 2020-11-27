import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch } from 'react-redux';
import { buildUserDocKeyFn } from '../../redux/user/userAction';
import NewChat from '../NewChat/newChat';
import './sideBar.scss';

const SideBar = (props) => {
  const dispatch = useDispatch();

  const { chats, userEmail, selectedChat, selectChatFn, sumbitMsgFn } = props;

  const selectChat = (chatIndex) => {
    selectChatFn(chatIndex);
  };

  const userIsSender = (chat) => {
    return chat.messages[chat.messages.length - 1].sender === userEmail;
  };

  const getFriendEmail = (users) => {
    return users.filter((user) => user !== userEmail)[0];
  };

  return (
    <div className="sideBarContainer">
      <div className="sideBarHeader">
        <strong>chat</strong>App
      </div>

      <div className="ctaBox">
        <NewChat
          selectChatFn={selectChatFn}
          chats={chats}
          sumbitMsgFn={sumbitMsgFn}
        />
      </div>

      <div className="chatList">
        {/* {console.log(filteredChat())} */}
        {chats.length ? (
          chats.map((chat, index) => {
            return (
              <div
                key={index}
                className={
                  selectedChat === index ? 'friendCard selected' : 'friendCard'
                }
                onClick={() => {
                  // console.log(getFriendEmail(chat.users));
                  dispatch(
                    buildUserDocKeyFn(userEmail, getFriendEmail(chat.users))
                  );
                  selectChat(index);
                }}
              >
                <div className="friendAvatar">
                  {chat.users
                    .filter((user) => user !== userEmail)[0][0]
                    .toUpperCase()}
                </div>
                <div style={{ width: '26em' }}>
                  <div className="friendEmail">
                    {chat.users.filter((user) => user !== userEmail)}
                  </div>
                  <div className="friendMsg">
                    {chat.messages[chat.messages.length - 1].message}
                  </div>
                </div>
                {chat.receiverHasRead === false && !userIsSender(chat) && (
                  <div className="newMsgDot"></div>
                )}
              </div>
            );
          })
        ) : (
          <LinearProgress />
        )}
      </div>
    </div>
  );
};

export default SideBar;
