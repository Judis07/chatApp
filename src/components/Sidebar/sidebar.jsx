import './sideBar.scss';

const SideBar = (props) => {
  const { chats, userEmail, selectedChat, selectChatFn } = props;

  const selectChat = (chatIndex) => {
    selectChatFn(chatIndex);
  };

  const userIsSender = (chat) => {
    return chat.messages[chat.messages.length - 1].sender === userEmail;
  };

  return (
    <div className="sideBarContainer">
      <div className="sideBarHeader">
        <strong>chat</strong>App
      </div>

      <div className="chatList">
        {chats &&
          chats.map((chat, index) => {
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
          })}
      </div>
    </div>
  );
};

export default SideBar;
