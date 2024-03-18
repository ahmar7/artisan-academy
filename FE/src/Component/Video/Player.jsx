import React, { useRef, useState, useEffect } from 'react';

const Player = ({ videoLink, handleComplete,permission }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Initialized at 100%

  const onTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSliderChange = (e) => {
    const video = videoRef.current;
    if (video) {
      const newTime = parseFloat(e.target.value);
      // Allow seeking forward only if permission is true
      if (permission || newTime <= video.currentTime) {
        video.currentTime = newTime;
        setCurrentTime(newTime);
      } else {
        // If seeking forward without permission, reset slider to current time
        e.target.value = video.currentTime;
      }
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused || video.ended) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  useEffect(() => {
    videoRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (videoRef.current) {
      // videoRef.current.pause();
      videoRef.current.load(); // Reload the video element to update the source
      // setIsPlaying(false); // Optionally, update isPlaying state
      setCurrentTime(0); // Reset currentTime
      // Auto-play the new video if needed
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [videoLink]);

  return (
    <div style={{backgroundColor:"#f7f7f7"}} className="video-container ">
      <div className="aspect-ratio-container">
        <video
          ref={videoRef}
          autoPlay
          onEnded={handleComplete}
          className="responsive-video"
          width="100%"
          height="auto"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        >
          <source key={videoLink} src={videoLink} type="video/mp4" />
        </video>
      </div>
      <div style={{
        backgroundColor: 'black',
        position: 'absolute',
        bottom: '0',
        zIndex: 10,
        height: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '0 10px',
      }}>
        {isPlaying?  <i className={"fas fa-pause" } onClick={togglePlayPause} style={{ marginRight: '20px', cursor: 'pointer' }}></i>:
      
        <i className={ "fas fa-play"} onClick={togglePlayPause} style={{ marginRight: '20px', cursor: 'pointer' }}></i>}
       
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          style={{ width: '70%' }}
        />
      
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: '10%', marginRight: '20px',marginLeft: '20px'}}
          
        />
           <i className={volume > 0 ? "fas fa-volume-up" : "fas fa-volume-mute"} style={{ marginRight: '10px' }}></i>
      </div>
    </div>
  );
};

export default Player;
