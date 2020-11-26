import { useEffect, useState } from 'react';
import EmptyChatWindow from '../EmptyChatWindow/emptyChatWindow';
import './chatWindow.scss';

const ChatWindow = (props) => {
  const { newChatFormVisible, chat, userEmail, sumbitMsgFn, signoutFn } = props;

  const [yourMsg, setYourMsg] = useState('');

  useEffect(() => {
    let chatView = document.getElementById('chatview-container');

    if (chatView) {
      chatView.scrollTo(0, chatView.scrollHeight);
    }
  }, [chat]);

  const userTyping = (event) => {
    const { value } = event.target;

    if (event.keyCode === 13) {
      sendBtnClick();
    } else {
      setYourMsg(value);
    }
  };

  const sendBtnClick = () => {
    console.log(yourMsg);
    sumbitMsgFn(yourMsg);
    document.getElementById('message-input').value = '';
  };

  return (
    <div className="chatWindowContainer">
      <div className="chatScreenHeader">
        {chat && (
          <div className="converstionWith">
            Your conversation with:{' '}
            <strong>{chat.users.filter((user) => user !== userEmail)}</strong>
          </div>
        )}

        <div className="logOut" onClick={() => signoutFn()}>
          Log Out
        </div>
      </div>

      <div className="chatScreenContent" id="chatview-container">
        {newChatFormVisible ? (
          <div className={'chatConversationContainer'}>
            {chat &&
              chat.messages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={msg.sender === userEmail ? ' userMsg' : 'frdMsg'}
                  >
                    {msg.message}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="notChatContainer">
            <EmptyChatWindow />
          </div>
        )}
      </div>

      {newChatFormVisible && (
        <div className="chatScreenFooter">
          <div className="innerContainer">
            <div className="msgInput">
              <input
                type="text"
                placeholder="Type your message.."
                id="message-input"
                onKeyUp={(e) => userTyping(e)}
              />
            </div>
            <div className="sendBtn">
              <button onClick={sendBtnClick}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
