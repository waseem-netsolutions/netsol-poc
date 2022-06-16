import React from 'react'
import { Modal } from 'react-bootstrap';
export const ViewEmployeeModal = (props) => {
  const { viewEmpModal, setViewEmpModal, currentEmp} = props;
  const { name, dob, salary, email } = currentEmp; 
  return (
    <Modal
        show={viewEmpModal}
        onHide={() => {
          setViewEmpModal(false);
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Employee Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name: {currentEmp.name}</p>
          <p>Email: {currentEmp.email}</p>
          <p>DOB: {currentEmp.dob}</p>
          <p>Salary: {currentEmp.salary}</p>
        </Modal.Body>
      </Modal>
  )
}
