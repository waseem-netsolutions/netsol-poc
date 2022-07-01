import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import { AddEmployeeForm, AllEmployees } from '../components';
import { addEmployee, getOwners } from '../util/firebase';
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import "../styles/homepage.css"
export default function HomePage(props) {

  const {  logout } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [intervalId, setIntervalId] = useState();
  const [refresh, setRefresh] = useState(0);
  const [time, setTime] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [fetchOwnersError, setFetchOwnersError] = useState(null);
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

  useEffect(() => {
    const getOwnersData = async () => {
     
        const [data, err] = await getOwners();
        if(data) {
          setOwners(data);
        } else{
          setFetchOwnersError(err)
        }
        //console.log(data)
    }
    if(currentUser){
     getOwnersData()
    }
  }, [currentUser, refresh])

  

  const handleSubmit = (values) => {
    const { dob, email, name, salary, isOwner = false, empId, accountOwner, office } = values;
    const data = {
      dob,
      email,
      name,
      salary,
      isOwner,
      empId
    };
    if(!isOwner){
      data.accountOwner = accountOwner;
      data.office = office;
    }
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
            <Nav.Link href="/chat">Chat</Nav.Link>  
          </Nav>
          <Nav>
          <Navbar.Text>{time}</Navbar.Text>
          &nbsp; &nbsp; &nbsp;
          {currentUser? 
            <Button onClick={handleLogout}>Signout</Button> :
            (
                <>
                  <Nav.Link href="/login">Login-admin</Nav.Link>
                  <Nav.Link href="/login-other">Login-other</Nav.Link>
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
          <AddEmployeeForm handleSubmit={handleSubmit} owners={owners}/>
        </Modal.Body>
      </Modal>
    </div>
  );
}
