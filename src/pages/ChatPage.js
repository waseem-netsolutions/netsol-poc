import React, { useCallback, useEffect, useState } from 'react'
import { GroupsComponent, SearchComponent, Topbar } from '../components'
import { App as SendbirdApp } from 'sendbird-uikit'
import {
  Channel as SBConversation,
  ChannelList as SBChannelList,
  ChannelSettings as SBChannelSettings,
  MessageSearch,
  useSendbirdStateContext, 
  sendBirdSelectors,
  withSendBird
} from "sendbird-uikit";

import "sendbird-uikit/dist/index.css";
import "../styles/chatpage.css";
import { debounce, groupBy, set } from 'lodash';
import produce from 'immer';
const ChatPage = (props) => {
  //console.log(props)
  const { config, dispatchers, stores } = props;
  const { sdkStore: { sdk }, userStore: { user } } = stores; 
  //const context = useSendbirdStateContext();
  //const sdk = sendBirdSelectors.getSdk(context);
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("ungrouped");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchInputText, setSearchInputText] = useState("");
  const [searchString, setSearchString] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [messagesType, setMessagesType] = useState("");
  const [queries, setQueries] = useState({
    channelListQuery: {
      customTypesFilter :[""],
      //hiddenChannelFilter : "HIDDEN"
    }
  })
  const [messagesFilterQuery, setMessagesFilterQuery] = useState({
    messageListParams: {
      messageType: ""
    }
  })

  useEffect(() => {
    if (!sdk || !sdk.GroupChannel) {
      return;
    }
    const groupChannelListQuery = sdk.GroupChannel.createMyGroupChannelListQuery();
    //groupChannelListQuery.customTypesFilter  = [group];
    groupChannelListQuery.next(function (groupChannels, error) {
      if (error) {
        return;
      }
      console.log(groupChannels)
      groupChannels = groupChannels.map(c => c.customType ? c : ({ ...c, customType: "ungrouped"}));
      const channelsMap =  groupBy(groupChannels, item => item.customType)
      setGroups(Object.keys(channelsMap));
      if (groups.length > 0) {
        setSelectedGroup("ungrouped");
        setQueries(produce(draft => {
          draft.channelListQuery.customTypesFilter = ['ungrouped']
        }))
      }
    });
  }, [sdk]);

  const handleOnBeforeCreateChannel = (selectedUsers) => {
    const channelParams = new sdk.GroupChannelParams();
    channelParams.addUserIds(selectedUsers);
    channelParams.name = "My Channel";
    channelParams.overUrl = null;
    channelParams.coverImage = null;
    channelParams.customType = "withData";
    channelParams.data = JSON.stringify({name: "My Channel", type: "withData"});
    return channelParams;
  }

  //I am deboucing the function that updates the searchString but to make it work we need to memoize the debounced funtion
  //because everytime re-render occurs it creates a new function thus we will never be able to cancel the previous 
  //debounced function calls.
  const handleUpdateSearchString = useCallback(debounce((value) => setSearchString(value), 2000, { trailing: true }), []);
  const handleInputSearch = (e) => {
    const value = e.target.value;
    setSearchInputText(value);
    handleUpdateSearchString.cancel();
    handleUpdateSearchString(value);
  }

  const resetSearchInput = () => {
    setSearchInputText("");
    setSearchString("");
    setMessagesType("");
    setMessagesFilterQuery(produce(draft => {
      draft.messageListParams.messageType = "";
    }))
  }
  const handleSearchIconClick = () => {
    setOpenSearch(!openSearch)
    setShowSettings(false)
    resetSearchInput();
  }

  const handleChatHeaderActionClick = () => {
    setShowSettings(true);
    setOpenSearch(false);
    resetSearchInput();
  }

  const handleSearchCloseIconClick = () => {
    setOpenSearch(false)
    resetSearchInput();
  }

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setQueries(produce(draft => {
      draft.channelListQuery.customTypesFilter = [group === "ungrouped" ? "" : group]
    }))
  }
  return (
    <div>
      <Topbar />
      <div className='app-area'>
        <div className='channel-list'>
          <SBChannelList
            queries={queries}
            onChannelSelect={(channel) => {
              if (channel && channel.url) {
                setCurrentChannelUrl(channel.url);
              }
            }}
            onBeforeCreateChannel={handleOnBeforeCreateChannel}
          />
          <GroupsComponent
            groups={groups}
            handleGroupClick={handleGroupClick}
            selectedGroup={selectedGroup}
          />
        </div>
       
        <div className='chat-area'>
          <SBConversation
            queries={messagesFilterQuery}
            highlightedMessage={selectedMessage}
            channelUrl={currentChannelUrl}
            showSearchIcon={true}
            onSearchClick={handleSearchIconClick}
            onChatHeaderActionClick={handleChatHeaderActionClick}
          />
        </div>

        {openSearch && <SearchComponent
          setSelectedMessage={setSelectedMessage}
          handleSearchCloseIconClick={handleSearchCloseIconClick}
          searchInputText={searchInputText}
          handleInputSearch={handleInputSearch}
          searchString={searchString}
          currentChannelUrl={currentChannelUrl}
          messagesType={messagesType}
          setMessagesType={setMessagesType}
          setMessagesFilterQuery={setMessagesFilterQuery}
          
        />}
        
        {showSettings && (
          <SBChannelSettings
            channelUrl={currentChannelUrl}
            onCloseClick={() => {
              setShowSettings(false);
            }}
          />
      )}
      </div>
    </div>
  )
}

export default withSendBird(ChatPage)