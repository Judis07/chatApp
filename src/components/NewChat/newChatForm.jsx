import { useState } from 'react';
import { useSelector } from 'react-redux';
import { AsyncPaginate } from 'react-select-async-paginate';
import { firestore, auth } from '../../firebase';
import './newChatForm.scss';

const NewChatForm = (props) => {
  const { handleClose, selectChatFn, chats, sumbitMsgFn } = props;

  const userEmail = useSelector((state) => state.user.currentUser);

  const [friendEmail, setFriendEmail] = useState('');
  const [msgToFriend, setMsgToFriend] = useState('');
  const [userErr, setUserErr] = useState(false);
  const [msgErr, setMsgErr] = useState(false);

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

  const loadOptions = async (search, prevOptions) => {
    // console.log('loadOptions func', prevOptions);
    await sleep(1000);

    let filteredOptions;
    if (!search && prevOptions.length === 0) {
      const usersSnapShot = await firestore.collection('users').get();

      filteredOptions = usersSnapShot.docs
        .filter((user) => user.data().email !== userEmail)
        .map((doc) => {
          return {
            value: doc.data().email,
            label: doc.data().email,
          };
        });
    } else {
      const searchLower = search.toLowerCase();

      const usersSnapShot = await firestore.collection('users').get();

      filteredOptions = usersSnapShot.docs
        .map((doc) => {
          return {
            value: doc.data().email,
            label: doc.data().email,
          };
        })
        .filter(({ label }) => label.toLowerCase().includes(searchLower));
    }
    const hasMore = filteredOptions.length > prevOptions.length + 20;
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 20
    );

    return {
      options: slicedOptions,
      hasMore,
    };
  };

  const buildDocKey = () => {
    return [auth.currentUser.email, friendEmail].sort().join(':');
  };

  const chatExistsFn = async () => {
    const dockey = buildDocKey();
    const chat = await firestore.collection('chats').doc(dockey).get();

    console.log(chat.exists);
    return chat.exists;
  };

  const createChat = async () => {
    const docKey = buildDocKey();

    await firestore
      .collection('chats')
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [auth.currentUser.email, friendEmail],
        messages: [
          {
            message: msgToFriend,
            sender: auth.currentUser.email,
            timestamp: Date.now(),
          },
        ],
      });

    selectChatFn(chats.length - 1);
  };

  const goToChat = async () => {
    const dockey = buildDocKey();

    const chat = chats.find((chat) =>
      dockey.split(':').every((user) => chat.users.includes(user))
    );

    await selectChatFn(chats.indexOf(chat));
    sumbitMsgFn(msgToFriend);
    // console.log('selectedChat', selectedChat);
    // sumbitMsg(msg);
    // this.props.goToChatFn(this.buildDocKey(), this.state.messageToFriend);
    console.log('chat exits so continuing');
  };

  const sendMsg = async () => {
    if (friendEmail === '' && msgToFriend === '') {
      setUserErr(true);
      setMsgErr(true);
    } else if (friendEmail === '') {
      setUserErr(true);
      setUserErr(false);
    } else if (msgToFriend === '') {
      setMsgErr(true);
      setUserErr(false);
    } else {
      console.log('friendEmail', friendEmail);
      console.log('msgToFriend', msgToFriend);

      const chatExists = await chatExistsFn();
      chatExists ? goToChat() : createChat();
      setUserErr(false);
      setMsgErr(false);
      setFriendEmail('');
      setMsgToFriend('');
      handleClose();
    }
  };

  return (
    <div className="newChatFormContainer">
      <div className="modalTitle">Message a friend</div>
      <div className="friendEmailContainer">
        <label>Friend's Email:</label>
        <AsyncPaginate
          className="usersInput"
          loadOptions={loadOptions}
          closeMenuOnSelect={true}
          isClearable={true}
          // cacheUniq={item.attribute}
          // isMulti={item.isMulti}

          onChange={(selectedOption) => {
            if (selectedOption) {
              console.log('this is the selected option', selectedOption.value);
              setFriendEmail(selectedOption.value);
            } else {
              setFriendEmail('');
            }
          }}
        />

        {userErr && (
          <div className="errMsg">Please choose a user to send a message</div>
        )}
      </div>
      <div className="friendMsgContainer">
        <label>Message to friend:</label>

        <textarea
          value={msgToFriend}
          onChange={(event) => {
            setMsgToFriend(event.target.value);
          }}
        ></textarea>
        {msgErr && <div className="errMsg">This field can't be blank</div>}
      </div>

      <div className="sendBtnContainer">
        <button onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
};

export default NewChatForm;
