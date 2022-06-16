import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import { AddEmployeeForm, AllEmployees } from '../components';
import { addEmployee } from '../util/firebase';
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import "../styles/homepage.css"
export default function HomePage() {

  const { currentUser, logout } = useAuth();
  const [intervalId, setIntervalId] = useState();
  const [refresh, setRefresh] = useState(0);
  const [time, setTime] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTime(moment().format('D ddd, MMMM, Y, hh:mm:ss A'));
    }, 1000);
    setIntervalId(id);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = (values) => {
    const { dob, email, name, salary, atWork = false, empId } = values;
    const data = {
      dob,
      email,
      name,
      salary,
      atWork,
      empId
    };
    addEmployee(data);
    setRefresh((prev) => prev + 1);
    setModalIsOpen(false);
  };
  

  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Logo</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>   
          </Nav>
          <Nav>
          <Navbar.Text>{time}</Navbar.Text>
          &nbsp; &nbsp; &nbsp;
          {currentUser? 
            <Button onClick={handleLogout}>Signout</Button> :
            (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
            )  
          }
          </Nav>
        </Container>
      </Navbar>
      <div className={`custom-banner ${currentUser? null : "banner-fullscreen"}`}>
        <h1>{`${currentUser? `Welcome, ${currentUser.email}` : 'Please, login'}`}</h1>
      </div>
      {currentUser? <div>
        <AllEmployees refresh={refresh} setRefresh={setRefresh} setModalIsOpen={setModalIsOpen} />
      </div> : null}
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEmployeeForm handleSubmit={handleSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
