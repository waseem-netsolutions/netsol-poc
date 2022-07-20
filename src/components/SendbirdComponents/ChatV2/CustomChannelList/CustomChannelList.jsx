import React from 'react'
import "./custom-channel-list.css";
import { useChannelListContext } from '@sendbird/uikit-react/ChannelList/context'
import PlaceHolder, { PlaceHolderTypes } from '@sendbird/uikit-react/ui/PlaceHolder'

const CustomChannelList = (props) => {

  const { renderChannelPreview, onLeaveChannel, renderHeader } = props;
  const { allChannels, initialized, loading } = useChannelListContext();

  if (loading) { return <PlaceHolder type={PlaceHolderTypes.LOADING} /> }
  if (!initialized) { return <PlaceHolder type={PlaceHolderTypes.WRONG} /> }
  
  return (
    <div className='custom-channel-list-container'>
      <div className='header-container'>
        {renderHeader()}
      </div>
      {
        allChannels.map((channel) =>
          renderChannelPreview(
            {
              channel,
              onLeaveChannel,
              key: channel.url
            }
          )
        )
      }
    </div>
  )
}

export default CustomChannelList