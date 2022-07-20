import React from 'react'
import { Check2Circle } from 'react-bootstrap-icons';

const GroupsComponent = (props) => {
  const { groups } = props;
  return (
    <div className='groups-div'>
      {groups.reduce((acc, group) => group.label === "ungrouped" ? [group, ...acc] : [...acc, group], []).map(group => {
        const { label, handleGroupClick, isSelected, visible = true } = group;
        if(!visible) return null
        return (
          <div key={label} onClick={handleGroupClick} className={`group-item ${isSelected ? 'group-item-selected' : ''}`}>
            <span>{label}</span>
            {isSelected ? <Check2Circle style={{ marginLeft: "20px", color: "blue" }} /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default GroupsComponent