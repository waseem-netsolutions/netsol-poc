import React, { useCallback, useState } from 'react'
import produce from "immer";
import { Topbar } from '../components'
import '@sendbird/uikit-react/dist/index.css';
import { Channel, useSendbirdStateContext, sendbirdSelectors } from "@sendbird/uikit-react";

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
import CustomChannelSettings from '../components/SendbirdComponents/ChatV2/CustomChannelSettings/CustomChannelSettings';
import CustomMessageInput from '../components/SendbirdComponents/ChatV2/CustomMessageInput/CustomMessageInput';
import CustomChannelList from '../components/SendbirdComponents/ChatV2/CustomChannelList/CustomChannelList';

//import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { Y as GroupChannelHandler } from "../../node_modules/@sendbird/uikit-react/groupChannel-009a07f0.js";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import { useRef } from 'react';

const ChatV2Page = (props) => {
  const { currentUser } = props;
  const { isOwner } = currentUser || {};

  const context = useSendbirdStateContext();
  const sdk = sendbirdSelectors.getSdk(context);

  const [refresh, updateUI] = useState(1);
  const uuidRef = useRef('');

  useEffect(() => {
    if(sdk?.groupChannel?.addGroupChannelHandler){
      uuidRef.current = uuidv4();
      const channelHandlerInstance = new GroupChannelHandler({
        onMessageReceived: (groupChannel) => {
          const { customType } = groupChannel;
          if(showInternal && customType === "internal"){
            updateUI(p => p + 1)
          }
          if(!showInternal && customType === "external"){
            updateUI(p => p + 1);
          }
        }
      });
      sdk.groupChannel.addGroupChannelHandler(uuidRef.current, channelHandlerInstance);
    }
    return () => {
      if(uuidRef.current && sdk?.groupChannel?.removeGroupChannelHandler){
        sdk?.groupChannel?.removeGroupChannelHandler(uuidRef.current);
      }
    }
  }, [sdk])

  //console.log(sendbirdSelectors)
  const deleteMessage = sendbirdSelectors.getDeleteMessage(context);
  const updateUserMessage = sendbirdSelectors.getUpdateUserMessage(context);
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(context);
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(context);
  const onLeaveChannel = sendbirdSelectors.getLeaveGroupChannel(context);

  const [currentChannel, setCurrentChannel] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInternal, setShowInternal] = useState(true);

  //* Query Object for ChannelList
  const [channelListQuery, setChannelListQuery] = useState({
    channelListQuery: {
      hiddenChannelFilter: 'unhidden_only',
      includeEmpty: true,
      customTypesFilter: [showInternal ? 'internal' : 'external']
    }
  })

  //* Data from Custom hooks
  const { similarUsers } = useInitChatV2({ currentUser, showInternal });

  const handleChannelSelect = channel => {
    setCurrentChannel(channel);
  }
  const handleOnBeforeSendUserMessage = (text) => {
    const { office } = currentUser || {};
    const userMessageParams = {};
    const data = {
      office
    }
    userMessageParams.data = JSON.stringify(data);
    userMessageParams.message = text;
    return userMessageParams
  }
  const handleOnBeforeSendFileMessage = (file) => {
    const { office } = currentUser || {};
    const fileMessageParam = {};
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
    if (type.includes("text")) fileMessageParam.customType = "document";
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
  const handleShowInternal = () => {
    setChannelListQuery(produce(draft => {
      draft.channelListQuery.customTypesFilter = ['internal']
    }))
    setShowInternal(true);
  }
  const handleShowExternal = () => {
    setChannelListQuery(produce(draft => {
      draft.channelListQuery.customTypesFilter = ['external']
    }))
    setShowInternal(false)
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
    },
    {
      label: "Internal",
      handleGroupClick: handleShowInternal,
      isSelected: showInternal
    },
    {
      label: "External",
      handleGroupClick: handleShowExternal,
      isSelected: !showInternal,
      visible: isOwner
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
  const handleSort = useCallback(allChannels => allChannels, [refresh])
  
  if(!currentUser) return null
  return (
    <div>
      <Topbar />
      <div className='main-chat-area'>
        <div className='channel-list-container'>
          <ChannelListProvider
            queries={channelListQuery}
            onChannelSelect={handleChannelSelect}
            sortChannelList={handleSort}
            disableAutoSelect={true}
          >
            <ChannelListUI
              renderHeader={() =>
                <CustomChannelListHeader
                  similarUsers={similarUsers}
                  currentUser={currentUser}
                  sdk={sdk}
                  setCurrentChannel={setCurrentChannel}
                  showInternal={showInternal}
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

        {/* <div className='channel-list-container'>
          <ChannelListProvider
            queries={channelListQuery}
            onChannelSelect={handleChannelSelect}
            sortChannelList={handleSort}
            disableAutoSelect={true}
          >
              <CustomChannelList
                onLeaveChannel={onLeaveChannel}
                renderHeader={() =>
                  <CustomChannelListHeader
                    similarUsers={similarUsers}
                    currentUser={currentUser}
                    sdk={sdk}
                    setCurrentChannel={setCurrentChannel}
                    showInternal={showInternal}
                  />
                }
                renderChannelPreview={(props) =>
                  <CustomChannelPreview
                    {...props}
                    currentChannelUrl={currentChannel?.url}
                    setCurrentChannel={setCurrentChannel}
                    from="custom-list"
                  />
                }
              />
            <GroupsComponent groups={groups} />
          </ChannelListProvider>
        </div> */}

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
              renderMessageInput={() => 
                <CustomMessageInput
                  sendUserMessage={sendUserMessage}
                  sendFileMessage={sendFileMessage}
                  currentChannel={currentChannel}
                  sdk={sdk}
                />
              }
            />
          </ChannelProvider>
        </div>

        {/* <div className='channel-settings-container'>
          {
            showSettings &&
            <ChannelSettings
              currentChannel={currentChannel}
              handleSettingsClose={handleSettingsClose}
            />
          }
        </div> */}
        <div className='channel-settings-container'>
          {
            showSettings && 
            <CustomChannelSettings
              currentChannel={currentChannel}
              handleSettingsClose={handleSettingsClose}
              currentUser={currentUser}
              similarUsers={similarUsers}
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