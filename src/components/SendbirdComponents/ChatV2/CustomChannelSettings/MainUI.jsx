import React from 'react'
import { useChannelSettingsContext } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelProfile from '@sendbird/uikit-react/ChannelSettings/components/ChannelProfile';
import { XLg } from 'react-bootstrap-icons';
import AdminPanel from './AdminPanel';

const MainUI = (props) => {
  const { currentUser, similarUsers } = props;
  const context = useChannelSettingsContext();
  const { onCloseClick } = context;
  //console.log(context)
  return (
    <>
      <div className='channel-search-header-container'>
        <div className='heading'>
          <span>Channel Information</span>
        </div>
        <div className='close-icon' onClick={onCloseClick}>
          <XLg />
        </div>
      </div>
      <ChannelProfile/>
      <AdminPanel
        context={context}
        currentUser={currentUser}
        similarUsers={similarUsers}
      />
    </>
  )
}

export default MainUI