import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from '.';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ ChannelName = '', setChannelName }) => {
  // const [client, setActiveChannel] = useChatContext(); // we have client here
  // const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  // We added ourselves to the list of selected users so that we can add ourselves to the channel

  const handleChange = (e) => {
    e.preventDefault();
    setChannelName(e.target.value);
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input type="text" onChange={handleChange} value={ChannelName} placeholder="Channel-name" />
      <p>Add Members</p>
    </div>
  );
};

const CreateChannel = ({ createType, setIsCreating }) => {
  // const [client, setActiveChannel] = useChatContext();
  const { client, setActiveChannel } = useChatContext(); // we have client here
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  // We added ourselves to the list of selected users so that we can add ourselves to the channel
  const [channelName, setChannelName] = useState('');

  const createChannel = async (e) => {
    e.preventDefault();

    try {
      const newChannel = await client.channel(createType, channelName, { name: channelName, members: selectedUsers });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]); // we always want to be there in the channel we are creating..
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>
          {createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}
        </p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {createType === 'team'
      && (
      <ChannelNameInput
        ChannelName={channelName}
        setChannelName={setChannelName}
      />
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div
        className="create-channel__button-wrapper"
        onClick={createChannel}
      >
        <p>
          { createType === 'team'
            ? 'Create Channel' : 'Create Message Group' }
        </p>
      </div>

    </div>
  );
};

export default CreateChannel;
