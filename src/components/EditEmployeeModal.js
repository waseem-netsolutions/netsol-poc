import React, { useState } from 'react'
import { Button, Form, Modal } from "react-bootstrap"

const EditEmployeeModal = (props) => {
  const { editModal, setEditModal, handleSave, newData, setNewData } = props;
  const { name, dob, salary, atWork } = newData;
  const [err, setErr] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if(!name){
      setErr(prev => ({...prev, name: "Please provide a name"}));
      hasError = true;
    }
    if(name && name.length < 4){
      setErr(prev => ({...prev, name: "Name is too short"}));
      hasError = true;
    }
    if(!dob){
      setErr(prev => ({...prev, dob: "Please provide a DOB"}));
      hasError = true;
    }
    if(!salary){
      setErr(prev => ({...prev, salary: "Please provide a salary"}));
      hasError = true;
    }
    if(salary && isNaN(parseFloat(salary))){
      setErr(prev => ({...prev, salary: "Invalid Salary"}));
      hasError = true;
    }
    if(hasError) return;

    const values = {
      name,
      dob,
      salary,
      atWork
    }
    handleSave(values);
    setErr({})
    setEditModal(false);
  }

  const updateData = (e) => {
    if(e.target.type == "checkbox"){
      setNewData(prev => ({ ...prev , [e.target.name]: e.target.checked }))
      return;
    }
    setNewData(prev => ({ ...prev , [e.target.name]: e.target.value }))
  }
  return (
    <Modal
      show={editModal}
      onHide={() => {
        setEditModal(false);
        setErr({});
      }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Employee
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control 
              isInvalid={err.name ? true : false} 
              type="text" 
              name='name' 
              id='name' 
              value={name} 
              onBlur={() => {
                if(!name) {
                  setErr(prev => ({...prev, name: "Please provide a name"}))
                  return
                }

                if(name.length < 4){
                  setErr(prev => ({...prev, name: "Name too short"}))
                  return
                }
              }}
              onChange={(e) => {
                updateData(e);
                setErr(prev => ({...prev, name: ""}))
              }} 
            />
            {err.name ? <span style={{ color: "red" }}>{err.name}</span> : null}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="dob">DOB</Form.Label>
            <Form.Control 
              isInvalid={err.dob ? true : false} 
              type="date" 
              name='dob' 
              id='dob'
              min='1960-01-01' 
              max='2010-01-01' 
              value={dob} 
              onBlur={() => {
                if(!dob) {
                  setErr(prev => ({...prev, dob: "Please provide a DOB"}))
                  return
                }
              }}
              onChange={(e) => {
                updateData(e);
                setErr(prev => ({...prev, dob: ""}))
              }} 
            />
            {err.dob ? <span style={{ color: "red" }}>{err.dob}</span> : null}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor="salary">Salary</Form.Label>
            <Form.Control 
              isInvalid={err.salary ? true : false} 
              type="number" 
              name='salary' 
              id='salary' 
              value={salary} 
              onBlur={() => {
                if(!salary) {
                  setErr(prev => ({...prev, salary: "Please provide a salary"}))
                  return
                }
                if(salary && isNaN(parseFloat(salary))){
                  setErr(prev => ({...prev, salary: "Invalid Salary"}));
                }
              }}
              onChange={(e) => {
                updateData(e);
                setErr(prev => ({...prev, salary: ""}))
              }} 
            />
            {err.salary ? <span style={{ color: "red" }}>{err.salary}</span> : null}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="atWork"
              name="atWork"
              checked={atWork}
              onChange={(e) => {
                updateData(e);
              }}
              label="At work"
            />
          </Form.Group>

          <Button variant='primary' type="submit">Update</Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditEmployeeModal