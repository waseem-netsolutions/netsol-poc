import React, { useState } from 'react';
import validator from 'validator';
const AddEmployeeForm = (props) => {
  const { handleSubmit } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [atWork, setAtWork] = useState(false);
  const [salary, setSalary] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if(!name){
      setErr("Please provide a name");
      return
    }
    if(!email){
      setErr("Please provide an email");
      return
    }
    if(!dob){
      setErr("Please provide a DOB");
      return
    }
    if(!salary){
      setErr("Please provide a salary");
      return
    }
    const isEmailValid = validator.isEmail(email);
    if(!isEmailValid){
      setErr("Email is not valid");
      return
    }
    //const isSalaryValid = validator.isDecimal(salary)
    if(isNaN(parseFloat(salary))){
      setErr("Salary is not valid");
      return
    }
    setErr('')
    const values = {
      name,
      email,
      dob,
      salary,
      atWork
    }
    handleSubmit(values);
    setEmail("");
    setName("");
    setDob("");
    setSalary("");
    setAtWork(false);
  }
  return (
          <form
            onSubmit={submit}
          >
            <h2>Add Employee</h2>

            <label htmlFor="name">Name</label>
            <input type="text" name='name' id='name' value={name} onChange={(e) => setName(e.target.name)} />
            <br />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <br />

            <label htmlFor="dob">DOB</label>
            <input type="date" id="dob" name="dob" value={dob} onChange={e => setDob(e.target.value)}/>
            <br />

            <label htmlFor="atWork">At Work</label>
            <input
              type="checkbox"
              id="atWork"
              name="atWork"
              checked={atWork}
              onChange={() => setAtWork(!atWork)}
            />
            <br />

            <label htmlFor="salary">Salary</label>
            <input type="number" id="salary" name="salary" value={salary} onChange={e => setSalary(e.target.value)}/>
            <br />
            {err ? <p style={{color: "red"}}>{err}</p> : null}
            <button type="submit">Submit</button>
          </form>
        );
}

export default AddEmployeeForm