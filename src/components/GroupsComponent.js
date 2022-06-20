import React from 'react'
import { Check2Circle } from 'react-bootstrap-icons';

const GroupsComponent = (props) => {
  const { groups, handleGroupClick, selectedGroup } = props;
  return (
    <div className='groups-div'>
      {groups.reduce((acc, group) => group === "ungrouped" ? [group, ...acc] : [...acc, group], []).map(group => {
        const selected = group === selectedGroup;
        return (
          <div key={group} onClick={() => handleGroupClick(group)} className={`group-item ${selected ? 'group-item-selected' : ''}`}>
            <span>{group}</span>
            {selected ? <Check2Circle style={{ marginLeft: "20px", color: "blue" }} /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default GroupsComponent