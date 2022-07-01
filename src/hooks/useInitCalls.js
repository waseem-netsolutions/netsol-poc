import SendBirdCall from "sendbird-calls";
import React from 'react'
import { useEffect } from "react";
import { APP_ID } from '../constants/sendbird';

function authenticateUser(userId) {
  const authOption = {
      userId: userId,
      accessToken: undefined
  };
  SendBirdCall.authenticate(authOption, (res, error) => {
      if (error) {
          console.dir(error);
          alert(`Error authenticating user! Is your Access
          / Session token correct? This user exists?`);
      } else {
          connectToWebsocket();
      }
  });   
}

function connectToWebsocket() {
  SendBirdCall.connectWebSocket()
  .then(() => {
      //waitForCalls();
  })
  .catch((err) => {
      console.dir(err);
      alert('Failed to connect to Socket server');
  });
}

const useInitCalls = (userId) => {
  useEffect(() => {
    if(userId){
      SendBirdCall.init(APP_ID);
      //SendBirdCall.useMedia({ audio: true, video: true });
      authenticateUser(userId)
    }
  }, [userId]);

  return SendBirdCall;
}


export default useInitCalls