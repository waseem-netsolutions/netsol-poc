import React from 'react'

const SingleTick = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 64 64"
      {...props}
    >
      <path 
        className="icon-done_svg__fill" 
        d="M12.552 31.448a2.665 2.665 0 10-3.771 3.771l13.333 13.333a2.666 2.666 0 003.772 0L55.219 19.22a2.667 2.667 0 00-3.771-3.771L24 42.895 12.552 31.448z" 
        fill="#a8cf3d" 
        fillRule="evenodd"
      >
      </path>
    </svg>
  )
}

export default SingleTick