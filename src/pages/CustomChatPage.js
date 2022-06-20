import React, { useEffect, useState } from 'react'
import { Topbar } from '../components'
import { App as SendbirdApp } from 'sendbird-uikit'
import "sendbird-uikit/dist/index.css";
import { Button } from 'react-bootstrap';
import { OpenChannelCreateParams } from "@sendbird/chat/openChannel"






const CustomChtPage = (props) => {
  const { sb } = props;
  const [user, setUser] = useState(null);
  const [channelUrl, setChannelUrl] = useState("sendbird_open_channel_16374_6f2a0a098ab8dc4eae292355a2701cfc530ca233");
  const [currentChannel, setCurrentChannel] = useState(null);
 
  //console.log(sb)

  useEffect(() => {
    // The USER_ID below should be unique to your Sendbird application.
    const setSendbirdUser =  async () => {
      try {
        const user = await sb.connect(USER_ID);
        // The user is connected to the Sendbird server.
        setUser(user);
        console.log("**user", user);
      } catch (err) {
        // Handle error.
        console.log("***err", err);
      }
    }
    if(sb){
      setSendbirdUser();
    }
  }, [sb])

  useEffect(() => {

    const getCurrentChannel = async () => {
      const [channel, err] = await getChannel(channelUrl, sb);
      if(!err){
        setCurrentChannel(channel);
        console.log("***currentChannel", channel);
      } else {
        console.log("*** err while getting channel", err);
      }
    }
    if(sb) getCurrentChannel();
  }, [channelUrl, sb])

  const handleCreateChannel = async () => {
    const [openChannel, err] = await createChannel("test-channel", sb);
    if(!err){
      console.log(openChannel);
    } else {
      console.log("**err while creating new channel", err)
    }
  }

  return (
    <div>
      <Topbar/>
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row"
      }}>

        <div style={{
          width: "30%",
          minHeight: "100%",
          background: "grey",
          display:"flex",
          flexDirection: "column"
        }}>
        
          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: 'center',
            alignContent: "center"
          }}>
            <Button style={{marginTop: "10px"}} variant='primary' onClick={handleCreateChannel}>
              Create Channel
            </Button>
          </div>
          <hr />

        </div>

        <div style={{
          width: "70%",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
            


        </div>

      </div>
    </div>
  )
}

export default CustomChtPage

//* Helper functions
const createChannel = async (channelName, sb) => {
  try {
      const openChannelParams = new sb.OpenChannelParams();
      openChannelParams.name = channelName;
      openChannelParams.operatorUserIds = [sb.currentUser.userId];
      const openChannel = await sb.OpenChannel.createChannel(openChannelParams);
      return [openChannel, null];
  } catch (error) {
      return [null, error];
  }
}

const getChannel = async (channelUrl, sb) => {
  try {
    const channel = await sb.OpenChannel.getChannel(channelUrl);
    return [ channel, null ];
  } catch (error) {
    return [null, error];
  }
}