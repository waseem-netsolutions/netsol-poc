import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from "react-router-dom"
const Topbar = () => {

  const [time, setTime] = useState();
  const [intervalId, setIntervalId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      setTime(moment().format('D ddd, MMMM, Y, hh:mm:ss A'));
    }, 1000);
    setIntervalId(id);
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  const currentUser = JSON.parse(localStorage.getItem("user"))
  return (
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
  )
}

export default Topbar