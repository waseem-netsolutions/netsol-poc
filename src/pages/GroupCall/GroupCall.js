import React, { useEffect, useContext, useState } from "react";

import useInitGroupCalls from "../../hooks/useInitGroupCalls";

import { MicMuteFill } from 'react-bootstrap-icons';
import { MicFill } from 'react-bootstrap-icons';
import { CameraVideoFill } from 'react-bootstrap-icons';
import { CameraVideoOffFill } from 'react-bootstrap-icons';
import { Topbar } from "../../components";
import { Tab, Tabs } from "react-bootstrap";
import { uniqBy } from "lodash";

import './group-calls.css';
import produce from "immer";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const randomColor = getRandomColor();

const GroupCall = (props) => {
  const { currentUser } = props;

  const [room, setroom] = useState('')
  const [joinRoomInput, setjoinRoomInput] = useState('')
  const [participantVideos, setparticipantVideos] = useState([])
  const [muteMicrophone, setmuteMicrophone] = useState(true)
  const [VideoAvaliable, setVideoAvaliable] = useState(true)
  const [roomStatus, setroomStatus] = useState('')
  const [selectedTab, setSelectedTab] = useState('audio');
  const [participants, setParticipants] = useState([]);
  const [participantColors, setParticipantColors] = useState({})

  useEffect(() => {
    participantVideos.forEach((pv) => {
      if(!participantColors[pv.participantId]){
        setParticipantColors(p => ({...p, [pv.participantId]: getRandomColor()}))
      }
    })
  }, [participantVideos])

  const isAudioCall = selectedTab === 'audio';
  const { SendBirdCall, connectedToServer } = useInitGroupCalls({ currentUser });
  const createRoom = () => {
    const roomParams = { roomType: isAudioCall? SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY : SendBirdCall.RoomType.SMALL_ROOM_FOR_VIDEO };
    SendBirdCall.createRoom(roomParams)
      .then((room) => {
        setroomStatus('CREATE')
        enterAndListen(room)
      })
      .catch((e) => {
         console.log('Failed to create a room.', e)
      });
  };

  const enterAndListen = (room) => {
    const enterParams = { videoEnabled: VideoAvaliable, audioEnabled: muteMicrophone }
    room.enter(enterParams).then(() => {
      // My View Setup
      setroom(room);

      const isAudioRoom = room.roomType === SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY; 

      const localMediaView = document.getElementById('local_video_element_id');

      const audioEl = document.getElementById('audio-for-large-room');

      if(!isAudioRoom){
        room.localParticipant.setMediaView(localMediaView);
      } else {
        room.setAudioForLargeRoom(audioEl);
      }

      setParticipants(room?.participants);
      setparticipantVideos(room?.remoteParticipants);
      
      room.on('remoteParticipantEntered', (participant) => {

        setParticipants(p => uniqBy([...p, participant], 'participantId'));
      
        setparticipantVideos(room.remoteParticipants)
        setparticipantVideos(p => uniqBy([participant, ...p], 'participantId'))
       
      })

      room.on('remoteVideoSettingsChanged', (participant) => {

        setparticipantVideos(room.remoteParticipants)
        setparticipantVideos(p => uniqBy([participant, ...p], 'participantId'))

      })

      room.on('remoteAudioSettingsChanged', (participant) => {
        setparticipantVideos(room.remoteParticipants)
        setparticipantVideos(p => uniqBy([participant, ...p], 'participantId'))
      })

      // Called when a remote participant has entered the room.
      room.on('remoteParticipantStreamStarted', (remoteParticipant) => {

        setparticipantVideos(room.remoteParticipants)
        setparticipantVideos(p => uniqBy([remoteParticipant, ...p], 'participantId'))

        let remoteMediaview = document.getElementById(remoteParticipant.participantId)
        let audioEl = document.getElementById('audio-for-large-room');

        if(!isAudioRoom){
          remoteParticipant.setMediaView(remoteMediaview);
        } else {
          room.setAudioForLargeRoom(audioEl)
        }

        setparticipantVideos(p => uniqBy([remoteParticipant, ...p], 'participantId'))

        setParticipants(p => uniqBy([...p, remoteParticipant], 'participantId'));
        
      });
      // new User Left   
      room.on('remoteParticipantExited', (participant) => {
  
        setparticipantVideos(room.remoteParticipants)
        setparticipantVideos(p => {
          let newArray = p.filter(e => e.participantId !== participant.participantId);
          return newArray
        })

        setParticipants(room.participants);
      });
    }).catch(e => {
      console.log("error while entering the room", e)
    })
  }

  const joinRoom = () => {
    if (!joinRoomInput) return
    SendBirdCall.fetchRoomById(joinRoomInput)
      .then(room => {
        if(room.roomType === SendBirdCall.RoomType.LARGE_ROOM_FOR_AUDIO_ONLY){
          setSelectedTab('audio')
        } else {
          setSelectedTab('video');
        }
        setroomStatus('JOIN')
        //console.log(room)
        enterAndListen(room)
      })
      .catch(e => {
        // Handle error
      });
  }


  const toggleMicrophone = () => {
    let Microphone = !muteMicrophone;
    setmuteMicrophone(Microphone);

    if (Microphone) {
     room.localParticipant.unmuteMicrophone();
    } else {
     room.localParticipant.muteMicrophone();
    }
  };

  const toggleVideo = () => {
    let video = !VideoAvaliable;
    //console.log(video);
    setVideoAvaliable(video);
    //console.log(room)
    if (video) {
      room.localParticipant.startVideo();
    } else {
      room.localParticipant.stopVideo();
    }
  };

  const exitCall = () => {
    if (!room) {
      console.log('no room found', room)
      return;
    }
    try {
      if(room.participants.findIndex(p => p.user.userId === currentUser.email) > -1){
        room.exit();
        setroom('')
        setparticipantVideos([]);
        setParticipants([]);
        setjoinRoomInput('')
        setroomStatus('')
      }
    } catch (error) {
      console.log("room exit error", error)
    }
  };


  useEffect(() => {
    return () => {
      exitCall();
    }
  }, [])

  const videoWorkaround = (id, mute, controls) => {
    let mutedParam = mute ? 'muted' : '';
    const controlsParam = controls? 'controls': '';
    return (
      <div dangerouslySetInnerHTML={{
        __html: `
        <video
        ${mutedParam}
        ${controlsParam}
        width="300"
         height="300" 
        autoplay
        playsinline      
        id="${id}"
          />`
      }}
      />
    );
  };

  //console.log({room, participantVideos})

  const tabContent = (<>
    <div className='row mb-4 mt-3'>
      <div className='col-6'>
        <div className="card h-100">
        <div className='card-body'>
          {room?.roomId &&
            <React.Fragment>
              <p>Joined Room</p>
              <p>{room?.roomId}</p>
            </React.Fragment>
          }
          {
            !connectedToServer && <span>Connecting to server....</span>
          }
          {
            (!room && connectedToServer) &&
            <button className='btn btn-primary mt-2' onClick={createRoom}>Create Room</button>
          }
        </div>
        </div>
      </div>

      {
        !room &&
        <div className='col-6'>
            <div className="card">
              <div className='card-body'>
                <input className='form-control' value={joinRoomInput} onChange={e => setjoinRoomInput(e.target.value)} />
                <button className='btn btn-primary mt-2' onClick={joinRoom} disabled={!joinRoomInput}>Join Room</button>
              </div>
            </div>
        </div>
      }

      {
        roomStatus &&
        <div className='card col-4'>
          <div className='card-body'>
            <div>
              <button className="btn btn-danger m-2" onClick={toggleMicrophone}> {muteMicrophone ? <MicFill /> : <MicMuteFill />}</button>
              {!isAudioCall && <button className="btn btn-danger m-2" onClick={toggleVideo}> {VideoAvaliable ? <CameraVideoFill /> : <CameraVideoOffFill />}</button>}
              <button className="btn m-1 btn-danger" onClick={exitCall} >Exit room</button>
            </div>
          </div>
        </div>
      }
    </div>
    <div>

      { !isAudioCall && <div className="row">
        {room &&
          <div className='col-md-6 custom_video_tab'>
            <div className="video-box">
              <video id="local_video_element_id" autoPlay preload='auto' width="100%" height="250px" muted/>
              {!room?.localParticipant?.isVideoEnabled && 
                  <div className="profile-wrapper">
                    <div className="profile-box" style={{ background: randomColor}}>
                      {room?.localParticipant?.user?.profileUrll ?
                        <img src={room?.localParticipant?.user?.profileUrl} alt="profile-pic" />
                        :
                        <span>{room?.localParticipant?.user?.nickname?.charAt(0)}</span>
                      }
                    </div>
                  </div>
                }
              <div className="participant-name-icon-container">
                  <div>{room?.localParticipant?.user?.nickname} {'(You)'}</div>
                  <div>{room?.localParticipant?.isAudioEnabled? <MicFill/> : <MicMuteFill/>}</div>
              </div>
            </div>
            {/* {videoWorkaround('local_video_element_id', true, false)} */}
          </div>
        }
        {
          participantVideos.length > 0 &&
          participantVideos.map(participant =>
            <div key={participant.participantId} className='col-md-6 custom_video_tab'>
              <div className="video-box">
                <video id={participant.participantId} autoPlay preload='auto' width="100%" height="250px" controls={participant.isVideoEnabled}/>
                {!participant.isVideoEnabled && 
                  <div className="profile-wrapper">
                    <div className="profile-box" style={{ background: participantColors[participant.participantId]}}>
                      {participant.user.profileUrll ?
                        <img src={participant.user.profileUrl} alt="profile-pic" />
                        :
                        <span>{participant.user.nickname.charAt(0)}</span>
                      }
                    </div>
                  </div>
                }
                <div className="participant-name-icon-container">
                  <div>{participant?.user?.nickname}</div>
                  <div>{participant?.isAudioEnabled? <MicFill/> : <MicMuteFill/>}</div>
                </div>
              </div>
              {/* {videoWorkaround(participant.participantId, false, true)} */}
            </div>
          )
        }
      </div>}
      { isAudioCall &&
        <div className="row">
          <audio id="audio-for-large-room" autoPlay={true}></audio>
          {!!(room && participants?.length) && <div>
            <h4>Participants</h4>
            {participants.map(p => {
              const showYou = p.user.userId === currentUser.email;
              return <p key={p.participantId}>{p.user.nickname}{showYou? ' (You)': ''}</p>
            })}
          </div>}
        </div>
      }
    </div>
  </>)

  return (
    <div>
      <Topbar />
      <div className="container">

        <Tabs
          id="call-type"
          activeKey={selectedTab}
          onSelect={k => setSelectedTab(k)}
        //className="mb-3"
        >
          <Tab eventKey="audio" title="Audio Call" disabled={(!isAudioCall && room)? true : false}>
          </Tab>
          <Tab eventKey="video" title="Video Call" disabled={(isAudioCall && room)? true : false}>
          </Tab>
        </Tabs>
        {tabContent}
      </div>
    </div>
  );
};

export default GroupCall;
