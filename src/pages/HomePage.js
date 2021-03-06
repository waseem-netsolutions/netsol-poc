import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import { AddEmployeeForm, AllEmployees, Topbar } from '../components';
import { addEmployee, getOwners } from '../util/firebase';
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import "../styles/homepage.css"
export default function HomePage(props) {

  const { currentUser: contextUser } = useAuth();
  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("user")), [contextUser]); 
  const [refresh, setRefresh] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [fetchOwnersError, setFetchOwnersError] = useState(null);
  
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
    const { dob, email, name, salary, isOwner = false, empId, accountOwner, office, isAdmin = false } = values;
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
      data.isAdmin = isAdmin;
    }
    addEmployee(data);
    setRefresh((prev) => prev + 1);
    setModalIsOpen(false);
  };
  

  return (
    <div>
      <Topbar/>
      <div className={`custom-banner ${currentUser? 'banner-fullscreen' : "banner-fullscreen"}`}>
        <h1>{`${currentUser? `Welcome, ${currentUser.name}` : 'Please, login'}`}</h1>
      </div>
      {/* {currentUser? <div key={refresh}>
        <AllEmployees refresh={refresh} setRefresh={setRefresh} setModalIsOpen={setModalIsOpen} />
      </div> : null} */}
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
          <AddEmployeeForm handleSubmit={handleSubmit} owners={owners} currentUser={currentUser}/>
        </Modal.Body>
      </Modal>
    </div>
  );
}
