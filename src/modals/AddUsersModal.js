import React from 'react'
import { Modal } from 'react-bootstrap';
import AddUsers from '../forms/CustomChannelListHeader/AddUsers.form';

const AddUsersModal = (props) => {
  const { usersModal, setUsersModal, handleSubmit, users } = props;
  return (
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
          onSubmit={handleSubmit}
          similarUsers={users}
        />
      </Modal.Body>
    </Modal>
  )
}

export default AddUsersModal