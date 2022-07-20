import React, { useState } from 'react'
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import OutsideClickHandler from 'react-outside-click-handler';
import ActionOptions from './ActionOptions';

const UserList = (props) => {
  const { users, listName, ...rest } = props;
  const isMembersList = listName === 'members-list';
  return (
    <ul className='settings-users-list'>
      {
        users.map(user => 
          <UserItem 
            key={`${listName}-${user.userId}`} 
            user={user} 
            isMembersList={isMembersList}
            {...rest}
          />
        )
      }
    </ul>
  )
}

const UserItem = (props) => {
  const { user, actionOptions, currentUser, isMembersList } = props;
  const { userId, nickname, profileUrl, role } = user;
  const isOperator = role === "operator";
  const [showActionDots, setShowActionDots] = useState(false);
  const [showActionOptions, setShowActionOptions] = useState(false);
  const isCurrentUser = userId === currentUser?.email;
  const showHideDots = () => {
    return showActionDots ? 'action-container-show' : 'hide';
  }
  const handleActionDotsClick = (e) => {
    e.stopPropagation();
    setShowActionOptions(!showActionOptions);
  }
  return (
    <li className='settings-user-item'
      onMouseOver={() => setShowActionDots(true)}
      onMouseLeave={() => { !showActionOptions && setShowActionDots(false) }}
    >
      <section className='settings-user-item-info'>
        <div className='settings-user-item-pic-container'>
          <img src={profileUrl} alt="profile-pic" />
        </div>
        <p className='settings-user-item-name'>{nickname} {isCurrentUser ? '(You)' : null}</p>
      </section>
      <section className='settings-user-item-action'>
        {isMembersList && isOperator && !showActionDots && <span className='operator-test'>Operator</span>}
        {(!isMembersList || (isMembersList && !isCurrentUser)) &&
          <OutsideClickHandler
            onOutsideClick={() => setShowActionOptions(false)}
          >
            <div className={`action-container`} onClick={handleActionDotsClick}>
              <div className={`action-icon ${showHideDots()}`}>
                <ThreeDotsVertical />
              </div>
              {showActionOptions && <div className='action-options'>
                <ActionOptions options={actionOptions} user={user} />
              </div>}
            </div>
          </OutsideClickHandler>}
      </section>
    </li>
  )
}

export default UserList