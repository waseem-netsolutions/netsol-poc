import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import validator from "validator";
import { Button, Card, Form } from 'react-bootstrap';
import "../styles/loginpage.css";
import { uniqBy } from 'lodash';

const  OtherLoginPage = () => {

  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (currentUser) return <Navigate to="/" />;

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [owner, setOwner] = useState('');
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState({});
  const [loginErr, setLoginErr] = useState(null);
  const navigate = useNavigate();
  const { otherLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [data, err, setCurrentUser] = await otherLogin(email);
    if (err)
      return setLoginErr(err.message);
    if (data && data.length) {
      const u = data.find(u => (u.email === email && u.accountOwner === owner));
      setCurrentUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem("userType", "other-user");
      return navigate('/chat-v2');
    }
  };

  const handleStepOne = async (e) => {
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
    const [data, err, setCurrentUser] = await otherLogin(email);
    if(err)
      return setLoginErr(err.message);
    if (data && data.length) {
      // if(password !== 'Admin@123456'){
      //   setLoginErr("Wrong password");
      //   return;
      // }
      const user = data[0];
      if (user.isOwner) {
        setCurrentUser(data[0]);
        localStorage.setItem('user', JSON.stringify(data[0]));
        localStorage.setItem("userType", "other-user");
        return navigate('/chat-v2');
      } else {
        setUsers(data);
        setStep(2);
      }
    }
    if (data && !data.length)
      setLoginErr("No such user with this email");
  }

  return (
    <div className='main-div'>
      <div style={{width: "25%"}}>
      <Card>
        <Card.Header>
          <h3 className='center-text'>Login</h3>
        </Card.Header>
        <Card.Body>
            <Form>
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
                    if(step === 2){
                      setStep(1);
                    }
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
              {step === 1 && 
                  <Button varient="primary" type="button" onClick={handleStepOne}>Next</Button>
              }
              {
                step === 2 && <>
                  <label htmlFor="owner">Account Owner</label> &nbsp; &nbsp;
                  <select name="owner" id="owner" defaultValue={owner} onChange={(e) => setOwner(e.target.value)}>
                    <option value="" hidden>Select...</option>
                    {uniqBy(users, 'accountOwner').map(u => <option value={u.accountOwner} key={u.accountOwner}>{u.accountOwner}</option>)}
                  </select>
                  <br/>
                  <br/>
                </>
              }
              {step === 2 && <Button varient="primary" type='button' onClick={handleSubmit}>Login</Button>}
              <Link className='btn-margin-left' to="/signup">Or Signup</Link>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  );
}

export default OtherLoginPage