import React, { useRef, useState } from 'react';

const Player = ({ videoLink ,handleComplete}) => {
  const videoRef = useRef(null);
  const [canSeekForward, setCanSeekForward] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const onTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const onSeeked = () => {
    // Call your custom function when seeking forward has completed
//  alert("dsaSD")
 handleComplete()
    // Add your function call here
  };

  return (
    <div className="video-container">
      <div className="aspect-ratio-container">
        <video
          ref={videoRef}
          controls
          autoPlay
        onEnded={onSeeked}
          className="responsive-video"
          width="100%"
          height="auto"
          onTimeUpdate={onTimeUpdate}
          // onSeeked={onSeeked} 
        >
          <source
            key={videoLink}
            src={videoLink}
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default Player;
