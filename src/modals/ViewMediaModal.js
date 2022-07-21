import { Button, Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { FileEarmark, Justify, PlayBtn } from 'react-bootstrap-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const MESSAGES_LIMIT = 5;

const ViewMediaModal = (props) => {
  const { currentChannel, showMediaModal,  setShowMediaModal } = props;
  const [getMessagesQuery, setGetMessageQuery] = useState({});
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTab, setSelectedTab] = useState("document");
  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState({})

  useEffect(() => {
    if (currentChannel && currentChannel.url) {
      const query = currentChannel.createPreviousMessageListQuery();
      query.limit = MESSAGES_LIMIT;
      query.customTypesFilter = ["document"];
      setGetMessageQuery(query);
    }
  }, [currentChannel]);

  async function getMessages() {
    if (getMessagesQuery && getMessagesQuery.load) {
      const messages = await getMessagesQuery?.load();
      return messages;
    }
    return []
  }

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const messages = await getMessages();
        setMessages([...messages])
      } catch (error) {
        console.log("error while geting messages", error)
      }
      setLoading(false)
    }
    getData();
  }, [getMessagesQuery]);

  const loadMoreMessages = async () => {
    try {
      const nextMessages = await getMessages();
      if (nextMessages.length) {
        setMessages(it => [...it, ...nextMessages]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("error while laoding more", error)
    }
  }

  const handleMediaClick = (type) => {
    if(currentChannel && currentChannel.url){
      const query = currentChannel.createPreviousMessageListQuery();
      query.limit = MESSAGES_LIMIT;
      query.customTypesFilter = [type];
      setGetMessageQuery(query);
    }
    setSelectedTab(type);
    setHasMore(true);
    setPlayVideo({})
  }

  const handleCloseModal = () => {
    setShowMediaModal(false);
  }

  const handlePlayVideo = (messageId) => {
    setPlayVideo(p => ({ ...p, [messageId]: true }))
  }

  const imagesSelected = selectedTab === "image";
  const docsSelected = selectedTab === "document";
  const vidsSelected = selectedTab === "video";

  let modalContent;
  if(imagesSelected){
    modalContent = (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        {messages.map((it, i) => {
          const { url, thumbnails, messageId } = it;
          let thumbUrl;
          if(thumbnails?.length){
            thumbUrl = thumbnails?.[0]?.url;
          }
          return (
            <div key={"image-" + i} style={{ padding: "2px"}}>
              <img width="250" height="250" src={thumbUrl || url} alt={"image"} />
            </div>
          )
        })}
      </div>
    )
  }
  if(docsSelected) {
    modalContent = (
      <div>
        {messages.map((it, i) => {
          const { name, url } = it;
          return (
            <div key={"doc-" + i}>
              <a href={url}>{name}</a>
            </div>
          )
        })}
      </div>
    )
  }
  if(vidsSelected) {
    modalContent = (
      <div>
        {messages.map((it, i) => {
          const { name, url, type, thumbnails, messageId } = it;
          let thumbUrl;
          if(thumbnails?.length){
            thumbUrl = thumbnails?.[0]?.url;
          }
          return (
            <div className='video-container' key={"vid-" + i}>
              {thumbUrl && !playVideo[messageId] &&
                <div onClick={() => handlePlayVideo(messageId)}>
                  <img src={thumbUrl} alt={name} />
                  <PlayBtn className='video-play-btn' />
                </div>
              }
              {(!thumbUrl || playVideo[messageId]) && <video src={url} controls />}
            </div>
          )
        })}
      </div>
    )
  }
  if(!messages.length){
    modalContent = (
      <div>
        <p>No results found</p>
      </div>
    )
  }

  const tabContent = (
    <InfiniteScroll
      dataLength={messages.length}
      next={loadMoreMessages}
      hasMore={hasMore}
      //scrollableTarget="scrollableDiv"
      height="50vh"

    >
      {!loading ? modalContent : <p>Loading...</p>}
    </InfiniteScroll>
  )
  return (
      <Modal
        show={showMediaModal}
        onHide={handleCloseModal}
        className='custom-view-media-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>All Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="view-media-tabs"
            activeKey={selectedTab}
            onSelect={(k) => handleMediaClick(k)}
            //className="mb-3"
          >
            <Tab eventKey="document" title="Documents">
              {tabContent}
            </Tab>
            <Tab eventKey="image" title="Images">
              {tabContent}
            </Tab>
            <Tab eventKey="video" title="Videos">
              {tabContent}
            </Tab>
          </Tabs>

        </Modal.Body>
      </Modal>
  )
}

export default ViewMediaModal