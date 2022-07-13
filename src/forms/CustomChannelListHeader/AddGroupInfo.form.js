import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap';
import { Upload } from 'react-bootstrap-icons';

const AddGroupInfo = (props) => {
  const { onSubmit } = props
  const [groupImage, setGroupImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const groupNameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    const groupName = groupNameRef?.current.value;
    if (!groupImage || !groupName) return;
    onSubmit({ groupImage, groupName })
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    setGroupImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }
  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <div className='image-upload-container'>
        <div className='image-upload-center'>
          <div className='image-preview-container'>
            <div className='image-preview'>
              <img src={imageUrl || "https://www.w3schools.com/howto/img_avatar.png"} alt="avatar" />
            </div>
            <label htmlFor="groupImage" className='image-upload-icon'>
                <Upload/>
            </label>
            <input type="file" name="groupImage" id="groupImage" onChange={handleInputChange} className='upload-image-input'/>
          </div>
        </div>
      </div>
      <Form.Group className='mb-3'>
        <Form.Label htmlFor="groupName" className='group-name-label'>Group Name</Form.Label>
        <Form.Control
          ref={groupNameRef}
          type="text"
          id="groupName"
          name="groupName"
          className='group-name-input'
        />
      </Form.Group>
      <div className='group-info-btn-section'>
        <button type="submit">Submit</button>
      </div>
    </Form>
  )
}

export default AddGroupInfo