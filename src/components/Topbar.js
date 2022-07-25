import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import useMounted from '../hooks/useMounted';
let intervalId;
const Topbar = () => {

  const [time, setTime] = useState();
  const navigate = useNavigate();
  const isMounted = useMounted();

  useEffect(() => {
    const id = setInterval(() => {
      isMounted && setTime(moment().format('D ddd, MMMM, Y, hh:mm:ss A'));
    }, 1000);
    intervalId = id;
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { logout } = useAuth();
  const handleLogout = () => {
     logout().then(() => {
        window.location.href = "/";
     });
  };
  
  const currentUser = JSON.parse(localStorage.getItem("user"))
  return (
    <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Logo</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>   
            {/* <Nav.Link href="/chat">Chat</Nav.Link> */}
            <Nav.Link href="/chat-v2">ChatV2</Nav.Link>
          </Nav>
          <Nav>
          <Navbar.Text>{time}</Navbar.Text>
          &nbsp; &nbsp; &nbsp;
          {currentUser? 
            <Button onClick={handleLogout}>Signout</Button> :
            (
                <>
                  {/* <Nav.Link href="/login">Login-admin</Nav.Link> */}
                  <Nav.Link href="/login-other">Login</Nav.Link>
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