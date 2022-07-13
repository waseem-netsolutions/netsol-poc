
import moment from 'moment';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { Download, PlayBtn, ThreeDotsVertical } from 'react-bootstrap-icons';
import OutsideClickHandler from 'react-outside-click-handler';
import '../../../styles/custom-message.css';
import useMounted from '../../../hooks/useMounted';
import { useChannel } from '@sendbird/uikit-react/Channel/context';

const CustomMessageItem = (props) => {
  const {
    message,
    currentUser,
    deleteMessage,
    updateUserMessage,
    setImageUrl,
    setImageViewer,
    currentChannel,
    setHighlighedMessage,
    sdk
  } = props;
  //TODO console.log(channel.getUnreadMemberCount(message), channel.getUndeliveredMemberCount(message))
  const { highLightedMessageId } = useChannel();
  const [selectedMessage, setSelectedMessage] = useState(false);
  const [showVerticalDots, setShowVerticalDots] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState("");
  const [playVideo, setPlayVideo] = useState(false);
  const isMounted = useMounted();

  const {
    createdAt,
    updatedAt,
    customType,
    messageType,
    message: messageText,
    messageId,
    name,
    type,
    url,
    _sender,
    data,
    sendingStatus,
    thumbnails
  } = message;
  let thumbnailUrl;
  if (thumbnails && thumbnails.length) {
    thumbnailUrl = thumbnails[0].url;
    console.log('Thumbnail URL', thumbnailUrl)
  }

  //console.log(channel.getUnreadMemberCount(message), channel.getUndeliveredMemberCount(message))
  // console.log(message)

  let additionalData = {}
  if (data) {
    try {
      additionalData = JSON.parse(data);
    } catch (error) {
      console.log("Error while parsing json data", error);
    }
  }

  useEffect(() => {
    if (highLightedMessageId === messageId) {
      if (isMounted.current) {
        setSelectedMessage(true);
        setTimeout(() => {
          if (isMounted.current) {
            setSelectedMessage(false);
            setHighlighedMessage(null);
          }
        }, 2000)
      }
    }
  }, [highLightedMessageId])


  const handleMouseOver = () => {
    setShowVerticalDots(true);
  }

  const handleMouseLeave = () => {
    setShowVerticalDots(false);
  }

  const handleThreeDotsClick = (e) => {
    setShowMessageOptions(!showMessageOptions)
  }

  const handleDeleteMessage = async () => {
    setShowMessageOptions(false);
    try {
      await deleteMessage(currentChannel.url, message);
      console.log("Message Deleted");
    } catch (error) {
      console.log("Error while deleteing a message", error);
    }
  }

  const handleTextOnChange = (e) => {
    const value = e.target.value;
    setUpdatedMessage(value);
  }

  const handleEditClick = () => {
    setUpdatedMessage(messageText);
    setShowEditInput(true);
    setShowMessageOptions(false);
  }

  const handleEditCancel = () => {
    setShowEditInput(false);
  }

  const handleEditMessageSave = async () => {
    try {
      const userMessageParams = new sdk.UserMessageParams();
      userMessageParams.message = updatedMessage;
      await updateUserMessage(currentChannel.url, messageId, userMessageParams);
      console.log("Message updated");
    } catch (error) {
      console.log("Error while updating a message", error)
    }
  }

  const handleImageClick = () => {
    setImageUrl(url)
    setImageViewer(true)
  }


  const { userId } = _sender;
  const isOwnMessage = userId === currentUser.email;
  const isTextMessage = messageType === "user";
  const isEdited = updatedAt > 0;
  const sending = sendingStatus == "pending"

  let content = null;
  let editContent = null;


  if (messageType === "user") {
    content = (
      <span >
        {messageText}
        {!isEdited ? null : (<span className='edited-flag'>{' (edited)'}</span>)}
      </span>
    )
    editContent = (
      <>
        <div className='textarea-container'>
          <textarea onChange={handleTextOnChange} name="" id="" cols="30" rows="5" placeholder='Edit message' value={updatedMessage}></textarea>
        </div>
        <div className='edit-actions-container'>
          <span onClick={handleEditCancel} className='edit-action-btn cancel-edit-btn'>Cancel</span>
          <span onClick={handleEditMessageSave} className='edit-action-btn'>Save</span>
        </div>
      </>
    )
  }
  if (customType === 'image') {
    content = (
      <>
        <div className='image-container' onClick={handleImageClick}>
          <img src={thumbnailUrl || url} alt={name} />
        </div>
        <span>{name}</span>
      </>
    )
  }
  if (customType === 'document') {
    content = (
      <>
        <a href={url} className="download-icon"><Download /></a> &nbsp;
        <span className='document-name'><a href={url}>{name}</a></span>
      </>
    )
  }
  if (customType === "video") {
    content = (
      <>
        <div className='video-container'>
          {thumbnailUrl && !playVideo &&
            <div onClick={() => setPlayVideo(true)}>
              <img src={thumbnailUrl} alt={name} />
              <PlayBtn className='video-play-btn' />
            </div>
          }
          {(!thumbnailUrl || playVideo) && <video src={url} controls />}
        </div>
        <span>{name}</span>
      </>
    )
  }

  return (
    <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} id={messageId}
      className={`${isOwnMessage ? 'own-message-container' : 'other-message-container'}`}
    >
      {sending && <div>
        <Spinner animation="border" variant="primary" />
      </div>}
      {(!sending && isOwnMessage) &&
        <OutsideClickHandler onOutsideClick={() => setShowMessageOptions(false)}>
          <div className={`message-options-container`}>
            <div className={`cursor message-options-btn  ${showVerticalDots ? 'show' : 'hide'}`} onClick={handleThreeDotsClick}>
              <ThreeDotsVertical />
            </div>
            {showMessageOptions &&
              <div className='message-options'>
                <ul>
                  <li onClick={handleDeleteMessage}>Delete</li>
                  {isTextMessage && <li onClick={handleEditClick}>Edit</li>}
                  {!isTextMessage && <li><a href={url}>Download</a></li>}
                </ul>
              </div>

            }
          </div>
        </OutsideClickHandler>}
      <div
        className={`text-message-area ${isOwnMessage ? 'text-message-area-outgoing' : 'text-message-area-incoming'} ${selectedMessage ? 'highlighted-message' : ''}`}>
        <div className='user-name-container'>
          <span className='name'>{isOwnMessage ? "You" : _sender.nickname}</span>
          <span className='office'>{additionalData.office ? additionalData.office : null}</span>
        </div>
        {showEditInput ? editContent : content}
        <small className='text-message-date'>{moment(createdAt).format("MMM D, YYYY [at] hh:mm A ")}</small>
      </div>
    </div>
  )
}

export default CustomMessageItem