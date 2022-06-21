import React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap';
import { MessageSearch } from 'sendbird-uikit';
import { CloseIcon } from '../icons';
import produce from "immer";


const SearchComponent = (props) => {

  const {
    setSelectedMessage,
    handleSearchCloseIconClick,
    searchInputText,
    handleInputSearch,
    searchString,
    currentChannelUrl,
    messagesType,
    setMessagesType,
    setMessagesFilterQuery
  } =  props;


  const handleMessagesTypeSelect = (e) => {
    const value = e.target.value;
    setMessagesType(value);
    setMessagesFilterQuery(produce(draft => {
      draft.messageListParams.messageType = value
    }))
  }

  return (
    <div className='sendbird-channel-settings search-area'>
      <div className="sendbird-channel-settings__header">
        <span className="sendbird-label sendbird-label--h-2 sendbird-label--color-onbackground-1">Search in channel</span>
        <button
          className="sendbird-message-search-pannel__header__close-button sendbird-iconbutton "
          type="button"
          style={{ height: '32px', width: '32px' }}
          onClick={handleSearchCloseIconClick}
        >
          <span className="sendbird-iconbutton__inner">
            <div className=" sendbird-icon sendbird-icon-close sendbird-icon-color--on-background-1" role="button" tabIndex="0" style={{ width: '22px', minWidth: '22px', height: '22px', minHeight: '22px' }}>
              <CloseIcon />
            </div>
          </span>
        </button>
      </div>
      <div className="sendbird-message-search-pannel__input">
        <InputGroup>
          <InputGroup.Text id="btnGroupAddon">Show</InputGroup.Text>
          <select defaultValue={messagesType} className="select-input" onChange={handleMessagesTypeSelect}>
            <option value="">All</option>
            <option value="MESG">Only messages</option>
            <option value="FILE">Only Files</option>
          </select>
        </InputGroup>
      </div>
      <div className="sendbird-message-search-pannel__input">
        <InputGroup>
          <InputGroup.Text id="btnGroupAddon">Search</InputGroup.Text>
          <FormControl
            type="text"
            value={searchInputText}
            onChange={handleInputSearch}
          />
        </InputGroup>
      </div>
      <MessageSearch
        searchString={searchString}
        channelUrl={currentChannelUrl}
        onResultClick={(msg) => {console.log(msg), setSelectedMessage(msg.messageId)}}
      />
    </div>
  )
}

export default SearchComponent