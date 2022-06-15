import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import validator from "validator";

const  LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email){
      setErr("Please provide the email");
      return
    }
    if(!password){
      setErr("Please provide a password");
      return
    }
    const isEmailValid = validator.isEmail(email);
    if(!isEmailValid){
      setErr("Email is not valid");
      return
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErr(err.message);
    }
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {!!err && <p style={{ color: 'red' }}>{err}</p>}
        <button type="submit">Submit</button>
        <br />
        <Link to="/signup">Or Signup</Link>
      </form>
    </div>
  );
}

export default LoginPage