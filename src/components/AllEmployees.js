import React, { useState } from 'react';
import { getAllEmps, updateEmp, deleteEmp } from '../util/firebase';
import { getTotalPagesInArray, paginateArray } from '../util/helpers';
import ArrayPagination from './ArrayPagination';
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

let timeoutId = null;

export default function AllEmployees(props) {
  const { setRefresh, refresh } = props;
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

  React.useEffect(() => {
    const getData = async () => {
      const filterData = {
        nameOrder: asc ? 'asc' : 'desc',
        searchedEmail: email,
      };
      const [data, err] = await getAllEmps(filterData);
      if (data) {
        //console.log(data);
        setData(data);
      } else {
        setErr(err);
      }
    };
    getData();
  }, [refresh, asc]);

  React.useEffect(() => {
    const getData = async () => {
      const filterData = {
        nameOrder: asc ? 'asc' : 'desc',
        searchedEmail: email,
        perPage,
      };
      const [data, err] = await getAllEmps(filterData);
      if (data) {
        //console.log(data);
        setData(data);
      } else {
        setErr(err);
      }
    };
    getData();
  }, [email]);

  const handleSave = async () => {
    console.log(newData);
    await updateEmp(editId, newData);
    setEditId('');
    setRefresh((prev) => prev + 1);
  };

  const handleDelete = async () => {
    //console.log(deleteId);
    await deleteEmp(deleteId);
    setRefresh((prev) => prev + 1);
    setModalIsOpen(false);
  };

  const handleEmailChange = (e) => {
    clearTimeout(timeoutId);
    setSearchEmail(e.target.value);
    timeoutId = setTimeout(() => {
      setEmail(e.target.value);
    }, 2000);
  };

  const handlePagePrev = () => {
    if (currentPage === 1) return;
    setCurrentPage((cp) => cp - 1);
  };

  const handlePageNext = () => {
    if (currentPage === totalPages) return;
    setCurrentPage((cp) => cp + 1);
  };

  const totalPages = getTotalPagesInArray(data, perPage);
  return (
    <div>
      <h2>List of Employees</h2>
      <input
        name="searchEmail"
        placeholder="search by email"
        value={searchEmail}
        onChange={handleEmailChange}
      />
      <label htmlFor="perPage">Items per page</label>
      <select
        name="perPage"
        id="perPage"
        value={perPage}
        onChange={(e) => setPerPage(e.target.value)}
      >
        <option value="" hidden>
          Select items per page
        </option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>

      <table style={{ border: 'solid', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>
              Name
              <button onClick={() => setAsc((prev) => !prev)}>
                {asc ? 'ASC' : 'DESC'}
              </button>
            </th>
            <th>Email</th>
            <th>DOB</th>
            <th>At-Work</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!!data &&
            paginateArray(data, perPage, currentPage).map((emp) => {
              const { docId, name, email, atWork, salary, dob } = emp;
              if (editId === docId) {
                return (
                  <tr key={docId}>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={newData.name}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>{email}</td>
                    <td>
                      <input
                        type="date"
                        name="dob"
                        value={newData.dob}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name="atWork"
                        checked={newData.atWork}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.checked,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="salary"
                        value={newData.salary}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <button onClick={handleSave}>Save</button>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={docId}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>
                    {showDob[docId] ? (
                      <>
                        {dob}
                        <button
                          onClick={() =>
                            setShowDob((prev) => ({ ...prev, [docId]: false }))
                          }
                        >
                          hide
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setShowDob((prev) => ({ ...prev, [docId]: true }))
                        }
                      >
                        show
                      </button>
                    )}
                  </td>
                  <td>{atWork ? 'Yes' : 'NO'}</td>
                  <td>
                    {showSalary[docId] ? (
                      <>
                        {salary}
                        <button
                          onClick={() =>
                            setShowSalary((prev) => ({
                              ...prev,
                              [docId]: false,
                            }))
                          }
                        >
                          hide
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setShowSalary((prev) => ({ ...prev, [docId]: true }))
                        }
                      >
                        show
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setEditId(docId);
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
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(docId);
                        setModalIsOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div>
        <ArrayPagination
          pagination={{ page: currentPage, totalPages }}
          setCurrentPage={setCurrentPage}
          handlePageNext={handlePageNext}
          handlePagePrev={handlePagePrev}
        />
      </div>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={() => {
          setModalIsOpen(false);
          setDeleteId('');
        }}
        style={customStyles}
      >
        <h2>Alert</h2>
        <div>Are you sure?</div>
        <form>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
          <button
            type="button"
            onClick={() => {
              setModalIsOpen(false);
              setDeleteId('');
            }}
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}
