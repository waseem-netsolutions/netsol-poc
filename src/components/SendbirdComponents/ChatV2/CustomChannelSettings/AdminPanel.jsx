import { uniqBy } from 'lodash';
import React, { useState } from 'react'
import { Accordion } from 'react-bootstrap'
import AddUsersModal from '../../../../modals/AddUsersModal';
import UserList from './UserList';
const OPERATOR = 'operator';
const AdminPanel = (props) => {
  const { context, currentUser, similarUsers = [] } = props;
  const { channel, forceUpdateUI } = context || {};
  const isOperator = channel?.myRole === "operator";
  const { members = [] } = channel || {};
  const operators = members.filter(m => m.role === OPERATOR);
  const filteredUsers = similarUsers.filter(user => {
    const { email } = user;
    const idx = members.findIndex(mem => mem.userId === email);
    return idx < 0;
  })
  const [usersModal, setUsersModal] = useState(false);
  const handleAddOperator = async ({ userId }) => {
    try {
      await channel.addOperators([userId]);
      console.log(`${userId} - added as operator`);
    } catch (error) {
      console.log(error);
    }
    forceUpdateUI();
  }
  const handleRemoveOperator = async ({ userId }) => {
    try {
      await channel.removeOperators([userId]);
      console.log(`${userId} - removed as operator`);
    } catch (error) {
      console.log(error);
    }
    forceUpdateUI()
  }
  const handleRemoveMember = async ({ member }) => {
    try {
      await channel.banUserWithUserId(member.userId);
      await channel.unbanUserWithUserId(member.userId);
      if(channel.data){
        const previousData = JSON.parse(channel.data);
        const previousMembers = previousData?.members;
        const updatedMembers = previousMembers.filter(m => m.email !== member.userId);
        previousData.members = updatedMembers;
        const updateChannelParams = {};
        updateChannelParams.data = JSON.stringify(previousData);
        channel.updateChannel(updateChannelParams);
      }
      forceUpdateUI()
    } catch (error) {
      console.log("error while removeing member", error);
    }
  }
  const operatorsListActionOptions = [
    {
      label: "Dismiss operator",
      id: "dismissOperator",
      onClick: handleRemoveOperator
    }
  ]
  const membersListActionOptions = [
    {
      label: "Register as operator",
      id: "registerOperator",
      onClick: handleAddOperator,
      visible: isOperator
    },
    {
      label: "Remove",
      id: "remove",
      onClick: handleRemoveMember,
      visible: isOperator
    }
  ]

  const handleInviteMembers = async ({ selectedUsers = [] }) => {
    try {
      await channel.inviteWithUserIds([...selectedUsers.map(u => u.email)]);
      const addedMembers = selectedUsers.map(u => ({ email: u.email, office: u.office, name: u.name}));
      if(channel.data){
        const previousData = JSON.parse(channel.data);
        const previousMembers = previousData?.members;
        const updatedMembers = [...previousMembers, ...addedMembers];
        previousData.members = uniqBy(updatedMembers, 'email');
        const updateChannelParams = {};
        updateChannelParams.data = JSON.stringify(previousData);
        channel.updateChannel(updateChannelParams);
      }
      forceUpdateUI()
      console.log(selectedUsers.map(u => u.email), ' -- users invited')
    } catch (error) {
      console.log("err occured while invitings members", error);
    }
    setUsersModal(false);
  } 
  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Operators</Accordion.Header>
          <Accordion.Body>
            <UserList
              users={operators}
              actionOptions={operatorsListActionOptions}
              currentUser={currentUser}
              listName="operators-list"
              iAmOperator={isOperator}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Members</Accordion.Header>
          <Accordion.Body>
            <UserList
              users={members}
              actionOptions={membersListActionOptions}
              currentUser={currentUser}
              listName="members-list"
              iAmOperator={isOperator}
            />
            {members.length > 2 && <div className='accordian-btn-section'>
              <button className='custom-button' onClick={() => setUsersModal(true)}>Add members</button>
            </div>}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <AddUsersModal
        usersModal={usersModal}
        setUsersModal={setUsersModal}
        handleSubmit={handleInviteMembers}
        users={filteredUsers}
      />
    </div>
  )
}

export default AdminPanel