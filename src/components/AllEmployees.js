import React, { useState, useEffect } from 'react';
import { getAllEmps, updateEmp, deleteEmp } from '../util/firebase';
import { getTotalPagesInArray, paginateArray } from '../util/helpers';
import ArrayPagination from './ArrayPagination';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { ArrowDown, ArrowUp, EyeFill, EyeSlash, EyeSlashFill } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';

import "../styles/all-employees.css";
import EditEmployeeModal from './EditEmployeeModal';
import { ViewEmployeeModal } from './ViewEmployeeModal';

let timeoutId = null;

export default function AllEmployees(props) {
  const { setRefresh, refresh, setModalIsOpen: setAddEmployeeModal } = props;
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [asc, setAsc] = useState(true);
  const [editId, setEditId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [newData, setNewData] = useState({});
  const [showDob, setShowDob] = useState({});
  const [showSalary, setShowSalary] = useState({});
  const [searchEmail, setSearchEmail] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [viewEmpModal, setViewEmpModal] = useState(false);
  const [currentEmp, setCurrentEmp] = useState({});

  useEffect(() => {
    const getData = async () => {
      const filterData = {
        nameOrder: asc ? 'asc' : 'desc',
        searchedEmail: email,
      };
      const [data, err] = await getAllEmps(filterData);
      if (data) {
        setData(data);
      } else {
        setErr(err);
      }
    };
    getData();
  }, [refresh, asc]);


  const handleSave = async () => {
    await updateEmp(editId, newData);
    setEditId('');
    setRefresh((prev) => prev + 1);
  };

  const handleDelete = async () => {
    await deleteEmp(deleteId);
    setRefresh((prev) => prev + 1);
    setModalIsOpen(false);
  };

  const handleEmailChange = (e) => {
    clearTimeout(timeoutId);
    setSearchEmail(e.target.value);
    timeoutId = setTimeout(() => {
      setEmail(e.target.value);
    }, 300);
  };

  const handlePagePrev = () => {
    if (currentPage === 1) return;
    setCurrentPage((cp) => cp - 1);
  };

  const handlePageNext = () => {
    if (currentPage === totalPages) return;
    setCurrentPage((cp) => cp + 1);
  };

  let filteredData = data;
  if(email){
    filteredData = data?.filter(obj =>( obj.email.toLowerCase().includes(email.toLowerCase()) || obj.name.toLowerCase().includes(email.toLowerCase())))
  }
  const totalPages = getTotalPagesInArray(filteredData, perPage);
  return (
    <div>
      <div className='table-div'>
        <h2 className='align-center'>List of Employees</h2>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <Form.Group className="mb-3" style={{ width: "30%" }}>
            <Form.Control
              name="searchEmail"
              placeholder="search by email or name"
              value={searchEmail}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Button onClick={() => setAddEmployeeModal(true)} style={{height: "40px"}} variant='primary'>Add Employee</Button>
        </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>
              Name
              <span style={{cursor: "pointer"}}onClick={() => setAsc((prev) => !prev)}>{ asc? <ArrowUp/> : <ArrowDown/> }</span>
            </th>
            <th>Email</th>
            <th>At-Work</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!!filteredData &&
            paginateArray(filteredData, perPage, currentPage).map((emp) => {
              const { docId, name, email, atWork, salary, dob } = emp;
              return (
                <tr key={docId}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{atWork ? 'Yes' : 'No'}</td>
                  <td>
                    <Button variant='success' 
                      style={{marginRight:"10px"}}
                      onClick={() => {
                        setEditId(docId);
                        setEditModal(true);
                        setNewData({
                          name,
                          email,
                          dob,
                          atWork,
                          salary,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant='danger'
                      style={{marginRight:"10px"}}
                      onClick={() => {
                        setDeleteId(docId);
                        setModalIsOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                    <Button variant='primary'
                      onClick={() => {
                        setCurrentEmp(emp);
                        setViewEmpModal(true);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ArrayPagination
          pagination={{ page: currentPage, totalPages }}
          setCurrentPage={setCurrentPage}
          handlePageNext={handlePageNext}
          handlePagePrev={handlePagePrev}
        />
      </div>
      <Modal
        show={modalIsOpen}
        onHide={() => {
          setModalIsOpen(false);
          setDeleteId('');
        }}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
           Are you sure you want to delete this item?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => {
            setModalIsOpen(false);
            setDeleteId('');
          }}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      
      <EditEmployeeModal
        editModal={editModal}
        setEditModal={setEditModal}
        handleSave={handleSave}
        newData={newData}
        setNewData={setNewData}
      />

      <ViewEmployeeModal 
        setViewEmpModal={setViewEmpModal}
        viewEmpModal={viewEmpModal}
        currentEmp={currentEmp}
      />

    </div>
  );
}
