import React from 'react'

const ActionOptions = (props) => {
  const { options } = props
  return (
    <ul>
      {options.map((op, i) => {
        const { label, onClick: handleClick } = op;
        return (
            <li key={`${label}-option-${i+1}`} onClick={handleClick}>{label}</li>
        )
      })}
    </ul>
  )
}

export default ActionOptions