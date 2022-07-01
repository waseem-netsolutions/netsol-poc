import React from "react";
import produce from "immer";
import { Button } from "react-bootstrap";


const MyCustomPreview = (props) => {
  const {
    channel,
    onLeaveChannel,
    setSelectedGroup,
    setQueries,
    setArchiveFilter,
    setCurrentChannelUrl,
    selectedGroup
  } = props;

  console.log(channel)
  if (channel.customType === "") {
    if (selectedGroup !== "ungrouped") return null
  } else {
    if (channel.customType !== selectedGroup) return null
  }

  const { hiddenState } = channel;
  const isHidden = hiddenState !== "unhidden";
  return (
    <div style={{ border: '1px solid gray', display: "flex", justifyContent: "space-between"}}>
      <div>
      <img height="20px" width="20px" src={channel.coverUrl} />
      <span>{channel.name}</span>
      </div>
      
      <div style={{display: "inline-block"}}>
        <Button variant="outline-danger" size="sm" onClick={() => {
          const callback = () => {
            console.warn('Leave channel success')
          };
          onLeaveChannel(channel, callback);
        }}
        > Leave
        </Button>
        {
          !isHidden && <Button variant="outline-primary" size="sm" onClick={async () => {
            channel.hide(false, false)
          }}
          > Archive
          </Button>
        }
        {
          isHidden && <Button variant="outline-primary" size="sm" onClick={() => {
            channel.unhide();
          }}
          > Unarchive
          </Button>
        }
      </div>

    </div>
  );
}

export default MyCustomPreview;