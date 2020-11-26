import LinearProgress from '@material-ui/core/LinearProgress';
import { useState } from 'react';
import './sideBar.scss';

const SideBar = (props) => {
  const { chats, userEmail, selectedChat, selectChatFn } = props;

  const [searchChatByUser, setSearchChatByUser] = useState('');

  const selectChat = (chatIndex) => {
    selectChatFn(chatIndex);
  };

  const filteredChat = () => {
    if (chats.length) {
      console.log('chats', chats);
      const result = chats.filter((chat) =>
        chat.users.includes(searchChatByUser)
      );

      if (result.length) return result;
      return chats;
    }
  };
  // const filteredChatByMessages = () => {
  //   if (chats.length) {
  //     console.log('chats', chats);
  //     const result = chats.filter((chat) =>
  //       chat.messages.some((msg) => msg.message.startsWith(searchChatByUser))
  //     );

  //     if (result.length) return result;
  //     return chats;
  //   }
  // };

  const userIsSender = (chat) => {
    return chat.messages[chat.messages.length - 1].sender === userEmail;
  };

  return (
    <div className="sideBarContainer">
      <div className="sideBarHeader">
        <strong>chat</strong>App
      </div>

      <div className="ctaBox">
        <input
          type="text"
          value={searchChatByUser}
          placeholder="Type the full user email"
          onChange={(event) => setSearchChatByUser(event.target.value.trim(''))}
        />
        <button className="newChatBtn">+ New Chat</button>
      </div>

      <div className="chatList">
        {/* {console.log(filteredChat())} */}
        {chats.length ? (
          filteredChat().map((chat, index) => {
            return (
              <div
                key={index}
                className={
                  selectedChat === index ? 'friendCard selected' : 'friendCard'
                }
                onClick={() => selectChat(index)}
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
