import React, { useState } from 'react';
import validator from 'validator';
import { Button, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
const AddEmployeeForm = (props) => {
  const { handleSubmit } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [atWork, setAtWork] = useState(false);
  const [salary, setSalary] = useState('');
  const [empId, setEmpId] = useState(null);
  const [err, setErr] = useState({});
  const submit = (e) => {
    e.preventDefault();
    let hasError = false;
    if(!name){
      setErr(prev => ({...prev, name: "Please provide a name"}));
      hasError = true;
    }
    if(name && name.length < 4){
      setErr(prev => ({...prev, name: "Name too short"}));
      hasError = true;
    }
    if(!email){
      setErr(prev => ({...prev, email: "Please provide an email"}));
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
    const isEmailValid = validator.isEmail(email);
    if(email && !isEmailValid){
      setErr(prev => ({...prev, email: "Email is not valid"}));
      hasError = true;
    }

    if(salary && isNaN(parseFloat(salary))){
      setErr(prev => ({...prev, salary: "Invalid Salary"}));
      hasError = true;
    }
    if(hasError) return;

    const values = {
      name,
      email,
      dob,
      salary,
      atWork,
      empId
    }
    handleSubmit(values);
    setEmail("");
    setName("");
    setDob("");
    setSalary("");
    setAtWork(false);
    setErr({})
  }

  if(name && !empId){
    setEmpId(uuidv4())
  }
  if(!name && empId){
    setEmpId(null);
  }
  return (
          <Form
            onSubmit={submit}
          >
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control 
                isInvalid={err.name ? true : false} 
                type="text" 
                name='name' 
                id='name' 
                value={name}
                onBlur={() => {
                  if(!name){
                    setErr(prev => ({...prev, name: "Please provide a name"}));
                  }
                  if(name && name.length < 4){
                    setErr(prev => ({...prev, name: "Name too short"}));
                  }
                }} 
                onChange={(e) => {
                  setName(e.target.value);
                  setErr(prev => ({...prev, name: ""}))
                }} 
              />
              {err.name ? <span style={{color: "red"}}>{err.name}</span> : null}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control 
                isInvalid={err.email ? true : false} 
                type="text" 
                id="email" 
                name="email" 
                onBlur={() => {
                  if(!email){
                    setErr(prev => ({...prev, email: "Please provide an email"}));
                  }
                  if(email && !validator.isEmail(email)){
                    setErr(prev => ({...prev, email: "email is not valid"}));
                  }
                }} 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr(prev => ({...prev, email: ""}))
                }}
              />
              {err.email ? <span style={{color: "red"}}>{err.email}</span> : null}
            </Form.Group>
    
            <Form.Group className="mb-3">
              <Form.Label htmlFor="dob">DOB</Form.Label>
              <Form.Control 
                isInvalid={err.dob ? true : false} 
                type="date" 
                id="dob" 
                name="dob" 
                min='1960-01-01' 
                max='2010-01-01'
                value={dob} 
                onBlur={() => {
                  if(!dob){
                    setErr(prev => ({...prev, dob: "Please provide a DOB"}));
                  }
                }}
                onChange={e => {
                  setDob(e.target.value);
                  setErr(prev => ({...prev, dob: ""}))
                }}
              />
              {err.dob ? <span style={{color: "red"}}>{err.dob}</span> : null}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="atWork"
                name="atWork"
                checked={atWork}
                onChange={() => setAtWork(!atWork)}
                label="At work"
              />
            </Form.Group>
        
            <Form.Group className="mb-3">
              <Form.Label htmlFor="salary">Salary</Form.Label>
              <Form.Control 
                isInvalid={err.salary ? true : false} 
                type="number" 
                id="salary" 
                name="salary" 
                value={salary} 
                onBlur={() => {
                  if(!salary){
                    setErr(prev => ({...prev, salary: "Please provide a salary"}));
                  }
                  if(salary && isNaN(parseFloat(salary))){
                    setErr(prev => ({...prev, salary: "Invalid Salary"}));
                  }
                }}
                onChange={e => {
                  setSalary(e.target.value);
                  setErr(prev => ({...prev, salary: ""}))
                }}
              />
              {err.salary ? <span style={{color: "red"}}>{err.salary}</span> : null}
            </Form.Group>

            {empId? <Form.Group className="mb-3">
              <Form.Label htmlFor="empId">Employee Id</Form.Label>
              <Form.Control 
                isInvalid={err.salary ? true : false} 
                type="text" 
                id="empId" 
                name="empId" 
                value={empId} 
                disabled={true}
              />
            </Form.Group> : null}

            <Button variant='primary' type="submit">Submit</Button>
          </Form>
        );
}

export default AddEmployeeForm