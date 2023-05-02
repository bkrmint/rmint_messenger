import React, { useEffect, useState } from 'react';
import { Avatar, useChatChannel, useChatContext } from 'stream-chat-react';

import { List } from 'stream-chat-react/dist/components/AutoCompleteTextarea/List';
import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
  console.log('in ListContainer', children);

  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      // we are keeping all users except the one we clicked on
      setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id));
    } else {
      // Spread the previous users and add the clicked user to the list
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }

    setSelected((prevSelected) => !prevSelected);
  };

  return (
    // handle select + setSelect = state management
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar src={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name"> {user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

const UserList = ({ setSelectedUsers }) => {
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } }, // exclude yourself
          { id: 1 }, // sort by id asc
          { limit: 10 },
        );

        console.log(response);

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    if (client) getUsers(); // if client is available, get users
  }, []);

  if (error) {
    return (
      <ListContainer>
        <div className="user-list__message">
          Error loading, please refresh and try again.
        </div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className="user-list__message">
          No users found.
        </div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading
        ? <div className="user-list__message">Loading users...</div>
        : (users?.map((user, i) => (
          <UserItem user={user} index={i} key={user.id} setSelectedUsers={setSelectedUsers} />)))}

    </ListContainer>
  );
};

export default UserList;
