import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import validator from "validator";
import { Button, Card, Form } from 'react-bootstrap';
import "../styles/loginpage.css";

const  OtherLoginPage = () => {

  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (currentUser) return <Navigate to="/" />;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState({});
  const [loginErr, setLoginErr] = useState(null);
  const navigate = useNavigate();
  const { otherLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    if(!email){
      setErr(prev => ({ ...prev, email: "Please provide the email"}));
      hasError = true;
    }
    // if(!password){
    //   setErr(prev => ({ ...prev, password: "Please provide a password"}));
    //   hasError = true
    // }
    const isEmailValid = validator.isEmail(email);
    if(!isEmailValid){
      setErr(prev => ({ ...prev, email: "Email is not valid"}));
      hasError = true
    }
    if (hasError) return
    const [data, err] = await otherLogin(email);
    if(err)
      return setLoginErr(err.message);
    if (data && data.length)
      return navigate('/');
    if (data && !data.length)
      setLoginErr("No such user found");
  };


  return (
    <div className='main-div'>
      <div style={{width: "25%"}}>
      <Card>
        <Card.Header>
          <h3 className='center-text'>Login</h3>
        </Card.Header>
        <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  isInvalid={err.email? true: false}
                  type="text"
                  id="email"
                  value={email}
                  onBlur={() => {
                    if(!email) setErr(prev => ({...prev, email: "Please provide an email"}))
                    if (email) {
                      const isEmailValid = validator.isEmail(email);
                      if (!isEmailValid) {
                        setErr(prev => ({ ...prev, email: "Email is not valid" }));
                      }
                    }
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErr(prev => ({...prev, email: ""}))
                    setLoginErr(null);
                  }}
                />
                {err.email ? <p className='error-msg'>{err.email}</p> : null}
              </Form.Group>
              {/* <Form.Group className='mb-3'>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  isInvalid={err.password ? true : false}
                  type="password"
                  id="password"
                  value={password}
                  onBlur={() => {
                    if(!password) {
                      setErr(prev => ({...prev, password: "Please provide a password"}));
                    }
                    if(password){
                      if(!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){
                        setErr(prev => ({...prev, password: "Password should be 8 - 15 chars and must contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character"}));
                      }
                    }
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErr(prev => ({...prev, password: ""}))
                    setLoginErr(null);
                  }}
                />
                {err.password ? <p className='error-msg'>{err.password}</p> : null}
              </Form.Group> */}
              {loginErr?  <p className='error-msg'>{loginErr}</p> : null}
              <Button varient="primary" type="submit">Login</Button>
              <Link className='btn-margin-left' to="/signup">Or Signup</Link>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
}

export default OtherLoginPage