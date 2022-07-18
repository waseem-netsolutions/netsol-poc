import React, { useState } from 'react'
import produce from "immer";
import { Topbar } from '../components'
import '@sendbird/uikit-react/dist/index.css';
import { Channel, useSendbirdStateContext, sendBirdSelectors } from "@sendbird/uikit-react";

import { useChannelListContext, ChannelListProvider } from '@sendbird/uikit-react/ChannelList/context';
import ChannelListUI from '@sendbird/uikit-react/ChannelList/components/ChannelListUI';

import { useChannelContext, ChannelProvider } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';

import "../styles/chat-v2.css";
import CustomChannelListHeader from '../components/SendbirdComponents/ChatV2/CustomChannelListHeader';
import useInitChatV2 from '../hooks/useInitChatV2';
import CustomMessageItem from '../components/SendbirdComponents/ChatV2/CustomMessageItem.jsx';
import CustomChannelPreview from '../components/SendbirdComponents/ChatV2/CustomChannelPreview';
import GroupsComponent from '../components/SendbirdComponents/ChatV2/GroupsComponent';
import CustomConversationHeader from '../components/SendbirdComponents/ChatV2/CustomConversationHeader';
import ChannelSettings from '../components/SendbirdComponents/ChatV2/ChannelSettings';
import ChannelSearch from '../components/SendbirdComponents/ChatV2/ChannelSearch';

const ChatV2Page = (props) => {
  const { currentUser } = props;
  const context = useSendbirdStateContext();
  const sdk = sendBirdSelectors.getSdk(context);
  const deleteMessage = sendBirdSelectors.getDeleteMessage(context);
  const updateUserMessage = sendBirdSelectors.getUpdateUserMessage(context);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  //* Query Object for ChannelList
  const [channelListQuery, setChannelListQuery] = useState({
    channelListQuery: {
      hiddenChannelFilter: 'unhidden_only'
    }
  })

  //* Data from Custom hooks
  const { similarUsers } = useInitChatV2({ currentUser });

  const handleChannelSelect = channel => {
    setCurrentChannel(channel);
  }
  const handleOnBeforeSendUserMessage = (text) => {
    const { office } = currentUser || {};
    const userMessageParams = new sdk.UserMessageParams();
    const data = {
      office
    }
    userMessageParams.data = JSON.stringify(data);
    userMessageParams.message = text;
    return userMessageParams
  }
  const handleOnBeforeSendFileMessage = (file) => {
    const { office } = currentUser || {};
    const fileMessageParam = new sdk.FileMessageParams();
    const { type } = file;
    fileMessageParam.file = file;
    const data = {
      office
    }
    fileMessageParam.data = JSON.stringify(data);
    if (type.includes("image")) {
      fileMessageParam.customType = "image";
      fileMessageParam.thumbnailSizes = [{ maxWidth: 200, maxHeight: 200 }];
    };
    if (type.includes("video")) {
      fileMessageParam.customType = "video";
      fileMessageParam.thumbnailSizes = [{ maxWidth: 200, maxHeight: 200 }];
    };
    if (type.includes("text")) fileMessageParam.customType = "text";
    if (type.includes("pdf")) fileMessageParam.customType = "document";
    if (type.includes("officedocument")) fileMessageParam.customType = "document"
    return fileMessageParam
  }
  const handleShowUnarchived = () => {
    setChannelListQuery(produce(draft => {
      draft.channelListQuery.hiddenChannelFilter = "unhidden_only"
    }))
    setShowArchived(false);
  }
  const handleShowArchived = () => {
    setChannelListQuery(produce(draft => {
      draft.channelListQuery.hiddenChannelFilter = "hidden_only"
    }))
    setShowArchived(true);
  }
  const groups = [
    {
      label: "Unarchived",
      handleGroupClick: handleShowUnarchived,
      isSelected: !showArchived
    },
    {
      label: "Archived",
      handleGroupClick: handleShowArchived,
      isSelected: showArchived
    }
  ]
  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
  }
  const handleSettingIconClick = () => {
    setShowSettings(!showSettings);
  }
  const handleSettingsClose = () => {
    setShowSettings(false);
  }
  const handleSearchClose = () => {
    setShowSearch(false)
  }
  const handleSelectMessage = (message) => {
    setSelectedMessage(message.messageId);
    // const el = document.getElementById(message.messageId);
    // if(el){
    //   el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center"})
    // }
  }
  return (
    <div>
      <Topbar />
      <div className='main-chat-area'>
        <div className='channel-list-container'>
          <ChannelListProvider
            queries={channelListQuery}
            onChannelSelect={handleChannelSelect}
          >
            <ChannelListUI
              renderHeader={() =>
                <CustomChannelListHeader
                  similarUsers={similarUsers}
                  currentUser={currentUser}
                  sdk={sdk}
                  setCurrentChannel={setCurrentChannel}
                />
              }
              renderChannelPreview={(props) =>
                <CustomChannelPreview
                  {...props}
                  currentChannelUrl={currentChannel?.url}
                  setCurrentChannel={setCurrentChannel}
                />
              }
            />
            <GroupsComponent groups={groups} />
          </ChannelListProvider>
        </div>

        <div className='conversation-container'>
          <ChannelProvider
            channelUrl={currentChannel?.url}
            onBeforeSendFileMessage={handleOnBeforeSendFileMessage}
            onBeforeSendUserMessage={handleOnBeforeSendUserMessage}
            highlightedMessage={selectedMessage}
          >
            <ChannelUI
              renderChannelHeader={() =>
                <CustomConversationHeader
                  onSearchClick={handleSearchIconClick}
                  onSettingsClick={handleSettingIconClick}
                  onCallClick={f => f}
                  channel={currentChannel}
                />
              }
              renderMessage={(props) =>
                <CustomMessageItem
                  {...props}
                  currentUser={currentUser}
                  setImageUrl={f => f}
                  setImageViewer={f => f}
                  highlightedMessageId={selectedMessage}
                  setHighlighedMessage={setSelectedMessage}
                  deleteMessage={deleteMessage}
                  updateUserMessage={updateUserMessage}
                  currentChannel={currentChannel}
                  sdk={sdk}
                />
              }
            />
          </ChannelProvider>
        </div>

        <div className='channel-settings-container'>
          {
            showSettings &&
            <ChannelSettings
              currentChannel={currentChannel}
              handleSettingsClose={handleSettingsClose}
            />
          }
        </div>
        {
          showSearch &&
          <div className='channel-search-container'>
              <ChannelSearch
                currentChannel={currentChannel}
                handleSearchClose={handleSearchClose}
                handleSelectMessage={handleSelectMessage}
              />
          </div>
        }
      </div>
    </div>
  )
}

export default ChatV2Page