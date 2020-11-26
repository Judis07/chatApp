import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { firestore } from '../../firebase';
import './newChatForm.scss';

const NewChatForm = () => {
  const [friendEmail, setFriendEmail] = useState('');

  const [msgToFriend, setMsgToFriend] = useState('');

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

      filteredOptions = usersSnapShot.docs.map((doc) => {
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

  const sendMsg = () => {
    console.log('friendEmail', friendEmail);
    console.log('msgToFriend', msgToFriend);
  };

  return (
    <div className="newChatFormContainer">
      <div className="modalTitle">Message a friend</div>
      <div className="friendEmailContainer">
        <label>Friend's Email:</label>
        <AsyncPaginate
          className="usersInput"
          //   value={friendEmail}
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
      </div>
      <div className="friendMsgContainer">
        <label>Message to friend:</label>
        <textarea
          value={msgToFriend}
          onChange={(event) => {
            setMsgToFriend(event.target.value);
          }}
        ></textarea>
      </div>

      <div className="sendBtnContainer">
        <button onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
};

export default NewChatForm;
