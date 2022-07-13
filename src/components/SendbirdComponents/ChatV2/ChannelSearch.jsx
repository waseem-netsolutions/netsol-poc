import React, { useEffect, useState } from 'react'
import { MessageSearchProvider } from '@sendbird/uikit-react/MessageSearch/context';
import MessageSearchUI from '@sendbird/uikit-react/MessageSearch/components/MessageSearchUI';
import { XLg } from 'react-bootstrap-icons';
import { SearchIcon } from '../../../icons';
import { debounce } from 'lodash';
import useMounted from "../../../hooks/useMounted.js";

const handleUpdateSearchString = debounce((value, setterFuntion, isMounted) => isMounted.current && setterFuntion(value), 2000, { trailing: true })

const ChannelSearch = (props) => {
  const { currentChannel, handleSearchClose, handleSelectMessage } = props;
  const [searchInputText, setSearchInputText] = useState('');
  const [searchString, setSearchString] = useState(null);
  const isMounted = useMounted();
  const handleSearchInputTextChange = (e) => {
    const value = e.target.value;
    setSearchInputText(value);
    handleUpdateSearchString.cancel();
    handleUpdateSearchString(value, setSearchString, isMounted);
  }
  return (
    <MessageSearchProvider
      searchString={searchString}
      onResultClick={handleSelectMessage}
      channelUrl={currentChannel?.url}
    >
      <div className='channel-search-header-container'>
        <div className='heading'>
          <span>Search in channel</span>
        </div>
        <div className='close-icon' onClick={handleSearchClose}>
          <XLg />
        </div>
      </div>
      <div className='channel-search-input-container'>
        <div className='channel-search-input'>
          <div className='channel-search-icon'>
            <SearchIcon/>
          </div>
          <div className='message-input-container'>
            <input type="text" value={searchInputText} onChange={handleSearchInputTextChange} placeholder='search'/>
          </div>
        </div>
        </div>
      <MessageSearchUI />
    </MessageSearchProvider>
  )
}

export default ChannelSearch