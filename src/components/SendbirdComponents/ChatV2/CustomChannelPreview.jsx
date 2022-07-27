import moment from 'moment';
import React , { useState } from 'react'
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import OutsideClickHandler from 'react-outside-click-handler';
import ActionOptions from './ActionOptions';
import { useChannelList } from '@sendbird/uikit-react/ChannelList/context';
import '../../../styles/custom-channel-preview.css';

const CustomChannelPreview = (props) => {
    const {
      channel: currentChannel, 
      onLeaveChannel, 
      currentChannelUrl, 
      setCurrentChannel, 
      from = '', 
      currentUser,
      updateChannelList
    } = props;
    const [showActionDots, setShowActionDots] = useState(false);
    //console.log(currentChannel)
    const [showActionOptions, setShowActionOptions] = useState(false);
    const isOperator = currentChannel.myRole === "operator";
    //console.log(currentChannel)
    //console.log(props.channel.name, props.channel.customType, props.channel.data)
    //console.log(useChannelList())
    const isActive = currentChannelUrl === currentChannel.url;
    const lastMessageTimeFromNow = moment().diff(moment(currentChannel?.lastMessage?.createdAt));
    const duration = moment.duration(lastMessageTimeFromNow).get("days");
    const timeToShow = duration > 1 ? moment(currentChannel?.lastMessage?.createdAt).format("MMM D") 
                                    : moment(currentChannel?.lastMessage?.createdAt).format("h:mm A");


    const { memberCount, data, name } = currentChannel
    let officeName = ''
    let channelOwner = ''
    let channelName = name;
    let messageText = currentChannel?.lastMessage?.message || currentChannel?.lastMessage?.name;
    if(messageText?.length > 30){
      messageText = currentChannel?.lastMessage?.message?.slice(0, 30)?.concat(' ...')
    }
    if(data && memberCount === 2){ 
      const customMembers = JSON.parse(data)?.members || []; 
      const otherUser = customMembers?.filter(mem => mem.email !== currentUser.email)?.[0];
      officeName = otherUser?.isOwner? 'Account Owner': otherUser?.office;
      channelName = otherUser?.name;
    }
    if(!currentUser.isOwner && data){
      channelOwner = JSON.parse(data).accountOwner;
    }
    //Note channelOwner will be empty for non-owners
    //console.log({currentUser, channelOwner, currentChannel})
    if(!currentUser.isOwner && (currentUser.accountOwner !== channelOwner)) return null
  
    const activeClass = () => {
      return isActive ? 'active-channel' : ''
    }
    
    const showHideDots = () => {
      return showActionDots ? 'action-container-show' : 'hide';
    }

    const showHideTime = () => {
      return showActionDots ? 'hide' : 'action-dots-show';
    }

    const handleActionDotsClick = (e) => {
      e.stopPropagation();
      setShowActionOptions(!showActionOptions);
    }

    const handleLeaveChannel = async () => {
      try {
        if(currentChannel.data){
          const previousData = JSON.parse(currentChannel.data);
          const previousMembers = previousData?.members;
          const updatedMembers = previousMembers.filter(m => m.email !== currentUser.email);
          previousData.members = updatedMembers;
          const updateChannelParams = {};
          updateChannelParams.data = JSON.stringify(previousData);
          await currentChannel.updateChannel(updateChannelParams);
        }
        await onLeaveChannel(from === 'custom-list' ? currentChannel.url : currentChannel);
        setCurrentChannel(null);
        updateChannelList(p => p + 1)
      } catch (error) {
        handleError(error);
      }
    }

    const handleArchiveChannel = async () => {
      try {
        await currentChannel.hide(false, false);
        setCurrentChannel(null);
        updateChannelList(p => p + 1)
      } catch (error) {
        handleError(error)
      }
    }

    const handleUnarchiveChannel = async () => {
      try {
        await currentChannel.unhide();
        setCurrentChannel(null);
        updateChannelList(p => p + 1);
      } catch (error) {
        handleError(error);
      }
    }

    const handleClearHistory = async () => {
      try {
        await currentChannel.resetMyHistory();
        //const updatedChannel = await currentChannel.refresh()
        setCurrentChannel(null);
        updateChannelList(p => p + 1)
      } catch (error) {
        handleError(error)
      }
    }
    const handleDeleteChannel = async () => {
      try {
        await currentChannel.delete();
        setCurrentChannel(null);
        console.log(`${currentChannel.name} - deleted`);
      } catch (error) {
        console.log("***err while deleting the channel", error)
      }
    }
    const handleError = (err) => {
      console.log("***errror", err);
    }
    const actionOptions = [
      {
        label: "Leave channel",
        onClick: handleLeaveChannel
      },
      {
        label: currentChannel.isHidden ? "Unarchive channel" : "Archive channel",
        onClick: currentChannel.isHidden ? handleUnarchiveChannel : handleArchiveChannel
      },
      {
        label: "Clear history",
        onClick: handleClearHistory
      },
      {
        label: "Delete channel",
        onClick: handleDeleteChannel,
        visible: isOperator
      }
    ]
    return (
      <div 
        className={`channel-preview-container ${activeClass()}`} 
        onMouseOver={() => setShowActionDots(true)} 
        onMouseLeave={() => {!showActionOptions && setShowActionDots(false)}}
        onClick={() => setCurrentChannel(currentChannel)}
      >
        <div className='channel-preview-image-container'>
          <img src={currentChannel?.coverUrl} alt="" />
        </div>

        <div className='channel-preview-info-container'>
          <div className='info'>
              <div className='name-members'>
                <span className='name'>{channelName}</span>
                {currentChannel?.memberCount > 2 && <span className='members'>{currentChannel?.memberCount}</span>}
              </div>
              <span className={`time ${showHideTime()}`}>{timeToShow}</span>
              <OutsideClickHandler 
                onOutsideClick={() => setShowActionOptions(false)}
              >
                <div className={`action-container`} onClick={handleActionDotsClick}>
                  <div className={`action-icon ${showHideDots()}`}>
                    <ThreeDotsVertical />
                  </div>
                  {showActionOptions && <div className='action-options'>
                    <ActionOptions options={actionOptions}/>
                  </div>}
                </div>
              </OutsideClickHandler>
          </div>
          {!!officeName && <div className='office-name-container'>
            <span>{officeName}</span>
          </div>}
          <div className='last-message-container'>
            <div className='last-message'>
              <span>{messageText}</span>
            </div>
            {!!currentChannel.unreadMessageCount && <div className='unread-messages-count'>
              <span>
                {currentChannel.unreadMessageCount}
              </span>
            </div>}
          </div>
        </div>
      </div>
    );
  };

  export default CustomChannelPreview