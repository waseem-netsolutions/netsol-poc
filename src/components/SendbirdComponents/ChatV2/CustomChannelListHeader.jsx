import React from 'react'
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import AddGroupInfo from '../../../forms/CustomChannelListHeader/AddGroupInfo.form';
import AddUsers from '../../../forms/CustomChannelListHeader/AddUsers.form';
import '../../../styles/custom-header.css';

const CustomHeader = (props) => {
  const { currentUser, similarUsers, sdk, setCurrentChannel, showInternal} = props;
  const { name, office = '', imageUrl } = currentUser || {};
  const [usersModal, setUsersModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupInfoModal, setGroupInfoModal] = useState(false);

  const handleStepOne = async (values) => {
    const { selectedUsers: selectedUsersFromForm = [] } = values;
    if(!selectedUsersFromForm.length) return
    if(selectedUsersFromForm?.length === 1){
      if(sdk){
        const selectedUser = selectedUsersFromForm?.[0];
        const { email: selectedUserEmail, imageUrl, name, isOwner = false } = selectedUser;
        const { email, accountOwner } = currentUser;
        const groupChannelParams = {};
        groupChannelParams.coverUrl = imageUrl;
        groupChannelParams.invitedUserIds = [selectedUserEmail]
        groupChannelParams.name = name;
        groupChannelParams.operatorUserIds = [email]
        groupChannelParams.customType = showInternal ? "internal" : "external";
        let data = {};
        data.members = [
          { email: selectedUser.email, office: selectedUser.office, name: selectedUser.name},
          { email: currentUser.email, office: selectedUser.office, name: currentUser.name }
        ];
        if(!isOwner) data.accountOwner = accountOwner;
        else data.accountOwner = currentUser.name;
        groupChannelParams.data = JSON.stringify(data);
        try {
          const channel = await sdk.groupChannel.createChannel(groupChannelParams);
          setCurrentChannel(channel);
          setUsersModal(false);
        } catch (error) {
          console.log(error)
        }
      }
      return
    }
    setSelectedUsers(selectedUsersFromForm)
    setUsersModal(false);
    setGroupInfoModal(true);
  }

  const handleStepTwo = async (values) => {
    const { groupImage, groupName } = values;
    if(sdk){
      const { email, accountOwner, isOwner, name: myName } = currentUser;
      const cu = { email, name: myName, office: '' };
      const groupChannelParams = {};
      groupChannelParams.coverImage = groupImage;
      groupChannelParams.invitedUserIds = selectedUsers.map(user => user.email);
      groupChannelParams.name = groupName;
      groupChannelParams.operatorUserIds = [email]
      groupChannelParams.customType = showInternal? "internal" : "external";
      let data = {};
      data.members = [...selectedUsers, cu].map(u => ({ email: u.email, office: u.office, name: u.name }));
      if(!isOwner) data.accountOwner = accountOwner;
      else data.accountOwner = myName;
      groupChannelParams.data = JSON.stringify(data);
      try {
        const channel = await sdk.groupChannel.createChannel(groupChannelParams);
        setCurrentChannel(channel);
        setGroupInfoModal(false);
      } catch (error) {
        console.log(error)
      }
    }
  }
  const handleCreateChannelClick = () => {
    setUsersModal(true);
  }
  return (
    <div className='custom-header-container'>
      <section className='image-container'>
        <div className='image'>
          <img src={imageUrl} alt="profile-pic" />
        </div>
      </section>
      <section className='info'>
          <p className='name'>{name}</p>
      </section>
      <section className='action-container'>
        <div className='action' onClick={handleCreateChannelClick}>
            <div>
            <PlusCircle/>
            </div>
        </div>
      </section>
      <Modal
        show={usersModal}
        onHide={() => setUsersModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select Users
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddUsers 
              onSubmit={handleStepOne}
              similarUsers={similarUsers}
            />
        </Modal.Body>
      </Modal>

      <Modal
        show={groupInfoModal}
        onHide={() => setGroupInfoModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add other info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddGroupInfo
              onSubmit={handleStepTwo}
            />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CustomHeader