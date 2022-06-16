// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy, limit, startAt } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBzQeLEWzpIoz-7P8rXWTGBetC44K6KOkA',
  authDomain: 'test-947db.firebaseapp.com',
  projectId: 'test-947db',
  storageBucket: 'test-947db.appspot.com',
  messagingSenderId: '1078726759320',
  appId: '1:1078726759320:web:b4ab337d1c61b82e6d91ed',
  measurementId: 'G-61SRGNSTD9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;


//Methods to manipulate the db
export const addEmployee = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "employees"), data);
  } catch (e) {
    console.error("Error adding document: ", e.message);
  }
}

export const getAllEmps = async (filterData) => {
  const { nameOrder = 'asc'} = filterData;
  let q = query(collection(db, "employees"), orderBy("name", nameOrder));
  try{
    const querySnapshot = await getDocs(q);
    const dataArr = [];
    querySnapshot.forEach((doc) => {
      dataArr.push({...doc.data(), docId: doc.id })
    });
    return [dataArr, null];
  } catch(err){
    console.error("***GEt all items error", err.message);
    return [null, err.message];
  }
}

export const updateEmp = async (docId, data) => {
  try {
    const docRef = doc(db, 'employees', docId);
    await updateDoc(docRef, data);
  } catch (err) {
    console.error("**updation error", err.message);
  }
}

export const deleteEmp = async (docId) => {
  try {
    await deleteDoc(doc(db, "employees", docId));
  } catch (err) {
    console.error("**updation error", err.message);
  }
}
