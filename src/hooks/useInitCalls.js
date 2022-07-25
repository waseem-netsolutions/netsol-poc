import SendBirdCall from "sendbird-calls";
import produce from "immer";
import { calls, APP_ID as appId } from "../constants/sendbird";
import { useEffect, useState } from "react";

const useInitCalls = (dependencies) => {
  const {
    userId: currentUserId,
    currentChannel,
    setDirectCallModal,
    setIsAudioCall
  } = dependencies;

  const [callingState, setcallingState] = useState({
    status:  calls.NOTHING,
    call: "",
    displayPickup: false,
    displayEnd: false,
    displayCall: true,
    listenerId: `${currentUserId}${Math.random()}`,
    errorMsg: '',
    isMuted: false,
    videoHidden: false,
    otherUser: ''
  })
  const [currentCall, setCurrentCall] = useState({})
  // Authenticate
  const authenticate = () => {
    return SendBirdCall.authenticate({
      userId: currentUserId,
      accessToken: undefined
    })
  }
  // connect WebSocket for video and audio 
  const connect = () => {
    return SendBirdCall.connectWebSocket()
  }

  const addIncomingListener = () => {
    console.log("Initizalized & ready...");
    SendBirdCall.addListener(callingState.listenerId, {
      onRinging: (call) => {
        const { _isVideoCall } = call;
        setIsAudioCall(!_isVideoCall);
        setCurrentCall(call)
        setDirectCallModal(true);
        setcallingState(produce(draft => {
          draft.status = calls.RINGING
        }));
        call.onEstablished = (call) => {
          setCurrentCall(call)
          setcallingState(produce(draft => {
            draft.status = calls.ESTABLISHED
          }));
        };
        call.onConnected = (call) => {
          setCurrentCall(call)
          setcallingState(produce(draft => {
            draft.status = calls.CONNECTED
          }));
        };
        call.onEnded = (call) => {
          setDirectCallModal(false);
          setCurrentCall({})
          setcallingState(produce(draft => {
            draft.status = calls.NOTHING
          }));
        }
      }
    });
  }

  const addDialOutListener = (call) => {
    setCurrentCall(call)
    setcallingState(produce(d => {
      d.status = calls.CONNECTING
    }));
    call.onEstablished = (call) => {
      setCurrentCall(call)
      setcallingState(produce(draft => {
        draft.status = calls.ESTABLISHED
      }));
    };
    call.onConnected = (call) => {
      setCurrentCall(call)
      setcallingState(produce(draft => {
        draft.status = calls.CONNECTED
      }));
    };
    call.onEnded = (call) => {
      setCurrentCall({})
      setcallingState(produce(draft => {
        draft.status = calls.NOTHING
      }));
    }
  }

  useEffect(() => {
    if(currentUserId){
      const { members = [] } = currentChannel || {};
    const otherUserId = members.filter(mem => mem.userId !== currentUserId)?.[0]?.userId
      setcallingState(produce(draft => {
        draft.otherUser = otherUserId
      }))

    }
  }, [currentUserId, currentChannel])
  useEffect(() => {
    if (currentChannel && currentChannel.memberCount === 2) {
      SendBirdCall.init(appId);
      authenticate()
        .then(() => connect())
        .then(() => addIncomingListener())
        .catch(err => {
          console.log('err use', err)
        });
    }
  }, [currentUserId, currentChannel])

  return { SendBirdCall, callingState, setcallingState, currentCall, setCurrentCall, addDialOutListener };
}

export default useInitCalls