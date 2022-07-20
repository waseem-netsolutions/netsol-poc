import { ChannelSettingsProvider } from '@sendbird/uikit-react/ChannelSettings/context';
import MainUI from './MainUI';
import "../../../../styles/custom-channel-settings.css";

const ChannelSettings = (props) => {
  const { currentChannel, handleSettingsClose, currentUser, similarUsers } = props;
  return (
    <ChannelSettingsProvider
      channelUrl={currentChannel?.url}
      onCloseClick={handleSettingsClose}
    >
      <MainUI
        currentUser={currentUser}
        similarUsers={similarUsers}
      />
    </ChannelSettingsProvider>
  )
}

export default ChannelSettings