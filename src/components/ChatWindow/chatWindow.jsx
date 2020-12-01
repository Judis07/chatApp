import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyChatWindow from '../EmptyChatWindow/emptyChatWindow';
import { logOutUser } from '../../redux/user/userAction';
import { sendMsgFn, clearChatStoreFn } from '../../redux/chats/chatsAction';
import { buildUserDocKeyFn } from '../../redux/user/userAction';

import './chatWindow.scss';

const ChatWindow = (props) => {
  const {
    chat,
    // userEmail,
    selectedChat,
    messageReadFn,
  } = props;

  const [yourMsg, setYourMsg] = useState('');

  const dispatch = useDispatch();

  const docKey = useSelector((state) => state.user.docKey);
  const userEmail = useSelector((state) => state.user.currentUser);
  const chats = useSelector((state) => state.chats.chats);

  const selectedChatIndex = useSelector(
    (state) => state.chats.selectedChatIndex
  );

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
    // sumbitMsgFn(yourMsg);
    dispatch(sendMsgFn(docKey, userEmail, yourMsg));
    document.getElementById('message-input').value = '';
  };

  return (
    <div className="chatWindowContainer">
      <div className="chatScreenHeader">
        {chats[selectedChatIndex] && (
          <div className="converstionWith">
            Your conversation with:{' '}
            <strong>
              {chats[selectedChatIndex].users.filter(
                (user) => user !== userEmail
              )}
            </strong>
          </div>
        )}

        <div
          className="logOut"
          onClick={() => {
            dispatch(clearChatStoreFn());
            dispatch(logOutUser());
          }}
        >
          Log Out
        </div>
      </div>

      <div className="chatScreenContent" id="chatview-container">
        {selectedChatIndex !== null ? (
          <div className={'chatConversationContainer'}>
            {chats[selectedChatIndex] &&
              chats[selectedChatIndex].messages.map((msg, index) => {
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

      {selectedChatIndex !== null && (
        <div className="chatScreenFooter">
          <div className="innerContainer">
            <div className="msgInput">
              <input
                type="text"
                placeholder="Type your message.."
                id="message-input"
                onKeyUp={(e) => userTyping(e)}
                onFocus={() => {
                  messageReadFn(selectedChat);
                  dispatch(
                    buildUserDocKeyFn(
                      userEmail,
                      chats[selectedChatIndex].users.filter(
                        (user) => user !== userEmail
                      )[0]
                    )
                  );
                }}
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
