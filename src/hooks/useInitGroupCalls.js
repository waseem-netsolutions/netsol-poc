import SendBirdCall from "sendbird-calls";
import produce from "immer";
import { APP_ID as appId } from "../constants/sendbird";
import { useEffect, useState } from "react";

const useInitGroupCalls = (dependencies) => {
  const { currentUser } = dependencies;
  const [connectedToServer, setConnectedToServer] = useState(false);
  // Authenticate
  const authenticate = () => {
    return SendBirdCall.authenticate({
      userId: currentUser.email,
      accessToken: undefined
    })
  }
  // connect WebSocket for video and audio 
  const connect = () => {
    return SendBirdCall.connectWebSocket()
  }

  useEffect(() => {
    if (currentUser && currentUser.email) {
      SendBirdCall.init(appId);
      authenticate()
        .then(() => connect())
        .then(() => {
          setConnectedToServer(true)
          console.log("user authenticated and socket connected");
        })
        .catch(err => {
          console.log('err use', err)
        });
    }
  }, [currentUser])


  return { SendBirdCall, connectedToServer }
}



export default useInitGroupCalls;