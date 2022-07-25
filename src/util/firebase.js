// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import axios from "axios"
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { APP_ID, API_TOKEN } from "../constants/sendbird";
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

//* GET FIREBASE MESSAGING INSTANCE
const messaging = getMessaging(app);
export const subscribeToPushNotifications = async () => {

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BIXY-VncPL0hU3DU-1Fp_2-TEUR6qL94qCMF3zek4DPERLP1L0K2K_1FfNWhlEaBuxVJlUKTL_JIL0ptIThmI5g"
    });
    if(currentToken){
      console.log({currentToken});
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
}
export const setOnMessageListener = (callback) => {
  onMessage(messaging, callback)
}

export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;


//Methods to manipulate the db
export const addEmployee = async (data) => {
  try {
    // try {
    //   const res = await axios.get("https://randomuser.me/api/?inc=picture");
    //   const apiData = res.data;
    //   const imageUrl = apiData?.results?.[0]?.picture?.medium || '';
    //   data.imageUrl = imageUrl;
    // } catch (error) {
    //   console.log("error while getting random image")
    // }
    const docRef = await addDoc(collection(db, "employees"), data);
    // const metadata = {
    //   email: data.email,
    //   isOwner: data.isOwner
    // }
    // if(!data.isOwner){
    //   metadata.accountOwner = data.accountOwner,
    //   metadata.office = data.office,
    //   metadata.isAdmin = data.isAdmin
    // }
    // const postData = {
    //   user_id: data.empId,
    //   nickname: data.name,
    //   profile_url: data.imageUrl,
    //   metadata
    // }
    // try {
    //   const res = await axios.post(`https://api-${APP_ID}.sendbird.com/v3/users`, postData, {
    //     headers: {
    //       'Api-Token': API_TOKEN
    //     }
    //   });
    //   console.log("sendbird user created", res)
    // } catch (e) {
    //   console.error("Error adding emp to sendbird: ", e.message);
    // }
  } catch (e) {
    console.error("Error adding emp to firebase: ", e.message);
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

export const getOwners = async () => {
  let q = query(collection(db, "employees"), where("isOwner", "==", true));
  try{
    const querySnapshot = await getDocs(q);
    const dataArr = [];
    querySnapshot.forEach((doc) => {
      dataArr.push({...doc.data(), docId: doc.id })
    });
    return [dataArr, null];
  } catch(err){
    console.error("***GEt all owners error", err.message);
    return [null, err.message];
  }
}

export const getUser = async (email) => {
  let q = query(collection(db, "employees"), where("email", "==", email));
  try{
    const querySnapshot = await getDocs(q);
    const dataArr = [];
    querySnapshot.forEach((doc) => {
      dataArr.push({...doc.data(), docId: doc.id })
    });
    return [dataArr, null];
  } catch(err){
    console.error("***GEt user error", err.message);
    return [null, err.message];
  }
}

export const getSimilarUsers = async (currentUser, showInternal) => {
  const { isOwner, accountOwner, office, email, name } = currentUser;
  let q;
  if (isOwner) {
    if(showInternal){
      q = query(collection(db, "employees"),  
            where("accountOwner", "==", name), 
          );
    } else {
      q = query(collection(db, "employees"), where("isOwner", "==", true));
    }
  } else {
    if(showInternal){
      q = query(collection(db, "employees"), 
            where("isOwner", "==", false), 
            where("accountOwner", "==", accountOwner), 
            //where("office", "==", office)
          );
    } else {
      q = query(collection(db, "employees"), 
            where("isOwner", "==", false), 
            where("accountOwner", "==", accountOwner), 
            where("office", "!=", office)
          );
    }
  }
  try {
    const querySnapshot = await getDocs(q);
    const dataArr = [];
    querySnapshot.forEach((doc) => {
      dataArr.push({ ...doc.data(), docId: doc.id })
    });
    return [dataArr, null];
  } catch (err) {
    console.error("***GEt owner error", err.message);
    return [null, err.message];
  }
}

export const updateEmp = async (docId, data) => {
  try {
    try {
      const res = await axios.get("https://randomuser.me/api/?inc=picture");
      const apiData = res.data;
      const imageUrl = apiData?.results?.[0]?.picture?.medium;
      data.imageUrl = imageUrl;
    } catch (error) {
      console.log("error while getting random image")
    }
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
