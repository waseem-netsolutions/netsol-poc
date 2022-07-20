import React from 'react'

const ActionOptions = (props) => {
  const { options, user} = props;
  const { userId } = user;
  return (
    <ul>
      {options.map((op, i) => {
        const { label, onClick: handleClick, visible = true } = op;
        if(!visible) return null
        return (
            <li key={`${label}-option-${i+1}`} onClick={() => handleClick({ userId, member: user })}>{label}</li>
        )
      })}
    </ul>
  )
}

export default ActionOptions