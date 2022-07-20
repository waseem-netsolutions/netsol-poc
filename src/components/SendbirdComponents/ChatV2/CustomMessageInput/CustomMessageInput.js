import React, { useEffect, useState } from 'react'
import { Paperclip } from 'react-bootstrap-icons';
import InputEmoji from "react-input-emoji";
import "../../../../styles/custom-message-input.css";
import { useChannelContext } from '@sendbird/uikit-react/Channel/context';

const accept = "audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"

const CustomMessageInput = (props) => {
  const { sendUserMessage, sendFileMessage, sdk, currentChannel } = props;
  const context = useChannelContext();
  const { onBeforeSendUserMessage, onBeforeSendFileMessage } = context;
  const [text, setText] = useState("");

  const handleTextInput = (text) => {
    text && currentChannel?.startTyping();
    setText(text);
  }
  const handleOnEnter = async (text) => {
    if(!text) return;
    currentChannel?.endTyping();
    const userMessageParams = onBeforeSendUserMessage(text);
    await sendUserMessage(currentChannel, userMessageParams);
  }
  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    if(!files.length) return;
    for(let i = 0; i < files.length; i++){
      const fileMessageParams = onBeforeSendFileMessage(files[i]);
      sendFileMessage(currentChannel, fileMessageParams);
    }
  }
  return (
    <div className='message-input-container'>
      <div className='message-input'>
      <InputEmoji
        theme="light"
        borderRadius={10}
        value={text}
        onChange={handleTextInput}
        cleanOnEnter
        onEnter={handleOnEnter}
        placeholder="Type a message"
      />
      </div>
      <div className='attachment-input'>
        <label htmlFor="attachment">
          <Paperclip className='attachment-icon'/>
        </label>
        <input 
          type="file" 
          name="attachment" 
          id="attachment" 
          style={{ display: "none" }} 
          onChange={handleAttachment}
          accept={accept}
          multiple
        />
      </div>
    </div>
  )
}

export default CustomMessageInput