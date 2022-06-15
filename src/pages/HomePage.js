import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { AddEmployeeForm, AllEmployees } from '../components';
import { addEmployee } from '../util/firebase';
import "../styles/homepage.css"
export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const [intervalId, setIntervalId] = React.useState();
  const [refresh, setRefresh] = React.useState(0);
  const [time, setTime] = React.useState();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      setTime(moment().format('D ddd, MMMM, Y, hh:mm:ss A'));
    }, 1000);
    setIntervalId(id);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleSubmit = (values) => {
    console.log(values);
    const { dob, email, name, salary, atWork = false } = values;
    const data = {
      dob,
      email,
      name,
      salary,
      atWork,
    };
    addEmployee(data);
    setRefresh((prev) => prev + 1);
  };
  

  return (
    <div>
      <nav>
        <h1>Welcome {currentUser?.email}</h1>
        <p>{time}</p>
      </nav>

      <button onClick={handleLogout}>Sign Out</button>
      <AddEmployeeForm handleSubmit={handleSubmit} />
      <AllEmployees refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
}
