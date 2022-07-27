import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { MicMuteFill } from 'react-bootstrap-icons';
import { MicFill } from 'react-bootstrap-icons';
import { CameraVideoFill } from 'react-bootstrap-icons';
import { CameraVideoOffFill } from 'react-bootstrap-icons';
import produce from 'immer';
import { calls } from '../constants/sendbird';

const DirectCallModal = (props) => {
  const {
    directCallModal,
    setDirectCallModal,
    SendBirdCall,
    callingState,
    setcallingState,
    currentCall,
    setCurrentCall,
    addDialOutListener,
    isAudioCall
  } = props;


  const acceptCall = () => {
    const callOption = getCallOptions();
    currentCall.accept({ callOption });
  }

  const muteCall = () => {
    if (!callingState.isMuted) {
      currentCall.muteMicrophone()
    } else {
      currentCall.unmuteMicrophone()
    }
    setcallingState(ps => ({...ps, isMuted: !ps.isMuted}))
  }
  const toggleVideo = () => {
    if (!callingState.videoHidden) {
      currentCall.stopVideo();
    } else {
      currentCall.startVideo();
    }
    setcallingState(ps => ({...ps, videoHidden: !ps.videoHidden}))
  }

  const beforeCallSetup = (type) => {
    if (type === 'Audio') {
      setcallingState(ps => ({...ps, isMuted: !ps.isMuted}));
    } else {
      setcallingState(ps => ({...ps, videoHidden: !ps.videoHidden}));
    }
  }
  const rejectCall = () => {
    if(currentCall && currentCall.end)
      currentCall.end();
    setCurrentCall({})
    clearState()
  }

  const clearState = () => {
    setcallingState(produce(draft => {
      draft.isMuted = false;
      draft.videoHidden = false;
      draft.status = calls.NOTHING;
      draft.errorMsg = ""
    }))
    //window.location.reload();
  }

  const makeCall = () => {
    setcallingState(produce(d => {
      d.status = calls.CONNECTING
    }));

    let callOption = getCallOptions();
    const dialParams = {
      userId: callingState.otherUser,
      isVideoCall: !isAudioCall,
      callOption
    };
    try {
      const call = SendBirdCall.dial(dialParams, (call, error) => {
        if (error) {
          setcallingState(ps => ({...ps, errorMsg: error.message}))
        } else {
          setcallingState(ps => ({...ps, errorMsg: ''}))
          addDialOutListener(call);
        }
      });
    } catch (e) {
      setcallingState(ps => ({...ps, errorMsg: e.message}))
    }

  }


  const screenShare = async () => {
    try {
      await currentCall.startScreenShare();
      currentCall.onScreenShareStopped = () => {
        // add your process for screen share stop.
      };
    } catch (e) {
      // add your process for start screen share fail.
    }
  }

  const screenShareStop = () => {
    currentCall.stopScreenShare();
  }

  const getCallOptions = () => {
    const callOption = {
      remoteMediaView: document.getElementById('remote_element_id'),
      localMediaView: document.getElementById('local_video_element_id'),
      audioEnabled: !callingState.isMuted,
      videoEnabled: !callingState.videoHidden
    }
    return callOption;
  }
  const videoView = () => {
    //return ''
    if(isAudioCall) return 'd-none'
    if (callingState.status == calls.CONNECTING || callingState.status == calls.CONNECTED) {
      return 'd-block'
    }
    return 'd-none'
  }

  const videoRemote = () => {
    //return ''
    if(isAudioCall) return 'd-none'
    if (callingState.status == calls.CONNECTING || callingState.status == calls.CONNECTED) {
      return 'd-block'
    }
    return 'd-none'
  }

  const Alert = () => {
    return (
      <div className="alert alert-success" role="alert">
        {console.log(currentCall)}
        <div>{currentCall?._caller?.nickname} is Calling</div>
        <button className="btn m-1 btn-success" onClick={acceptCall}>Accept</button>
        <button className="btn m-1 btn-danger" onClick={rejectCall} >Reject</button>
      </div>
    )
  }
  return (
    <Modal
      show={directCallModal}
      onHide={() => {
        setDirectCallModal(false);
        rejectCall();
      }}
      size="lg"
      contentClassName='image-viewer'
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Direct {isAudioCall ? "Audio" : "Video"} Call
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          { callingState.errorMsg? <p style={{color: "red"}}>{callingState.errorMsg}</p> : null }
          {
            // Screen sharing is not requirement
            false && !isAudioCall && callingState.status == calls.CONNECTED &&
            <div>
              <button className="btn btn-primary m-2" onClick={screenShare}> Screen share </button>
              <button className="btn btn-primary m-2" onClick={screenShareStop}> Stop screen share </button>
            </div>
          }
          <div className="row">
            <div className={`col-6 ${videoRemote()} `}>
              <video id="remote_element_id" autoPlay preload='auto' width="300px" height="150px" controls/>
            </div>
            <div className={`col-6 ${videoView()} `}>
              <video id="local_video_element_id" autoPlay preload='auto' width="300px" height="150px" muted/>
            </div>
          </div>
          {
            (callingState.status == calls.CONNECTING || callingState.status == calls.CONNECTED) &&
            <div>
              after
              <button className="btn btn-danger m-2" onClick={muteCall}> {callingState.isMuted ? <MicMuteFill /> : <MicFill />}</button>
              {!isAudioCall && <button className="btn btn-danger m-2" onClick={toggleVideo}> {callingState.videoHidden ? <CameraVideoOffFill /> : <CameraVideoFill />}</button>}
              <button className="btn m-1 btn-danger" onClick={rejectCall} > call end</button>
            </div>
          }
          {/* Before call */}
          {
            (callingState.status == calls.NOTHING || callingState.status == calls.RINGING) && callingState.otherUser &&
            <div>
              <button className="btn btn-danger m-2" onClick={() => beforeCallSetup('Audio')}> {callingState.isMuted ? <MicMuteFill /> : <MicFill />}</button>
              Join with Mic {callingState.isMuted ? "off" : "on"}
              {!isAudioCall && <button className="btn btn-danger m-2" onClick={() => beforeCallSetup('Video')} > {callingState.videoHidden ? <CameraVideoOffFill /> : <CameraVideoFill />}</button>}
              {!isAudioCall && `Join with Camera ${callingState.videoHidden ? "off" : "on"}`}
            </div>
          }
          {/* Before call */}
          {  
            callingState.otherUser && callingState.status == calls.NOTHING &&
            <button className="btn btn-danger call-btn" onClick={makeCall}>Call</button>
          }
          {
            callingState.status === calls.RINGING && 
            <Alert />
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DirectCallModal

