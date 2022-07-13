import React from 'react'
import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import ChannelSettingsUI from '@sendbird/uikit-react/ChannelSettings/components/ChannelSettingsUI';

const ChannelSettings = (props) => {
  const { currentChannel, handleSettingsClose } = props;
  return (
    <ChannelSettingsProvider
      channelUrl={currentChannel?.url}
      onCloseClick={handleSettingsClose}
    >
      <ChannelSettingsUI/>
    </ChannelSettingsProvider>
  )
}

export default ChannelSettings