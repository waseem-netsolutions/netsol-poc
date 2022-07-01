import React from 'react'
import { Topbar } from '../components'
import useInitCalls from '../hooks/useInitCalls'

const DirectCallsPage = (props) => {
  const { currentUser } = props;
  const { email } = currentUser || {}

  const SendBirdCall = useInitCalls(email);
  console.log(SendBirdCall)

  const makeCall = () => {

  }

  const acceptCall = () => {

  }

  const endCall = () => {

  }

  return (
    <div>
      <Topbar />
      <div className="card mt-4" style={{ width: "800px" }} id="videoCard">
        <div className="card-header">Sendbird Calls</div>
        <div className="card-body d-flex">
          <div className="col text-center">
            {/* YOUR VIDEO */}
            <video
              style={{ width: '300px' }}
              id="local_video_element_id"
              autoPlay
              className="border"
              muted
            />
          </div>
          <div className="col text-center">
            {/* REMOTE VIDEO */}
            <video
              style={{ width: "300px" }}
              id="remote_video_element_id"
              autoPlay
              className="border"
            />
          </div>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-center" id="makeCallPanel">
            {/* MAKE CALL BUTTON */}
            <button
              className="btn btn-success btn-sm m-1"
              onClick={makeCall}
              id="butMakeCall"
            >
              Make Call
            </button>
          </div>
          <div className="d-flex justify-content-center" id="receiveCallPanel">
            {/* YOU HAVE A CALL LABEL */}
            <div style={{ display: "none" }} id="isRinging" className="text-danger m-2">
              YOU HAVE A CALL!
            </div>
            {/* ACCEPT CALL BUTTON */}
            <button
              style={{ display: "none" }}
              className="btn btn-primary btn-sm m-1"
              onClick={acceptCall}
              id="butAcceptCall"
            >
              Accept Call
            </button>
            {/* END CALL */}
            <button
              style={{ display: "none" }}
              className="btn btn-danger btn-sm m-1"
              onClick={endCall}
              id="butEndCall"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectCallsPage