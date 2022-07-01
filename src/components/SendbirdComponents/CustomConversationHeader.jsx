import React from 'react'
import { Info, Search, Telephone } from 'react-bootstrap-icons';

const CustomChatHeader = (props) => {
  const { 
    channel, 
    onSearchClick, 
    onSettingsClick, 
    onCallClick 
  } = props;
  const { name: groupName, coverUrl, memberCount } = channel;
  return (
    <div className='chatheader-container'>
      <section className='chatheader-image-container'>
          <div className='chatheader-image'>
            <img src={coverUrl} alt={groupName} />
          </div>
      </section>
      <section className='chatheader-channel-name'>
        {groupName}
      </section>
      <section className='chatheader-channel-actions'>
        <div>
          <span onClick={onSearchClick}>
            <Search/>
          </span>
          {memberCount === 2 && <span onClick={() => onCallClick(ps => !ps)}>
            <Telephone/>
          </span>}
          <span onClick={onSettingsClick}>
            <Info />
          </span>
        </div>
      </section>
    </div>
  )
}

export default CustomChatHeader