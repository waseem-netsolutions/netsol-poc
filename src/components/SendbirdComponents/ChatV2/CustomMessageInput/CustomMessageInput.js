import React, { useEffect, useState } from 'react'
import { Paperclip, SendFill } from 'react-bootstrap-icons';
import InputEmoji from "react-input-emoji";
import "../../../../styles/custom-message-input.css";
import { useChannelContext } from '@sendbird/uikit-react/Channel/context';
import { Form } from 'react-bootstrap';

const accept = "audio/*,video/*,image/*,.pdf,.txt,.doc,.docx"
const fileSizeLimitInMbs = 5
const fileSizeLimitInBytes = fileSizeLimitInMbs * 1024 * 1024

const CustomMessageInput = (props) => {
  const { sendUserMessage, sendFileMessage, sdk, currentChannel } = props;
  const context = useChannelContext();
  const { onBeforeSendUserMessage, onBeforeSendFileMessage } = context;
  const [text, setText] = useState("");
  const [error, setError] = useState('');

  const handleTextInput = (e) => {
    const value = e.target.value;
    error && setError('');
    value && currentChannel?.startTyping();
    setText(value);
  }
  const handleSend = async () => {
    if (!text) return;
    currentChannel?.endTyping();
    const userMessageParams = onBeforeSendUserMessage(text);
    await sendUserMessage(currentChannel, userMessageParams);
    setText('');
  }
  const handleAttachment = (e) => {
    error && setError('');
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > fileSizeLimitInBytes) {
        setError(e => `${e ? `${e}, ` : ''}${file.name} has size more than ${fileSizeLimitInMbs}mb`);
        continue;
      }
      const fileMessageParams = onBeforeSendFileMessage(file);
      sendFileMessage(currentChannel, fileMessageParams);
    }
  }
  return (
    <div>
      {!!error &&
        <div style={{marginLeft: '10px'}}>
          <span style={{ color: 'red', fontSize: '14px' }}>{error}</span>
        </div>
      }
      <div className='message-input-container'>
        <div className='message-input'>
          <Form.Control as="textarea" rows={2} value={text} onChange={handleTextInput} />
        </div>
        <div className='send-icon-container' onClick={handleSend}>
          <SendFill className='send-icon' />
        </div>
        <div className='attachment-input'>
          <label htmlFor="attachment">
            <Paperclip className='attachment-icon' />
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
    </div>
  )
}

export default CustomMessageInput