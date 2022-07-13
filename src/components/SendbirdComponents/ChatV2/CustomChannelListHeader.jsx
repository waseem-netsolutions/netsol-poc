import React from 'react'
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import AddGroupInfo from '../../../forms/CustomChannelListHeader/AddGroupInfo.form';
import AddUsers from '../../../forms/CustomChannelListHeader/AddUsers.form';
import '../../../styles/custom-header.css';

const CustomHeader = (props) => {
  const { currentUser, similarUsers, sdk, setCurrentChannel} = props;
  const { name, office = '', imageUrl } = currentUser || {};
  const [usersModal, setUsersModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupInfoModal, setGroupInfoModal] = useState(false);

  const handleStepOne = (values) => {
    const { selectedUsers: selectedUsersFromForm = [] } = values;
    if(!selectedUsersFromForm.length) return
    setSelectedUsers(selectedUsersFromForm)
    setUsersModal(false);
    setGroupInfoModal(true);
  }

  const handleStepTwo = async (values) => {
    const { groupImage, groupName } = values;
    if(sdk){
      const { isOwner = false, accountOwner = '', email } = currentUser;
      const groupChannelParams = new sdk.GroupChannelParams();
      groupChannelParams.addUserIds(selectedUsers);
      groupChannelParams.coverImage = groupImage;
      console.log(groupImage)
      groupChannelParams.name = groupName;
      groupChannelParams.operatorUserIds = [email]
      groupChannelParams.customType = isOwner? "internal" : "external";
      if(!isOwner) groupChannelParams.data = JSON.stringify({ accountOwner, office });

      try {
        const channel = await sdk.GroupChannel.createChannel(groupChannelParams);
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
          <p className='office'>{office}</p>
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