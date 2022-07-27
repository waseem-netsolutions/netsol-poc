import React from 'react'
import { Info, Search, Telephone, FileEarmark, CameraVideo } from 'react-bootstrap-icons';


const CustomConversationHeader = (props) => {
  const { 
    channel, 
    onSearchClick, 
    onSettingsClick, 
    onVideoCallClick,
    onAudioCallClick,
    onMediaClick,
    currentUser
  } = props;
  const { name: groupName, coverUrl, memberCount, data } = channel;
  let channelName = groupName;
  let officeName = '';
  if (data && memberCount === 2) {
    const customMembers = JSON.parse(data)?.members || [];
    const otherUser = customMembers?.filter(mem => mem.email !== currentUser.email)?.[0];
    channelName = otherUser?.name;
    officeName = otherUser?.isOwner? 'Account Owner' : otherUser?.office;
  }
  console.log(JSON.parse(channel.data))
  return (
    <div className='chatheader-container'>
      <section className='chatheader-image-container'>
          <div className='chatheader-image'>
            <img src={coverUrl} alt={groupName} />
          </div>
      </section>
      <section className='chatheader-channel-name'>
        <div>{channelName}</div>
        {!!officeName && <div style={{color: 'grey', fontSize: '13px'}}>
          {officeName}
        </div>}
      </section>
      <section className='chatheader-channel-actions'>
        <div>
          <span onClick={onMediaClick}>
            <FileEarmark/>
          </span>
          <span onClick={onSearchClick}>
            <Search/>
          </span>
          {memberCount === 2 && <span onClick={onVideoCallClick}>
            <CameraVideo/>
          </span>}
          {memberCount === 2 && <span onClick={onAudioCallClick}>
            <Telephone/>
          </span>}
          {memberCount > 2 && <span onClick={onSettingsClick}>
            <Info />
          </span>}
        </div>
      </section>
    </div>
  )
}

export default CustomConversationHeader